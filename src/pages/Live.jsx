// ============================================================================
// LIVE PAGE
// Clean live score feed with status tabs and no emojis
// ============================================================================

import React, { useState } from 'react';
import MatchCard from '../components/MatchCard.jsx';

export default function Live({
  matches = [],
  teams = [],
  tournaments = [],
  onSelectMatch,
  onOpenScoreModal,
  isOrganizer
}) {
  const [statusFilter, setStatusFilter] = useState('live'); // 'live', 'upcoming', 'completed', 'all'
  const [sportFilter, setSportFilter] = useState('All');

  const sports = ['All', 'Football', 'Cricket', 'Basketball'];

  const filteredMatches = matches.filter(match => {
    if (sportFilter !== 'All') {
      const tourney = tournaments.find(t => t.id === match.tournamentId);
      if (!tourney || tourney.sport.toLowerCase() !== sportFilter.toLowerCase()) return false;
    }

    if (statusFilter === 'all') return true;
    if (statusFilter === 'live') return match.status === 'live';
    if (statusFilter === 'upcoming') return match.status === 'scheduled';
    if (statusFilter === 'completed') return match.status === 'completed';
    return true;
  });

  const liveCount = matches.filter(m => m.status === 'live').length;
  const upcomingCount = matches.filter(m => m.status === 'scheduled').length;
  const completedCount = matches.filter(m => m.status === 'completed').length;

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Live Matches & Scores
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time score updates across tournament fixtures
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="font-semibold text-emerald-700">{liveCount} Live Now</span>
          <span>·</span>
          <span>{upcomingCount} Upcoming</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'live', label: `Live (${liveCount})` },
            { id: 'upcoming', label: `Starting Soon (${upcomingCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'all', label: `All (${matches.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sport selection */}
        <div className="flex items-center gap-1">
          {sports.map(s => (
            <button
              key={s}
              onClick={() => setSportFilter(s)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                sportFilter === s
                  ? 'font-semibold text-slate-900 bg-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map(match => (
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
          No matches found for the selected category.
        </div>
      )}

    </div>
  );
}
