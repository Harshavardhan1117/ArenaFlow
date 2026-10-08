// ============================================================================
// ARENAFLOW TOP HEADER
// Clean, professional top bar for the application shell.
// Left: Current Page Title / Context & Mobile Hamburger
// Right: Notification Bell & User Profile Menu Dropdown
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function Navbar({
  activePage,
  setActivePage,
  dashboardView,
  setDashboardView,
  onOpenMobileSidebar
}) {
  const { currentUser, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleSignOut() {
    setIsUserMenuOpen(false);
    logout();
  }

  function handleSettingsClick() {
    setIsUserMenuOpen(false);
    setActivePage('dashboard');
    if (setDashboardView) {
      setDashboardView('settings');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Derive human-readable page title
  function getPageTitle() {
    if (activePage === 'dashboard') {
      const viewTitles = {
        dashboard: 'Dashboard',
        tournaments: 'Tournaments Management',
        teams: 'Teams Management',
        players: 'Players Squad Roster',
        fixtures: 'Fixtures & Matches',
        matches: 'Live Match Scoring',
        standings: 'Tournament Standings',
        settings: 'System Settings'
      };
      return viewTitles[dashboardView] || 'Dashboard';
    }
    const pageTitles = {
      home: 'Overview',
      live: 'Live Matches',
      schedule: 'Match Schedule',
      results: 'Past Results',
      tournaments: 'Tournaments Directory',
      'tournament-details': 'Tournament Details',
      teams: 'Participating Teams',
      'team-details': 'Team Squad Details',
      rankings: 'League Standings',
      'match-center': 'Match Center'
    };
    return pageTitles[activePage] || 'Dashboard';
  }

  const userInitial = (currentUser?.displayName || currentUser?.email || 'A')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* LEFT: Mobile Hamburger & Page Context Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-bold text-slate-900 tracking-tight truncate">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* RIGHT: Notifications & User Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Notifications Button & Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Real-Time Sync</span>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="px-3 py-2.5 hover:bg-slate-50">
                    <p className="font-medium text-slate-800">Thunder FC vs Titans FC is Live</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Campus Premier Cup · Main Ground</p>
                  </div>
                  <div className="px-3 py-2.5 hover:bg-slate-50">
                    <p className="font-medium text-slate-800">Points Table recalculated</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Net run rates updated automatically</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
              aria-expanded={isUserMenuOpen}
            >
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {userInitial}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[120px] truncate">
                {currentUser?.displayName || 'Organizer'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 text-xs">
                {/* User info banner */}
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">
                    {currentUser?.displayName || 'Organizer User'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {currentUser?.email || 'admin@arenaflow.io'}
                  </p>
                </div>

                {/* Profile & Settings items */}
                <div className="py-1">
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Profile & Account</span>
                  </button>

                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-left cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Platform Settings</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 my-1" />

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 text-left font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
