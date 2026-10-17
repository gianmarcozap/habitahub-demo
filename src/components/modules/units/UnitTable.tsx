import React from 'react';
import { Unit } from '../../../domain/unit';
import { Tenant, LeaseContract } from '../../../domain/lease';
import { Badge } from '../../common/Badge';
import { ChevronRight, FileText } from 'lucide-react';

export interface UnitTableProps {
  units: Unit[];
  tenants: Tenant[];
  leases: LeaseContract[];
  onSelectUnit: (unitId: string) => void;
}

export const UnitTable: React.FC<UnitTableProps> = ({
  units,
  tenants,
  leases,
  onSelectUnit,
}) => {
  const getTenant = (tenantId?: string) => tenants.find((t) => t.id === tenantId);
  const getLease = (leaseId?: string) => leases.find((l) => l.id === leaseId);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Unidad</th>
              <th className="px-4 py-3.5">Piso</th>
              <th className="px-4 py-3.5">Tipología</th>
              <th className="px-4 py-3.5">Metraje</th>
              <th className="px-5 py-3.5">Inquilino Actual</th>
              <th className="px-4 py-3.5">Vencimiento</th>
              <th className="px-5 py-3.5 text-right">Renta Mensual</th>
              <th className="px-5 py-3.5 text-center">Estado</th>
              <th className="px-4 py-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-sans">
            {units.map((unit) => {
              const tenant = getTenant(unit.currentTenantId);
              const lease = getLease(unit.currentLeaseId);

              const statusBadge = {
                occupied: <Badge variant="emerald" size="sm">Ocupado</Badge>,
                vacant: <Badge variant="blue" size="sm">Disponible</Badge>,
                maintenance: <Badge variant="rose" size="sm" pulse>Mantenimiento</Badge>,
              }[unit.status];

              return (
                <tr
                  key={unit.id}
                  onClick={() => onSelectUnit(unit.id)}
                  className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-4 font-bold font-mono text-slate-100 group-hover:text-emerald-400">
                    Dpto {unit.unitNumber}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-400">
                    Piso {unit.floor}
                  </td>
                  <td className="px-4 py-4 text-slate-300 font-medium">
                    {unit.typology}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-400">
                    {unit.squareMeters} m²
                  </td>
                  <td className="px-5 py-4">
                    {tenant ? (
                      <div>
                        <div className="font-medium text-slate-200">{tenant.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{tenant.phone}</div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Sin inquilino</span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-300">
                    {lease ? (
                      <span className={lease.status === 'expiring_soon' ? 'text-amber-400 font-semibold' : ''}>
                        {lease.endDate}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-slate-100">
                    ${unit.monthlyRent.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-center">
                    {statusBadge}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUnit(unit.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 group-hover:text-emerald-300 text-xs transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Ficha</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
