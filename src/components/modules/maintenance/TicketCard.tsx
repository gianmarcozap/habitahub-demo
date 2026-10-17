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
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-sm transition-all space-y-3">
      {/* Top Meta: Unit tag & Priority chip */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded">
          {ticket.unitNumber === 'Common' ? 'Áreas Comunes' : `Unidad ${ticket.unitNumber}`}
        </span>
        <Badge variant={priority.variant} size="sm" pulse={priority.pulse}>
          {priority.label}
        </Badge>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-xs font-bold text-slate-100 leading-snug">
          {ticket.title}
        </h4>
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* Reporter and Assignment */}
      <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400 font-sans">
        <div className="flex items-center gap-1.5">
          <User className="w-3 h-3 text-slate-500" />
          <span className="truncate">{ticket.reporterName}</span>
        </div>
        {ticket.assignedTechnician && (
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Wrench className="w-3 h-3 text-emerald-400" />
            <span className="truncate">{ticket.assignedTechnician}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(ticket.createdAt)}
          </span>
          {ticket.estimatedCost && (
            <span className="text-emerald-400/90 font-bold">
              Est: ${ticket.estimatedCost}
            </span>
          )}
        </div>
      </div>

      {/* Progression Action Button */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
        {ticket.status === 'reported' && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center text-xs"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-3.5 h-3.5 text-emerald-400" />}
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
            rightIcon={<CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
            onClick={() => onUpdateStatus(ticket.id, 'resolved')}
          >
            Marcar Resuelto
          </Button>
        )}

        {ticket.status === 'resolved' && (
          <div className="w-full flex items-center justify-between text-[11px] text-emerald-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Incidencia cerrada
            </span>
            <button
              onClick={() => onUpdateStatus(ticket.id, 'in_progress')}
              className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
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
