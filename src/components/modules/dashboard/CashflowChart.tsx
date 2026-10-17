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
      <div className="bg-white border border-slate-200 shadow-md rounded-lg p-2.5 text-xs text-slate-800 font-sans min-w-[200px]">
        <div className="text-slate-900 font-semibold border-b border-slate-100 pb-1.5 mb-2 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-emerald-700 font-mono text-[11px] font-medium">{occupancy}% Ocupación</span>
        </div>
        <div className="space-y-1 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Recaudado:
            </span>
            <span className="text-emerald-700 font-bold">${collected.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              Presupuestado:
            </span>
            <span className="text-slate-700 font-medium">${expected.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] font-sans">
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
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Cobranza & Ocupación Histórica
              </h3>
              <p className="text-xs text-slate-500">
                Últimos 6 meses · Comparativa de recaudación efectiva vs MRR presupuestado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-sans">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-700 font-medium">Cobrado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" />
              <span className="text-slate-500">Presupuestado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historical} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="expected" fill="#CBD5E1" radius={[4, 4, 0, 0]} barSize={22} name="Presupuestado" />
            <Bar dataKey="collected" fill="#10B981" radius={[4, 4, 0, 0]} barSize={22} name="Cobrado" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Período actual: Octubre 2026</span>
        </span>
        <span className="text-emerald-700 font-mono text-[11px] font-medium">
          Promedio semestral: 86.7% ocupación
        </span>
      </div>
    </div>
  );
};
