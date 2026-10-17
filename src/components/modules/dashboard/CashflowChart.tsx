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
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs font-sans min-w-[200px]">
        <div className="text-slate-300 font-semibold border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-emerald-400 font-mono text-[11px]">{occupancy}% Ocupado</span>
        </div>
        <div className="space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Recaudado:
            </span>
            <span className="text-emerald-300 font-bold">${collected.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Esperado (MRR):
            </span>
            <span className="text-slate-300 font-medium">${expected.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
            <span className="text-slate-400">Eficiencia de cobro:</span>
            <span className={`font-bold ${collectionPct >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
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
    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Cobranza & Ocupación Histórica
              </h3>
              <p className="text-xs text-slate-400">
                Últimos 6 meses · Comparativa de recaudación efectiva vs MRR presupuestado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">Cobrado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
              <span className="text-slate-400">Esperado</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={historical} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="expected" fill="#334155" radius={[4, 4, 0, 0]} barSize={22} name="Esperado" />
            <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} barSize={22} name="Cobrado" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-mono text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Período actual: Octubre 2026</span>
        </span>
        <span className="text-emerald-400/90 font-mono text-[11px]">
          Promedio semestral: 86.7% ocupación
        </span>
      </div>
    </div>
  );
};
