import React from 'react';
import { MaintenanceTicket, IncidentStatus } from '../../../domain/ticket';
import { TicketCard } from './TicketCard';
import { Badge } from '../../common/Badge';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { usePropertyStore } from '../../../store/usePropertyStore';

export interface KanbanBoardProps {
  tickets: MaintenanceTicket[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tickets }) => {
  const updateTicketStatus = usePropertyStore((state) => state.updateTicketStatus);
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
      title: 'Reportados / Por Asignar',
      description: 'Averías recibidas pendientes de cuadrilla técnica',
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
      title: 'Resueltos / Conformidad',
      description: 'Avería subsanada con visto bueno de inquilino',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      badgeVariant: 'emerald',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-start">
      {columns.map((col) => {
        const columnTickets = tickets.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="rounded-xl bg-slate-50/70 border border-slate-200/90 p-3.5 space-y-3 shadow-2xs flex flex-col"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <div className="flex items-center gap-2">
                {col.icon}
                <span className="text-xs font-bold text-slate-900 tracking-tight">
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
            <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-0.5">
              {columnTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onUpdateStatus={updateTicketStatus}
                  isSubmitting={isActionSubmitting}
                />
              ))}

              {columnTickets.length === 0 && (
                <div className="p-8 text-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 space-y-1">
                  <p className="font-medium text-slate-500">Sin órdenes en esta columna</p>
                  <p className="text-[10px]">Todo al día en esta etapa</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
