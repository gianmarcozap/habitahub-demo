import React from 'react';
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  Wrench,
  ShieldCheck,
  FolderGit2,
  ExternalLink,
} from 'lucide-react';
import { usePropertyStore, NavigationPage } from '../../store/usePropertyStore';

export const Sidebar: React.FC = () => {
  const activePage = usePropertyStore((state) => state.activePage);
  const setActivePage = usePropertyStore((state) => state.setActivePage);
  const payments = usePropertyStore((state) => state.payments);
  const tickets = usePropertyStore((state) => state.tickets);

  const delinquentCount = payments.filter((p) => p.status === 'overdue').length;
  const urgentTicketsCount = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved').length;

  const navItems: Array<{
    id: NavigationPage;
    label: string;
    icon: React.ReactNode;
    badge?: { count: number; variant: 'rose' | 'amber' | 'emerald' | 'blue' };
  }> = [
    {
      id: 'dashboard',
      label: 'Panel Ejecutivo',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'units',
      label: 'Unidades & Contratos',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'payments',
      label: 'Finanzas & Morosidad',
      icon: <DollarSign className="w-4 h-4" />,
      badge: delinquentCount > 0 ? { count: delinquentCount, variant: 'rose' } : undefined,
    },
    {
      id: 'maintenance',
      label: 'Mantenimiento & Tickets',
      icon: <Wrench className="w-4 h-4" />,
      badge: urgentTicketsCount > 0 ? { count: urgentTicketsCount, variant: 'rose' } : undefined,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="h-14 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
              <span>HabitaHub</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">PMS · PropTech SaaS</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
            Gestión Operativa
          </div>

          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      item.badge.variant === 'rose'
                        ? 'bg-rose-950 text-rose-400 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
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

      {/* Tech Stack & Architecture Footnote */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 space-y-3">
        <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hexagonal Architecture</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            UI calls Use Cases → Use Cases call Ports → In-Memory Go REST adapter.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Go & PostgreSQL Base</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <ExternalLink className="w-3 h-3" />
            <span>v1.0-demo</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
