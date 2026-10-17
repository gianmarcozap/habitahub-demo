# HabitaHub Pro — PropTech & Property Management System (PMS)

Interactive client-side portfolio demo built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Zustand**, strictly following **Hexagonal Architecture (Ports & Adapters)**.

Originally designed with a **Go + PostgreSQL** backend, this standalone client demo showcases deep domain expertise in rental management, contract lifecycles, delinquency tracking, and incident management with an in-memory mock service layer simulating real-world REST latency (~150ms).

---

## 🏛️ Hexagonal Architecture (Frontend)

```
src/
├── domain/                  # Pure TypeScript domain models (No UI / No framework dependencies)
│   ├── unit.ts              # Unit entity, Floor, Typology & UnitStatus
│   ├── lease.ts             # LeaseContract, Tenant, RenewalAlert & LeaseStatus
│   ├── payment.ts           # PaymentTransaction, PaymentMethod & DelinquencySummary
│   └── ticket.ts            # MaintenanceTicket, Priority & IncidentStatus
├── services/
│   ├── ports/               # Repository interfaces (decopuling UI from persistence)
│   │   ├── unit.port.ts     # IUnitPort
│   │   ├── lease.port.ts    # ILeasePort
│   │   ├── payment.port.ts  # IPaymentPort
│   │   └── ticket.port.ts   # ITicketPort
│   └── mock/                # In-memory adapter + seed data + latency simulation
│       ├── seedData.ts      # Authentic seed for "Edificio Residencial Las Acacias"
│       └── inMemoryAdapter.ts # Simulates Go REST API endpoints with ~150ms delay
├── store/                   # Reactive state management with Zustand
│   └── usePropertyStore.ts  # Orchestrates actions, modals, and atomic 'Reset Demo'
├── components/
│   ├── common/              # Reusable UI primitives (Button, Badge, Modal, Drawer, StatCard, Toast)
│   ├── layout/              # DemoBanner, Topbar, Sidebar, QuickSearchModal (Cmd+K)
│   └── modules/
│       ├── dashboard/       # MetricGrid, CashflowChart (Recharts), UrgentActionFeed
│       ├── units/           # UnitCard, UnitTable, UnitDetailDrawer
│       ├── payments/        # PaymentSummaryBanner, LedgerTable, RecordPaymentModal
│       └── maintenance/     # KanbanBoard (3 columns), TicketCard, NewTicketModal
└── pages/                   # DashboardPage, UnitsPage, PaymentsPage, MaintenancePage
```

---

## 🏢 Grounded Seed Data: "Edificio Residencial Las Acacias"

Located in **San Isidro, Lima, Perú** (5 floors, 20 units total):
1. **Unidades (20):**
   - **16 Ocupadas:** Contratos vigentes de arrendamiento.
   - **3 Disponibles:** Listas para entrega y arriendo (Dptos 104, 204 y 504).
   - **1 En Mantenimiento:** Dpto 302 (Fuga de tubería vertical en reparación).
2. **Finanzas & Cobranzas:**
   - **Ingresos Mensuales Esperados (MRR):** $18,400 USD.
   - **Ingresos Cobrados Efectivos:** $16,200 USD (90% de recaudación en fecha).
   - **Cartera Morosa:** $2,200 USD (10% morosidad, Dpto 203 y Dpto 402 con más de 15 días de retraso).
   - **Alertas de Renovación:** 3 contratos con vencimiento menor a 30 días (Dptos 401, 102 y 502).
3. **Mantenimiento & Incidencias:**
   - **4 Tickets:** 1 Urgente (Fuga de tubería en Dpto 302), 2 En Progreso, 1 Resuelto.

---

## ⚡ Zero Placeholder Policy

Cada botón, modal, filtro y acción cuenta con transiciones de estado funcionales en memoria:
- **`↺ Reset Demo Data`:** Restaura atómicamente el estado del edificio al seed inicial.
- **`Cmd + K` / `Ctrl + K`:** Buscador rápido omnibox para saltar a cualquier departamento, inquilino o acción.
- **Cobro de Arriendo:** Registra el pago con método (`Transferencia`, `Yape/Plin`, `Efectivo`), actualiza el MRR del dashboard y remueve la unidad del estado de mora en tiempo real.
- **Ficha de Unidad (Side Sheet Drawer):** Muestra el inquilino, vigencia de contrato, botón de descarga de contrato en PDF simulado y acción de extensión de contrato (+6 o +12 meses).
- **Tablero Kanban de Mantenimiento:** Progresión de tickets con un clic (`Reportado` → `En Atención` → `Resuelto`).

---

## 🚀 Puesta en Marcha

### Prerrequisitos
- Node.js v18+ o [Bun](https://bun.sh) v1.0+

### Instalación y Ejecución
```bash
# Instalar dependencias
bun install # o npm install

# Iniciar servidor de desarrollo en http://localhost:3000
bun run dev # o npm run dev

# Compilar para producción
bun run build # o npm run build
```
