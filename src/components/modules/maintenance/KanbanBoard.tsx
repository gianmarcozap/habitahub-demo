import React from 'react';
import { MaintenanceTicket, IncidentStatus } from '../../../domain/ticket';
import { TicketCard } from './TicketCard';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { AlertCircle, Clock, CheckCircle2, Plus } from 'lucide-react';
import { usePropertyStore } from '../../../store/usePropertyStore';

export interface KanbanBoardProps {
  tickets: MaintenanceTicket[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tickets }) => {
  const updateTicketStatus = usePropertyStore((state) => state.updateTicketStatus);
  const openNewTicketModal = usePropertyStore((state) => state.openNewTicketModal);
  const isActionSubmitting = usePropertyStore((state) => state.isActionSubmitting);

  const columns: Array<{
    id: IncidentStatus;
    title: string;
    description: string;
    icon: React.ReactNode;
    badgeVariant: 'amber' | 'blue' | 'emerald';
  }> = [
    {
      id: 'reported',
      title: 'Reportados / Backlog',
      description: 'Averías recibidas pendientes de asignación técnica',
      icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
      badgeVariant: 'amber',
    },
    {
      id: 'in_progress',
      title: 'En Atención / Progreso',
      description: 'Técnico o contratista asignado en sitio',
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      badgeVariant: 'blue',
    },
    {
      id: 'resolved',
      title: 'Resueltos / Cerrados',
      description: 'Conformidad de inquilino y cierre de orden',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      badgeVariant: 'emerald',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => {
        const columnTickets = tickets.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="rounded-xl bg-slate-50/80 border border-slate-200 p-4.5 space-y-4 shadow-xs flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-2">
                {col.icon}
                <span className="text-xs font-bold text-slate-900">
                  {col.title}
                </span>
              </div>
              <Badge variant={col.badgeVariant} size="sm">
                {columnTickets.length}
              </Badge>
            </div>

            {/* Column Subtitle */}
            <p className="text-[11px] text-slate-500 leading-tight">
              {col.description}
            </p>

            {/* Tickets Stack */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onUpdateStatus={updateTicketStatus}
                  isSubmitting={isActionSubmitting}
                />
              ))}

              {columnTickets.length === 0 && (
                <div className="p-8 text-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 space-y-2">
                  <p>Sin incidencias en esta columna</p>
                </div>
              )}
            </div>

            {/* Column Footer Quick Add */}
            {col.id === 'reported' && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center text-xs border-dashed text-slate-600 hover:text-slate-900 shadow-xs"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => openNewTicketModal()}
              >
                Reportar Nueva Incidencia
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
