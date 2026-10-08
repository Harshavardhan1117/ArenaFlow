// ============================================================================
// SCORE MATCH MODAL COMPONENT
// Clean, compact form for updating live scores, overs, and match results
// ============================================================================

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ScoreMatchModal({
  match,
  teams = [],
  tournaments = [],
  onSave,
  onClose
}) {
  const teamA = teams.find(t => t.id === match.teamAId) || { name: 'Team A', shortName: 'TMA' };
  const teamB = teams.find(t => t.id === match.teamBId) || { name: 'Team B', shortName: 'TMB' };
  const tournament = tournaments.find(t => t.id === match.tournamentId) || { name: 'Tournament', sport: 'Cricket' };
  const isCricket = (tournament.sport || '').toLowerCase() === 'cricket';

  const [status, setStatus] = useState(match.status || 'live');
  const [teamAScore, setTeamAScore] = useState(match.teamAScore || '');
  const [teamBScore, setTeamBScore] = useState(match.teamBScore || '');
  const [teamAOvers, setTeamAOvers] = useState(match.teamAOvers || '');
  const [teamBOvers, setTeamBOvers] = useState(match.teamBOvers || '');
  const [currentInnings, setCurrentInnings] = useState(match.currentInnings || '');
  const [resultSummary, setResultSummary] = useState(match.resultSummary || '');

  const [newOverText, setNewOverText] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [eventsList, setEventsList] = useState(
    Array.isArray(match.timelineEvents) ? match.timelineEvents : []
  );

  function handleAddEvent() {
    if (!newEventDesc.trim()) return;
    const newEvt = {
      over: newOverText.trim() || (isCricket ? 'Over' : 'Min'),
      text: newEventDesc.trim(),
      type: 'update'
    };
    setEventsList([newEvt, ...eventsList]);
    setNewOverText('');
    setNewEventDesc('');
  }

  function handleRemoveEvent(index) {
    setEventsList(eventsList.filter((_, idx) => idx !== index));
  }

  function handleQuickResult(winnerName) {
    if (winnerName === 'tie') {
      setResultSummary('Match Tied / Draw');
      setStatus('completed');
    } else {
      setResultSummary(`${winnerName} Won`);
      setStatus('completed');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const updatedMatch = {
      ...match,
      status,
      teamAScore,
      teamBScore,
      teamAOvers,
      teamBOvers,
      currentInnings,
      resultSummary,
      timelineEvents: eventsList
    };
    onSave(updatedMatch);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-lg w-full max-w-xl overflow-hidden shadow-lg my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {tournament.name}
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Record Score: {teamA.name} vs {teamB.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          
          {/* Match Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Match Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('scheduled')}
                className={`py-1.5 px-3 rounded-md text-xs font-medium border transition-colors ${
                  status === 'scheduled'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Scheduled
              </button>
              <button
                type="button"
                onClick={() => setStatus('live')}
                className={`py-1.5 px-3 rounded-md text-xs font-medium border transition-colors ${
                  status === 'live'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Live
              </button>
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`py-1.5 px-3 rounded-md text-xs font-medium border transition-colors ${
                  status === 'completed'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-md bg-slate-50 border border-slate-200">
            {/* Team A */}
            <div className="space-y-3">
              <span className="font-bold text-xs text-slate-900 block truncate">{teamA.name}</span>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  {isCricket ? 'Score (e.g. 162/8)' : 'Score / Goals'}
                </label>
                <input
                  type="text"
                  value={teamAScore}
                  onChange={(e) => setTeamAScore(e.target.value)}
                  placeholder={isCricket ? "162/8" : "2"}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
                />
              </div>
              {isCricket && (
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Overs (e.g. 20.0)</label>
                  <input
                    type="text"
                    value={teamAOvers}
                    onChange={(e) => setTeamAOvers(e.target.value)}
                    placeholder="20.0"
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Team B */}
            <div className="space-y-3">
              <span className="font-bold text-xs text-slate-900 block truncate">{teamB.name}</span>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  {isCricket ? 'Score (e.g. 158/4)' : 'Score / Goals'}
                </label>
                <input
                  type="text"
                  value={teamBScore}
                  onChange={(e) => setTeamBScore(e.target.value)}
                  placeholder={isCricket ? "158/4" : "1"}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
                />
              </div>
              {isCricket && (
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Overs (e.g. 18.2)</label>
                  <input
                    type="text"
                    value={teamBOvers}
                    onChange={(e) => setTeamBOvers(e.target.value)}
                    placeholder="18.2"
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Result / Situation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Match Situation or Final Result
            </label>
            <input
              type="text"
              value={resultSummary}
              onChange={(e) => setResultSummary(e.target.value)}
              placeholder="e.g. Thunder FC won 2 - 1 or Reva Royals need 5 runs"
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
            />

            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-500">Quick Result:</span>
              <button
                type="button"
                onClick={() => handleQuickResult(teamA.name)}
                className="text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                {teamA.shortName} Won
              </button>
              <button
                type="button"
                onClick={() => handleQuickResult(teamB.name)}
                className="text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                {teamB.shortName} Won
              </button>
              <button
                type="button"
                onClick={() => handleQuickResult('tie')}
                className="text-xs px-2 py-0.5 rounded border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Draw/Tie
              </button>
            </div>
          </div>

          {/* Simple Timeline Item */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Add Timeline Event
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newOverText}
                onChange={(e) => setNewOverText(e.target.value)}
                placeholder="72' / 18.2"
                className="w-20 bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 focus:outline-none"
              />
              <input
                type="text"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="Goal by Alex Silva / Boundary scored"
                className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddEvent}
                className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200"
              >
                Add
              </button>
            </div>

            {eventsList.length > 0 && (
              <div className="max-h-28 overflow-y-auto space-y-1 mt-2 text-xs">
                {eventsList.map((evt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-200">
                    <span className="truncate">
                      <strong>{evt.over}:</strong> {evt.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEvent(idx)}
                      className="text-slate-400 hover:text-red-600 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
            >
              Save Score
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
