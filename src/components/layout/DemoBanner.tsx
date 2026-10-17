import React from 'react';
import { RotateCcw, Database, Cpu } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const DemoBanner: React.FC = () => {
  const resetDemo = usePropertyStore((state) => state.resetDemo);
  const isActionSubmitting = usePropertyStore((state) => state.isActionSubmitting);

  return (
    <div className="h-9 w-full bg-slate-900 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 font-mono text-[11px]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span>Demo Mode: Standalone In-Memory Sandbox</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Go REST API Mock (~150ms)</span>
          </span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span>Zustand Reactive Store</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={resetDemo}
          disabled={isActionSubmitting}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all disabled:opacity-50 active:scale-95"
          title="Restablecer todos los datos del edificio al seed inicial"
        >
          <RotateCcw className={`w-3 h-3 text-emerald-400 ${isActionSubmitting ? 'animate-spin' : ''}`} />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
