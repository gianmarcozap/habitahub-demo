import React from 'react';

export interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  progress?: {
    value: number; // 0 to 100
    colorClass?: string;
  };
  highlightColor?: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon,
  badge,
  progress,
  highlightColor = 'slate',
  onClick,
}) => {
  const borderHighlights = {
    emerald: 'hover:border-emerald-500/50',
    amber: 'hover:border-amber-500/50',
    rose: 'hover:border-rose-500/50',
    blue: 'hover:border-blue-500/50',
    slate: 'hover:border-slate-700',
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:bg-slate-850 ' + borderHighlights[highlightColor] : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="flex items-center gap-2">
          {badge}
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            {icon}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-slate-100 font-mono">
          {value}
        </div>
        {subValue && (
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            {subValue}
          </p>
        )}
      </div>

      {progress && (
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress.colorClass || 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress.value))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
