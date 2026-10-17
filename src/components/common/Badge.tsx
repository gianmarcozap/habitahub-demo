import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate' | 'purple';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
    amber: 'bg-amber-950/70 text-amber-400 border-amber-800/60',
    rose: 'bg-rose-950/70 text-rose-400 border-rose-800/60',
    blue: 'bg-blue-950/70 text-blue-400 border-blue-800/60',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    purple: 'bg-purple-950/70 text-purple-400 border-purple-800/60',
  };

  const dotColors = {
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    blue: 'bg-blue-400',
    slate: 'bg-slate-400',
    purple: 'bg-purple-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
        </span>
      )}
      {children}
    </span>
  );
};
