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
    low: { label: 'Bajo', variant: 'blue' as const, pulse: false },
  };

  const priority = priorityConfig[ticket.priority];

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all space-y-3">
      {/* Top Meta: Unit tag & Priority chip */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
          {ticket.unitNumber === 'Common Area' || ticket.unitNumber === 'Common' ? 'Áreas Comunes' : `Dpto ${ticket.unitNumber}`}
        </span>
        <Badge variant={priority.variant} size="sm" pulse={priority.pulse}>
          {priority.label}
        </Badge>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 leading-snug">
          {ticket.title}
        </h4>
        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* Reporter and Assignment */}
      <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-500 font-sans">
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3 text-slate-400" />
          <span className="truncate">{ticket.reporterName}</span>
        </div>
        {ticket.assignedTechnician && (
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Wrench className="w-3 h-3 text-emerald-600" />
            <span className="truncate">{ticket.assignedTechnician}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(ticket.createdAt)}
          </span>
          {ticket.estimatedCost && (
            <span className="text-emerald-700 font-bold">
              Est: ${ticket.estimatedCost} USD
            </span>
          )}
        </div>
      </div>

      {/* Progression Action Button */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
        {ticket.status === 'reported' && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-3.5 h-3.5 text-slate-600" />}
            onClick={() => onUpdateStatus(ticket.id, 'in_progress')}
          >
            Iniciar Atención
          </Button>
        )}

        {ticket.status === 'in_progress' && (
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center text-xs"
            isLoading={isSubmitting}
            rightIcon={<CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            onClick={() => onUpdateStatus(ticket.id, 'resolved')}
          >
            Marcar como Resuelto
          </Button>
        )}

        {ticket.status === 'resolved' && (
          <div className="w-full flex items-center justify-between text-[11px] text-emerald-700 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Incidencia cerrada
            </span>
            <button
              onClick={() => onUpdateStatus(ticket.id, 'in_progress')}
              className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
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
