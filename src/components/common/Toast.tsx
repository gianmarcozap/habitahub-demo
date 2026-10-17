import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const Toast: React.FC = () => {
  const toast = usePropertyStore((state) => state.toast);
  const dismissToast = usePropertyStore((state) => state.dismissToast);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-800/80 bg-slate-900/95 text-slate-100 shadow-emerald-950/50',
    warning: 'border-rose-800/80 bg-slate-900/95 text-slate-100 shadow-rose-950/50',
    info: 'border-blue-800/80 bg-slate-900/95 text-slate-100 shadow-blue-950/50',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-bounce-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-xs leading-relaxed font-medium">
          {toast.message}
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
