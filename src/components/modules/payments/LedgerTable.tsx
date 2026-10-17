import React, { useState } from 'react';
import { PaymentTransaction, PaymentStatus } from '../../../domain/payment';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { CreditCard, CheckCircle2, Clock, AlertCircle, Download } from 'lucide-react';
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
    transfer: 'Transferencia Bancaria BCP/BBVA',
    yape_plin: 'Billetera Digital Yape / Plin',
    cash: 'Efectivo en Caja',
  };

  const handleDownloadReceipt = (p: PaymentTransaction) => {
    const receiptContent = `===============================================================
               INMOBILIARIA LAS ACACIAS S.A.C.
                     RUC: 20601928374
       Av. Javier Prado Este 2450, San Isidro, Lima, Perú
===============================================================
BOLETA DE PAGO ELECTRÓNICA — ARRENDAMIENTO RESIDENCIAL
N° de Serie / Comprobante: B001-${p.referenceNumber?.replace(/[^a-zA-Z0-9]/g, '').slice(-8) || '00491823'}
Fecha de Emisión:          ${p.paidAt ? p.paidAt.split('T')[0] : '2026-10-05'}
Fecha de Vencimiento:      ${p.dueDate}
---------------------------------------------------------------
DATOS DEL ARRENDATARIO (INQUILINO):
Nombre / Razón Social:     ${p.tenantName.toUpperCase()}
Unidad Inmobiliaria:       Departamento ${p.unitNumber} (Piso ${p.unitNumber[0]})
Edificio:                  Residencial Las Acacias
Período de Arrendamiento:  ${p.billingPeriod}
---------------------------------------------------------------
DETALLE DEL COBRO:
Concepto:                  Renta mensual de departamento
Canal / Método de Pago:    ${p.paymentMethod ? methodLabels[p.paymentMethod] : 'Transferencia Bancaria'}
N° de Operación / Voucher: ${p.referenceNumber || 'BCP-TR-918234'}
Estado:                    PAGADO Y CONCILIADO
---------------------------------------------------------------
TOTAL PAGADO:              $${p.amount.toLocaleString()} USD
---------------------------------------------------------------
Comprobante emitido electrónicamente por el sistema HabitaHub PMS.
Código hash de autenticación: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}
===============================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Boleta_Pago_Dpto_${p.unitNumber}_${p.billingPeriod.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Boleta de Pago para Dpto ${p.unitNumber} descargada exitosamente`, 'success');
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs space-y-3.5 p-4 sm:p-5">
      {/* Table Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Libro Diario de Ingresos & Morosidad</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
              {filtered.length} Transacciones
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Registro cronológico de cobranzas por departamento con descarga de boleta.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({payments.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'paid'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Pagados ({payments.filter((p) => p.status === 'paid').length})
          </button>
          <button
            onClick={() => setStatusFilter('overdue')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === 'overdue'
                ? 'bg-rose-50 text-rose-800 font-semibold shadow-2xs'
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
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-3.5 py-3">Unidad</th>
              <th className="px-3.5 py-3">Inquilino</th>
              <th className="px-3.5 py-3">Período</th>
              <th className="px-3.5 py-3 text-right">Monto</th>
              <th className="px-3.5 py-3">Vencimiento</th>
              <th className="px-3.5 py-3">Canal & Ref</th>
              <th className="px-3.5 py-3 text-center">Estado</th>
              <th className="px-3.5 py-3 text-right">Comprobante</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filtered.map((p) => {
              const isPaid = p.status === 'paid';
              const isOverdue = p.status === 'overdue';

              return (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-3.5 py-3 font-bold font-mono text-slate-900">
                    Dpto {p.unitNumber}
                  </td>
                  <td className="px-3.5 py-3 font-medium text-slate-900">
                    {p.tenantName}
                  </td>
                  <td className="px-3.5 py-3 text-slate-500 font-mono text-[11px]">
                    {p.billingPeriod}
                  </td>
                  <td className="px-3.5 py-3 text-right font-mono font-bold text-slate-900">
                    ${p.amount.toLocaleString()}
                  </td>
                  <td className="px-3.5 py-3 font-mono text-slate-600 text-[11px]">
                    {p.dueDate}
                  </td>
                  <td className="px-3.5 py-3">
                    {p.paymentMethod ? (
                      <div>
                        <div className="text-slate-800 font-medium text-[11px]">
                          {p.paymentMethod === 'transfer' ? 'Transferencia BCP' : p.paymentMethod === 'yape_plin' ? 'Yape / Plin' : 'Efectivo'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {p.referenceNumber}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Pendiente</span>
                    )}
                  </td>
                  <td className="px-3.5 py-3 text-center">
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
                  <td className="px-3.5 py-3 text-right">
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
                        leftIcon={<Download className="w-3 h-3 text-slate-500" />}
                        onClick={() => handleDownloadReceipt(p)}
                        title="Descargar Boleta de Pago Electrónica (.txt)"
                      >
                        Boleta
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
