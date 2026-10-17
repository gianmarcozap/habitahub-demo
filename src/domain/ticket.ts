export type Priority = 'urgent' | 'medium' | 'low';

export type IncidentStatus = 'reported' | 'in_progress' | 'resolved';

export interface MaintenanceTicket {
  id: string;
  unitId: string;
  unitNumber: string;
  title: string;
  description: string;
  reporterName: string;
  priority: Priority;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  assignedTechnician?: string;
  estimatedCost?: number;
}

export interface CreateTicketParams {
  unitId: string;
  title: string;
  description: string;
  reporterName: string;
  priority: Priority;
}
