// ============================================================================
// MATCH CARD COMPONENT
// Clean, professional sports match card without neon gradients or glow effects
// ============================================================================

import React from 'react';

export default function MatchCard({
  match,
  teams = [],
  tournaments = [],
  onSelectMatch,
  onOpenScoreModal,
  isOrganizer = false
}) {
  const teamA = teams.find(t => t.id === match.teamAId) || { name: 'Team A', shortName: 'TMA' };
  const teamB = teams.find(t => t.id === match.teamBId) || { name: 'Team B', shortName: 'TMB' };
  const tournament = tournaments.find(t => t.id === match.tournamentId) || { name: 'Tournament', sport: 'Sport' };

  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const isScheduled = match.status === 'scheduled';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
      <div>
        {/* Top: Tournament Name */}
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 truncate">
          {tournament.name}
        </div>

        {/* Status Line: subtle LIVE indicator or time */}
        <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-100">
          <div>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 text-[11px] tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                LIVE
              </span>
            ) : isCompleted ? (
              <span className="text-slate-500 font-medium">Final</span>
            ) : (
              <span className="text-slate-500 font-medium">Scheduled</span>
            )}
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            {isLive ? (match.currentInnings || 'In Progress') : (match.matchTime || '')}
          </div>
        </div>

        {/* Teams & Scores */}
        <div className="space-y-2.5 my-2">
          {/* Team A */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-slate-900 truncate pr-2">
              {teamA.name}
            </span>
            <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
              {match.teamAScore || (isScheduled ? '-' : '0')}
            </span>
          </div>

          {/* Team B */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-slate-900 truncate pr-2">
              {teamB.name}
            </span>
            <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
              {match.teamBScore || (isScheduled ? '-' : '0')}
            </span>
          </div>
        </div>

        {/* Optional situation note / result */}
        {match.resultSummary && (
          <div className="mt-2.5 text-xs text-slate-600 font-medium">
            {match.resultSummary}
          </div>
        )}
      </div>

      {/* Card Footer: Venue & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="truncate pr-2">
          <span>{match.venue || 'Main Ground'}</span>
          <span className="mx-1">·</span>
          <span>{match.matchDate}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isOrganizer && onOpenScoreModal && (
            <button
              onClick={() => onOpenScoreModal(match)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
            >
              Score
            </button>
          )}

          <button
            onClick={() => onSelectMatch(match.id)}
            className="text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
          >
            View Match →
          </button>
        </div>
      </div>
    </div>
  );
}
