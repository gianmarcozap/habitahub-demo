import React from 'react';
import { PaymentSummaryBanner } from '../components/modules/payments/PaymentSummaryBanner';
import { LedgerTable } from '../components/modules/payments/LedgerTable';
import { RecordPaymentModal } from '../components/modules/payments/RecordPaymentModal';
import { usePropertyStore } from '../store/usePropertyStore';

export const PaymentsPage: React.FC = () => {
  const payments = usePropertyStore((state) => state.payments);

  return (
    <div className="space-y-6">
      <PaymentSummaryBanner />
      <LedgerTable payments={payments} />
      <RecordPaymentModal />
    </div>
  );
};
