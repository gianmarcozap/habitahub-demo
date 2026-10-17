import React from 'react';
import { KanbanBoard } from '../components/modules/maintenance/KanbanBoard';
import { NewTicketModal } from '../components/modules/maintenance/NewTicketModal';
import { Button } from '../components/common/Button';
import { Plus, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { usePropertyStore } from '../store/usePropertyStore';

export const MaintenancePage: React.FC = () => {
  const tickets = usePropertyStore((state) => state.tickets);
  const openNewTicketModal = usePropertyStore((state) => state.openNewTicketModal);

  const urgentCount = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Mesa de Mantenimiento & Incidencias
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200 font-mono">
              Tablero Kanban
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Seguimiento operativo de reparaciones en departamentos y áreas comunes de Edificio Las Acacias.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-white" />}
            onClick={() => openNewTicketModal()}
          >
            Nueva Incidencia
          </Button>
        </div>
      </div>

      {/* Mini Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Tickets Críticos / Urgentes</span>
              <div className="text-sm font-bold font-mono text-rose-700">{urgentCount} Activo</div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Dpto 302</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500">En Atención Técnica</span>
              <div className="text-sm font-bold font-mono text-blue-700">{inProgressCount} En Progreso</div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Cuadrilla</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Incidencias Resueltas</span>
              <div className="text-sm font-bold font-mono text-emerald-700">{resolvedCount} Conformes</div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Histórico</span>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard tickets={tickets} />

      {/* New Ticket Modal */}
      <NewTicketModal />
    </div>
  );
};
