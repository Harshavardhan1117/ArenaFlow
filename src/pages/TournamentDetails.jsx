// ============================================================================
// TOURNAMENT DETAILS PAGE
// Resembles professional sports competition pages:
// Clean header -> Simple nav (Overview | Matches | Teams | Standings) -> Whitespace
// ============================================================================

import React, { useState } from 'react';
import MatchCard from '../components/MatchCard.jsx';
import TeamCard from '../components/TeamCard.jsx';
import PointsTable from '../components/PointsTable.jsx';
import { ArrowLeft } from 'lucide-react';

export default function TournamentDetails({
  tournamentId,
  tournaments = [],
  teams = [],
  matches = [],
  onBack,
  onSelectMatch,
  onSelectTeam,
  onOpenScoreModal,
  isOrganizer
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'matches', 'teams', 'standings'
  const [matchSubFilter, setMatchSubFilter] = useState('all');

  const tournament = tournaments.find(t => t.id === tournamentId) || tournaments[0];

  if (!tournament) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-500">
        <p>Tournament not found.</p>
        <button onClick={onBack} className="mt-4 text-slate-900 font-semibold underline">
          Back to Tournaments
        </button>
      </div>
    );
  }

  const tournamentTeams = teams.filter(t => t.tournamentId === tournament.id);
  const tournamentMatches = matches.filter(m => m.tournamentId === tournament.id);

  const liveMatches = tournamentMatches.filter(m => m.status === 'live');
  const upcomingMatches = tournamentMatches.filter(m => m.status === 'scheduled');
  const completedMatches = tournamentMatches.filter(m => m.status === 'completed');

  const tabMatches = tournamentMatches.filter(m => {
    if (matchSubFilter === 'live') return m.status === 'live';
    if (matchSubFilter === 'upcoming') return m.status === 'scheduled';
    if (matchSubFilter === 'completed') return m.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Tournaments</span>
        </button>
      </div>

      {/* Clean Competition Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          {tournament.sport}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {tournament.name}
        </h1>
        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 pt-1">
          <span>{tournament.startDate} – {tournament.endDate || 'TBD'}</span>
          <span>·</span>
          <span>{tournament.location || 'University Ground'}</span>
          <span>·</span>
          <span className="capitalize font-medium text-slate-700">{tournament.status}</span>
        </div>
      </div>

      {/* Simple Navigation: Overview | Matches | Teams | Standings */}
      <div className="border-b border-slate-200 flex items-center space-x-6 text-sm">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'matches', label: `Matches (${tournamentMatches.length})` },
          { id: 'teams', label: `Teams (${tournamentTeams.length})` },
          { id: 'standings', label: 'Standings' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 border-b-2 font-semibold text-xs sm:text-sm transition-colors ${
                isActive
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          
          {/* Overview Stat Counters (clean, minimal) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-xs text-slate-600">
              <div className="pt-2 sm:pt-0 sm:px-4">
                <span>Teams</span>
                <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                  {tournamentTeams.length}
                </span>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-4">
                <span>Total Matches</span>
                <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                  {tournamentMatches.length}
                </span>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-4">
                <span>Completed</span>
                <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                  {completedMatches.length}
                </span>
              </div>
              <div className="pt-2 sm:pt-0 sm:px-4">
                <span>Upcoming</span>
                <span className="text-xl font-bold font-mono text-slate-900 block mt-1">
                  {upcomingMatches.length + liveMatches.length}
                </span>
              </div>
            </div>
          </div>

          {/* Live matches if any */}
          {liveMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Live Matches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    teams={teams}
                    tournaments={tournaments}
                    onSelectMatch={onSelectMatch}
                    onOpenScoreModal={onOpenScoreModal}
                    isOrganizer={isOrganizer}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Matches</h3>
              <button
                onClick={() => { setActiveTab('matches'); setMatchSubFilter('upcoming'); }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                All Upcoming →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMatches.slice(0, 2).map(m => (
                <MatchCard
                  key={m.id}
                  match={m}
                  teams={teams}
                  tournaments={tournaments}
                  onSelectMatch={onSelectMatch}
                  onOpenScoreModal={onOpenScoreModal}
                  isOrganizer={isOrganizer}
                />
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recent Results</h3>
              <button
                onClick={() => { setActiveTab('matches'); setMatchSubFilter('completed'); }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                All Results →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedMatches.slice(0, 2).map(m => (
                <MatchCard
                  key={m.id}
                  match={m}
                  teams={teams}
                  tournaments={tournaments}
                  onSelectMatch={onSelectMatch}
                  onOpenScoreModal={onOpenScoreModal}
                  isOrganizer={isOrganizer}
                />
              ))}
            </div>
          </div>

          {/* Standings Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Standings Preview</h3>
              <button
                onClick={() => setActiveTab('standings')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Full Table →
              </button>
            </div>
            <PointsTable
              tournamentId={tournament.id}
              matches={matches}
              teams={teams}
              sport={tournament.sport}
              onSelectTeam={onSelectTeam}
            />
          </div>

        </div>
      )}

      {/* TAB 2: MATCHES */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `All (${tournamentMatches.length})` },
              { id: 'live', label: `Live (${liveMatches.length})` },
              { id: 'upcoming', label: `Upcoming (${upcomingMatches.length})` },
              { id: 'completed', label: `Completed (${completedMatches.length})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setMatchSubFilter(f.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  matchSubFilter === f.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tabMatches.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                teams={teams}
                tournaments={tournaments}
                onSelectMatch={onSelectMatch}
                onOpenScoreModal={onOpenScoreModal}
                isOrganizer={isOrganizer}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEAMS */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tournamentTeams.map(tm => (
            <TeamCard
              key={tm.id}
              team={tm}
              tournament={tournament}
              onSelect={onSelectTeam}
            />
          ))}
        </div>
      )}

      {/* TAB 4: STANDINGS */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <PointsTable
            tournamentId={tournament.id}
            matches={matches}
            teams={teams}
            sport={tournament.sport}
            onSelectTeam={onSelectTeam}
          />
        </div>
      )}

    </div>
  );
}
