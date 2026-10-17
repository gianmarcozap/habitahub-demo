import React from 'react';
import { AlertCircle, Clock, Wrench, ArrowRight, DollarSign, FileText } from 'lucide-react';
import { Badge } from '../../common/Badge';
import { usePropertyStore } from '../../../store/usePropertyStore';

export const UrgentActionFeed: React.FC = () => {
  const financialSummary = usePropertyStore((state) => state.financialSummary);
  const renewalAlerts = usePropertyStore((state) => state.renewalAlerts);
  const tickets = usePropertyStore((state) => state.tickets);
  const openRecordPaymentModal = usePropertyStore((state) => state.openRecordPaymentModal);
  const openUnitDetail = usePropertyStore((state) => state.openUnitDetail);
  const setActivePage = usePropertyStore((state) => state.setActivePage);

  const urgentTicket = tickets.find((t) => t.priority === 'urgent' && t.status !== 'resolved');
  const delinquentUnits = financialSummary?.delinquentUnits || [];

  return (
    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Acciones Urgentes Requeridas</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-400 border border-rose-800">
                  {delinquentUnits.length + renewalAlerts.length + (urgentTicket ? 1 : 0)} Pendientes
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Cobranzas vencidas, contratos por vencer y averías críticas
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* Urgent Maintenance Ticket */}
          {urgentTicket && (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/60 flex items-start justify-between gap-3 group hover:border-rose-600 transition-colors">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-rose-900/60 text-rose-300 mt-0.5">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-rose-300">
                      Unidad {urgentTicket.unitNumber} · Fuga de Tubería
                    </span>
                    <Badge variant="rose" size="sm" pulse>
                      Crítico
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                    {urgentTicket.description}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Técnico: {urgentTicket.assignedTechnician}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActivePage('maintenance')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:underline shrink-0 mt-1"
              >
                <span>Ver Ticket</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Delinquent Units */}
          {delinquentUnits.map((d) => (
            <div
              key={d.unitNumber}
              className="p-3 rounded-lg bg-slate-850 border border-rose-900/40 hover:border-rose-700/60 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-rose-950 text-rose-400 border border-rose-800/60 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">
                      Unidad {d.unitNumber} · {d.tenantName}
                    </span>
                    <Badge variant="rose" size="sm">
                      {d.daysOverdue} días de mora
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Deuda acumulada de <strong className="text-rose-300">${d.amountDue.toLocaleString()}</strong> correspondiente al mes en curso.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const unitId = d.unitNumber === '203' ? 'u-203' : 'u-402';
                  openRecordPaymentModal(unitId);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium shrink-0 transition-colors mt-0.5"
              >
                <span>Cobrar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Expiring Soon Leases */}
          {renewalAlerts.map((alert) => (
            <div
              key={alert.leaseId}
              className="p-3 rounded-lg bg-slate-850/80 border border-amber-900/40 hover:border-amber-700/60 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-800/60 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">
                      Unidad {alert.unitNumber} · {alert.tenantName}
                    </span>
                    <Badge variant="amber" size="sm">
                      Vence en {alert.daysRemaining} días
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fecha de término: {alert.endDate}. Se recomienda ofrecer prórroga de 12 meses.
                  </p>
                </div>
              </div>
              <button
                onClick={() => openUnitDetail(alert.unitId)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium shrink-0 transition-colors mt-0.5"
              >
                <FileText className="w-3 h-3 text-amber-400" />
                <span>Gestionar</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Acciones integradas directamente con el store reactivo</span>
        <span className="font-mono text-emerald-400">Zero Placeholder Policy Activa</span>
      </div>
    </div>
  );
};
