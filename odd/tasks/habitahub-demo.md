# HabitaHub Pro - Production-grade Portfolio Demo
PropTech Property Management System (PMS) interactive client-side demo with Hexagonal Architecture.

## Specs
- **S1**: "Zero Placeholder Policy: Never use 'Lorem Ipsum', 'TODO', or stubbed mock clicks. Every button, filter, and modal must have functional state transitions."
- **S2**: "Hexagonal Architecture in Frontend: Decouple UI components from data fetching. UI calls useCases -> useCases call ports (interfaces) -> ports are implemented by InMemoryMockAdapter."
- **S3**: "Domain Modeling: Enforce strict TypeScript types for Unit, Tenant, LeaseContract, PaymentTransaction, and MaintenanceTicket. No any."
- **S4**: "Design Benchmark: Linear / Stripe dashboard aesthetic. Subtle borders (border-slate-800), dark or crisp modern light palette, clear visual hierarchy, Lucide icons, micro-animations, and consistent status chip colors (Emerald = Paid/Active, Amber = Expiring/Pending, Rose = Delinquent/Urgent)."
- **S5**: "Session Lifecycle: State must be reactive in memory (Zustand or React Context) and fully reset to the initial seed on page reload or via a dedicated 'Reset Demo' action."
- **S6**: "Provide realistic seed data for 'Edificio Residencial Las Acacias' (5 floors, 20 units total): Units (20): 16 Occupied (active leases), 3 Vacant (ready to lease), 1 In Maintenance (Unit 302 - Plumbing repair). Financials & Leases: Currency: USD ($). 2 tenants currently in Delinquent status (overdue by >15 days). 3 leases with Expiring Soon alerts (<30 days remaining). On-time collection rate: 90%. Maintenance Tickets: 4 total tickets: 1 Urgent (Water pipe leak, Unit 302), 2 In Progress, 1 Resolved."
- **S7**: "Top Navigation & Demo Status Bar: Fixed top ribbon: Badge 'Demo Mode: Standalone In-Memory Sandbox' + quick action button: ↺ Reset Demo Data. Clean header showing property selector (Edificio Las Acacias ▾) and quick search bar (Cmd + K visual style)."
- **S8**: "Screen: Executive Dashboard (/): Metric Cards (KPIs): Occupancy Rate: 80% (16/20 units) with progress bar. Monthly Expected Revenue: $18,400 vs Collected: $16,200 (90% collected). Delinquency Rate: 10% ($2,200 in arrears, highlighting 2 delinquent units in Rose). Active Incidents: 3 Open (1 Urgent in pulsing red badge). Interactive Widgets: Occupancy & Revenue Chart: Recharts bar/line chart showing collection over the past 6 months. Urgent Actions Feed: List of actionable items (e.g., 'Unit 401 lease expires in 12 days', 'Unit 203 payment 18 days overdue'). Clicking any action opens its respective drawer/modal."
- **S9**: "Screen: Units & Leases (/units): Controls: Floor tabs (All, Floor 1, Floor 2, Floor 3, Floor 4, Floor 5) and Status filter (All, Occupied, Vacant, Maintenance). Data View: Toggleable between Grid cards and Table view. Unit Detail Drawer (Side Sheet): Opens on unit click without leaving the page. Displays tenant contact info, lease start/end dates, monthly rate, and a simulated PDF download button for the contract. Quick action inside drawer: 'Extend Lease' or 'Log Incident'."
- **S10**: "Screen: Financials & Delinquency Ledger (/payments): Summary Banner: Overdue vs Collected metrics. Ledger Table: Date, Unit, Tenant, Amount, Due Date, Payment Status (Paid, Pending, Overdue), and Actions. Action 'Record Payment' Modal: Select Unit, Amount, Payment Method (Transfer, Yape/Plin, Cash), and Reference Number. Submitting simulates an idempotent write to PostgreSQL with a 150ms delay, updates the unit status to Paid, updates MRR on the dashboard, and shows a success toast."
- **S11**: "Screen: Maintenance & Incidents (/maintenance): Kanban Board Layout: 3 Columns (Reported / Backlog, In Progress, Resolved). Ticket Card: Title, Unit tag (e.g., Unit 302), Reporter name, Priority tag (Urgent, Medium, Low), and Created timestamp. Interactive Features: Drag-and-drop or single-click status progression button (Move to In Progress -> Resolve). Button '+ New Ticket' opening a modal to submit an incident associated with any unit."

## Tasks
- [x] T1: Project scaffolding (Vite + React 19 + TypeScript + Tailwind CSS + Lucide Icons + Recharts + Zustand) | S1, S4 | inline | done
- [x] T2: Domain modeling & Hexagonal architecture ports (Unit, Tenant, LeaseContract, PaymentTransaction, MaintenanceTicket, Ports) | S2, S3 | inline | done
- [x] T3: In-memory mock adapter, realistic Las Acacias seed data & latency simulation (150ms) | S2, S5, S6 | inline | done
- [x] T4: Zustand store with reactive state, actions, and atomic 'Reset Demo' lifecycle | S2, S5 | inline | done
- [x] T5: Top navigation, property selector, quick search (Cmd+K modal), and Demo status bar ribbon | S4, S7 | inline | done
- [x] T6: Executive Dashboard view (KPI cards, Recharts 6-month cashflow/occupancy chart, Urgent Actions Feed with modal/drawer deep-links) | S4, S8 | inline | done
- [x] T7: Units & Leases view (Floor filters 1-5, status filters, Grid/Table view toggle, Unit Detail Drawer with PDF simulated download and actions) | S4, S9 | inline | done
- [x] T8: Financials & Delinquency Ledger view (Summary banner, Ledger table, Record Payment modal with 150ms delay and live MRR/occupancy reactivity) | S4, S10 | inline | done
- [x] T9: Maintenance & Incidents view (Kanban 3-column board, ticket priority chips, status progression, New Ticket modal) | S4, S11 | inline | done
- [/] T10: Final polish, responsive testing, TypeScript typecheck, production build verification | S1, S4 | inline | in_progress

## Log
- L1: User provided Master Prompt for HabitaHub Pro production-grade interactive portfolio demo with Hexagonal architecture, Linear/Stripe design benchmark, 20-unit Las Acacias seed, Dashboard, Units, Payments, and Maintenance Kanban.
