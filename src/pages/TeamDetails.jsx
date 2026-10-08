// ============================================================================
// TEAM DETAILS PAGE
// Franchise overview, squad roster, and match history
// ============================================================================

import React, { useState } from 'react';
import MatchCard from '../components/MatchCard.jsx';
import { ArrowLeft, X } from 'lucide-react';

export default function TeamDetails({
  teamId,
  teams = [],
  tournaments = [],
  players = [],
  matches = [],
  onBack,
  onSelectMatch,
  onOpenScoreModal,
  onAddPlayer,
  isOrganizer
}) {
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerJersey, setNewPlayerJersey] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('Forward');

  const team = teams.find(t => t.id === teamId) || teams[0];

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-500">
        <p>Team not found.</p>
        <button onClick={onBack} className="mt-4 text-slate-900 font-semibold underline">
          Back to Teams
        </button>
      </div>
    );
  }

  const tournament = tournaments.find(t => t.id === team.tournamentId);
  const isCricket = tournament?.sport?.toLowerCase() === 'cricket';

  const teamPlayers = players.filter(p => p.teamId === team.id);
  const teamMatches = matches.filter(m => m.teamAId === team.id || m.teamBId === team.id);
  const completedMatches = teamMatches.filter(m => m.status === 'completed');

  let wins = 0;
  let losses = 0;
  let draws = 0;

  completedMatches.forEach(m => {
    const isTeamA = m.teamAId === team.id;
    const isWinnerA = (m.resultSummary || '').includes(teams.find(t => t.id === m.teamAId)?.name || 'Team A');
    const isWinnerB = (m.resultSummary || '').includes(teams.find(t => t.id === m.teamBId)?.name || 'Team B');

    if ((m.resultSummary || '').includes('Draw') || (m.resultSummary || '').includes('Tied')) {
      draws++;
    } else if (isTeamA && isWinnerA) {
      wins++;
    } else if (!isTeamA && isWinnerB) {
      wins++;
    } else {
      losses++;
    }
  });

  const totalPoints = isCricket ? (wins * 2 + draws * 1) : (wins * 3 + draws * 1);

  function handleCreatePlayerSubmit(e) {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    if (onAddPlayer) {
      onAddPlayer({
        teamId: team.id,
        tournamentId: team.tournamentId,
        name: newPlayerName.trim(),
        jerseyNumber: newPlayerJersey.trim() || '0',
        role: newPlayerRole
      });
    }

    setNewPlayerName('');
    setNewPlayerJersey('');
    setShowAddPlayerModal(false);
  }

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Teams</span>
        </button>
      </div>

      {/* Team Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {tournament?.name || 'Tournament'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {team.name}
          </h1>
          <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 pt-1">
            <span>Captain: <strong className="text-slate-800">{team.captain || 'Not Set'}</strong></span>
            {team.contact && (
              <>
                <span>·</span>
                <span>Contact: <span className="font-mono text-slate-700">{team.contact}</span></span>
              </>
            )}
          </div>
        </div>

        {/* Win/Loss Record Box */}
        <div className="flex items-center gap-4 bg-white border border-slate-200 p-3 rounded-lg shadow-xs self-start md:self-auto text-xs">
          <div className="text-center px-2">
            <span className="text-slate-500 block">P</span>
            <span className="font-bold font-mono text-slate-900 text-sm">{completedMatches.length}</span>
          </div>
          <div className="text-center px-2">
            <span className="text-slate-500 block">W</span>
            <span className="font-bold font-mono text-emerald-700 text-sm">{wins}</span>
          </div>
          <div className="text-center px-2">
            <span className="text-slate-500 block">L</span>
            <span className="font-bold font-mono text-slate-500 text-sm">{losses}</span>
          </div>
          <div className="text-center px-2">
            <span className="text-slate-500 block">Pts</span>
            <span className="font-bold font-mono text-slate-900 text-sm">{totalPoints}</span>
          </div>
        </div>
      </div>

      {/* Grid: Squad List & Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Squad Players (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Squad Roster ({teamPlayers.length} Players)
            </h2>
            {isOrganizer && (
              <button
                onClick={() => setShowAddPlayerModal(true)}
                className="btn-secondary text-xs"
              >
                + Add Player
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">No.</th>
                  <th className="py-2.5 px-3">Player Name</th>
                  <th className="py-2.5 px-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {teamPlayers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-500">
                      #{p.jerseyNumber || '-'}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{p.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Fixtures (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Team Matches
          </h2>

          <div className="space-y-3">
            {teamMatches.length > 0 ? (
              teamMatches.map(m => (
                <MatchCard
                  key={m.id}
                  match={m}
                  teams={teams}
                  tournaments={tournaments}
                  onSelectMatch={onSelectMatch}
                  onOpenScoreModal={onOpenScoreModal}
                  isOrganizer={isOrganizer}
                />
              ))
            ) : (
              <div className="p-6 bg-white border border-slate-200 rounded-lg text-center text-slate-500 text-xs">
                No fixtures scheduled for this team yet.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Player to {team.name}</h3>
              <button onClick={() => setShowAddPlayerModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlayerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Player Full Name</label>
                <input
                  type="text"
                  required
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Player name"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jersey Number</label>
                <input
                  type="text"
                  value={newPlayerJersey}
                  onChange={(e) => setNewPlayerJersey(e.target.value)}
                  placeholder="e.g. 7"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={newPlayerRole}
                  onChange={(e) => setNewPlayerRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                >
                  <option value="Forward">Forward</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Defender">Defender</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                  <option value="Batter">Batter</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-rounder">All-rounder</option>
                  <option value="Wicketkeeper">Wicketkeeper</option>
                  <option value="Player">Player</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPlayerModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Save Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
