// ============================================================================
// TOURNAMENT SERVICE
// Handles Tournament, Team, Player, and Match data, plus Standings calculations.
// Beginner-friendly functions with clear explanations and comments.
// ============================================================================

import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase.js';
import {
  INITIAL_TOURNAMENTS,
  INITIAL_TEAMS,
  INITIAL_PLAYERS,
  INITIAL_MATCHES
} from '../data/sampleData.js';

// Local storage keys for instant fallback if offline
const STORAGE_PREFIX = 'sports_tourney_';

function getLocalData(key, fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('LocalStorage access issue:', e);
  }
  return fallback;
}

function saveLocalData(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save issue:', e);
  }
}

// ----------------------------------------------------------------------------
// 1. POINTS TABLE CALCULATION (Beginner-Friendly & Documented)
// ----------------------------------------------------------------------------

/**
 * Calculates standings from matches and teams for any tournament.
 * Football: Win = 3 pts, Draw = 1 pt, Loss = 0 pt. Ranked by Points, then Goal Difference.
 * Cricket: Win = 2 pts, Tie/NR = 1 pt, Loss = 0 pt. Ranked by Points, then Net Run Rate (NRR).
 */
export function calculatePointsTable(tournamentId, matches = [], teams = [], sport = 'Cricket') {
  const isCricket = (sport || '').toLowerCase() === 'cricket';

  // 1. Initialize stats for each team in this tournament
  const tournamentTeams = teams.filter(t => t.tournamentId === tournamentId);
  const statsByTeam = {};

  tournamentTeams.forEach(team => {
    statsByTeam[team.id] = {
      teamId: team.id,
      teamName: team.name,
      shortName: team.shortName || team.name.slice(0, 3).toUpperCase(),
      played: 0,
      won: 0,
      lost: 0,
      drawnOrTied: 0,
      points: 0,
      // Cricket specific:
      runsScored: 0,
      oversFaced: 0,
      runsConceded: 0,
      oversBowled: 0,
      netRunRate: 0.0,
      // Football specific:
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0
    };
  });

  // 2. Loop through completed matches for this tournament
  const completedMatches = matches.filter(
    m => m.tournamentId === tournamentId && m.status === 'completed'
  );

  completedMatches.forEach(match => {
    const teamAStats = statsByTeam[match.teamAId];
    const teamBStats = statsByTeam[match.teamBId];

    if (!teamAStats || !teamBStats) return;

    teamAStats.played += 1;
    teamBStats.played += 1;

    if (isCricket) {
      // Parse Cricket runs and overs
      const parseScore = (scoreStr) => {
        if (!scoreStr) return 0;
        const parts = scoreStr.split('/');
        return parseInt(parts[0], 10) || 0;
      };

      const runsA = parseScore(match.teamAScore);
      const runsB = parseScore(match.teamBScore);
      const oversA = parseFloat(match.teamAOvers) || 20.0;
      const oversB = parseFloat(match.teamBOvers) || 20.0;

      teamAStats.runsScored += runsA;
      teamAStats.oversFaced += oversA;
      teamAStats.runsConceded += runsB;
      teamAStats.oversBowled += oversB;

      teamBStats.runsScored += runsB;
      teamBStats.oversFaced += oversB;
      teamBStats.runsConceded += runsA;
      teamBStats.oversBowled += oversA;

      // Cricket Scoring: Win = 2 pts, Tie = 1 pt, Loss = 0 pts
      if (runsA > runsB) {
        teamAStats.won += 1;
        teamAStats.points += 2; // 2 points for a win
        teamBStats.lost += 1;
      } else if (runsB > runsA) {
        teamBStats.won += 1;
        teamBStats.points += 2; // 2 points for a win
        teamAStats.lost += 1;
      } else {
        teamAStats.drawnOrTied += 1;
        teamBStats.drawnOrTied += 1;
        teamAStats.points += 1; // 1 point for a tie
        teamBStats.points += 1;
      }
    } else {
      // Football / League Scoring: Win = 3 pts, Draw = 1 pt, Loss = 0 pt
      const scoreA = parseInt(match.teamAScore, 10) || 0;
      const scoreB = parseInt(match.teamBScore, 10) || 0;

      teamAStats.goalsFor += scoreA;
      teamAStats.goalsAgainst += scoreB;
      teamBStats.goalsFor += scoreB;
      teamBStats.goalsAgainst += scoreA;

      if (scoreA > scoreB) {
        teamAStats.won += 1;
        teamAStats.points += 3; // 3 points for a win
        teamBStats.lost += 1;
      } else if (scoreB > scoreA) {
        teamBStats.won += 1;
        teamBStats.points += 3; // 3 points for a win
        teamAStats.lost += 1;
      } else {
        teamAStats.drawnOrTied += 1;
        teamBStats.drawnOrTied += 1;
        teamAStats.points += 1; // 1 point for a draw
        teamBStats.points += 1;
      }
    }
  });

  // 3. Calculate Rates and Differences
  const tableRows = Object.values(statsByTeam).map(row => {
    if (isCricket) {
      const runRateScored = row.oversFaced > 0 ? (row.runsScored / row.oversFaced) : 0;
      const runRateConceded = row.oversBowled > 0 ? (row.runsConceded / row.oversBowled) : 0;
      const nrr = runRateScored - runRateConceded;
      return {
        ...row,
        netRunRate: Number(nrr.toFixed(3))
      };
    } else {
      return {
        ...row,
        goalDifference: row.goalsFor - row.goalsAgainst
      };
    }
  });

  // 4. Sort Rankings:
  // Primary: Points (highest first)
  // Secondary: NRR (cricket) or Goal Difference (football)
  // Tertiary: Matches Won
  tableRows.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (isCricket) {
      if (b.netRunRate !== a.netRunRate) {
        return b.netRunRate - a.netRunRate;
      }
    } else {
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }
      if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }
    }
    return b.won - a.won;
  });

  // Add rank index (1, 2, 3...)
  return tableRows.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

