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
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span>Acciones Prioritarias</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200">
                  {delinquentUnits.length + renewalAlerts.length + (urgentTicket ? 1 : 0)} Pendientes
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Cobranzas vencidas, renovaciones y mantenimiento urgente
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Urgent Maintenance Ticket */}
          {urgentTicket && (
            <div className="p-3.5 rounded-lg bg-rose-50/60 border border-rose-200 flex items-start justify-between gap-3 group hover:border-rose-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-white border border-rose-200 text-rose-600 mt-0.5">
                  <Wrench className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      Unidad {urgentTicket.unitNumber} · Fuga de Tubería
                    </span>
                    <Badge variant="rose" size="sm" pulse>
                      Urgente
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                    {urgentTicket.description}
                  </p>
                  <span className="text-[10px] text-slate-500 font-sans">
                    Técnico asignado: {urgentTicket.assignedTechnician}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActivePage('maintenance')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 hover:text-rose-800 hover:underline shrink-0 mt-1 cursor-pointer"
              >
                <span>Ver orden</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Delinquent Units */}
          {delinquentUnits.map((d) => (
            <div
              key={d.unitNumber}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-white border border-rose-200 text-rose-600 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      Unidad {d.unitNumber} · {d.tenantName}
                    </span>
                    <Badge variant="rose" size="sm">
                      {d.daysOverdue} días de mora
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Saldo adeudado: <strong className="text-rose-700 font-semibold">${d.amountDue.toLocaleString()} USD</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const unitId = d.unitNumber === '203' ? 'u-203' : 'u-402';
                  openRecordPaymentModal(unitId);
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium shrink-0 transition-colors shadow-xs cursor-pointer"
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
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-white border border-amber-200 text-amber-600 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      Unidad {alert.unitNumber} · {alert.tenantName}
                    </span>
                    <Badge variant="amber" size="sm">
                      Vence en {alert.daysRemaining} días
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Término de contrato: {alert.endDate}.
                  </p>
                </div>
              </div>
              <button
                onClick={() => openUnitDetail(alert.unitId)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                <FileText className="w-3 h-3 text-slate-500" />
                <span>Renovar</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Gestión directa de incidencias y cobranzas</span>
        <span className="text-slate-400 font-mono">Las Acacias</span>
      </div>
    </div>
  );
};
