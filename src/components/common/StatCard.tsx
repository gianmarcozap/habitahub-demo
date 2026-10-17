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
      className={`p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs transition-all duration-150 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">{title}</span>
        <div className="flex items-center gap-1.5">
          {badge}
          <div className="p-1 rounded-md bg-slate-50 border border-slate-200/80 text-slate-500">
            {icon}
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1.5 gap-2">
        <div className="text-xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </div>
        {subValue && (
          <p className="text-[11px] text-slate-400 font-sans truncate">
            {subValue}
          </p>
        )}
      </div>

      {progress && (
        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progress.colorClass || 'bg-emerald-600'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress.value))}%` }}
          />
        </div>
      )}
    </div>
  );
};
