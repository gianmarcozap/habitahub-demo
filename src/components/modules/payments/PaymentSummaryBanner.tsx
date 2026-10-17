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
  const collectionRate = financialSummary ? Math.round((collected / expected) * 100) : 90;
  const delinquencyRate = financialSummary?.delinquencyRate || 10;
  const delinquentCount = financialSummary?.delinquentUnits.length || 2;

  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Estado Financiero & Balance de Cobranzas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Octubre 2026 · Edificio Las Acacias · Conciliación de ingresos mensuales y cartera en mora.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CreditCard className="w-3.5 h-3.5 text-white" />}
            onClick={() => openRecordPaymentModal()}
          >
            Registrar Cobro de Arriendo
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {/* Expected */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>MRR Presupuestado</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">
            ${expected.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            20 unidades (16 con contrato vigente)
          </p>
        </div>

        {/* Collected */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span>Recaudación Efectiva</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-800">
            ${collected.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-emerald-200/80 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-800">
              {collectionRate}%
            </span>
          </div>
        </div>

        {/* Delinquent */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
          <div className="flex items-center justify-between text-xs text-rose-800">
            <span>Saldo en Mora (&gt;15 días)</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-700">
            ${overdue.toLocaleString()}
          </div>
          <p className="text-[11px] text-rose-800 mt-1 flex items-center gap-1">
            <span>{delinquentCount} inquilinos morosos</span>
            <span>·</span>
            <span className="font-mono font-semibold">{delinquencyRate}% cartera vencida</span>
          </p>
        </div>
      </div>
    </div>
  );
};
