import { IUnitPort, ILeasePort, IPaymentPort, ITicketPort } from '../ports';
import { Unit, UnitStatus } from '../../domain/unit';
import { LeaseContract, Tenant, RenewalAlert } from '../../domain/lease';
import { PaymentTransaction, MonthlyFinancialSummary, RecordPaymentParams } from '../../domain/payment';
import { MaintenanceTicket, IncidentStatus, CreateTicketParams } from '../../domain/ticket';
import {
  INITIAL_UNITS,
  INITIAL_LEASES,
  INITIAL_TENANTS,
  INITIAL_PAYMENTS,
  INITIAL_TICKETS,
  HISTORICAL_FINANCIALS,
} from './seedData';

// Artificial latency helper to simulate real-world Go + PostgreSQL REST roundtrip
const simulateLatency = <T>(data: T, delayMs = 150): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delayMs));
};

export class InMemoryMockAdapter implements IUnitPort, ILeasePort, IPaymentPort, ITicketPort {
  private units: Unit[] = [];
  private leases: LeaseContract[] = [];
  private tenants: Tenant[] = [];
  private payments: PaymentTransaction[] = [];
  private tickets: MaintenanceTicket[] = [];

  constructor() {
    this.resetToSeed();
  }

  public resetToSeed(): void {
    this.units = structuredClone(INITIAL_UNITS);
    this.leases = structuredClone(INITIAL_LEASES);
    this.tenants = structuredClone(INITIAL_TENANTS);
    this.payments = structuredClone(INITIAL_PAYMENTS);
    this.tickets = structuredClone(INITIAL_TICKETS);
  }

  // --- IUnitPort ---
  async getAllUnits(): Promise<Unit[]> {
    return simulateLatency(this.units);
  }

  async getUnitById(id: string): Promise<Unit | undefined> {
    const unit = this.units.find((u) => u.id === id);
    return simulateLatency(unit);
  }

  async updateUnitStatus(id: string, status: UnitStatus): Promise<Unit> {
    const unitIndex = this.units.findIndex((u) => u.id === id);
    if (unitIndex === -1) {
      throw new Error(`Unit with id ${id} not found`);
    }
    this.units[unitIndex] = {
      ...this.units[unitIndex],
      status,
    };
    return simulateLatency(this.units[unitIndex]);
  }

  // --- ILeasePort ---
  async getAllLeases(): Promise<LeaseContract[]> {
    return simulateLatency(this.leases);
  }

  async getLeaseById(id: string): Promise<LeaseContract | undefined> {
    const lease = this.leases.find((l) => l.id === id);
    return simulateLatency(lease);
  }

  async getLeaseByUnitId(unitId: string): Promise<LeaseContract | undefined> {
    const lease = this.leases.find((l) => l.unitId === unitId);
    return simulateLatency(lease);
  }

  async getAllTenants(): Promise<Tenant[]> {
    return simulateLatency(this.tenants);
  }

  async getTenantById(id: string): Promise<Tenant | undefined> {
    const tenant = this.tenants.find((t) => t.id === id);
    return simulateLatency(tenant);
  }

  async getRenewalAlerts(): Promise<RenewalAlert[]> {
    const alerts: RenewalAlert[] = [];
    const now = new Date('2026-10-17');

    for (const lease of this.leases) {
      if (lease.status === 'expiring_soon' || lease.status === 'active') {
        const end = new Date(lease.endDate);
        const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 30) {
          const unit = this.units.find((u) => u.id === lease.unitId);
          const tenant = this.tenants.find((t) => t.id === lease.tenantId);
          alerts.push({
            leaseId: lease.id,
            unitId: lease.unitId,
            unitNumber: unit ? unit.unitNumber : 'N/A',
            tenantName: tenant ? tenant.fullName : 'Inquilino',
            daysRemaining: diffDays,
            endDate: lease.endDate,
            actionRequired: diffDays <= 14 ? 'offer_extension' : 'contact_tenant',
          });
        }
      }
    }

