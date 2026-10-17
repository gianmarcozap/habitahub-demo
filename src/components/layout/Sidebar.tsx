import React from 'react';
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  Wrench,
} from 'lucide-react';
import { usePropertyStore, NavigationPage } from '../../store/usePropertyStore';

export interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const activePage = usePropertyStore((state) => state.activePage);
  const setActivePage = usePropertyStore((state) => state.setActivePage);
  const payments = usePropertyStore((state) => state.payments);
  const tickets = usePropertyStore((state) => state.tickets);

  const delinquentCount = payments.filter((p) => p.status === 'overdue').length;
  const urgentTicketsCount = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved').length;

  const handleNavClick = (page: NavigationPage) => {
    setActivePage(page);
    if (onNavigate) onNavigate();
  };

  const navItems: Array<{
    id: NavigationPage;
    label: string;
    icon: React.ReactNode;
    badge?: { count: number; variant: 'rose' | 'amber' };
  }> = [
    {
      id: 'dashboard',
      label: 'Panel Ejecutivo',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'units',
      label: 'Unidades y Contratos',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'payments',
      label: 'Cobranzas y Morosidad',
      icon: <DollarSign className="w-4 h-4" />,
      badge: delinquentCount > 0 ? { count: delinquentCount, variant: 'rose' } : undefined,
    },
    {
      id: 'maintenance',
      label: 'Mantenimiento e Incidencias',
      icon: <Wrench className="w-4 h-4" />,
      badge: urgentTicketsCount > 0 ? { count: urgentTicketsCount, variant: 'rose' } : undefined,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>HabitaHub</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                PMS
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Property Management</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Administración Inmobiliaria
          </div>

          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-medium rounded-lg border-r-2 border-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-emerald-600' : 'text-slate-400'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      item.badge.variant === 'rose'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {item.badge.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Commercial Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-medium text-slate-700">Edificio Las Acacias</span>
          <span className="font-mono text-emerald-700 font-semibold">20 U.</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          HabitaHub PMS Enterprise · v2.4
        </p>
      </div>
    </aside>
  );
};
