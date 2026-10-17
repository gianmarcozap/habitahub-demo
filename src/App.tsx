import { useEffect, useState } from 'react';
import { usePropertyStore } from './store/usePropertyStore';
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <div className="h-screen w-screen bg-slate-50 text-slate-800 flex overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* 1. Left Full-Height Sidebar (Desktop) */}
      <div className="hidden lg:block shrink-0 h-screen">
        <Sidebar />
      </div>

      {/* 2. Mobile Sidebar Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in duration-150">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 bg-white h-full shadow-2xl z-10">
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Right Area (Topbar + Main Content Viewport) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar: Spans only the right side on desktop, starting next to Sidebar */}
        <Topbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {isLoading ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="text-xs font-mono text-slate-500">Cargando inventario de Edificio Las Acacias...</p>
              </div>
            ) : (
              <>
                {activePage === 'dashboard' && <DashboardPage />}
                {activePage === 'units' && <UnitsPage />}
                {activePage === 'payments' && <PaymentsPage />}
                {activePage === 'maintenance' && <MaintenancePage />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <QuickSearchModal />
      <RecordPaymentModal />
      <NewTicketModal />
      <Toast />
    </div>
  );
}
