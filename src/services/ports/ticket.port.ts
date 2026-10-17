import { MaintenanceTicket, IncidentStatus, CreateTicketParams } from '../../domain/ticket';

export interface ITicketPort {
  getAllTickets(): Promise<MaintenanceTicket[]>;
  getTicketById(id: string): Promise<MaintenanceTicket | undefined>;
  createTicket(params: CreateTicketParams): Promise<MaintenanceTicket>;
  updateTicketStatus(id: string, status: IncidentStatus): Promise<MaintenanceTicket>;
}
