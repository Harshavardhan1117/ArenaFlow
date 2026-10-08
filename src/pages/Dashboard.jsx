// ============================================================================
// ORGANIZER DASHBOARD
// Clean management system with compact sidebar and tabular data views
// ============================================================================

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PointsTable from '../components/PointsTable.jsx';
import StatCard from '../components/StatCard.jsx';
import { calculatePointsTable } from '../services/tournamentService.js';
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCheck,
  Calendar,
  Activity,
  BarChart2,
  Settings,
  LogOut,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  CheckCircle,
  Menu,
  Clock,
  MapPin,
  ArrowRight,
  Radio
} from 'lucide-react';

export default function Dashboard({
  tournaments = [],
  teams = [],
  players = [],
  matches = [],
  onSaveTournament,
  onDeleteTournament,
  onSaveTeam,
  onDeleteTeam,
  onSavePlayer,
  onDeletePlayer,
  onSaveMatch,
  onDeleteMatch,
  onOpenScoreModal,
  onSelectTournament,
  onSelectMatch,
  setActivePage,
  activeView,
  setActiveView
}) {
  const { currentUser, isOrganizer, logout, quickDemoLogin } = useAuth();
  
  // Sidebar active view (supports external activeView prop or internal state)
  const [internalView, setInternalView] = useState('dashboard');
  const currentView = activeView || internalView;
  const setCurrentView = (view) => {
    if (setActiveView) setActiveView(view);
    setInternalView(view);
  };
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search filters
  const [teamSearch, setTeamSearch] = useState('');
  const [playerSearch, setPlayerSearch] = useState('');
  const [tournamentSearch, setTournamentSearch] = useState('');

  // Modals
  const [showTournamentModal, setShowTournamentModal] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [showFixtureModal, setShowFixtureModal] = useState(false);
  const [editingFixture, setEditingFixture] = useState(null);

  // Form states
  const [tName, setTName] = useState('');
  const [tSport, setTSport] = useState('Cricket');
  const [tLocation, setTLocation] = useState('');
  const [tStartDate, setTStartDate] = useState('');
  const [tEndDate, setTEndDate] = useState('');
  const [tDescription, setTDescription] = useState('');
  const [tStatus, setTStatus] = useState('ongoing');

  const [tmName, setTmName] = useState('');
  const [tmShort, setTmShort] = useState('');
  const [tmTourneyId, setTmTourneyId] = useState('');
  const [tmCaptain, setTmCaptain] = useState('');
  const [tmContact, setTmContact] = useState('');

  const [pName, setPName] = useState('');
  const [pTeamId, setPTeamId] = useState('');
  const [pJersey, setPJersey] = useState('');
  const [pRole, setPRole] = useState('Batter');

  const [fTourneyId, setFTourneyId] = useState('');
  const [fTeamA, setFTeamA] = useState('');
  const [fTeamB, setFTeamB] = useState('');
  const [fDate, setFDate] = useState('');
  const [fTime, setFTime] = useState('');
  const [fVenue, setFVenue] = useState('');
  const [fStatus, setFStatus] = useState('scheduled');
  const [formError, setFormError] = useState('');

  // Calculations
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'scheduled');
  const completedMatches = matches.filter(m => m.status === 'completed');

  if (!isOrganizer) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-slate-200 rounded-lg text-center space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">Organizer Access Required</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Sign in as an organizer or enable demo organizer mode to access the management console.
        </p>
        <button
          onClick={() => quickDemoLogin('organizer')}
          className="btn-primary w-full text-xs"
        >
          Enable Demo Organizer Mode
        </button>
      </div>
    );
  }

  // --- Handlers for Modals ---
  function openCreateTournament() {
    setEditingTournament(null);
    setTName('');
    setTSport('Football');
    setTLocation('University Ground');
    setTStartDate(new Date().toISOString().split('T')[0]);
    setTEndDate('');
    setTDescription('');
    setTStatus('ongoing');
    setShowTournamentModal(true);
  }

  function openEditTournament(t) {
    setEditingTournament(t);
    setTName(t.name);
    setTSport(t.sport || 'Football');
    setTLocation(t.location || '');
    setTStartDate(t.startDate || '');
    setTEndDate(t.endDate || '');
    setTDescription(t.description || '');
    setTStatus(t.status || 'ongoing');
    setShowTournamentModal(true);
  }

  function handleSaveTournamentSubmit(e) {
    e.preventDefault();
    if (!tName.trim()) return;
    const record = {
      id: editingTournament ? editingTournament.id : `tourney-${Date.now()}`,
      name: tName.trim(),
      sport: tSport,
      location: tLocation.trim(),
      startDate: tStartDate,
      endDate: tEndDate,
      description: tDescription.trim(),
      status: tStatus,
      createdAt: editingTournament?.createdAt || new Date().toISOString()
    };
    onSaveTournament(record);
    setShowTournamentModal(false);
  }

  function openCreateTeam() {
    setEditingTeam(null);
    setTmName('');
    setTmShort('');
    setTmTourneyId(tournaments[0]?.id || '');
    setTmCaptain('');
    setTmContact('');
    setShowTeamModal(true);
  }

  function openEditTeam(tm) {
    setEditingTeam(tm);
    setTmName(tm.name);
    setTmShort(tm.shortName || '');
    setTmTourneyId(tm.tournamentId || tournaments[0]?.id || '');
    setTmCaptain(tm.captain || '');
    setTmContact(tm.contact || '');
    setShowTeamModal(true);
  }

  function handleSaveTeamSubmit(e) {
    e.preventDefault();
    if (!tmName.trim() || !tmTourneyId) return;
    const record = {
      id: editingTeam ? editingTeam.id : `team-${Date.now()}`,
      tournamentId: tmTourneyId,
      name: tmName.trim(),
      shortName: tmShort.trim() || tmName.slice(0, 3).toUpperCase(),
      captain: tmCaptain.trim(),
      contact: tmContact.trim(),
      playersCount: editingTeam ? editingTeam.playersCount : 0,
      createdAt: editingTeam?.createdAt || new Date().toISOString()
    };
    onSaveTeam(record);
    setShowTeamModal(false);
  }

  function openCreatePlayer(defaultTeamId = '') {
    setEditingPlayer(null);
    setPName('');
    setPTeamId(defaultTeamId || teams[0]?.id || '');
    setPJersey('');
    setPRole('Forward');
    setShowPlayerModal(true);
  }

  function handleSavePlayerSubmit(e) {
    e.preventDefault();
    if (!pName.trim() || !pTeamId) return;
    const selectedTeam = teams.find(t => t.id === pTeamId);
    const record = {
      id: editingPlayer ? editingPlayer.id : `p-${Date.now()}`,
      teamId: pTeamId,
      tournamentId: selectedTeam?.tournamentId || tournaments[0]?.id,
      name: pName.trim(),
      jerseyNumber: pJersey.trim() || '0',
      role: pRole,
      createdAt: editingPlayer?.createdAt || new Date().toISOString()
    };
    onSavePlayer(record);
    setShowPlayerModal(false);
  }

  function openCreateFixture() {
    setEditingFixture(null);
    const firstT = tournaments[0]?.id || '';
    setFTourneyId(firstT);
    const tourneyTeams = teams.filter(t => t.tournamentId === firstT);
    setFTeamA(tourneyTeams[0]?.id || '');
    setFTeamB(tourneyTeams[1]?.id || '');
    setFDate(new Date().toISOString().split('T')[0]);
    setFTime('16:00');
    setFVenue('University Ground');
    setFStatus('scheduled');
    setFormError('');
    setShowFixtureModal(true);
  }

  function handleSaveFixtureSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (fTeamA === fTeamB) {
      setFormError('Team A and Team B cannot be the same team. Please choose different teams.');
      return;
    }
    if (!fTourneyId || !fTeamA || !fTeamB) {
      setFormError('Please select tournament and both teams.');
      return;
    }
    const record = {
      id: editingFixture ? editingFixture.id : `match-${Date.now()}`,
      tournamentId: fTourneyId,
      teamAId: fTeamA,
      teamBId: fTeamB,
      matchDate: fDate,
      matchTime: fTime,
      venue: fVenue.trim(),
      status: fStatus,
      teamAScore: editingFixture ? editingFixture.teamAScore : '',
      teamBScore: editingFixture ? editingFixture.teamBScore : '',
      teamAOvers: editingFixture ? editingFixture.teamAOvers : '',
      teamBOvers: editingFixture ? editingFixture.teamBOvers : '',
      resultSummary: editingFixture ? editingFixture.resultSummary : '',
      currentInnings: editingFixture ? editingFixture.currentInnings : 'Scheduled',
      timelineEvents: editingFixture ? editingFixture.timelineEvents : [],
      createdAt: editingFixture?.createdAt || new Date().toISOString()
    };
    onSaveMatch(record);
    setShowFixtureModal(false);
  }

  // Default tournament for compact standings preview
  const defaultTourney = tournaments[0];
  const previewStandings = defaultTourney
    ? calculatePointsTable(defaultTourney.id, matches, teams, defaultTourney.sport).slice(0, 5)
    : [];

  const tabItems = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'teams', label: 'Teams' },
    { id: 'players', label: 'Players' },
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'matches', label: 'Matches' },
    { id: 'standings', label: 'Standings' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Tab Navigation Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {tabItems.map(tab => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* VIEW 1: DASHBOARD OVERVIEW */}
      {/* ==================================================================== */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Top Greeting & Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome back, {currentUser?.displayName || 'Organizer'}
              </p>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                Tournament Overview
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={openCreateTournament}
                className="btn-primary text-xs cursor-pointer"
              >
                + Create Tournament
              </button>
              <button
                onClick={openCreateTeam}
                className="btn-secondary text-xs cursor-pointer"
              >
                + Add Team
              </button>
              <button
                onClick={openCreateFixture}
                className="btn-secondary text-xs cursor-pointer"
              >
                + Create Fixture
              </button>
              <button
                onClick={() => setCurrentView('matches')}
                className="btn-secondary text-xs cursor-pointer"
              >
                Enter Score
              </button>
            </div>
          </div>

          {/* 8. SUMMARY CARDS (Simple, no gradients, no glowing effects) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Active Tournaments"
              value={tournaments.length}
              subtitle="Registered tournaments"
              badgeText="Active"
              badgeType="default"
              onClick={() => setCurrentView('tournaments')}
            />
            <StatCard
              title="Teams"
              value={teams.length}
              subtitle="Participating squads"
              badgeText={`${teams.length} Total`}
              badgeType="default"
              onClick={() => setCurrentView('teams')}
            />
            <StatCard
              title="Matches"
              value={matches.length}
              subtitle={`${completedMatches.length} finished`}
              badgeText="Fixtures"
              badgeType="default"
              onClick={() => setCurrentView('fixtures')}
            />
            <StatCard
              title="Live Matches"
              value={liveMatches.length}
              subtitle="Currently in progress"
              badgeText={liveMatches.length > 0 ? "Live" : "None"}
              badgeType={liveMatches.length > 0 ? "live" : "default"}
              onClick={() => setCurrentView('matches')}
            />
          </div>

          {/* 10. LIVE MATCHES SECTION */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Live Matches</h3>
              </div>
              <span className="text-[11px] text-slate-500">
                {liveMatches.length} In Progress
              </span>
            </div>

            {liveMatches.length === 0 ? (
              <div className="py-6 text-center border border-dashed border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500">No live matches currently in progress.</p>
                <button
                  onClick={() => setCurrentView('fixtures')}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  Start or Score an Upcoming Fixture →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map(m => {
                  const tmA = teams.find(t => t.id === m.teamAId);
                  const tmB = teams.find(t => t.id === m.teamBId);
                  const tourney = tournaments.find(t => t.id === m.tournamentId);
                  return (
                    <div
                      key={m.id}
                      className="border border-slate-200 rounded-lg p-4 bg-slate-50/40 space-y-3"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700 uppercase tracking-wider truncate">
                          {tourney?.name || 'Tournament'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          LIVE · {m.currentInnings || m.matchStage || 'In Progress'}
                        </span>
                      </div>

                      <div className="space-y-1.5 py-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{tmA?.name}</span>
                          <span className="text-xs font-bold font-mono text-slate-900">
                            {m.teamAScore || '0'}{m.teamAOvers ? ` (${m.teamAOvers} ov)` : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{tmB?.name}</span>
                          <span className="text-xs font-bold font-mono text-slate-900">
                            {m.teamBScore || '0'}{m.teamBOvers ? ` (${m.teamBOvers} ov)` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{m.venue || 'Main Ground'}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectMatch(m.id)}
                            className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold cursor-pointer"
                          >
                            View Match
                          </button>
                          <button
                            onClick={() => onOpenScoreModal(m)}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
                          >
                            Update Score
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 9. UPCOMING MATCHES SECTION */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upcoming Matches</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Scheduled fixtures across competitions</p>
              </div>
              <button
                onClick={() => setCurrentView('fixtures')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                View All Fixtures →
              </button>
            </div>

            {upcomingMatches.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No upcoming fixtures scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingMatches.slice(0, 6).map(m => {
                  const tmA = teams.find(t => t.id === m.teamAId);
                  const tmB = teams.find(t => t.id === m.teamBId);
                  const tourney = tournaments.find(t => t.id === m.tournamentId);
                  return (
                    <div
                      key={m.id}
                      className="border border-slate-200 rounded-lg p-3.5 bg-white hover:border-slate-300 transition-colors space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="truncate">{tourney?.name || 'Tournament'}</span>
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                          Scheduled
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-900">
                        {tmA?.name} <span className="font-normal text-slate-400">vs</span> {tmB?.name}
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <p>{m.matchDate} · {m.matchTime || 'TBD'}</p>
                        <p className="text-slate-400">{m.venue || 'University Ground'}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => onSelectMatch(m.id)}
                          className="text-[11px] text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                        >
                          Match Details
                        </button>
                        <button
                          onClick={() => onOpenScoreModal(m)}
                          className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          Start Match
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TWO COLUMN GRID: 11. Recent Results & 12. Current Standings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 11. RECENT RESULTS */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Results</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Completed tournament outcomes</p>
                </div>
                <button
                  onClick={() => setCurrentView('matches')}
                  className="text-xs text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  View All
                </button>
              </div>

              {completedMatches.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No completed matches yet.</p>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {completedMatches.slice(0, 4).map(m => {
                    const tmA = teams.find(t => t.id === m.teamAId);
                    const tmB = teams.find(t => t.id === m.teamBId);
                    const tourney = tournaments.find(t => t.id === m.tournamentId);
                    return (
                      <div key={m.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">
                            {tmA?.name} {m.teamAScore} — {m.teamBScore} {tmB?.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                            {m.matchDate} · {tourney?.name}
                          </span>
                          {m.resultSummary && (
                            <span className="text-[11px] text-slate-400 block truncate">
                              {m.resultSummary}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onSelectMatch(m.id)}
                          className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 bg-slate-50 rounded border border-slate-200 shrink-0 cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 12. CURRENT STANDINGS (Compact Points Table Preview) */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Current Standings</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {defaultTourney?.name || 'Tournament Standings'}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('standings')}
                  className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Standings</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {previewStandings.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No standing data available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="py-2 px-2 text-center w-8">Rank</th>
                        <th className="py-2 px-2">Team</th>
                        <th className="py-2 px-2 text-center">P</th>
                        <th className="py-2 px-2 text-center">W</th>
                        <th className="py-2 px-2 text-center">D</th>
                        <th className="py-2 px-2 text-center">L</th>
                        <th className="py-2 px-2 text-center font-bold">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {previewStandings.map((row, idx) => (
                        <tr key={row.teamId} className="hover:bg-slate-50">
                          <td className="py-2 px-2 text-center font-bold text-slate-500 text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-2 px-2 font-semibold text-slate-900 truncate max-w-[120px]">
                            {row.teamName}
                          </td>
                          <td className="py-2 px-2 text-center font-mono text-[11px]">{row.played}</td>
                          <td className="py-2 px-2 text-center font-mono text-[11px]">{row.won}</td>
                          <td className="py-2 px-2 text-center font-mono text-[11px]">{row.drawnOrTied}</td>
                          <td className="py-2 px-2 text-center font-mono text-[11px]">{row.lost}</td>
                          <td className="py-2 px-2 text-center font-mono font-bold text-slate-900 text-xs">
                            {row.points}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

        {/* ==================================================================== */}
        {/* VIEW 2: TOURNAMENTS TABLE */}
        {/* ==================================================================== */}
        {currentView === 'tournaments' && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Tournaments</h2>
                <p className="text-xs text-slate-500">Manage all sports tournaments and cups</p>
              </div>
              <button onClick={openCreateTournament} className="btn-primary text-xs">
                + Create Tournament
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={tournamentSearch}
                onChange={(e) => setTournamentSearch(e.target.value)}
                placeholder="Search tournaments..."
                className="w-full sm:w-64 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Tournament</th>
                    <th className="py-2.5 px-3">Sport</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Dates</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tournaments
                    .filter(t => t.name.toLowerCase().includes(tournamentSearch.toLowerCase()))
                    .map(t => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-semibold text-slate-900">{t.name}</td>
                        <td className="py-3 px-3">{t.sport}</td>
                        <td className="py-3 px-3 text-slate-600">{t.location}</td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">{t.startDate} – {t.endDate || 'TBD'}</td>
                        <td className="py-3 px-3 capitalize text-slate-600">{t.status}</td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => openEditTournament(t)}
                            className="text-slate-600 hover:text-slate-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete tournament "${t.name}"?`)) onDeleteTournament(t.id);
                            }}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 3: TEAMS TABLE */}
        {/* ==================================================================== */}
        {currentView === 'teams' && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Teams</h2>
                <p className="text-xs text-slate-500">Register and manage teams across tournaments</p>
              </div>
              <button onClick={openCreateTeam} className="btn-primary text-xs">
                + Add Team
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                placeholder="Search teams..."
                className="w-full sm:w-64 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Team</th>
                    <th className="py-2.5 px-3">Tournament</th>
                    <th className="py-2.5 px-3">Captain</th>
                    <th className="py-2.5 px-3 text-center">Players</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {teams
                    .filter(tm => tm.name.toLowerCase().includes(teamSearch.toLowerCase()))
                    .map(tm => {
                      const t = tournaments.find(tourney => tourney.id === tm.tournamentId);
                      return (
                        <tr key={tm.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            {tm.name} <span className="font-mono text-slate-400 text-[11px]">({tm.shortName})</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{t?.name || 'Tournament'}</td>
                          <td className="py-3 px-3 text-slate-600">{tm.captain || 'Not Set'}</td>
                          <td className="py-3 px-3 text-center font-mono">{tm.playersCount || 0}</td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button
                              onClick={() => openCreatePlayer(tm.id)}
                              className="text-emerald-700 hover:underline font-medium"
                            >
                              + Player
                            </button>
                            <button
                              onClick={() => openEditTeam(tm)}
                              className="text-slate-600 hover:text-slate-900 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete team "${tm.name}"?`)) onDeleteTeam(tm.id);
                              }}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 4: PLAYERS TABLE */}
        {/* ==================================================================== */}
        {currentView === 'players' && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Players</h2>
                <p className="text-xs text-slate-500">Squad roster registry and player roles</p>
              </div>
              <button onClick={() => openCreatePlayer()} className="btn-primary text-xs">
                + Add Player
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
                placeholder="Search players..."
                className="w-full sm:w-64 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3">Team</th>
                    <th className="py-2.5 px-3">Jersey</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {players
                    .filter(p => p.name.toLowerCase().includes(playerSearch.toLowerCase()))
                    .map(p => {
                      const tm = teams.find(t => t.id === p.teamId);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-semibold text-slate-900">{p.name}</td>
                          <td className="py-3 px-3 text-slate-600">{tm?.name || 'Team'}</td>
                          <td className="py-3 px-3 font-mono">#{p.jerseyNumber || '-'}</td>
                          <td className="py-3 px-3 text-slate-600">{p.role}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete player "${p.name}"?`)) onDeletePlayer(p.id);
                              }}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 5: FIXTURES / MATCHES */}
        {/* ==================================================================== */}
        {(currentView === 'fixtures' || currentView === 'matches') && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Fixtures & Matches</h2>
                <p className="text-xs text-slate-500">Schedule fixtures and enter live match scores</p>
              </div>
              <button onClick={openCreateFixture} className="btn-primary text-xs">
                + Create Fixture
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Tournament</th>
                    <th className="py-2.5 px-3">Match</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {matches.map(m => {
                    const tmA = teams.find(t => t.id === m.teamAId);
                    const tmB = teams.find(t => t.id === m.teamBId);
                    const t = tournaments.find(tourney => tourney.id === m.tournamentId);

                    return (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                          {m.matchDate} · {m.matchTime || 'TBD'}
                        </td>
                        <td className="py-3 px-3 text-slate-600 truncate max-w-[150px]">{t?.name}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {tmA?.name} vs {tmB?.name}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {m.teamAScore || (m.status === 'scheduled' ? '-' : '0')} - {m.teamBScore || (m.status === 'scheduled' ? '-' : '0')}
                        </td>
                        <td className="py-3 px-3 capitalize">
                          {m.status === 'live' ? (
                            <span className="text-emerald-700 font-bold">Live</span>
                          ) : (
                            <span className="text-slate-500">{m.status}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right space-x-2">
                          <button
                            onClick={() => onOpenScoreModal(m)}
                            className="text-emerald-700 hover:text-emerald-900 font-semibold"
                          >
                            Score
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this fixture?')) onDeleteMatch(m.id);
                            }}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 6: STANDINGS */}
        {/* ==================================================================== */}
        {currentView === 'standings' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Tournament Standings</h2>
            <PointsTable
              tournamentId={tournaments[0]?.id}
              matches={matches}
              teams={teams}
              sport={tournaments[0]?.sport}
            />
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 7: SETTINGS */}
        {/* ==================================================================== */}
        {currentView === 'settings' && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-6 max-w-xl space-y-4">
            <h2 className="text-base font-bold text-slate-900">Settings</h2>
            <div className="text-xs text-slate-600 space-y-2">
              <div>Logged in as: <strong className="text-slate-900">{currentUser?.email}</strong></div>
              <div>Role: <strong className="text-slate-900">Organizer</strong></div>
              <div>Platform: <strong className="text-slate-900">ARENaflow</strong></div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActivePage('home')}
                className="btn-secondary text-xs"
              >
                Return to Public Website
              </button>
              <button
                onClick={logout}
                className="btn-primary text-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

      {/* ==================================================================== */}
      {/* 14. COMPACT FORMS & MODALS */}
      {/* ==================================================================== */}

      {/* CREATE / EDIT TOURNAMENT MODAL */}
      {showTournamentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingTournament ? 'Edit Tournament' : 'Create Tournament'}
              </h3>
              <button onClick={() => setShowTournamentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTournamentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tournament Name</label>
                <input
                  type="text"
                  required
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  placeholder="e.g. Inter-College Football Cup"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sport</label>
                  <select
                    value={tSport}
                    onChange={(e) => setTSport(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  >
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={tStatus}
                    onChange={(e) => setTStatus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={tLocation}
                  onChange={(e) => setTLocation(e.target.value)}
                  placeholder="University Ground"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={tStartDate}
                    onChange={(e) => setTStartDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={tEndDate}
                    onChange={(e) => setTEndDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={tDescription}
                  onChange={(e) => setTDescription(e.target.value)}
                  placeholder="Tournament overview..."
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTournamentModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Create Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT TEAM MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingTeam ? 'Edit Team' : 'Add Team'}
              </h3>
              <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={tmName}
                  onChange={(e) => setTmName(e.target.value)}
                  placeholder="e.g. Thunder FC"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Code</label>
                <input
                  type="text"
                  maxLength="4"
                  value={tmShort}
                  onChange={(e) => setTmShort(e.target.value)}
                  placeholder="e.g. THU"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tournament</label>
                <select
                  value={tmTourneyId}
                  onChange={(e) => setTmTourneyId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                >
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Captain</label>
                <input
                  type="text"
                  value={tmCaptain}
                  onChange={(e) => setTmCaptain(e.target.value)}
                  placeholder="Captain name"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={tmContact}
                  onChange={(e) => setTmContact(e.target.value)}
                  placeholder="Contact details"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT PLAYER MODAL */}
      {showPlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Player</h3>
              <button onClick={() => setShowPlayerModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlayerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Player Full Name</label>
                <input
                  type="text"
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Team</label>
                <select
                  value={pTeamId}
                  onChange={(e) => setPTeamId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                >
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jersey Number</label>
                  <input
                    type="text"
                    value={pJersey}
                    onChange={(e) => setPJersey(e.target.value)}
                    placeholder="e.g. 10"
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={pRole}
                    onChange={(e) => setPRole(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  >
                    <option value="Forward">Forward</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Defender">Defender</option>
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Batter">Batter</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-rounder">All-rounder</option>
                    <option value="Wicketkeeper">Wicketkeeper</option>
                    <option value="Player">Player</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPlayerModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Save Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE FIXTURE MODAL */}
      {showFixtureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Create Fixture</h3>
              <button onClick={() => setShowFixtureModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveFixtureSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tournament</label>
                <select
                  value={fTourneyId}
                  onChange={(e) => {
                    setFTourneyId(e.target.value);
                    const matchingTeams = teams.filter(t => t.tournamentId === e.target.value);
                    if (matchingTeams.length >= 2) {
                      setFTeamA(matchingTeams[0].id);
                      setFTeamB(matchingTeams[1].id);
                    }
                  }}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                >
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Team A</label>
                  <select
                    value={fTeamA}
                    onChange={(e) => setFTeamA(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  >
                    {teams
                      .filter(t => !fTourneyId || t.tournamentId === fTourneyId)
                      .map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Team B</label>
                  <select
                    value={fTeamB}
                    onChange={(e) => setFTeamB(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  >
                    {teams
                      .filter(t => !fTourneyId || t.tournamentId === fTourneyId)
                      .map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Match Date</label>
                  <input
                    type="date"
                    required
                    value={fDate}
                    onChange={(e) => setFDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Match Time</label>
                  <input
                    type="time"
                    required
                    value={fTime}
                    onChange={(e) => setFTime(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue</label>
                <input
                  type="text"
                  required
                  value={fVenue}
                  onChange={(e) => setFVenue(e.target.value)}
                  placeholder="University Ground"
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFixtureModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs"
                >
                  Create Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
