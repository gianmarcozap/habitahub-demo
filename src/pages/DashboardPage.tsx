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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Panel Ejecutivo de Operaciones
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
              En Tiempo Real
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {selectedProperty} · Ocupación, cobranzas y estado general de mantenimiento.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Interactive Charts & Urgent Actions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <CashflowChart />
        </div>
        <div className="lg:col-span-5">
          <UrgentActionFeed />
        </div>
      </div>
    </div>
  );
};
