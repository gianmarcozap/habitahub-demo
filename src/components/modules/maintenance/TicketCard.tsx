import React from 'react';
import { MaintenanceTicket, IncidentStatus } from '../../../domain/ticket';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { Wrench, Clock, User, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export interface TicketCardProps {
  ticket: MaintenanceTicket;
  onUpdateStatus: (ticketId: string, status: IncidentStatus) => void;
  isSubmitting?: boolean;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onUpdateStatus,
  isSubmitting = false,
}) => {
  const priorityConfig = {
    urgent: { label: 'Urgente', variant: 'rose' as const, pulse: true },
    medium: { label: 'Medio', variant: 'amber' as const, pulse: false },
    low: { label: 'Bajo', variant: 'slate' as const, pulse: false },
  };

  const priority = priorityConfig[ticket.priority];

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all space-y-2.5">
      {/* Header: Unit badge + Priority */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
          {ticket.unitNumber === 'Common Area' || ticket.unitNumber === 'Common' ? 'Áreas Comunes' : `Dpto ${ticket.unitNumber}`}
        </span>
        <Badge variant={priority.variant} size="sm" pulse={priority.pulse}>
          {priority.label}
        </Badge>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-xs font-semibold text-slate-900 leading-snug">
          {ticket.title}
        </h4>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* Reporter, Technician & Cost */}
      <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500 font-sans">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 truncate">
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{ticket.reporterName}</span>
          </span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400 shrink-0">
            <Clock className="w-3 h-3" />
            {formatDate(ticket.createdAt)}
          </span>
        </div>

        {ticket.assignedTechnician && (
          <div className="flex items-center justify-between pt-0.5">
            <span className="flex items-center gap-1.5 text-slate-700 font-medium text-[10px] truncate">
              <Wrench className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{ticket.assignedTechnician}</span>
            </span>
            {ticket.estimatedCost && (
              <span className="text-emerald-700 font-mono font-semibold text-[10px]">
                ${ticket.estimatedCost} USD
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progression Action Button */}
      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-end">
        {ticket.status === 'reported' && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs py-1"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-3 h-3 text-slate-600" />}
            onClick={() => onUpdateStatus(ticket.id, 'in_progress')}
          >
            Iniciar Atención
          </Button>
        )}

        {ticket.status === 'in_progress' && (
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center text-xs py-1"
            isLoading={isSubmitting}
            rightIcon={<CheckCircle2 className="w-3 h-3 text-white" />}
            onClick={() => onUpdateStatus(ticket.id, 'resolved')}
          >
            Marcar Resuelto
          </Button>
        )}

        {ticket.status === 'resolved' && (
          <div className="w-full flex items-center justify-between text-[11px] text-emerald-700 font-medium py-0.5">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Conforme
            </span>
            <button
              onClick={() => onUpdateStatus(ticket.id, 'in_progress')}
              className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 cursor-pointer text-[10px]"
              title="Reabrir ticket"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reabrir</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
