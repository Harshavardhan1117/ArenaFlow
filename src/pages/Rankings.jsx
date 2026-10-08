// ============================================================================
// RANKINGS PAGE
// Official tournament points table and standings
// ============================================================================

import React, { useState } from 'react';
import PointsTable from '../components/PointsTable.jsx';

export default function Rankings({
  tournaments = [],
  teams = [],
  matches = [],
  onSelectTeam
}) {
  const [selectedTournamentId, setSelectedTournamentId] = useState(
    tournaments[0]?.id || 'tourney-cricket-1'
  );

  const selectedTourney = tournaments.find(t => t.id === selectedTournamentId) || tournaments[0];
  const isCricket = selectedTourney?.sport?.toLowerCase() === 'cricket';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Tournament Standings & Rankings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Points table dynamically calculated from verified match outcomes
        </p>
      </div>

      {/* Tournament Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tournaments.map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTournamentId(t.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTournamentId === t.id
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{t.name}</span>
            <span className="opacity-60 ml-1.5">({t.sport})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {selectedTourney && (
        <div className="space-y-6">
          <PointsTable
            tournamentId={selectedTourney.id}
            matches={matches}
            teams={teams}
            sport={selectedTourney.sport}
            onSelectTeam={onSelectTeam}
          />

          {/* Scoring Rules Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
              <h4 className="font-bold text-slate-900">Points System</h4>
              <ul className="text-slate-600 space-y-1">
                <li>Win: <strong>{isCricket ? '2 Points' : '3 Points'}</strong></li>
                <li>Tie / Draw: <strong>1 Point</strong></li>
                <li>Loss: <strong>0 Points</strong></li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2">
              <h4 className="font-bold text-slate-900">Tie-Breaking Criteria</h4>
              <p className="text-slate-600 leading-relaxed">
                {isCricket
                  ? 'Tied teams are separated by Net Run Rate (NRR) = (Runs Scored / Overs Faced) - (Runs Conceded / Overs Bowled).'
                  : 'Tied teams are separated by Goal Difference (GD) = Goals For - Goals Against.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
