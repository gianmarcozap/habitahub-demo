export type UnitStatus = 'occupied' | 'vacant' | 'maintenance';

export type Typology = '1B/1B' | '2B/1B' | '2B/2B' | '3B/2B' | 'Studio';

export interface Unit {
  id: string;
  unitNumber: string;
  floor: number;
  typology: Typology;
  squareMeters: number;
  status: UnitStatus;
  monthlyRent: number;
  currentLeaseId?: string;
  currentTenantId?: string;
  notes?: string;
}
