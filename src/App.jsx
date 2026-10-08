// ============================================================================
// ARENAFLOW - TOURNAMENT MANAGEMENT PLATFORM
// Main Application Component with Real-Time State & Routing
// ============================================================================

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ScoreMatchModal from './components/ScoreMatchModal.jsx';

import Home from './pages/Home.jsx';
import Live from './pages/Live.jsx';
import Schedule from './pages/Schedule.jsx';
import Results from './pages/Results.jsx';
import Tournaments from './pages/Tournaments.jsx';
import TournamentDetails from './pages/TournamentDetails.jsx';
import Teams from './pages/Teams.jsx';
import TeamDetails from './pages/TeamDetails.jsx';
import Rankings from './pages/Rankings.jsx';
import MatchCenter from './pages/MatchCenter.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

import {
  subscribeToCollection,
  saveRecord,
  deleteRecord,
  initializeSampleData
} from './services/tournamentService.js';
import {
  INITIAL_TOURNAMENTS,
  INITIAL_TEAMS,
  INITIAL_PLAYERS,
  INITIAL_MATCHES
} from './data/sampleData.js';

function MainApp() {
  const { currentUser, authLoading, isOrganizer } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Navigation State - defaults to organizer dashboard for SaaS experience
  const [activePage, setActivePage] = useState('dashboard');
  const [dashboardView, setDashboardView] = useState('dashboard');
  const [selectedTournamentId, setSelectedTournamentId] = useState(INITIAL_TOURNAMENTS[0].id);
  const [selectedTeamId, setSelectedTeamId] = useState(INITIAL_TEAMS[0].id);
  const [selectedMatchId, setSelectedMatchId] = useState(INITIAL_MATCHES[0].id);

  // Live collections
  const [tournaments, setTournaments] = useState(INITIAL_TOURNAMENTS);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [matches, setMatches] = useState(INITIAL_MATCHES);

  // Modal State for live score updating
  const [scoreModalMatch, setScoreModalMatch] = useState(null);

  // Initialize sample data & subscribe to real-time collections
  useEffect(() => {
    initializeSampleData();

    // Listen for real-time changes across Firestore collections
    const unsubTournaments = subscribeToCollection('tournaments', INITIAL_TOURNAMENTS, setTournaments);
    const unsubTeams = subscribeToCollection('teams', INITIAL_TEAMS, setTeams);
    const unsubPlayers = subscribeToCollection('players', INITIAL_PLAYERS, setPlayers);
    const unsubMatches = subscribeToCollection('matches', INITIAL_MATCHES, setMatches);

    return () => {
      unsubTournaments();
      unsubTeams();
      unsubPlayers();
      unsubMatches();
    };
  }, []);

  // --- CRUD Handlers ---

  async function handleSaveTournament(tournamentData) {
    const saved = await saveRecord('tournaments', tournamentData);
    setTournaments(prev => {
      const idx = prev.findIndex(t => t.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  }

  async function handleDeleteTournament(tournamentId) {
    await deleteRecord('tournaments', tournamentId);
    setTournaments(prev => prev.filter(t => t.id !== tournamentId));
  }

  async function handleSaveTeam(teamData) {
    const saved = await saveRecord('teams', teamData);
    setTeams(prev => {
      const idx = prev.findIndex(t => t.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  }

  async function handleDeleteTeam(teamId) {
    await deleteRecord('teams', teamId);
    setTeams(prev => prev.filter(t => t.id !== teamId));
  }

  async function handleSavePlayer(playerData) {
    const saved = await saveRecord('players', playerData);
    setPlayers(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });

    if (playerData.teamId) {
      const team = teams.find(t => t.id === playerData.teamId);
      if (team) {
        const updatedTeam = { ...team, playersCount: (team.playersCount || 0) + 1 };
        handleSaveTeam(updatedTeam);
      }
    }
  }

  async function handleDeletePlayer(playerId) {
    await deleteRecord('players', playerId);
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  }

  async function handleSaveMatch(matchData) {
    const saved = await saveRecord('matches', matchData);
    setMatches(prev => {
      const idx = prev.findIndex(m => m.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  }

  async function handleDeleteMatch(matchId) {
    await deleteRecord('matches', matchId);
    setMatches(prev => prev.filter(m => m.id !== matchId));
  }

  async function handleSaveScore(updatedMatch) {
    await handleSaveMatch(updatedMatch);
    setScoreModalMatch(null);
  }

  // Navigation Helpers
  function navigateToTournament(id) {
    setSelectedTournamentId(id);
    setActivePage('tournament-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToTeam(id) {
    setSelectedTeamId(id);
    setActivePage('team-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToMatch(id) {
    setSelectedMatchId(id);
    setActivePage('match-center');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 1. Loading screen while Firebase checks session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-lg bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-xs animate-pulse">
            A
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            ArenaFlow
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate: Show Login first. Protect all application routes.
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-600 selection:text-white">
        {authView === 'login' ? (
          <Login
            onSwitchToRegister={() => setAuthView('register')}
            onSuccess={() => setActivePage('home')}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setAuthView('login')}
            onSuccess={() => setActivePage('home')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white">
      
      {/* 1. FIXED LEFT SIDEBAR (Desktop) & SLIDE-OVER DRAWER (Mobile) */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        dashboardView={dashboardView}
        setDashboardView={setDashboardView}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. MAIN APPLICATION CONTENT SHELL */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          dashboardView={dashboardView}
          setDashboardView={setDashboardView}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main Page Routing Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activePage === 'home' && (
          <Home
            tournaments={tournaments}
            teams={teams}
            matches={matches}
            onSelectMatch={navigateToMatch}
            onSelectTournament={navigateToTournament}
            onSelectTeam={navigateToTeam}
            onOpenScoreModal={setScoreModalMatch}
            setActivePage={setActivePage}
            isOrganizer={isOrganizer}
          />
        )}

        {activePage === 'live' && (
          <Live
            matches={matches}
            teams={teams}
            tournaments={tournaments}
            onSelectMatch={navigateToMatch}
            onOpenScoreModal={setScoreModalMatch}
            isOrganizer={isOrganizer}
          />
        )}

        {activePage === 'schedule' && (
          <Schedule
            matches={matches}
            teams={teams}
            tournaments={tournaments}
            onSelectMatch={navigateToMatch}
          />
        )}

        {activePage === 'results' && (
          <Results
            matches={matches}
            teams={teams}
            tournaments={tournaments}
            onSelectMatch={navigateToMatch}
            onOpenScoreModal={setScoreModalMatch}
            isOrganizer={isOrganizer}
          />
        )}

        {activePage === 'tournaments' && (
          <Tournaments
            tournaments={tournaments}
            teams={teams}
            matches={matches}
            onSelectTournament={navigateToTournament}
            setActivePage={setActivePage}
            isOrganizer={isOrganizer}
          />
        )}

        {activePage === 'tournament-details' && (
          <TournamentDetails
            tournamentId={selectedTournamentId}
            tournaments={tournaments}
            teams={teams}
            matches={matches}
            onBack={() => setActivePage('tournaments')}
            onSelectMatch={navigateToMatch}
            onSelectTeam={navigateToTeam}
            onOpenScoreModal={setScoreModalMatch}
            isOrganizer={isOrganizer}
          />
        )}

        {activePage === 'teams' && (
          <Teams
            teams={teams}
            tournaments={tournaments}
            onSelectTeam={navigateToTeam}
            setActivePage={setActivePage}
            isOrganizer={isOrganizer}
          />
        )}

        {activePage === 'team-details' && (
          <TeamDetails
            teamId={selectedTeamId}
            teams={teams}
            tournaments={tournaments}
            players={players}
            matches={matches}
            onBack={() => setActivePage('teams')}
            onSelectMatch={navigateToMatch}
            onOpenScoreModal={setScoreModalMatch}
            onAddPlayer={handleSavePlayer}
            isOrganizer={isOrganizer}
          />
        )}

        {activePage === 'rankings' && (
          <Rankings
            tournaments={tournaments}
            teams={teams}
            matches={matches}
            onSelectTeam={navigateToTeam}
          />
        )}

        {activePage === 'match-center' && (
          <MatchCenter
            matchId={selectedMatchId}
            matches={matches}
            teams={teams}
            tournaments={tournaments}
            onBack={() => setActivePage('home')}
            onOpenScoreModal={setScoreModalMatch}
            isOrganizer={isOrganizer}
          />
        )}

        {activePage === 'login' && (
          <Login
            onSwitchToRegister={() => setActivePage('register')}
            onSuccess={() => setActivePage('home')}
          />
        )}

        {activePage === 'register' && (
          <Register
            onSwitchToLogin={() => setActivePage('login')}
            onSuccess={() => setActivePage('home')}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            activeView={dashboardView}
            setActiveView={setDashboardView}
            tournaments={tournaments}
            teams={teams}
            players={players}
            matches={matches}
            onSaveTournament={handleSaveTournament}
            onDeleteTournament={handleDeleteTournament}
            onSaveTeam={handleSaveTeam}
            onDeleteTeam={handleDeleteTeam}
            onSavePlayer={handleSavePlayer}
            onDeletePlayer={handleDeletePlayer}
            onSaveMatch={handleSaveMatch}
            onDeleteMatch={handleDeleteMatch}
            onOpenScoreModal={setScoreModalMatch}
            onSelectTournament={navigateToTournament}
            onSelectMatch={navigateToMatch}
            setActivePage={setActivePage}
          />
        )}
      </main>

      {/* Live Scoring Modal */}
      {scoreModalMatch && (
        <ScoreMatchModal
          match={scoreModalMatch}
          teams={teams}
          tournaments={tournaments}
          onSave={handleSaveScore}
          onClose={() => setScoreModalMatch(null)}
        />
      )}

        {/* Clean SaaS Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                A
              </div>
              <span className="font-bold text-slate-900">ArenaFlow</span>
              <span className="text-slate-400">· Tournament Management Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <button onClick={() => { setActivePage('dashboard'); setDashboardView('dashboard'); }} className="hover:text-slate-900 cursor-pointer">Dashboard</button>
              <span className="text-slate-300">·</span>
              <button onClick={() => { setActivePage('dashboard'); setDashboardView('tournaments'); }} className="hover:text-slate-900 cursor-pointer">Tournaments</button>
              <span className="text-slate-300">·</span>
              <button onClick={() => { setActivePage('dashboard'); setDashboardView('fixtures'); }} className="hover:text-slate-900 cursor-pointer">Fixtures</button>
              <span className="text-slate-300">·</span>
              <button onClick={() => setActivePage('live')} className="hover:text-slate-900 cursor-pointer">Live</button>
              <span className="text-slate-300">·</span>
              <button onClick={() => { setActivePage('dashboard'); setDashboardView('standings'); }} className="hover:text-slate-900 cursor-pointer">Standings</button>
            </div>

            <div className="text-slate-400">
              &copy; {new Date().getFullYear()} ArenaFlow. All rights reserved.
            </div>
          </div>
        </footer>

      </div>

      {/* Live Scoring Modal */}
      {scoreModalMatch && (
        <ScoreMatchModal
          match={scoreModalMatch}
          teams={teams}
          tournaments={tournaments}
          onSave={handleSaveScore}
          onClose={() => setScoreModalMatch(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
