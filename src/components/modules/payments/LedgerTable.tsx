import React, { useState } from 'react';
import { PaymentTransaction, PaymentStatus } from '../../../domain/payment';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { CreditCard, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';
import { usePropertyStore } from '../../../store/usePropertyStore';

export interface LedgerTableProps {
  payments: PaymentTransaction[];
}

export const LedgerTable: React.FC<LedgerTableProps> = ({ payments }) => {
  const openRecordPaymentModal = usePropertyStore((state) => state.openRecordPaymentModal);
  const showToast = usePropertyStore((state) => state.showToast);

  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');

  const filtered = payments.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const methodLabels = {
    transfer: 'Transferencia Bancaria',
    yape_plin: 'Yape / Plin',
    cash: 'Efectivo',
  };

  const handlePrintReceipt = (payment: PaymentTransaction) => {
    showToast(`Comprobante para Unidad ${payment.unitNumber} (${payment.referenceNumber || 'REC-001'}) generado correctamente.`, 'info');
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4 p-5">
      {/* Table Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>Libro Diario de Ingresos & Morosidad</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {filtered.length} Transacciones
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro cronológico de cobranzas mensuales por departamento.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-slate-100 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({payments.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === 'paid'
                ? 'bg-emerald-950 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Pagados ({payments.filter((p) => p.status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-3 py-1 rounded-md transition-colors ${
              statusFilter === 'overdue'
                ? 'bg-rose-950 text-rose-300 font-semibold'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            En Mora ({payments.filter((p) => p.status === 'overdue').length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Unidad</th>
              <th className="px-4 py-3">Inquilino</th>
              <th className="px-4 py-3">Período</th>
              <th className="px-4 py-3 text-right">Monto</th>
              <th className="px-4 py-3">Vencimiento</th>
              <th className="px-4 py-3">Método & Ref</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-sans">
            {filtered.map((p) => {
              const isPaid = p.status === 'paid';
              const isOverdue = p.status === 'overdue';

              return (
                <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="px-4 py-3.5 font-bold font-mono text-slate-100">
                    Dpto {p.unitNumber}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-200">
                    {p.tenantName}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                    {p.billingPeriod}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-100">
                    ${p.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-300 text-[11px]">
                    {p.dueDate}
                  </td>
                  <td className="px-4 py-3.5">
                    {p.paymentMethod ? (
                      <div>
                        <div className="text-slate-300 font-medium">
                          {methodLabels[p.paymentMethod]}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {p.referenceNumber}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Pendiente de abono</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {isPaid ? (
                      <Badge variant="emerald" size="sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Pagado</span>
                      </Badge>
                    ) : isOverdue ? (
                      <Badge variant="rose" size="sm" pulse>
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        <span>Mora {p.daysOverdue}d</span>
                      </Badge>
                    ) : (
                      <Badge variant="amber" size="sm">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Pendiente</span>
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {isOverdue ? (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<CreditCard className="w-3 h-3 text-slate-950" />}
                        onClick={() => openRecordPaymentModal(p.unitId)}
                      >
                        Cobrar
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<FileText className="w-3 h-3 text-slate-400" />}
                        onClick={() => handlePrintReceipt(p)}
                      >
                        Recibo
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
