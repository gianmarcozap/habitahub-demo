import { useEffect } from 'react';
import { usePropertyStore } from './store/usePropertyStore';
import { DemoBanner } from './components/layout/DemoBanner';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { QuickSearchModal } from './components/layout/QuickSearchModal';
import { Toast } from './components/common/Toast';
import { RecordPaymentModal } from './components/modules/payments/RecordPaymentModal';
import { NewTicketModal } from './components/modules/maintenance/NewTicketModal';

import { DashboardPage } from './pages/DashboardPage';
import { UnitsPage } from './pages/UnitsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { Loader2 } from 'lucide-react';

export default function App() {
  const activePage = usePropertyStore((state) => state.activePage);
  const isLoading = usePropertyStore((state) => state.isLoading);
  const fetchInitialData = usePropertyStore((state) => state.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. Fixed Demo Banner */}
      <DemoBanner />

      {/* 2. Main App Shell */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Topbar */}
          <Topbar />

          {/* Page Body */}
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {isLoading ? (
              <div className="min-h-[500px] flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-xs font-mono">Cargando datos del edificio (Las Acacias, 20 unidades)...</p>
              </div>
            ) : (
              <>
                {activePage === 'dashboard' && <DashboardPage />}
                {activePage === 'units' && <UnitsPage />}
                {activePage === 'payments' && <PaymentsPage />}
                {activePage === 'maintenance' && <MaintenancePage />}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Global Portals & Overlays */}
      <QuickSearchModal />
      <RecordPaymentModal />
      <NewTicketModal />
      <Toast />
    </div>
  );
}
