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
    <div className="p-6 rounded-xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Acciones Urgentes Requeridas</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-50 text-rose-700 border border-rose-200">
                  {delinquentUnits.length + renewalAlerts.length + (urgentTicket ? 1 : 0)} Pendientes
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Cobranzas vencidas, renovaciones y averías prioritarias
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Urgent Maintenance Ticket */}
          {urgentTicket && (
            <div className="p-3.5 rounded-lg bg-white border border-rose-200/90 shadow-xs flex items-start justify-between gap-3 group hover:border-rose-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 mt-0.5">
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
                  <span className="text-[10px] text-slate-400 font-sans">
                    Técnico: {urgentTicket.assignedTechnician}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActivePage('maintenance')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-medium shrink-0 transition-colors shadow-2xs cursor-pointer mt-0.5"
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
              className="p-3.5 rounded-lg bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      Unidad {d.unitNumber} · {d.tenantName}
                    </span>
                    <Badge variant="rose" size="sm">
                      {d.daysOverdue}d en mora
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
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium shrink-0 transition-colors shadow-xs cursor-pointer mt-0.5"
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
              className="p-3.5 rounded-lg bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-900">
                      Unidad {alert.unitNumber} · {alert.tenantName}
                    </span>
                    <Badge variant="amber" size="sm">
                      Vence en {alert.daysRemaining}d
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Fecha de término: {alert.endDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openUnitDetail(alert.unitId)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-medium shrink-0 transition-colors shadow-xs cursor-pointer mt-0.5"
              >
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Gestionar</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Seguimiento directo en Edificio Las Acacias</span>
        <span className="text-slate-400 font-mono text-[10px]">Actualizado</span>
      </div>
    </div>
  );
};
