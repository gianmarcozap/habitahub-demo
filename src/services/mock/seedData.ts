import { Unit } from '../../domain/unit';
import { LeaseContract, Tenant } from '../../domain/lease';
import { PaymentTransaction } from '../../domain/payment';
import { MaintenanceTicket } from '../../domain/ticket';

export const INITIAL_TENANTS: Tenant[] = [
  { id: 'tenant-101', fullName: 'Valeria Quintana', email: 'valeria.q@gmail.com', phone: '+51 987 654 321', nationalId: '72819203' },
  { id: 'tenant-102', fullName: 'Lucia Fernandez', email: 'lucia.f@gmail.com', phone: '+51 984 123 456', nationalId: '71092834' },
  { id: 'tenant-103', fullName: 'Mariana Vera', email: 'mariana.v@outlook.com', phone: '+51 976 543 210', nationalId: '70918273' },
  { id: 'tenant-201', fullName: 'Andres Soto', email: 'andres.soto@tech.pe', phone: '+51 991 234 567', nationalId: '74561289' },
  { id: 'tenant-202', fullName: 'Camila Benitez', email: 'cbenitez@empresa.com', phone: '+51 965 432 198', nationalId: '73928174' },
  { id: 'tenant-203', fullName: 'Carlos Mendoza', email: 'cmendoza@law.pe', phone: '+51 954 321 098', nationalId: '70123984' },
  { id: 'tenant-301', fullName: 'Rodrigo Paredes', email: 'rodrigo.paredes@finanzas.pe', phone: '+51 943 210 987', nationalId: '75128934' },
  { id: 'tenant-303', fullName: 'Gabriela Morales', email: 'gmorales@design.pe', phone: '+51 932 109 876', nationalId: '76891234' },
  { id: 'tenant-304', fullName: 'Fernando Castillo', email: 'fcastillo@gmail.com', phone: '+51 921 098 765', nationalId: '72349012' },
  { id: 'tenant-401', fullName: 'Diego Valdivia', email: 'diego.valdivia@startup.pe', phone: '+51 910 987 654', nationalId: '74123890' },
  { id: 'tenant-402', fullName: 'Sofia Arredondo', email: 'sofia.arredondo@estudio.pe', phone: '+51 909 876 543', nationalId: '71902834' },
  { id: 'tenant-403', fullName: 'Esteban Rios', email: 'erios@medicina.pe', phone: '+51 988 765 432', nationalId: '70234918' },
  { id: 'tenant-404', fullName: 'Patricia Naranjo', email: 'patricia.n@gmail.com', phone: '+51 977 654 321', nationalId: '73456789' },
  { id: 'tenant-501', fullName: 'Elena Ramos', email: 'elena.ramos@consultora.com', phone: '+51 966 543 210', nationalId: '75678901' },
  { id: 'tenant-502', fullName: 'Mateo Rossi', email: 'mateo.rossi@arquitectura.pe', phone: '+51 955 432 109', nationalId: '72345678' },
  { id: 'tenant-503', fullName: 'Claudia Guzman', email: 'cguzman@empresa.pe', phone: '+51 944 321 098', nationalId: '71234567' },
];

