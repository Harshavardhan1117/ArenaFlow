// ============================================================================
// ARENAFLOW SIDEBAR
// Clean, professional left navigation sidebar.
// Easy for hackathon teams and beginners to add/remove navigation items!
// ============================================================================

import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCheck,
  Calendar,
  Swords,
  BarChart2,
  Radio,
  Clock,
  CheckSquare,
  Award,
  Settings,
  LogOut,
  X
} from 'lucide-react';

// ============================================================================
// HACKATHON CONFIGURATION: Easily edit sidebar items here!
// ============================================================================
export const MAIN_NAV_ITEMS = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'tournaments', name: 'Tournaments', icon: Trophy },
  { id: 'teams', name: 'Teams', icon: Users },
  { id: 'players', name: 'Players', icon: UserCheck },
  { id: 'fixtures', name: 'Fixtures', icon: Calendar },
  { id: 'matches', name: 'Matches', icon: Swords },
  { id: 'standings', name: 'Standings', icon: BarChart2 }
];

export const PUBLIC_NAV_ITEMS = [
  { id: 'live', name: 'Live Scores', icon: Radio },
  { id: 'schedule', name: 'Schedule', icon: Clock },
  { id: 'results', name: 'Results', icon: CheckSquare },
  { id: 'rankings', name: 'Rankings', icon: Award }
];

export const SYSTEM_NAV_ITEMS = [
  { id: 'settings', name: 'Settings', icon: Settings }
];

export default function Sidebar({
  activePage,
  setActivePage,
  dashboardView,
  setDashboardView,
  isMobileOpen,
  setIsMobileOpen
}) {
  const { currentUser, logout } = useAuth();

  // Navigation handler
  function handleNavigate(pageId, viewId = null) {
    if (pageId === 'dashboard') {
      setActivePage('dashboard');
      if (viewId && setDashboardView) {
        setDashboardView(viewId);
      }
    } else if (['tournaments', 'teams', 'players', 'fixtures', 'matches', 'standings', 'settings'].includes(pageId)) {
      // In ArenaFlow organizer workflow, these can navigate to the respective dashboard tab or page
      setActivePage('dashboard');
      if (setDashboardView) {
        setDashboardView(pageId);
      }
    } else {
      setActivePage(pageId);
    }

    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSignOut() {
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
    logout();
  }

  // Determine which item is currently active
  function isItemActive(itemId) {
    if (activePage === 'dashboard') {
      return (dashboardView || 'dashboard') === itemId;
    }
    return activePage === itemId;
  }

  const userInitial = (currentUser?.displayName || currentUser?.email || 'A')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
          <button
            onClick={() => handleNavigate('dashboard', 'dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center tracking-tight shadow-xs">
              A
            </div>
            <div className="leading-tight">
              <span className="text-sm font-bold text-slate-900 tracking-tight block">
                ArenaFlow
              </span>
              <span className="text-[10px] text-slate-500 font-normal block">
                Tournament Platform
              </span>
            </div>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          
          {/* Section: MAIN */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main
            </div>
            <div className="space-y-0.5">
              {MAIN_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id, item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                      active
                        ? 'bg-slate-100 text-slate-900 font-bold border-l-2 border-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: PUBLIC SPORTS PAGES */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Public Views
            </div>
            <div className="space-y-0.5">
              {PUBLIC_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                      active
                        ? 'bg-slate-100 text-slate-900 font-bold border-l-2 border-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: SYSTEM */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              System
            </div>
            <div className="space-y-0.5">
              {SYSTEM_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate('dashboard', item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                      active
                        ? 'bg-slate-100 text-slate-900 font-bold border-l-2 border-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </nav>

        {/* Sidebar Footer: User info & Sign Out */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser?.displayName || 'Organizer'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser?.email || 'admin@arenaflow.io'}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
