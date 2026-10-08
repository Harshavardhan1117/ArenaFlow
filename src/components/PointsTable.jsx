// ============================================================================
// POINTS TABLE COMPONENT
// Clean sports standings table supporting Cricket (NRR) and Football (GD)
// ============================================================================

import React from 'react';
import { calculatePointsTable } from '../services/tournamentService.js';

export default function PointsTable({ tournamentId, matches = [], teams = [], sport = 'Cricket', onSelectTeam }) {
  const standings = calculatePointsTable(tournamentId, matches, teams, sport);
  const isCricket = (sport || '').toLowerCase() === 'cricket';

  if (!standings || standings.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 text-sm">
        No standings available for this tournament yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900">Points Table & Standings</h3>
        <span className="text-xs text-slate-500">
          {isCricket ? 'Win: 2 pts · Tie: 1 pt · Sorted by NRR' : 'Win: 3 pts · Draw: 1 pt · Sorted by GD'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th scope="col" className="py-2.5 px-4 text-center w-12">Pos</th>
              <th scope="col" className="py-2.5 px-4">Team</th>
              <th scope="col" className="py-2.5 px-3 text-center" title="Matches Played">P</th>
              <th scope="col" className="py-2.5 px-3 text-center" title="Matches Won">W</th>
              <th scope="col" className="py-2.5 px-3 text-center" title={isCricket ? "Tied" : "Drawn"}>
                {isCricket ? 'T' : 'D'}
              </th>
              <th scope="col" className="py-2.5 px-3 text-center" title="Matches Lost">L</th>
              {isCricket ? (
                <th scope="col" className="py-2.5 px-4 text-right" title="Net Run Rate">NRR</th>
              ) : (
                <>
                  <th scope="col" className="py-2.5 px-3 text-center" title="Goals For">GF</th>
                  <th scope="col" className="py-2.5 px-3 text-center" title="Goals Against">GA</th>
                  <th scope="col" className="py-2.5 px-3 text-center" title="Goal Difference">GD</th>
                </>
              )}
              <th scope="col" className="py-2.5 px-4 text-right font-bold text-slate-900" title="Total Points">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {standings.map((teamRow, idx) => {
              const isPlayoffZone = idx < 2;
              const nrrSign = teamRow.netRunRate > 0 ? '+' : '';

              return (
                <tr
                  key={teamRow.teamId}
                  className={`hover:bg-slate-50 transition-colors ${
                    isPlayoffZone ? 'bg-slate-50/50' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center font-semibold text-slate-500">
                    {teamRow.rank}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <button
                      onClick={() => onSelectTeam && onSelectTeam(teamRow.teamId)}
                      className="hover:text-emerald-700 text-left transition-colors"
                    >
                      <span>{teamRow.teamName}</span>
                      <span className="text-xs text-slate-400 font-normal ml-1.5 font-mono">
                        ({teamRow.shortName})
                      </span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                    {teamRow.played}
                  </td>
                  <td className="py-3 px-3 text-center font-mono tabular-nums font-semibold text-slate-900">
                    {teamRow.won}
                  </td>
                  <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                    {teamRow.drawnOrTied}
                  </td>
                  <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                    {teamRow.lost}
                  </td>

                  {isCricket ? (
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                      {nrrSign}{teamRow.netRunRate.toFixed(3)}
                    </td>
                  ) : (
                    <>
                      <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                        {teamRow.goalsFor}
                      </td>
                      <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-600">
                        {teamRow.goalsAgainst}
                      </td>
                      <td className="py-3 px-3 text-center font-mono tabular-nums font-semibold text-slate-800">
                        {teamRow.goalDifference > 0 ? `+${teamRow.goalDifference}` : teamRow.goalDifference}
                      </td>
                    </>
                  )}

                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900 text-sm">
                    {teamRow.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
