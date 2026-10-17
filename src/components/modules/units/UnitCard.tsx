import React from 'react';
import { Unit } from '../../../domain/unit';
import { Tenant, LeaseContract } from '../../../domain/lease';
import { Badge } from '../../common/Badge';
import { User, Calendar, FileCheck, Wrench } from 'lucide-react';

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
  // Color coding per user specification:
  // Ocupado -> Rojo (rose)
  // Disponible -> Blanco (white/slate border)
  // Mantenimiento -> Naranja (amber)
  const statusConfig = {
    occupied: {
      label: 'Ocupado',
      badge: (
        <Badge variant="rose" size="sm">
          Ocupado
        </Badge>
      ),
      borderColor: 'border-slate-200 hover:border-rose-300',
    },
    vacant: {
      label: 'Disponible',
      badge: (
        <span className="inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 shadow-2xs font-medium">
          Disponible
        </span>
      ),
      borderColor: 'border-slate-200 hover:border-slate-400',
    },
    maintenance: {
      label: 'Mantenimiento',
      badge: (
        <Badge variant="amber" size="sm" pulse>
          Mantenimiento
        </Badge>
      ),
      borderColor: 'border-amber-200 hover:border-amber-400',
    },
  };

  const status = statusConfig[unit.status];

  return (
    <div
      onClick={onClick}
      className={`p-3.5 rounded-xl bg-white border ${status.borderColor} shadow-2xs hover:shadow-sm transition-all duration-150 cursor-pointer group flex flex-col justify-between`}
    >
      <div>
        {/* Top Header: Dpto number + Floor + Status Chip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 font-mono group-hover:text-emerald-700 transition-colors">
              Dpto {unit.unitNumber}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Piso {unit.floor}
            </span>
          </div>

          <div>{status.badge}</div>
        </div>

        {/* Typology without m² */}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{unit.typology}</span>
        </div>

        {/* Tenant or Status Info */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          {unit.status === 'occupied' && tenant ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800 truncate">{tenant.fullName}</span>
              </div>
              {lease && (
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pl-5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Fin: {lease.endDate}
                  </span>
                  {lease.status === 'expiring_soon' && (
                    <span className="text-amber-700 font-sans font-semibold">Por vencer</span>
                  )}
                </div>
              )}
            </div>
          ) : unit.status === 'vacant' ? (
            <div className="py-0.5 text-xs text-slate-600 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px]">Listo para arriendo</span>
            </div>
          ) : (
            <div className="py-0.5 text-xs text-amber-700 font-medium flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] truncate">{unit.notes || 'En reparación'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Monthly Rent */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Renta</span>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-900 font-mono">
            ${unit.monthlyRent.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 font-mono"> /mes</span>
        </div>
      </div>
    </div>
  );
};
