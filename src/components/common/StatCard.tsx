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
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  icon,
  badge,
  progress,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        <div className="flex items-center gap-2">
          {badge}
          <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600">
            {icon}
          </div>
        </div>
      </div>

      <div className="mt-2.5">
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </div>
        {subValue && (
          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
            {subValue}
          </p>
        )}
      </div>

      {progress && (
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress.colorClass || 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress.value))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
