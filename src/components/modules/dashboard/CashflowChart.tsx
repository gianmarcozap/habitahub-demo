import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { usePropertyStore } from '../../../store/usePropertyStore';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const collected = payload.find((p) => p.dataKey === 'collected')?.value || 0;
    const expected = payload.find((p) => p.dataKey === 'expected')?.value || 0;
    const occupancy = payload.find((p) => p.dataKey === 'occupancy')?.value || 0;
    const collectionPct = expected > 0 ? Math.round((collected / expected) * 100) : 0;

    return (
      <div className="bg-white border border-slate-200 shadow-lg rounded-xl p-3 text-xs text-slate-800 font-sans min-w-[210px]">
        <div className="text-slate-900 font-semibold border-b border-slate-100 pb-1.5 mb-2 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-emerald-700 font-mono text-[11px] font-semibold">{occupancy}% Ocupación</span>
        </div>
        <div className="space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5 font-sans">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Recaudado:
            </span>
            <span className="text-emerald-700 font-bold">${collected.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5 font-sans">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
              Presupuesto:
            </span>
            <span className="text-slate-700 font-medium">${expected.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[11px] font-sans">
            <span className="text-slate-500">Eficiencia de cobro:</span>
            <span className={`font-semibold ${collectionPct >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {collectionPct}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const CashflowChart: React.FC = () => {
  const historical = usePropertyStore((state) => state.historicalFinancials);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 tracking-tight">
                Recaudación vs Presupuesto Histórico
              </h3>
              <p className="text-[11px] text-slate-500">
                Últimos 6 meses · Comparativa de cobranza real frente al presupuesto base
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-sans">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-700 font-medium text-[11px]">Cobrado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 border border-slate-300" />
              <span className="text-slate-500 text-[11px]">Presupuesto</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-44 sm:h-48 xl:h-52 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historical} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="expected" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={22} name="Presupuesto" />
            <Bar dataKey="collected" fill="#10B981" radius={[4, 4, 0, 0]} barSize={22} name="Cobrado" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Período actual: Octubre 2026</span>
        </span>
        <span className="text-emerald-700 font-mono text-[11px] font-semibold">
          Promedio: 86.7% ocupación
        </span>
      </div>
    </div>
  );
};
