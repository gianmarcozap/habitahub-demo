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
    showToast(`Comprobante para Unidad ${payment.unitNumber} (${payment.referenceNumber || 'REC-001'}) emitido correctamente.`, 'info');
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm space-y-4 p-6">
      {/* Table Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Libro Diario de Ingresos & Morosidad</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
              {filtered.length} Transacciones
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro cronológico de cobranzas mensuales por departamento.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({payments.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Pagados ({payments.filter((p) => p.status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'overdue'
                ? 'bg-rose-50 text-rose-800 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            En Mora ({payments.filter((p) => p.status === 'overdue').length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">Unidad</th>
              <th className="px-4 py-3.5">Inquilino</th>
              <th className="px-4 py-3.5">Período</th>
              <th className="px-4 py-3.5 text-right">Monto</th>
              <th className="px-4 py-3.5">Vencimiento</th>
              <th className="px-4 py-3.5">Canal & Ref</th>
              <th className="px-4 py-3.5 text-center">Estado</th>
              <th className="px-4 py-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filtered.map((p) => {
              const isPaid = p.status === 'paid';
              const isOverdue = p.status === 'overdue';

              return (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-bold font-mono text-slate-900">
                    Dpto {p.unitNumber}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {p.tenantName}
                  </td>
                  <td className="px-4 py-4 text-slate-500 font-mono text-[11px]">
                    {p.billingPeriod}
                  </td>
                  <td className="px-4 py-4 text-right font-mono font-bold text-slate-900">
                    ${p.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-600 text-[11px]">
                    {p.dueDate}
                  </td>
                  <td className="px-4 py-4">
                    {p.paymentMethod ? (
                      <div>
                        <div className="text-slate-800 font-medium">
                          {methodLabels[p.paymentMethod]}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {p.referenceNumber}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Pendiente de abono</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {isPaid ? (
                      <Badge variant="emerald" size="sm">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Pagado</span>
                      </Badge>
                    ) : isOverdue ? (
                      <Badge variant="rose" size="sm" pulse>
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Mora {p.daysOverdue}d</span>
                      </Badge>
                    ) : (
                      <Badge variant="amber" size="sm">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pendiente</span>
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {isOverdue ? (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<CreditCard className="w-3 h-3 text-white" />}
                        onClick={() => openRecordPaymentModal(p.unitId)}
                      >
                        Cobrar
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<FileText className="w-3 h-3 text-slate-500" />}
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
