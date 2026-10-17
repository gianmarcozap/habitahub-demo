import React, { useState, useMemo } from 'react';
import { UnitCard } from '../components/modules/units/UnitCard';
import { UnitTable } from '../components/modules/units/UnitTable';
import { UnitDetailDrawer } from '../components/modules/units/UnitDetailDrawer';
import { UnitStatus } from '../domain/unit';
import { usePropertyStore } from '../store/usePropertyStore';
import { LayoutGrid, List, Search } from 'lucide-react';

export const UnitsPage: React.FC = () => {
  const units = usePropertyStore((state) => state.units);
  const tenants = usePropertyStore((state) => state.tenants);
  const leases = usePropertyStore((state) => state.leases);
  const openUnitDetail = usePropertyStore((state) => state.openUnitDetail);

  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<UnitStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchFilter, setSearchFilter] = useState('');

  // Counts
  const occupiedCount = units.filter((u) => u.status === 'occupied').length;
  const vacantCount = units.filter((u) => u.status === 'vacant').length;
  const maintenanceCount = units.filter((u) => u.status === 'maintenance').length;

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      // Floor filter
      if (selectedFloor !== 'all' && unit.floor !== selectedFloor) return false;
      // Status filter
      if (selectedStatus !== 'all' && unit.status !== selectedStatus) return false;
      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const tenant = tenants.find((t) => t.id === unit.currentTenantId);
        const matchesUnit = unit.unitNumber.includes(q) || unit.typology.toLowerCase().includes(q);
        const matchesTenant = tenant?.fullName.toLowerCase().includes(q);
        if (!matchesUnit && !matchesTenant) return false;
      }
      return true;
    });
  }, [units, tenants, selectedFloor, selectedStatus, searchFilter]);

  const getTenant = (tenantId?: string) => tenants.find((t) => t.id === tenantId);
  const getLease = (leaseId?: string) => leases.find((l) => l.id === leaseId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Inventario de Unidades & Contratos</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono border border-slate-700/60">
              20 Unidades
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de departamentos, arrendatarios vigentes y contratos del edificio.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vista en Cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden md:inline">Cuadrícula</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
              viewMode === 'table'
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vista en Tabla"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Tabla</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Floor Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-[11px] font-mono text-slate-500 mr-2 uppercase tracking-wider shrink-0">
            Nivel:
          </span>
          {(['all', 1, 2, 3, 4, 5] as const).map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                selectedFloor === floor
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {floor === 'all' ? 'Todos los Pisos' : `Piso ${floor}`}
            </button>
          ))}
        </div>

        {/* Status Filters & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-slate-800 text-slate-100 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos ({units.length})
            </button>
            <button
              onClick={() => setSelectedStatus('occupied')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'occupied'
                  ? 'bg-emerald-950 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Ocupados ({occupiedCount})
            </button>
            <button
              onClick={() => setSelectedStatus('vacant')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'vacant'
                  ? 'bg-blue-950 text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-blue-400'
              }`}
            >
              Disponibles ({vacantCount})
            </button>
            <button
              onClick={() => setSelectedStatus('maintenance')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedStatus === 'maintenance'
                  ? 'bg-rose-950 text-rose-400 font-semibold'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Mantenimiento ({maintenanceCount})
            </button>
          </div>

          {/* Quick Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrar por N° o inquilino..."
              className="h-8 pl-8 pr-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 w-44"
            />
          </div>
        </div>
      </div>

      {/* Data View: Grid or Table */}
      {filteredUnits.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredUnits.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                tenant={getTenant(unit.currentTenantId)}
                lease={getLease(unit.currentLeaseId)}
                onClick={() => openUnitDetail(unit.id)}
              />
            ))}
          </div>
        ) : (
          <UnitTable
            units={filteredUnits}
            tenants={tenants}
            leases={leases}
            onSelectUnit={openUnitDetail}
          />
        )
      ) : (
        <div className="p-12 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 space-y-2">
          <p className="font-semibold text-slate-200">No se encontraron unidades con los filtros seleccionados</p>
          <p className="text-xs text-slate-500">Prueba cambiando el piso seleccionado o limpiando la búsqueda.</p>
        </div>
      )}

      {/* Unit Detail Drawer Side Sheet */}
      <UnitDetailDrawer />
    </div>
  );
};
