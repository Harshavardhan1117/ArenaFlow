// ============================================================================
// TOURNAMENTS DIRECTORY PAGE
// Directory of active and upcoming sports tournaments without emojis
// ============================================================================

import React, { useState } from 'react';
import TournamentCard from '../components/TournamentCard.jsx';

export default function Tournaments({
  tournaments = [],
  teams = [],
  matches = [],
  onSelectTournament,
  setActivePage,
  isOrganizer
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');

  const sports = ['All', 'Football', 'Cricket', 'Basketball'];

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'All' || t.sport.toLowerCase() === selectedSport.toLowerCase();
    return matchesSearch && matchesSport;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Sports Tournaments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse active and upcoming leagues, championships, and college cups
          </p>
        </div>

        {isOrganizer && (
          <button
            onClick={() => setActivePage('dashboard')}
            className="btn-primary text-xs self-start sm:self-auto"
          >
            Create Tournament
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tournament or venue..."
          className="w-full sm:w-72 bg-white border border-slate-300 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-500"
        />

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {sports.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSport(s)}
              className={`px-3 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                selectedSport === s
                  ? 'font-semibold text-slate-900 bg-slate-200'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTournaments.map(t => {
            const tourneyTeams = teams.filter(tm => tm.tournamentId === t.id);
            const tourneyMatches = matches.filter(m => m.tournamentId === t.id);
            return (
              <TournamentCard
                key={t.id}
                tournament={t}
                teamsCount={tourneyTeams.length}
                matchesCount={tourneyMatches.length}
                onSelect={onSelectTournament}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 text-xs">
          No tournaments found matching the criteria.
        </div>
      )}

    </div>
  );
}
