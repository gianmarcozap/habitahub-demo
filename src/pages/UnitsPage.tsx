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
      if (selectedFloor !== 'all' && unit.floor !== selectedFloor) return false;
      if (selectedStatus !== 'all' && unit.status !== selectedStatus) return false;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Inventario de Unidades & Contratos</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200 font-mono">
              20 Unidades
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión de departamentos, arrendatarios y contratos de arriendo en Edificio Las Acacias.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white border border-slate-200 shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Vista en Cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden md:inline">Cuadrícula</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-[11px] font-mono font-semibold text-slate-400 mr-1 uppercase tracking-wider shrink-0">
            Piso:
          </span>
          {(['all', 1, 2, 3, 4, 5] as const).map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedFloor === floor
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {floor === 'all' ? 'Todos los Pisos' : `Piso ${floor}`}
            </button>
          ))}
        </div>

        {/* Status Filters & Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedStatus === 'all'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({units.length})
            </button>
            <button
              onClick={() => setSelectedStatus('occupied')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedStatus === 'occupied'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Ocupados ({occupiedCount})
            </button>
            <button
              onClick={() => setSelectedStatus('vacant')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedStatus === 'vacant'
                  ? 'bg-blue-50 text-blue-800 font-semibold'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Disponibles ({vacantCount})
            </button>
            <button
              onClick={() => setSelectedStatus('maintenance')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedStatus === 'maintenance'
                  ? 'bg-rose-50 text-rose-800 font-semibold'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              Mantenimiento ({maintenanceCount})
            </button>
          </div>

          {/* Quick Filter Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar por N° o inquilino..."
              className="h-8.5 pl-8 pr-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 shadow-xs w-48"
            />
          </div>
        </div>
      </div>

      {/* Data View: Grid or Table */}
      {filteredUnits.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
        <div className="p-12 text-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm space-y-2">
          <p className="font-semibold text-slate-900">No se encontraron unidades con los filtros seleccionados</p>
          <p className="text-xs text-slate-500">Probá cambiando el piso seleccionado o limpiando el campo de búsqueda.</p>
        </div>
      )}

      {/* Unit Detail Drawer Side Sheet */}
      <UnitDetailDrawer />
    </div>
  );
};