export const INITIAL_UNITS: Unit[] = [
  // Floor 1
  { id: 'u-101', unitNumber: '101', floor: 1, typology: '2B/1B', squareMeters: 68, status: 'occupied', monthlyRent: 1100, currentLeaseId: 'l-101', currentTenantId: 'tenant-101' },
  { id: 'u-102', unitNumber: '102', floor: 1, typology: '2B/1B', squareMeters: 65, status: 'occupied', monthlyRent: 1100, currentLeaseId: 'l-102', currentTenantId: 'tenant-102' },
  { id: 'u-103', unitNumber: '103', floor: 1, typology: '1B/1B', squareMeters: 48, status: 'occupied', monthlyRent: 900, currentLeaseId: 'l-103', currentTenantId: 'tenant-103' },
  { id: 'u-104', unitNumber: '104', floor: 1, typology: '1B/1B', squareMeters: 48, status: 'vacant', monthlyRent: 950, notes: 'Pintado reciente. Listo para entrega.' },
  // Floor 2
  { id: 'u-201', unitNumber: '201', floor: 2, typology: '2B/2B', squareMeters: 75, status: 'occupied', monthlyRent: 1200, currentLeaseId: 'l-201', currentTenantId: 'tenant-201' },
  { id: 'u-202', unitNumber: '202', floor: 2, typology: '2B/1B', squareMeters: 68, status: 'occupied', monthlyRent: 1100, currentLeaseId: 'l-202', currentTenantId: 'tenant-202' },
  { id: 'u-203', unitNumber: '203', floor: 2, typology: '2B/1B', squareMeters: 68, status: 'occupied', monthlyRent: 1100, currentLeaseId: 'l-203', currentTenantId: 'tenant-203', notes: 'Demora en pago recurrente. 18 días en mora.' },
  { id: 'u-204', unitNumber: '204', floor: 2, typology: '1B/1B', squareMeters: 50, status: 'vacant', monthlyRent: 950, notes: 'Listo para visitas agendadas.' },
  // Floor 3
  { id: 'u-301', unitNumber: '301', floor: 3, typology: '2B/2B', squareMeters: 78, status: 'occupied', monthlyRent: 1250, currentLeaseId: 'l-301', currentTenantId: 'tenant-301' },
  { id: 'u-302', unitNumber: '302', floor: 3, typology: '2B/1B', squareMeters: 70, status: 'maintenance', monthlyRent: 1100, notes: 'Fuga de tubería principal de agua. En reparación por gasfitero.' },
  { id: 'u-303', unitNumber: '303', floor: 3, typology: '2B/1B', squareMeters: 68, status: 'occupied', monthlyRent: 1100, currentLeaseId: 'l-303', currentTenantId: 'tenant-303' },
  { id: 'u-304', unitNumber: '304', floor: 3, typology: 'Studio', squareMeters: 38, status: 'occupied', monthlyRent: 850, currentLeaseId: 'l-304', currentTenantId: 'tenant-304' },
  // Floor 4
  { id: 'u-401', unitNumber: '401', floor: 4, typology: '2B/2B', squareMeters: 80, status: 'occupied', monthlyRent: 1300, currentLeaseId: 'l-401', currentTenantId: 'tenant-401', notes: 'Contrato vence en 12 días.' },
  { id: 'u-402', unitNumber: '402', floor: 4, typology: '2B/1B', squareMeters: 68, status: 'occupied', monthlyRent: 1100, currentLeaseId: 'l-402', currentTenantId: 'tenant-402', notes: '22 días en mora. Notificación formal enviada.' },
  { id: 'u-403', unitNumber: '403', floor: 4, typology: '2B/1B', squareMeters: 68, status: 'occupied', monthlyRent: 1100, currentLeaseId: 'l-403', currentTenantId: 'tenant-403' },
  { id: 'u-404', unitNumber: '404', floor: 4, typology: 'Studio', squareMeters: 38, status: 'occupied', monthlyRent: 850, currentLeaseId: 'l-404', currentTenantId: 'tenant-404' },
  // Floor 5
  { id: 'u-501', unitNumber: '501', floor: 5, typology: '3B/2B', squareMeters: 105, status: 'occupied', monthlyRent: 1700, currentLeaseId: 'l-501', currentTenantId: 'tenant-501' },
  { id: 'u-502', unitNumber: '502', floor: 5, typology: '2B/2B', squareMeters: 85, status: 'occupied', monthlyRent: 1400, currentLeaseId: 'l-502', currentTenantId: 'tenant-502', notes: 'Contrato vence en 26 días.' },
  { id: 'u-503', unitNumber: '503', floor: 5, typology: '2B/1B', squareMeters: 72, status: 'occupied', monthlyRent: 1150, currentLeaseId: 'l-503', currentTenantId: 'tenant-503' },
  { id: 'u-504', unitNumber: '504', floor: 5, typology: '2B/1B', squareMeters: 72, status: 'vacant', monthlyRent: 1200, notes: 'Piso alto con vista panorámica. Publicado en portal.' },
];

