export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export type PaymentMethod = 'transfer' | 'yape_plin' | 'cash';

export interface PaymentTransaction {
  id: string;
  unitId: string;
  unitNumber: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  billingPeriod: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  referenceNumber?: string;
  status: PaymentStatus;
  daysOverdue: number;
}

export interface DelinquentUnitInfo {
  unitNumber: string;
  tenantName: string;
  daysOverdue: number;
  amountDue: number;
  severity: 'mild' | 'moderate' | 'critical';
}

export interface MonthlyFinancialSummary {
  expectedRevenue: number;
  collectedRevenue: number;
  delinquentRevenue: number;
  collectionRate: number;
  delinquencyRate: number;
  delinquentUnits: DelinquentUnitInfo[];
}

export interface RecordPaymentParams {
  unitId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
}
