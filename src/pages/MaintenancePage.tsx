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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Mesa de Mantenimiento & Tickets Operativos
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono border border-slate-700/60">
              Kanban 3 Columnas
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tablero de incidencias técnicas por departamento y áreas comunes con progresión de estado en un clic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-slate-950" />}
            onClick={() => openNewTicketModal()}
          >
            Nueva Incidencia
          </Button>
        </div>
      </div>

      {/* Mini Summary Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Tickets Críticos / Urgentes</span>
              <div className="text-sm font-bold font-mono text-rose-400">{urgentCount} Activo</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Unidad 302</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400">En Atención Técnica</span>
              <div className="text-sm font-bold font-mono text-blue-400">{inProgressCount} En Progreso</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Contratistas</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Incidencias Resueltas</span>
              <div className="text-sm font-bold font-mono text-emerald-400">{resolvedCount} Conformes</div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Histórico</span>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard tickets={tickets} />

      {/* New Ticket Modal */}
      <NewTicketModal />
    </div>
  );
};
