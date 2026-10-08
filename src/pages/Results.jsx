// ============================================================================
// RESULTS PAGE
// Completed championship fixtures with winner margins and scores
// ============================================================================

import React, { useState } from 'react';
import MatchCard from '../components/MatchCard.jsx';

export default function Results({
  matches = [],
  teams = [],
  tournaments = [],
  onSelectMatch,
  onOpenScoreModal,
  isOrganizer
}) {
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedTournament, setSelectedTournament] = useState('All');

  const completedMatches = matches.filter(m => m.status === 'completed');

  const filteredResults = completedMatches.filter(match => {
    const tourney = tournaments.find(t => t.id === match.tournamentId);
    if (selectedSport !== 'All' && tourney?.sport.toLowerCase() !== selectedSport.toLowerCase()) {
      return false;
    }
    if (selectedTournament !== 'All' && match.tournamentId !== selectedTournament) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Recent Match Results
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified final scores, winning margins, and concluded fixture records
        </p>
      </div>

      {/* Filter Row */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 focus:outline-none"
            >
              <option value="All">All Sports</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Basketball">Basketball</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tournament</label>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 focus:outline-none max-w-xs truncate"
            >
              <option value="All">All Tournaments</option>
              {tournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-mono">
          Showing {filteredResults.length} completed results
        </div>
      </div>

      {/* Results Grid */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResults.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              teams={teams}
              tournaments={tournaments}
              onSelectMatch={onSelectMatch}
              onOpenScoreModal={onOpenScoreModal}
              isOrganizer={isOrganizer}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 text-xs">
          No completed results recorded yet.
        </div>
      )}

    </div>
  );
}
