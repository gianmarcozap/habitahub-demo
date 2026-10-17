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
    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Estado Financiero & Balance de Cobranzas
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Octubre 2026 · Edificio Las Acacias · Conciliación bancaria y cartera morosa
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<CreditCard className="w-3.5 h-3.5 text-slate-950" />}
            onClick={() => openRecordPaymentModal()}
          >
            Registrar Cobro de Arriendo
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Expected */}
        <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>MRR Facturado / Proyectado</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">
            ${expected.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            20 unidades (16 con contrato vigente)
          </p>
        </div>

        {/* Collected */}
        <div className="p-4 rounded-xl bg-slate-850/80 border border-emerald-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Recaudación Efectiva</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            ${collected.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-300">
              {collectionRate}%
            </span>
          </div>
        </div>

        {/* Delinquent */}
        <div className="p-4 rounded-xl bg-slate-850/80 border border-rose-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Saldo en Mora (&gt;15 días)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">
            ${overdue.toLocaleString()}
          </div>
          <p className="text-[11px] text-rose-300/90 mt-1 flex items-center gap-1">
            <span>{delinquentCount} inquilinos morosos</span>
            <span>·</span>
            <span className="font-mono">{delinquencyRate}% cartera vencida</span>
          </p>
        </div>
      </div>
    </div>
  );
};