    return simulateLatency(alerts.sort((a, b) => a.daysRemaining - b.daysRemaining));
  }

  async extendLease(leaseId: string, additionalMonths: number): Promise<LeaseContract> {
    const index = this.leases.findIndex((l) => l.id === leaseId);
    if (index === -1) {
      throw new Error(`Lease with id ${leaseId} not found`);
    }
    const current = this.leases[index];
    const currentEnd = new Date(current.endDate);
    currentEnd.setMonth(currentEnd.getMonth() + additionalMonths);
    const newEndStr = currentEnd.toISOString().split('T')[0];

    this.leases[index] = {
      ...current,
      endDate: newEndStr,
      status: 'active',
    };
    return simulateLatency(this.leases[index]);
  }

  // --- IPaymentPort ---
  async getAllPayments(): Promise<PaymentTransaction[]> {
    return simulateLatency(this.payments);
  }

  async getPaymentById(id: string): Promise<PaymentTransaction | undefined> {
    const payment = this.payments.find((p) => p.id === id);
    return simulateLatency(payment);
  }

  async recordPayment(params: RecordPaymentParams): Promise<PaymentTransaction> {
    const unit = this.units.find((u) => u.id === params.unitId);
    if (!unit) {
      throw new Error(`Unit ${params.unitId} not found`);
    }
    const tenant = this.tenants.find((t) => t.id === unit.currentTenantId);

    // Look for an existing pending/overdue payment for this unit
    const existingIndex = this.payments.findIndex(
      (p) => p.unitId === params.unitId && (p.status === 'overdue' || p.status === 'pending')
    );

    const nowIso = new Date().toISOString();
    let recorded: PaymentTransaction;

    if (existingIndex !== -1) {
      recorded = {
        ...this.payments[existingIndex],
        amount: params.amount,
        status: 'paid',
        paidAt: nowIso,
        paymentMethod: params.paymentMethod,
        referenceNumber: params.referenceNumber,
        daysOverdue: 0,
      };
      this.payments[existingIndex] = recorded;
    } else {
      recorded = {
        id: `pay-${Date.now()}`,
        unitId: unit.id,
        unitNumber: unit.unitNumber,
        tenantId: tenant ? tenant.id : 'unknown',
        tenantName: tenant ? tenant.fullName : 'Inquilino',
        amount: params.amount,
        billingPeriod: 'Octubre 2026',
        dueDate: '2026-10-05',
        paidAt: nowIso,
        paymentMethod: params.paymentMethod,
        referenceNumber: params.referenceNumber,
        status: 'paid',
        daysOverdue: 0,
      };
      this.payments.unshift(recorded);
    }

    return simulateLatency(recorded);
  }

  async getFinancialSummary(): Promise<MonthlyFinancialSummary> {
    const expectedRevenue = 18400;
    const paidSum = this.payments
      .filter((p) => p.status === 'paid')
      .reduce((acc, p) => acc + p.amount, 0);

    const delinquentPayments = this.payments.filter((p) => p.status === 'overdue');
    const delinquentRevenue = delinquentPayments.reduce((acc, p) => acc + p.amount, 0);
    const collectionRate = Math.round((paidSum / expectedRevenue) * 100);
    const delinquencyRate = Math.round((delinquentRevenue / expectedRevenue) * 100);

    const delinquentUnits = delinquentPayments.map((p) => ({
      unitNumber: p.unitNumber,
      tenantName: p.tenantName,
      daysOverdue: p.daysOverdue,
      amountDue: p.amount,
      severity: (p.daysOverdue > 20 ? 'critical' : p.daysOverdue > 10 ? 'moderate' : 'mild') as 'critical' | 'moderate' | 'mild',
    }));

    return simulateLatency({
      expectedRevenue,
      collectedRevenue: paidSum,
      delinquentRevenue,
      collectionRate,
      delinquencyRate,
      delinquentUnits,
    });
  }

  // --- ITicketPort ---
  async getAllTickets(): Promise<MaintenanceTicket[]> {
    return simulateLatency(this.tickets);
  }

  async getTicketById(id: string): Promise<MaintenanceTicket | undefined> {
    const ticket = this.tickets.find((t) => t.id === id);
    return simulateLatency(ticket);
  }

  async createTicket(params: CreateTicketParams): Promise<MaintenanceTicket> {
    const unit = this.units.find((u) => u.id === params.unitId);
    const nowIso = new Date().toISOString();
    const newTicket: MaintenanceTicket = {
      id: `ticket-${String(this.tickets.length + 1).padStart(3, '0')}`,
      unitId: params.unitId,
      unitNumber: unit ? unit.unitNumber : 'Common Area',
      title: params.title,
      description: params.description,
      reporterName: params.reporterName,
      priority: params.priority,
      status: 'reported',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    // If urgent, update unit status to maintenance if applicable
    if (params.priority === 'urgent' && unit) {
      const uIndex = this.units.findIndex((u) => u.id === unit.id);
      if (uIndex !== -1) {
        this.units[uIndex] = { ...this.units[uIndex], status: 'maintenance' };
      }
    }

    this.tickets.unshift(newTicket);
    return simulateLatency(newTicket);
  }

  async updateTicketStatus(id: string, status: IncidentStatus): Promise<MaintenanceTicket> {
    const index = this.tickets.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Ticket with id ${id} not found`);
    }
    this.tickets[index] = {
      ...this.tickets[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    // If resolved and it was unit 302, restore unit status
    if (status === 'resolved' && this.tickets[index].unitNumber === '302') {
      const uIndex = this.units.findIndex((u) => u.unitNumber === '302');
      if (uIndex !== -1) {
        this.units[uIndex] = { ...this.units[uIndex], status: 'occupied' };
      }
    }

    return simulateLatency(this.tickets[index]);
  }

  getHistoricalFinancials() {
    return simulateLatency(HISTORICAL_FINANCIALS);
  }
}

// Singleton adapter instance
export const mockAdapter = new InMemoryMockAdapter();
