import { create } from 'zustand';
import { Unit } from '../domain/unit';
import { LeaseContract, Tenant, RenewalAlert } from '../domain/lease';
import { PaymentTransaction, MonthlyFinancialSummary, RecordPaymentParams } from '../domain/payment';
import { MaintenanceTicket, IncidentStatus, CreateTicketParams } from '../domain/ticket';
import { mockAdapter } from '../services/mock';

export type NavigationPage = 'dashboard' | 'units' | 'payments' | 'maintenance';

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface PropertyState {
  // Navigation & Modals
  activePage: NavigationPage;
  selectedProperty: string;
  selectedUnitId: string | null;
  isRecordPaymentModalOpen: boolean;
  recordPaymentUnitId: string | null;
  isNewTicketModalOpen: boolean;
  newTicketUnitId: string | null;
  isQuickSearchOpen: boolean;
  toast: ToastNotification | null;

  // Domain Data
  units: Unit[];
  leases: LeaseContract[];
  tenants: Tenant[];
  payments: PaymentTransaction[];
  tickets: MaintenanceTicket[];
  renewalAlerts: RenewalAlert[];
  financialSummary: MonthlyFinancialSummary | null;
  historicalFinancials: Array<{ month: string; expected: number; collected: number; occupancy: number }>;

  // Loading States
  isLoading: boolean;
  isActionSubmitting: boolean;

  // Actions
  fetchInitialData: () => Promise<void>;
  resetDemo: () => Promise<void>;
  setActivePage: (page: NavigationPage) => void;
  setSelectedProperty: (property: string) => void;
  openUnitDetail: (unitId: string) => void;
  closeUnitDetail: () => void;
  openRecordPaymentModal: (unitId?: string) => void;
  closeRecordPaymentModal: () => void;
  openNewTicketModal: (unitId?: string) => void;
  closeNewTicketModal: () => void;
  setQuickSearchOpen: (open: boolean) => void;

  recordPayment: (params: RecordPaymentParams) => Promise<void>;
  extendLease: (leaseId: string, additionalMonths: number) => Promise<void>;
  createTicket: (params: CreateTicketParams) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: IncidentStatus) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: () => void;
}

let toastCounter = 0;

