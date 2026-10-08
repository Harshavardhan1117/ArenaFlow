// ============================================================================
// SCHEDULE PAGE
// Matches grouped by calendar date with clean filters and no emojis
// ============================================================================

import React, { useState } from 'react';

export default function Schedule({
  matches = [],
  teams = [],
  tournaments = [],
  onSelectMatch
}) {
  const [selectedSport, setSelectedSport] = useState('All');
  const [selectedTournament, setSelectedTournament] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredMatches = matches.filter(match => {
    const tourney = tournaments.find(t => t.id === match.tournamentId);
    if (selectedSport !== 'All' && tourney?.sport.toLowerCase() !== selectedSport.toLowerCase()) {
      return false;
    }
    if (selectedTournament !== 'All' && match.tournamentId !== selectedTournament) {
      return false;
    }
    if (selectedStatus !== 'All' && match.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  const matchesByDate = {};
  filteredMatches.forEach(match => {
    const dateKey = match.matchDate || 'Upcoming Dates';
    if (!matchesByDate[dateKey]) {
      matchesByDate[dateKey] = [];
    }
    matchesByDate[dateKey].push(match);
  });

  const sortedDates = Object.keys(matchesByDate).sort();

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Tournament Match Schedule
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Timetable of collegiate fixtures grouped chronologically by date
        </p>
      </div>

      {/* Filter Bar */}
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

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-mono">
          Showing {filteredMatches.length} fixtures
        </div>
      </div>

      {/* Grouped Matches */}
      {sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map(dateStr => {
            const dateMatches = matchesByDate[dateStr];
            return (
              <div key={dateStr} className="space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-1.5">
                  {dateStr}
                </div>

                <div className="space-y-2">
                  {dateMatches.map(match => {
                    const teamA = teams.find(t => t.id === match.teamAId) || { name: 'Team A' };
                    const teamB = teams.find(t => t.id === match.teamBId) || { name: 'Team B' };
                    const tourney = tournaments.find(t => t.id === match.tournamentId) || { name: 'Tournament' };

                    return (
                      <div
                        key={match.id}
                        className="bg-white border border-slate-200 rounded-lg p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="sm:w-48 space-y-0.5">
                          <span className="font-mono text-slate-500 block">{match.matchTime || 'Time TBD'}</span>
                          <span className="text-slate-700 font-medium truncate block">{tourney.name}</span>
                          <span className="text-slate-400 truncate block">{match.venue || 'Main Ground'}</span>
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between font-semibold text-sm text-slate-900">
                            <span>{teamA.name}</span>
                            <span className="font-mono text-xs tabular-nums text-slate-700">
                              {match.teamAScore || (match.status === 'scheduled' ? '-' : '0')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-semibold text-sm text-slate-900">
                            <span>{teamB.name}</span>
                            <span className="font-mono text-xs tabular-nums text-slate-700">
                              {match.teamBScore || (match.status === 'scheduled' ? '-' : '0')}
                            </span>
                          </div>
                          {match.resultSummary && (
                            <div className="text-[11px] text-slate-600 mt-1">{match.resultSummary}</div>
                          )}
                        </div>

                        <div className="sm:w-32 flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <span className="capitalize text-slate-500 font-medium">
                            {match.status === 'live' ? <strong className="text-emerald-700">Live</strong> : match.status}
                          </span>
                          <button
                            onClick={() => onSelectMatch(match.id)}
                            className="font-semibold text-slate-900 hover:text-emerald-700"
                          >
                            View Match →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 text-xs">
          No matches found for the selected criteria.
        </div>
      )}

    </div>
  );
}
