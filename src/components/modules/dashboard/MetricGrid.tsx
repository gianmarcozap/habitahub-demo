import React from 'react';
import { Building2, DollarSign, AlertCircle, Wrench, TrendingUp } from 'lucide-react';
import { StatCard } from '../../common/StatCard';
import { Badge } from '../../common/Badge';
import { usePropertyStore } from '../../../store/usePropertyStore';

export const MetricGrid: React.FC = () => {
  const units = usePropertyStore((state) => state.units);
  const financialSummary = usePropertyStore((state) => state.financialSummary);
  const tickets = usePropertyStore((state) => state.tickets);
  const setActivePage = usePropertyStore((state) => state.setActivePage);
  const openRecordPaymentModal = usePropertyStore((state) => state.openRecordPaymentModal);

  const totalUnits = units.length || 20;
  const occupiedUnits = units.filter((u) => u.status === 'occupied').length;
  const occupancyPercentage = Math.round((occupiedUnits / totalUnits) * 100);

  const expectedRev = financialSummary?.expectedRevenue || 18400;
  const collectedRev = financialSummary?.collectedRevenue || 16200;
  const collectionRate = financialSummary ? Math.round((collectedRev / expectedRev) * 100) : 88;

  const delinquentRev = financialSummary?.delinquentRevenue || 2200;
  const delinquentCount = financialSummary?.delinquentUnits.length || 2;

  const openTickets = tickets.filter((t) => t.status !== 'resolved');
  const urgentTickets = openTickets.filter((t) => t.priority === 'urgent');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Tasa de Ocupación */}
      <StatCard
        title="Tasa de Ocupación"
        value={`${occupancyPercentage}%`}
        subValue={`${occupiedUnits} de ${totalUnits} unidades`}
        icon={<Building2 className="w-4 h-4 text-emerald-600" />}
        progress={{
          value: occupancyPercentage,
          colorClass: 'bg-emerald-600',
        }}
        badge={
          <Badge variant="emerald" size="sm">
            Meta 80%+
          </Badge>
        }
        onClick={() => setActivePage('units')}
      />

      {/* 2. Ingresos Recaudados (MRR) */}
      <StatCard
        title="Ingresos Recaudados (MRR)"
        value={`$${collectedRev.toLocaleString()}`}
        subValue={`${collectionRate}% de $${expectedRev.toLocaleString()} esperados`}
        icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        progress={{
          value: collectionRate,
          colorClass: 'bg-emerald-600',
        }}
        badge={
          <Badge variant="emerald" size="sm" className="gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>{collectionRate}% Cobrado</span>
          </Badge>
        }
        onClick={() => setActivePage('payments')}
      />

      {/* 3. Morosidad Acumulada */}
      <StatCard
        title="Morosidad Acumulada"
        value={`$${delinquentRev.toLocaleString()}`}
        subValue={`${delinquentCount} unidades con deuda >15 días`}
        icon={<AlertCircle className="w-4 h-4 text-rose-600" />}
        progress={{
          value: (delinquentRev / expectedRev) * 100 * 3,
          colorClass: 'bg-rose-600',
        }}
        badge={
          <Badge variant="rose" size="sm" pulse={delinquentCount > 0}>
            {delinquentCount} En Mora
          </Badge>
        }
        onClick={() => openRecordPaymentModal('u-203')}
      />

      {/* 4. Incidencias Activas */}
      <StatCard
        title="Incidencias Activas"
        value={`${openTickets.length} Abiertas`}
        subValue={urgentTickets.length > 0 ? `1 Urgente (Dpto 302)` : `Sin averías críticas`}
        icon={<Wrench className="w-4 h-4 text-amber-600" />}
        progress={{
          value: (openTickets.length / 5) * 100,
          colorClass: urgentTickets.length > 0 ? 'bg-rose-600' : 'bg-amber-600',
        }}
        badge={
          urgentTickets.length > 0 ? (
            <Badge variant="rose" size="sm" pulse>
              1 Urgente
            </Badge>
          ) : (
            <Badge variant="amber" size="sm">
              En Curso
            </Badge>
          )
        }
        onClick={() => setActivePage('maintenance')}
      />
    </div>
  );
};
