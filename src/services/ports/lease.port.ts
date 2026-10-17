import { LeaseContract, Tenant, RenewalAlert } from '../../domain/lease';

export interface ILeasePort {
  getAllLeases(): Promise<LeaseContract[]>;
  getLeaseById(id: string): Promise<LeaseContract | undefined>;
  getLeaseByUnitId(unitId: string): Promise<LeaseContract | undefined>;
  getAllTenants(): Promise<Tenant[]>;
  getTenantById(id: string): Promise<Tenant | undefined>;
  getRenewalAlerts(): Promise<RenewalAlert[]>;
  extendLease(leaseId: string, additionalMonths: number): Promise<LeaseContract>;
}
