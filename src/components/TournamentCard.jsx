// ============================================================================
// TOURNAMENT CARD COMPONENT
// Clean, professional sports tournament card
// ============================================================================

import React from 'react';

export default function TournamentCard({
  tournament,
  teamsCount = 0,
  matchesCount = 0,
  onSelect
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        {/* Category & Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-600">
            {tournament.sport}
          </span>
          <span className="capitalize font-medium text-slate-500">
            {tournament.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 mb-2">
          {tournament.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {tournament.description || 'Inter-college championship featuring league fixtures and playoffs.'}
        </p>

        {/* Metadata */}
        <div className="text-xs text-slate-500 space-y-1">
          <div>Venue: <span className="text-slate-700">{tournament.location || 'Main Ground'}</span></div>
          <div>Dates: <span className="text-slate-700">{tournament.startDate} – {tournament.endDate || 'TBD'}</span></div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="text-slate-500">
          <span>{teamsCount} Teams</span>
          <span className="mx-1.5">·</span>
          <span>{matchesCount} Matches</span>
        </div>

        <button
          onClick={() => onSelect(tournament.id)}
          className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
        >
          View Tournament →
        </button>
      </div>
    </div>
  );
}
