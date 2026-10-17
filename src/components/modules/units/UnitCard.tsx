import React from 'react';
import { Unit } from '../../../domain/unit';
import { Tenant, LeaseContract } from '../../../domain/lease';
import { Badge } from '../../common/Badge';
import { User, Calendar, Maximize2, FileCheck } from 'lucide-react';

export interface UnitCardProps {
  unit: Unit;
  tenant?: Tenant;
  lease?: LeaseContract;
  onClick: () => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({
  unit,
  tenant,
  lease,
  onClick,
}) => {
  const statusConfig = {
    occupied: {
      label: 'Ocupado',
      variant: 'emerald' as const,
      pulse: false,
    },
    vacant: {
      label: 'Disponible',
      variant: 'slate' as const,
      pulse: false,
    },
    maintenance: {
      label: 'Mantenimiento',
      variant: 'rose' as const,
      pulse: true,
    },
  };

  const status = statusConfig[unit.status];

  return (
    <div
      onClick={onClick}
      className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Header: Unit number, floor, status */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 font-mono group-hover:text-emerald-700 transition-colors">
                Dpto {unit.unitNumber}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Piso {unit.floor}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className="font-medium text-slate-700">{unit.typology}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Maximize2 className="w-3 h-3 text-slate-400" />
                {unit.squareMeters} m²
              </span>
            </div>
          </div>

          <Badge variant={status.variant} size="sm" pulse={status.pulse}>
            {status.label}
          </Badge>
        </div>

        {/* Tenant Information or Vacancy Banner */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          {unit.status === 'occupied' && tenant ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                  <User className="w-3 h-3 text-slate-500" />
                </div>
                <span className="font-semibold text-slate-900 truncate">{tenant.fullName}</span>
              </div>
              {lease && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pl-7">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Fin: {lease.endDate}
                  </span>
                  {lease.status === 'expiring_soon' && (
                    <span className="text-amber-700 font-semibold font-sans">Por vencer</span>
                  )}
                </div>
              )}
            </div>
          ) : unit.status === 'vacant' ? (
            <div className="py-1 text-xs text-slate-600 font-medium flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-slate-500" />
              <span>Listo para visitas & arriendo</span>
            </div>
          ) : (
            <div className="py-1 text-xs text-rose-700 font-medium">
              <span>{unit.notes || 'Incidencia de mantenimiento en curso'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Rent amount */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500">Renta mensual</span>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-900 font-mono">
            ${unit.monthlyRent.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-mono"> USD</span>
        </div>
      </div>
    </div>
  );
};