// ----------------------------------------------------------------------------
// 2. DATA SUBSCRIPTION & CRUD
// ----------------------------------------------------------------------------

/**
 * Subscribes to real-time collections from Firestore or local fallback.
 * Automatically notifies callback when data updates!
 */
export function subscribeToCollection(collectionName, fallbackData, onUpdate) {
  // Always trigger initial render immediately with local/fallback data
  const localInitial = getLocalData(collectionName, fallbackData);
  onUpdate(localInitial);

  let unsubscribe = () => {};

  try {
    const colRef = collection(db, collectionName);
    unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          saveLocalData(collectionName, items);
          onUpdate(items);
        } else {
          // If Firestore collection is empty, keep local initial data
          onUpdate(localInitial);
        }
      },
      (error) => {
        console.warn(`Firestore onSnapshot notice for "${collectionName}":`, error.message);
        // Fall back gracefully to local data
        onUpdate(getLocalData(collectionName, fallbackData));
      }
    );
  } catch (err) {
    console.warn(`Firestore subscription fallback for ${collectionName}:`, err);
  }

  return unsubscribe;
}

// Helper to save an item to Firestore (with local fallback update)
export async function saveRecord(collectionName, record) {
  const id = record.id || `${collectionName}-${Date.now()}`;
  const finalRecord = { ...record, id, updatedAt: new Date().toISOString() };

  // 1. Immediately update LocalStorage for instant UI responsiveness
  const currentList = getLocalData(collectionName, []);
  const existingIdx = currentList.findIndex(item => item.id === id);
  let updatedList;
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = finalRecord;
  } else {
    updatedList = [finalRecord, ...currentList];
  }
  saveLocalData(collectionName, updatedList);

  // 2. Write to Firestore if available
  try {
    await setDoc(doc(db, collectionName, id), finalRecord, { merge: true });
  } catch (err) {
    console.warn(`Firestore write fallback: saved locally for ${collectionName}/${id}`);
  }

  return finalRecord;
}

// Helper to delete an item
export async function deleteRecord(collectionName, recordId) {
  // 1. Update local storage
  const currentList = getLocalData(collectionName, []);
  const updatedList = currentList.filter(item => item.id !== recordId);
  saveLocalData(collectionName, updatedList);

  // 2. Delete from Firestore
  try {
    await deleteDoc(doc(db, collectionName, recordId));
  } catch (err) {
    console.warn(`Firestore delete fallback: removed locally for ${collectionName}/${recordId}`);
  }
  return true;
}

// Pre-seed sample data into local storage on first launch
export function initializeSampleData() {
  if (!localStorage.getItem(STORAGE_PREFIX + 'tournaments')) {
    saveLocalData('tournaments', INITIAL_TOURNAMENTS);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'teams')) {
    saveLocalData('teams', INITIAL_TEAMS);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'players')) {
    saveLocalData('players', INITIAL_PLAYERS);
  }
  if (!localStorage.getItem(STORAGE_PREFIX + 'matches')) {
    saveLocalData('matches', INITIAL_MATCHES);
  }
}
