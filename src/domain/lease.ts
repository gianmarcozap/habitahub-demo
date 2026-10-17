export interface Tenant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export type LeaseStatus = 'active' | 'expiring_soon' | 'expired' | 'terminated';

export interface LeaseContract {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount: number;
  status: LeaseStatus;
  documentUrl?: string;
  renewalNoticeDays: number;
  termsAccepted: boolean;
}

export interface RenewalAlert {
  leaseId: string;
  unitId: string;
  unitNumber: string;
  tenantName: string;
  daysRemaining: number;
  endDate: string;
  actionRequired: 'contact_tenant' | 'offer_extension' | 'prepare_listing';
}
