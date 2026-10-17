import React, { useState, useEffect, useRef } from 'react';
import { Search, Building, User, Receipt, Wrench, ArrowRight, CornerDownLeft } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const QuickSearchModal: React.FC = () => {
  const isQuickSearchOpen = usePropertyStore((state) => state.isQuickSearchOpen);
  const setQuickSearchOpen = usePropertyStore((state) => state.setQuickSearchOpen);
  const units = usePropertyStore((state) => state.units);
  const tenants = usePropertyStore((state) => state.tenants);
  const tickets = usePropertyStore((state) => state.tickets);
  const setActivePage = usePropertyStore((state) => state.setActivePage);
  const openUnitDetail = usePropertyStore((state) => state.openUnitDetail);
  const openRecordPaymentModal = usePropertyStore((state) => state.openRecordPaymentModal);
  const openNewTicketModal = usePropertyStore((state) => state.openNewTicketModal);

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen(!isQuickSearchOpen);
      }
      if (e.key === 'Escape' && isQuickSearchOpen) {
        setQuickSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickSearchOpen, setQuickSearchOpen]);

  useEffect(() => {
    if (isQuickSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isQuickSearchOpen]);

  if (!isQuickSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingUnits = units.filter(
    (u) => u.unitNumber.includes(q) || u.typology.toLowerCase().includes(q)
  );

  const matchingTenants = tenants.filter(
    (t) => t.fullName.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
  );

  const matchingTickets = tickets.filter(
    (tk) => tk.title.toLowerCase().includes(q) || tk.unitNumber.includes(q)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="fixed inset-0"
        onClick={() => setQuickSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search Input Box */}
        <div className="flex items-center px-4 border-b border-slate-200 bg-white">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar unidad (ej. 302), inquilino o acción..."
            className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {(!q || 'registrar pago nuevo ticket'.includes(q)) && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Acciones Rápidas
              </div>
              <button
                onClick={() => {
                  setQuickSearchOpen(false);
                  openRecordPaymentModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Registrar Cobro de Arrendamiento</span>
                </div>
                <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => {
                  setQuickSearchOpen(false);
                  openNewTicketModal();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Wrench className="w-4 h-4 text-amber-600" />
                  <span>Crear Ticket de Mantenimiento</span>
                </div>
                <CornerDownLeft className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          )}

          {matchingUnits.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Unidades ({matchingUnits.length})
              </div>
              <div className="space-y-0.5">
                {matchingUnits.slice(0, 5).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setQuickSearchOpen(false);
                      setActivePage('units');
                      openUnitDetail(u.id);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-900">Dpto {u.unitNumber}</span>
                      <span className="text-slate-500">· Piso {u.floor} ({u.typology})</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 font-medium">
                      ${u.monthlyRent}/mes
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingTenants.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Inquilinos ({matchingTenants.length})
              </div>
              <div className="space-y-0.5">
                {matchingTenants.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setQuickSearchOpen(false);
                      setActivePage('units');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium text-slate-900">{t.fullName}</span>
                      <span className="text-slate-400 text-[11px]">{t.phone}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingTickets.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Incidencias ({matchingTickets.length})
              </div>
              <div className="space-y-0.5">
                {matchingTickets.slice(0, 3).map((tk) => (
                  <button
                    key={tk.id}
                    onClick={() => {
                      setQuickSearchOpen(false);
                      setActivePage('maintenance');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-medium text-slate-900 truncate max-w-xs">{tk.title}</span>
                      <span className="text-slate-500 text-[11px]">Dpto {tk.unitNumber}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        tk.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tk.priority.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Navegación del Edificio Las Acacias</span>
          <span className="font-medium">HabitaHub PMS</span>
        </div>
      </div>
    </div>
  );
};
