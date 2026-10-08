// ============================================================================
// TEAMS DIRECTORY & MANAGEMENT PAGE
// Administrative table view inspired by professional sports SaaS products.
// ============================================================================

import React, { useState } from 'react';
import TeamCard from '../components/TeamCard.jsx';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';

export default function Teams({
  teams = [],
  tournaments = [],
  onSelectTeam,
  setActivePage,
  isOrganizer
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTournament, setSelectedTournament] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (team.captain && team.captain.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTourney = selectedTournament === 'All' || team.tournamentId === selectedTournament;
    return matchesSearch && matchesTourney;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Teams
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage participating teams, squad captains, and tournament rosters
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded flex items-center gap-1 cursor-pointer ${
                viewMode === 'table' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded flex items-center gap-1 cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>

          <button
            onClick={() => setActivePage('dashboard')}
            className="btn-primary text-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Team</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teams or captains..."
            className="w-full bg-white border border-slate-300 rounded-md pl-3 pr-3 py-1.5 text-slate-900 focus:outline-none focus:border-slate-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <label className="text-slate-500 text-xs hidden sm:inline">Tournament:</label>
          <select
            value={selectedTournament}
            onChange={(e) => setSelectedTournament(e.target.value)}
            className="w-full sm:w-auto bg-white border border-slate-300 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
          >
            <option value="All">All Tournaments</option>
            {tournaments.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content: Administrative Table or Card Grid */}
      {filteredTeams.length > 0 ? (
        viewMode === 'table' ? (
          /* Professional Administrative Table View */
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Team</th>
                    <th className="py-3 px-4">Tournament</th>
                    <th className="py-3 px-4">Captain</th>
                    <th className="py-3 px-4 text-center">Players</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTeams.map(team => {
                    const tourney = tournaments.find(t => t.id === team.tournamentId);
                    return (
                      <tr key={team.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onSelectTeam(team.id)}
                            className="font-bold text-slate-900 hover:underline text-left cursor-pointer"
                          >
                            {team.name}
                          </button>
                          {team.shortName && (
                            <span className="font-mono text-slate-400 text-[11px] ml-1.5">
                              ({team.shortName})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {tourney?.name || 'Tournament'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {team.captain || 'Not Set'}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-800">
                          {team.playersCount || 0}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => onSelectTeam(team.id)}
                            className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                          >
                            View Squad
                          </button>
                          {isOrganizer && (
                            <button
                              onClick={() => setActivePage('dashboard')}
                              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Card Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeams.map(team => {
              const tourney = tournaments.find(t => t.id === team.tournamentId);
              return (
                <TeamCard
                  key={team.id}
                  team={team}
                  tournament={tourney}
                  onSelect={onSelectTeam}
                />
              );
            })}
          </div>
        )
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 text-xs">
          No teams found matching the search criteria.
        </div>
      )}

    </div>
  );
}
