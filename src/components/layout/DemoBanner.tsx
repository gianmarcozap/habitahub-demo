import React from 'react';
import { RotateCcw } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const DemoBanner: React.FC = () => {
  const resetDemo = usePropertyStore((state) => state.resetDemo);
  const isActionSubmitting = usePropertyStore((state) => state.isActionSubmitting);

  return (
    <div className="h-8 w-full bg-slate-100/90 border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between text-xs select-none">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Demo Sandbox</span>
        </span>
        <span className="hidden sm:inline text-[11px] text-slate-500 font-sans">
          Entorno interactivo para evaluación inmobiliaria
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={resetDemo}
          disabled={isActionSubmitting}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-all disabled:opacity-50"
          title="Restablecer todos los datos del edificio al valor inicial"
        >
          <RotateCcw className={`w-3 h-3 text-slate-500 ${isActionSubmitting ? 'animate-spin' : ''}`} />
          <span>↻ Reiniciar datos</span>
        </button>
      </div>
    </div>
  );
};