export const usePropertyStore = create<PropertyState>((set, get) => ({
  activePage: 'dashboard',
  selectedProperty: 'Edificio Residencial Las Acacias',
  selectedUnitId: null,
  isRecordPaymentModalOpen: false,
  recordPaymentUnitId: null,
  isNewTicketModalOpen: false,
  newTicketUnitId: null,
  isQuickSearchOpen: false,
  toast: null,

  units: [],
  leases: [],
  tenants: [],
  payments: [],
  tickets: [],
  renewalAlerts: [],
  financialSummary: null,
  historicalFinancials: [],

  isLoading: true,
  isActionSubmitting: false,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const [units, leases, tenants, payments, tickets, renewalAlerts, financialSummary, historicalFinancials] =
        await Promise.all([
          mockAdapter.getAllUnits(),
          mockAdapter.getAllLeases(),
          mockAdapter.getAllTenants(),
          mockAdapter.getAllPayments(),
          mockAdapter.getAllTickets(),
          mockAdapter.getRenewalAlerts(),
          mockAdapter.getFinancialSummary(),
          mockAdapter.getHistoricalFinancials(),
        ]);

      set({
        units,
        leases,
        tenants,
        payments,
        tickets,
        renewalAlerts,
        financialSummary,
        historicalFinancials,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to load initial property data:', err);
      set({ isLoading: false });
    }
  },

  resetDemo: async () => {
    set({ isActionSubmitting: true });
    mockAdapter.resetToSeed();
    await get().fetchInitialData();
    set({
      isActionSubmitting: false,
      selectedUnitId: null,
      isRecordPaymentModalOpen: false,
      isNewTicketModalOpen: false,
      isQuickSearchOpen: false,
    });
    get().showToast('Estado de la demo restablecido al seed inicial (20 unidades, Las Acacias)', 'info');
  },

  setActivePage: (page: NavigationPage) => set({ activePage: page }),
  setSelectedProperty: (property: string) => set({ selectedProperty: property }),

  openUnitDetail: (unitId: string) => set({ selectedUnitId: unitId }),
  closeUnitDetail: () => set({ selectedUnitId: null }),

  openRecordPaymentModal: (unitId?: string) =>
    set({ isRecordPaymentModalOpen: true, recordPaymentUnitId: unitId || null }),
  closeRecordPaymentModal: () =>
    set({ isRecordPaymentModalOpen: false, recordPaymentUnitId: null }),

  openNewTicketModal: (unitId?: string) =>
    set({ isNewTicketModalOpen: true, newTicketUnitId: unitId || null }),
  closeNewTicketModal: () =>
    set({ isNewTicketModalOpen: false, newTicketUnitId: null }),

  setQuickSearchOpen: (open: boolean) => set({ isQuickSearchOpen: open }),

  recordPayment: async (params: RecordPaymentParams) => {
    set({ isActionSubmitting: true });
    try {
      const payment = await mockAdapter.recordPayment(params);
      const [payments, financialSummary] = await Promise.all([
        mockAdapter.getAllPayments(),
        mockAdapter.getFinancialSummary(),
      ]);

      set({
        payments,
        financialSummary,
        isActionSubmitting: false,
        isRecordPaymentModalOpen: false,
        recordPaymentUnitId: null,
      });

      get().showToast(
        `Pago de $${params.amount.toLocaleString()} registrado para la Unidad ${payment.unitNumber} (${params.paymentMethod.toUpperCase()})`,
        'success'
      );
    } catch (err) {
      console.error('Error recording payment:', err);
      set({ isActionSubmitting: false });
      get().showToast('Error al registrar pago en base de datos PostgreSQL simulada', 'warning');
    }
  },

  extendLease: async (leaseId: string, additionalMonths: number) => {
    set({ isActionSubmitting: true });
    try {
      const updated = await mockAdapter.extendLease(leaseId, additionalMonths);
      const [leases, renewalAlerts] = await Promise.all([
        mockAdapter.getAllLeases(),
        mockAdapter.getRenewalAlerts(),
      ]);

      set({
        leases,
        renewalAlerts,
        isActionSubmitting: false,
      });

      get().showToast(
        `Contrato extendido con éxito por ${additionalMonths} meses (Nuevo vencimiento: ${updated.endDate})`,
        'success'
      );
    } catch (err) {
      console.error('Error extending lease:', err);
      set({ isActionSubmitting: false });
      get().showToast('Error al extender contrato', 'warning');
    }
  },

  createTicket: async (params: CreateTicketParams) => {
    set({ isActionSubmitting: true });
    try {
      const newTicket = await mockAdapter.createTicket(params);
      const [tickets, units] = await Promise.all([
        mockAdapter.getAllTickets(),
        mockAdapter.getAllUnits(),
      ]);

      set({
        tickets,
        units,
        isActionSubmitting: false,
        isNewTicketModalOpen: false,
        newTicketUnitId: null,
      });

      get().showToast(
        `Incidencia registrada: "${newTicket.title}" para Unidad ${newTicket.unitNumber}`,
        'success'
      );
    } catch (err) {
      console.error('Error creating ticket:', err);
      set({ isActionSubmitting: false });
      get().showToast('Error al crear ticket de incidencia', 'warning');
    }
  },

  updateTicketStatus: async (ticketId: string, status: IncidentStatus) => {
    set({ isActionSubmitting: true });
    try {
      const updated = await mockAdapter.updateTicketStatus(ticketId, status);
      const [tickets, units] = await Promise.all([
        mockAdapter.getAllTickets(),
        mockAdapter.getAllUnits(),
      ]);

      set({
        tickets,
        units,
        isActionSubmitting: false,
      });

      const label = status === 'in_progress' ? 'En Progreso' : status === 'resolved' ? 'Resuelto' : 'Reportado';
      get().showToast(`Ticket #${updated.id} movido a "${label}"`, 'info');
    } catch (err) {
      console.error('Error updating ticket status:', err);
      set({ isActionSubmitting: false });
      get().showToast('Error al actualizar estado del ticket', 'warning');
    }
  },

  showToast: (message: string, type = 'info') => {
    const id = ++toastCounter;
    set({ toast: { id, message, type } });
    setTimeout(() => {
      if (get().toast?.id === id) {
        set({ toast: null });
      }
    }, 4000);
  },

  dismissToast: () => set({ toast: null }),
}));
