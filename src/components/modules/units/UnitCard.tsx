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
      variant: 'blue' as const,
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
      className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Header: Unit number, floor, status */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-100 font-mono group-hover:text-emerald-400 transition-colors">
                Dpto {unit.unitNumber}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                Piso {unit.floor}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span className="font-medium text-slate-300">{unit.typology}</span>
              <span>·</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <Maximize2 className="w-3 h-3 text-slate-500" />
                {unit.squareMeters} m²
              </span>
            </div>
          </div>

          <Badge variant={status.variant} size="sm" pulse={status.pulse}>
            {status.label}
          </Badge>
        </div>

        {/* Tenant Information or Vacancy Banner */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80">
          {unit.status === 'occupied' && tenant ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                  <User className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="font-medium text-slate-200 truncate">{tenant.fullName}</span>
              </div>
              {lease && (
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pl-7">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    Fin: {lease.endDate}
                  </span>
                  {lease.status === 'expiring_soon' && (
                    <span className="text-amber-400 font-semibold">Por vencer</span>
                  )}
                </div>
              )}
            </div>
          ) : unit.status === 'vacant' ? (
            <div className="py-1 text-xs text-blue-400/90 font-medium flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-400" />
              <span>Listo para visitas & nuevo arriendo</span>
            </div>
          ) : (
            <div className="py-1 text-xs text-rose-400 font-medium">
              <span>{unit.notes || 'Incidencia de plomería reportada'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Rent amount */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs text-slate-500">Renta mensual</span>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-100 font-mono">
            ${unit.monthlyRent.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono"> /mes</span>
        </div>
      </div>
    </div>
  );
};
