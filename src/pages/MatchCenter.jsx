// ============================================================================
// MATCH CENTER PAGE
// Clean, professional match scorecard and event timeline
// ============================================================================

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function MatchCenter({
  matchId,
  matches = [],
  teams = [],
  tournaments = [],
  onBack,
  onOpenScoreModal,
  isOrganizer
}) {
  const match = matches.find(m => m.id === matchId) || matches[0];

  if (!match) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-500">
        <p>Match not found.</p>
        <button onClick={onBack} className="mt-4 text-slate-900 font-semibold underline">
          Back to Matches
        </button>
      </div>
    );
  }

  const teamA = teams.find(t => t.id === match.teamAId) || { name: 'Team A', shortName: 'TMA' };
  const teamB = teams.find(t => t.id === match.teamBId) || { name: 'Team B', shortName: 'TMB' };
  const tournament = tournaments.find(t => t.id === match.tournamentId) || { name: 'Tournament', sport: 'Sport' };

  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const timelineEvents = Array.isArray(match.timelineEvents) ? match.timelineEvents : [];

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Matches</span>
        </button>

        {isOrganizer && (
          <button
            onClick={() => onOpenScoreModal(match)}
            className="btn-primary text-xs"
          >
            Update Score / Result
          </button>
        )}
      </div>

      {/* Main Clean Scoreboard Box */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Tournament & Status */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
          <div>
            <span className="font-semibold text-slate-500 uppercase tracking-wider">{tournament.name}</span>
            <span className="text-slate-400 mx-1.5">·</span>
            <span className="text-slate-500 capitalize">{tournament.sport}</span>
          </div>

          <div>
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                LIVE NOW
              </span>
            ) : isCompleted ? (
              <span className="text-slate-500 font-medium">Final Result</span>
            ) : (
              <span className="text-slate-500 font-medium">Scheduled</span>
            )}
          </div>
        </div>

        {/* Head to Head Score Display */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center py-2">
          
          {/* Team A */}
          <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 sm:text-right">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{teamA.name}</h2>
              {match.teamAOvers && (
                <span className="text-xs text-slate-500 font-mono">({match.teamAOvers} overs)</span>
              )}
            </div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {match.teamAScore || (match.status === 'scheduled' ? '-' : '0')}
            </span>
          </div>

          {/* VS */}
          <div className="sm:col-span-1 text-center text-xs font-semibold text-slate-400 uppercase">
            VS
          </div>

          {/* Team B */}
          <div className="sm:col-span-2 flex items-center justify-between sm:justify-start gap-3 sm:text-left">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 tabular-nums">
              {match.teamBScore || (match.status === 'scheduled' ? '-' : '0')}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{teamB.name}</h2>
              {match.teamBOvers && (
                <span className="text-xs text-slate-500 font-mono">({match.teamBOvers} overs)</span>
              )}
            </div>
          </div>

        </div>

        {/* Situation / Winner Headline */}
        {match.resultSummary && (
          <div className="text-center text-xs font-semibold text-slate-700 bg-slate-50 py-2.5 px-4 rounded border border-slate-200">
            {match.resultSummary}
          </div>
        )}
      </div>

      {/* Details & Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Match Info */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Match Information
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Tournament</span>
              <span className="font-semibold text-slate-800">{tournament.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Date</span>
              <span className="font-mono text-slate-800">{match.matchDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Time</span>
              <span className="font-mono text-slate-800">{match.matchTime || 'TBD'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Venue</span>
              <span className="text-slate-800">{match.venue || 'University Ground'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Sport</span>
              <span className="capitalize text-slate-800">{tournament.sport}</span>
            </div>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Match Timeline</h3>
            <span className="text-xs text-slate-400 font-mono">{timelineEvents.length} events</span>
          </div>

          {timelineEvents.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="font-mono font-bold text-slate-700 text-[11px]">
                    {event.over}
                  </div>
                  <div className="text-slate-800">
                    {event.text}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              No timeline events recorded for this match yet.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