export const INITIAL_LEASES: LeaseContract[] = [
  { id: 'l-101', unitId: 'u-101', tenantId: 'tenant-101', startDate: '2026-01-01', endDate: '2026-12-31', monthlyRent: 1100, depositAmount: 2200, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-102', unitId: 'u-102', tenantId: 'tenant-102', startDate: '2025-11-05', endDate: '2026-11-05', monthlyRent: 1100, depositAmount: 2200, status: 'expiring_soon', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-103', unitId: 'u-103', tenantId: 'tenant-103', startDate: '2026-03-01', endDate: '2027-02-28', monthlyRent: 900, depositAmount: 1800, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-201', unitId: 'u-201', tenantId: 'tenant-201', startDate: '2026-02-01', endDate: '2027-01-31', monthlyRent: 1200, depositAmount: 2400, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-202', unitId: 'u-202', tenantId: 'tenant-202', startDate: '2026-04-01', endDate: '2027-03-31', monthlyRent: 1100, depositAmount: 2200, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-203', unitId: 'u-203', tenantId: 'tenant-203', startDate: '2025-09-01', endDate: '2026-08-31', monthlyRent: 1100, depositAmount: 2200, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-301', unitId: 'u-301', tenantId: 'tenant-301', startDate: '2026-01-15', endDate: '2027-01-14', monthlyRent: 1250, depositAmount: 2500, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-303', unitId: 'u-303', tenantId: 'tenant-303', startDate: '2026-02-15', endDate: '2027-02-14', monthlyRent: 1100, depositAmount: 2200, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-304', unitId: 'u-304', tenantId: 'tenant-304', startDate: '2026-05-01', endDate: '2027-04-30', monthlyRent: 850, depositAmount: 1700, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-401', unitId: 'u-401', tenantId: 'tenant-401', startDate: '2025-10-29', endDate: '2026-10-29', monthlyRent: 1300, depositAmount: 2600, status: 'expiring_soon', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-402', unitId: 'u-402', tenantId: 'tenant-402', startDate: '2025-12-01', endDate: '2026-11-30', monthlyRent: 1100, depositAmount: 2200, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-403', unitId: 'u-403', tenantId: 'tenant-403', startDate: '2026-03-15', endDate: '2027-03-14', monthlyRent: 1100, depositAmount: 2200, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-404', unitId: 'u-404', tenantId: 'tenant-404', startDate: '2026-06-01', endDate: '2027-05-31', monthlyRent: 850, depositAmount: 1700, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-501', unitId: 'u-501', tenantId: 'tenant-501', startDate: '2026-01-01', endDate: '2026-12-31', monthlyRent: 1700, depositAmount: 3400, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-502', unitId: 'u-502', tenantId: 'tenant-502', startDate: '2025-11-12', endDate: '2026-11-12', monthlyRent: 1400, depositAmount: 2800, status: 'expiring_soon', renewalNoticeDays: 30, termsAccepted: true },
  { id: 'l-503', unitId: 'u-503', tenantId: 'tenant-503', startDate: '2026-04-15', endDate: '2027-04-14', monthlyRent: 1150, depositAmount: 2300, status: 'active', renewalNoticeDays: 30, termsAccepted: true },
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  // 14 paid units = $16,200
  { id: 'pay-101', unitId: 'u-101', unitNumber: '101', tenantId: 'tenant-101', tenantName: 'Valeria Quintana', amount: 1100, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-04T10:15:00Z', paymentMethod: 'transfer', referenceNumber: 'BCP-TR-918234', status: 'paid', daysOverdue: 0 },
  { id: 'pay-102', unitId: 'u-102', unitNumber: '102', tenantId: 'tenant-102', tenantName: 'Lucia Fernandez', amount: 1100, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-05T14:20:00Z', paymentMethod: 'yape_plin', referenceNumber: 'YAPE-554129', status: 'paid', daysOverdue: 0 },
  { id: 'pay-103', unitId: 'u-103', unitNumber: '103', tenantId: 'tenant-103', tenantName: 'Mariana Vera', amount: 900, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-03T18:00:00Z', paymentMethod: 'transfer', referenceNumber: 'BBVA-990124', status: 'paid', daysOverdue: 0 },
  { id: 'pay-201', unitId: 'u-201', unitNumber: '201', tenantId: 'tenant-201', tenantName: 'Andres Soto', amount: 1200, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-05T09:30:00Z', paymentMethod: 'transfer', referenceNumber: 'INT-341902', status: 'paid', daysOverdue: 0 },
  { id: 'pay-202', unitId: 'u-202', unitNumber: '202', tenantId: 'tenant-202', tenantName: 'Camila Benitez', amount: 1100, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-04T11:45:00Z', paymentMethod: 'yape_plin', referenceNumber: 'PLIN-773419', status: 'paid', daysOverdue: 0 },
  // Delinquent Unit 203: $1,100, 18 days overdue
  { id: 'pay-203', unitId: 'u-203', unitNumber: '203', tenantId: 'tenant-203', tenantName: 'Carlos Mendoza', amount: 1100, billingPeriod: 'Octubre 2026', dueDate: '2026-10-01', status: 'overdue', daysOverdue: 18 },
  { id: 'pay-301', unitId: 'u-301', unitNumber: '301', tenantId: 'tenant-301', tenantName: 'Rodrigo Paredes', amount: 1250, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-02T16:10:00Z', paymentMethod: 'transfer', referenceNumber: 'BCP-TR-881249', status: 'paid', daysOverdue: 0 },
  { id: 'pay-303', unitId: 'u-303', unitNumber: '303', tenantId: 'tenant-303', tenantName: 'Gabriela Morales', amount: 1100, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-05T17:50:00Z', paymentMethod: 'cash', referenceNumber: 'REC-00349', status: 'paid', daysOverdue: 0 },
  { id: 'pay-304', unitId: 'u-304', unitNumber: '304', tenantId: 'tenant-304', tenantName: 'Fernando Castillo', amount: 850, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-05T12:00:00Z', paymentMethod: 'yape_plin', referenceNumber: 'YAPE-882310', status: 'paid', daysOverdue: 0 },
  { id: 'pay-401', unitId: 'u-401', unitNumber: '401', tenantId: 'tenant-401', tenantName: 'Diego Valdivia', amount: 1300, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-04T08:20:00Z', paymentMethod: 'transfer', referenceNumber: 'BCP-TR-441209', status: 'paid', daysOverdue: 0 },
  // Delinquent Unit 402: $1,100, 22 days overdue
  { id: 'pay-402', unitId: 'u-402', unitNumber: '402', tenantId: 'tenant-402', tenantName: 'Sofia Arredondo', amount: 1100, billingPeriod: 'Octubre 2026', dueDate: '2026-09-25', status: 'overdue', daysOverdue: 22 },
  { id: 'pay-403', unitId: 'u-403', unitNumber: '403', tenantId: 'tenant-403', tenantName: 'Esteban Rios', amount: 1100, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-05T15:30:00Z', paymentMethod: 'transfer', referenceNumber: 'BBVA-112948', status: 'paid', daysOverdue: 0 },
  { id: 'pay-404', unitId: 'u-404', unitNumber: '404', tenantId: 'tenant-404', tenantName: 'Patricia Naranjo', amount: 850, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-03T13:40:00Z', paymentMethod: 'cash', referenceNumber: 'REC-00350', status: 'paid', daysOverdue: 0 },
  { id: 'pay-501', unitId: 'u-501', unitNumber: '501', tenantId: 'tenant-501', tenantName: 'Elena Ramos', amount: 1700, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-01T10:00:00Z', paymentMethod: 'transfer', referenceNumber: 'BCP-TR-100234', status: 'paid', daysOverdue: 0 },
  { id: 'pay-502', unitId: 'u-502', unitNumber: '502', tenantId: 'tenant-502', tenantName: 'Mateo Rossi', amount: 1400, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-04T19:15:00Z', paymentMethod: 'transfer', referenceNumber: 'INT-774910', status: 'paid', daysOverdue: 0 },
  { id: 'pay-503', unitId: 'u-503', unitNumber: '503', tenantId: 'tenant-503', tenantName: 'Claudia Guzman', amount: 1150, billingPeriod: 'Octubre 2026', dueDate: '2026-10-05', paidAt: '2026-10-05T11:10:00Z', paymentMethod: 'yape_plin', referenceNumber: 'PLIN-332190', status: 'paid', daysOverdue: 0 },
];

export const INITIAL_TICKETS: MaintenanceTicket[] = [
  {
    id: 'ticket-001',
    unitId: 'u-302',
    unitNumber: '302',
    title: 'Fuga severa en tubería de agua fría',
    description: 'Rotura de codo en baño principal, filtrando hacia ducto vertical. Se cerró llave de paso general temporalmente.',
    reporterName: 'Conserje / Miguel Castro',
    priority: 'urgent',
    status: 'reported',
    createdAt: '2026-10-17T08:15:00Z',
    updatedAt: '2026-10-17T08:15:00Z',
    assignedTechnician: 'Gasfitería San Jorge EIRL',
    estimatedCost: 280,
  },
  {
    id: 'ticket-002',
    unitId: 'u-501',
    unitNumber: '501',
    title: 'Falla intermitente en sensor de ascensor piso 5',
    description: 'Puerta no cierra al primer intento en piso 5. Requiere calibración de fotocelda óptica.',
    reporterName: 'Elena Ramos (Inquilina)',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2026-10-16T14:30:00Z',
    updatedAt: '2026-10-16T16:00:00Z',
    assignedTechnician: 'Schindler Elevadores Perú',
    estimatedCost: 150,
  },
  {
    id: 'ticket-003',
    unitId: 'u-201',
    unitNumber: '201',
    title: 'Limpieza y cambio de filtros de aire acondicionado',
    description: 'Mantenimiento preventivo semestral de unidad split en dormitorio principal.',
    reporterName: 'Andres Soto (Inquilino)',
    priority: 'low',
    status: 'in_progress',
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-16T10:00:00Z',
    assignedTechnician: 'ClimaTech Servicios',
    estimatedCost: 90,
  },
  {
    id: 'ticket-004',
    unitId: 'u-103',
    unitNumber: '103',
    title: 'Revisión de citófono / intercomunicador',
    description: 'Buzzer de audio tenía estática al comunicarse con recepción. Cableado de par trenzado ajustado y operativo.',
    reporterName: 'Mariana Vera (Inquilina)',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-10-12T09:20:00Z',
    updatedAt: '2026-10-13T11:45:00Z',
    assignedTechnician: 'Comunicaciones & Seguridad',
    estimatedCost: 65,
  },
];

export const HISTORICAL_FINANCIALS = [
  { month: 'May 26', expected: 18000, collected: 17500, occupancy: 85 },
  { month: 'Jun 26', expected: 18000, collected: 17800, occupancy: 85 },
  { month: 'Jul 26', expected: 18400, collected: 18100, occupancy: 90 },
  { month: 'Aug 26', expected: 18400, collected: 17900, occupancy: 85 },
  { month: 'Sep 26', expected: 18400, collected: 18200, occupancy: 90 },
  { month: 'Oct 26', expected: 18400, collected: 16200, occupancy: 80 },
];
