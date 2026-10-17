import { PaymentTransaction, MonthlyFinancialSummary, RecordPaymentParams } from '../../domain/payment';

export interface IPaymentPort {
  getAllPayments(): Promise<PaymentTransaction[]>;
  getPaymentById(id: string): Promise<PaymentTransaction | undefined>;
  recordPayment(params: RecordPaymentParams): Promise<PaymentTransaction>;
  getFinancialSummary(): Promise<MonthlyFinancialSummary>;
}
