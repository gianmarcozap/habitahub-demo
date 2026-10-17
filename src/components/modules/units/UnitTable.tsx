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
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
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
          <tbody className="divide-y divide-slate-100 font-sans">
            {units.map((unit) => {
              const tenant = getTenant(unit.currentTenantId);
              const lease = getLease(unit.currentLeaseId);

              const statusBadge = {
                occupied: <Badge variant="emerald" size="sm">Ocupado</Badge>,
                vacant: <Badge variant="slate" size="sm">Disponible</Badge>,
                maintenance: <Badge variant="rose" size="sm" pulse>Mantenimiento</Badge>,
              }[unit.status];

              return (
                <tr
                  key={unit.id}
                  onClick={() => onSelectUnit(unit.id)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-4 font-bold font-mono text-slate-900 group-hover:text-emerald-700">
                    Dpto {unit.unitNumber}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-600">
                    Piso {unit.floor}
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-medium">
                    {unit.typology}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-500">
                    {unit.squareMeters} m²
                  </td>
                  <td className="px-5 py-4">
                    {tenant ? (
                      <div>
                        <div className="font-semibold text-slate-900">{tenant.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{tenant.phone}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Sin inquilino</span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-600">
                    {lease ? (
                      <span className={lease.status === 'expiring_soon' ? 'text-amber-700 font-semibold' : ''}>
                        {lease.endDate}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 group-hover:text-emerald-700 border border-slate-200 text-xs transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Ficha</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
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
