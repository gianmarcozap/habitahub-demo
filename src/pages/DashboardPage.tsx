import React from 'react';
import { MetricGrid } from '../components/modules/dashboard/MetricGrid';
import { CashflowChart } from '../components/modules/dashboard/CashflowChart';
import { UrgentActionFeed } from '../components/modules/dashboard/UrgentActionFeed';
import { Button } from '../components/common/Button';
import { Receipt, Wrench } from 'lucide-react';
import { usePropertyStore } from '../store/usePropertyStore';

export const DashboardPage: React.FC = () => {
  const selectedProperty = usePropertyStore((state) => state.selectedProperty);
  const openRecordPaymentModal = usePropertyStore((state) => state.openRecordPaymentModal);
  const openNewTicketModal = usePropertyStore((state) => state.openNewTicketModal);

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Panel Ejecutivo de Operaciones
            </h1>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
              En Tiempo Real
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {selectedProperty} · Ocupación, cobranzas y estado general de mantenimiento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Wrench className="w-3.5 h-3.5 text-slate-500" />}
            onClick={() => openNewTicketModal()}
          >
            Nueva Incidencia
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Receipt className="w-3.5 h-3.5 text-white" />}
            onClick={() => openRecordPaymentModal()}
          >
            Registrar Cobro
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <MetricGrid />

      {/* Interactive 65% / 35% Split Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="w-full lg:w-[65%]">
          <CashflowChart />
        </div>
        <div className="w-full lg:w-[35%]">
          <UrgentActionFeed />
        </div>
      </div>
    </div>
  );
};
