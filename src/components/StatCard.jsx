// ============================================================================
// STAT CARD COMPONENT
// Clean, minimal metrics card for ArenaFlow organizer dashboard.
// Easy for students and beginners to customize!
// ============================================================================

import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'default', // 'default' | 'live' | 'success' | 'warning'
  onClick
}) {
  const badgeClasses = {
    default: 'bg-slate-100 text-slate-700',
    live: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-lg p-5 shadow-2xs transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {badgeText && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeClasses[badgeType] || badgeClasses.default}`}>
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
