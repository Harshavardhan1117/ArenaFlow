// ============================================================================
// TEAM CARD COMPONENT
// Clean, professional franchise card without giant badges or emojis
// ============================================================================

import React from 'react';

export default function TeamCard({ team, tournament, onSelect }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            {team.shortName || team.name?.slice(0, 3).toUpperCase()}
          </span>
          {tournament && (
            <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
              {tournament.name}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 truncate">
          {team.name}
        </h3>

        <div className="text-xs text-slate-600 space-y-1">
          <div>Captain: <span className="text-slate-800 font-medium">{team.captain || 'Not Announced'}</span></div>
          {team.contact && (
            <div>Contact: <span className="font-mono text-slate-700">{team.contact}</span></div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>{team.playersCount || 15} Squad Players</span>
        <button
          onClick={() => onSelect(team.id)}
          className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
        >
          View Team →
        </button>
      </div>
    </div>
  );
}
