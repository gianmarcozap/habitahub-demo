import React from 'react';
import { KanbanBoard } from '../components/modules/maintenance/KanbanBoard';
import { NewTicketModal } from '../components/modules/maintenance/NewTicketModal';
import { Button } from '../components/common/Button';
import { Plus } from 'lucide-react';
import { usePropertyStore } from '../store/usePropertyStore';

export const MaintenancePage: React.FC = () => {
  const tickets = usePropertyStore((state) => state.tickets);
  const openNewTicketModal = usePropertyStore((state) => state.openNewTicketModal);

  const urgentCount = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Mesa de Mantenimiento & Incidencias
            </h1>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200 font-mono">
              Tablero Kanban
            </span>
            {urgentCount > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                {urgentCount} Urgente
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Seguimiento operativo de reparaciones en departamentos y áreas comunes de Edificio Las Acacias.
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Modern Clean Kanban Board */}
      <KanbanBoard tickets={tickets} />

      {/* New Ticket Modal */}
      <NewTicketModal />
    </div>
  );
};
