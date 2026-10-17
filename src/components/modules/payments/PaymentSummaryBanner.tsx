import React from 'react';
import { DollarSign, AlertTriangle, CheckCircle2, TrendingUp, CreditCard } from 'lucide-react';
import { usePropertyStore } from '../../../store/usePropertyStore';
import { Button } from '../../common/Button';

export const PaymentSummaryBanner: React.FC = () => {
  const financialSummary = usePropertyStore((state) => state.financialSummary);
  const openRecordPaymentModal = usePropertyStore((state) => state.openRecordPaymentModal);

  const expected = financialSummary?.expectedRevenue || 18400;
  const collected = financialSummary?.collectedRevenue || 16200;
  const overdue = financialSummary?.delinquentRevenue || 2200;
  const collectionRate = financialSummary ? Math.round((collected / expected) * 100) : 88;
  const delinquencyRate = financialSummary?.delinquencyRate || 10;
  const delinquentCount = financialSummary?.delinquentUnits.length || 2;

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Estado Financiero & Balance de Cobranzas
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Octubre 2026 · Edificio Las Acacias · Conciliación de ingresos mensuales y mora.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CreditCard className="w-3.5 h-3.5 text-white" />}
            onClick={() => openRecordPaymentModal()}
          >
            Registrar Cobro
          </Button>
        </div>
      </div>

      {/* Compact 3 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Expected */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>MRR Presupuestado</span>
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-slate-900">
            ${expected.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            20 unidades (16 con contrato activo)
          </p>
        </div>

        {/* Collected */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center justify-between text-[11px] text-emerald-800">
            <span>Recaudación Efectiva</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-emerald-800">
            ${collected.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 bg-emerald-200/80 rounded-full h-1 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-800">
              {collectionRate}%
            </span>
          </div>
        </div>

        {/* Delinquent */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-rose-50/60 border border-rose-200">
          <div className="flex items-center justify-between text-[11px] text-rose-800">
            <span>Saldo en Mora (&gt;15 días)</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-1 text-lg sm:text-xl font-bold font-mono text-rose-700">
            ${overdue.toLocaleString()}
          </div>
          <p className="text-[10px] text-rose-800 mt-0.5 flex items-center gap-1">
            <span>{delinquentCount} morosos</span>
            <span>·</span>
            <span className="font-mono font-semibold">{delinquencyRate}% cartera vencida</span>
          </p>
        </div>
      </div>
    </div>
  );
};
