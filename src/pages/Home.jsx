// ============================================================================
// HOMEPAGE
// Clean sports management layout with clear hierarchy:
// Hero -> Live Matches -> Upcoming Matches -> Recent Results -> Tournaments -> Standings
// ============================================================================

import React from 'react';
import MatchCard from '../components/MatchCard.jsx';
import TournamentCard from '../components/TournamentCard.jsx';
import PointsTable from '../components/PointsTable.jsx';

export default function Home({
  tournaments = [],
  teams = [],
  matches = [],
  onSelectMatch,
  onSelectTournament,
  onSelectTeam,
  onOpenScoreModal,
  setActivePage,
  isOrganizer
}) {
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled');
  const recentResults = matches.filter(m => m.status === 'completed');

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. PAGE HERO */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Manage Every Tournament From One Place
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Create tournaments, manage teams, schedule matches, record scores and track standings.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActivePage(isOrganizer ? 'dashboard' : 'login')}
                className="btn-primary"
              >
                Create Tournament
              </button>
              <button
                onClick={() => setActivePage('tournaments')}
                className="btn-secondary"
              >
                View Tournaments
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* 2. LIVE MATCHES */}
        {liveMatches.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Live Matches
                </h2>
                <p className="text-xs text-slate-500">Currently active matches with live scores</p>
              </div>
              <button
                onClick={() => setActivePage('live')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950"
              >
                View All Live →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveMatches.slice(0, 3).map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  teams={teams}
                  tournaments={tournaments}
                  onSelectMatch={onSelectMatch}
                  onOpenScoreModal={onOpenScoreModal}
                  isOrganizer={isOrganizer}
                />
              ))}
            </div>
          </section>
        )}

        {/* 3. UPCOMING MATCHES */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Upcoming Matches
              </h2>
              <p className="text-xs text-slate-500">Scheduled tournament fixtures</p>
            </div>
            <button
              onClick={() => setActivePage('schedule')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950"
            >
              Full Schedule →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingMatches.slice(0, 3).map(match => (
              <MatchCard
                key={match.id}
                match={match}
                teams={teams}
                tournaments={tournaments}
                onSelectMatch={onSelectMatch}
                onOpenScoreModal={onOpenScoreModal}
                isOrganizer={isOrganizer}
              />
            ))}
          </div>
        </section>

        {/* 4. RECENT RESULTS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Recent Results
              </h2>
              <p className="text-xs text-slate-500">Completed fixtures and final scores</p>
            </div>
            <button
              onClick={() => setActivePage('results')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-950"
            >
              All Results →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentResults.slice(0, 3).map(match => (
              <MatchCard
                key={match.id}
                match={match}
                teams={teams}
                tournaments={tournaments}
                onSelectMatch={onSelectMatch}
                onOpenScoreModal={onOpenScoreModal}
                isOrganizer={isOrganizer}
              />
            ))}
          </div>
        </section>

        {/* 5. ONGOING TOURNAMENTS & 6. POINTS TABLE PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          
          {/* Ongoing Tournaments (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Ongoing Tournaments
              </h2>
              <button
                onClick={() => setActivePage('tournaments')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950"
              >
                Browse All →
              </button>
            </div>

            <div className="space-y-4">
              {tournaments.slice(0, 2).map(t => {
                const tourneyTeams = teams.filter(tm => tm.tournamentId === t.id);
                const tourneyMatches = matches.filter(m => m.tournamentId === t.id);
                return (
                  <TournamentCard
                    key={t.id}
                    tournament={t}
                    teamsCount={tourneyTeams.length}
                    matchesCount={tourneyMatches.length}
                    onSelect={onSelectTournament}
                  />
                );
              })}
            </div>
          </div>

          {/* Standings Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Standings Preview
              </h2>
              <button
                onClick={() => setActivePage('rankings')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-950"
              >
                Full Standings →
              </button>
            </div>

            <PointsTable
              tournamentId={tournaments[0]?.id}
              matches={matches}
              teams={teams}
              sport={tournaments[0]?.sport}
              onSelectTeam={onSelectTeam}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
