import React from 'react';
import { Building2, DollarSign, AlertCircle, Wrench } from 'lucide-react';
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
  const collectionRate = financialSummary ? Math.round((collectedRev / expectedRev) * 100) : 90;

  const delinquentRev = financialSummary?.delinquentRevenue || 2200;
  const delinquencyRate = financialSummary?.delinquencyRate || 10;
  const delinquentCount = financialSummary?.delinquentUnits.length || 2;

  const openTickets = tickets.filter((t) => t.status !== 'resolved');
  const urgentTickets = openTickets.filter((t) => t.priority === 'urgent');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* 1. Occupancy Rate */}
      <StatCard
        title="Tasa de Ocupación"
        value={`${occupancyPercentage}%`}
        subValue={`${occupiedUnits} de ${totalUnits} unidades con contrato`}
        icon={<Building2 className="w-4 h-4 text-emerald-600" />}
        progress={{
          value: occupancyPercentage,
          colorClass: occupancyPercentage >= 80 ? 'bg-emerald-600' : 'bg-amber-600',
        }}
        badge={
          <Badge variant="emerald" size="sm">
            Meta 80%+
          </Badge>
        }
        onClick={() => setActivePage('units')}
      />

      {/* 2. Monthly Revenue */}
      <StatCard
        title="Ingresos Recaudados (MRR)"
        value={`$${collectedRev.toLocaleString()}`}
        subValue={`de $${expectedRev.toLocaleString()} presupuestados (${collectionRate}%)`}
        icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
        progress={{
          value: collectionRate,
          colorClass: 'bg-emerald-600',
        }}
        badge={
          <Badge variant="emerald" size="sm">
            {collectionRate}% Cobrado
          </Badge>
        }
        onClick={() => setActivePage('payments')}
      />

      {/* 3. Delinquency Rate */}
      <StatCard
        title="Cartera en Mora"
        value={`$${delinquentRev.toLocaleString()}`}
        subValue={`${delinquentCount} unidades con deuda >15 días (${delinquencyRate}%)`}
        icon={<AlertCircle className="w-4 h-4 text-rose-600" />}
        progress={{
          value: delinquencyRate * 4,
          colorClass: 'bg-rose-600',
        }}
        badge={
          <Badge variant="rose" size="sm" pulse={delinquentCount > 0}>
            {delinquentCount} En Mora
          </Badge>
        }
        onClick={() => openRecordPaymentModal('u-203')}
      />

      {/* 4. Active Incidents */}
      <StatCard
        title="Incidencias Operativas"
        value={`${openTickets.length} Abiertas`}
        subValue={urgentTickets.length > 0 ? `1 Urgente (Dpto 302 fuga de agua)` : `Sin incidencias críticas`}
        icon={<Wrench className="w-4 h-4 text-amber-600" />}
        progress={{
          value: (openTickets.length / 5) * 100,
          colorClass: urgentTickets.length > 0 ? 'bg-rose-600' : 'bg-amber-600',
        }}
        badge={
          urgentTickets.length > 0 ? (
            <Badge variant="rose" size="sm" pulse>
              1 Crítico
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
