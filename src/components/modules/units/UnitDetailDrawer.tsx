import React, { useState } from 'react';
import { Drawer } from '../../common/Drawer';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Download,
  Wrench,
  Clock,
  Building,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { usePropertyStore } from '../../../store/usePropertyStore';

export const UnitDetailDrawer: React.FC = () => {
  const selectedUnitId = usePropertyStore((state) => state.selectedUnitId);
  const closeUnitDetail = usePropertyStore((state) => state.closeUnitDetail);
  const units = usePropertyStore((state) => state.units);
  const leases = usePropertyStore((state) => state.leases);
  const tenants = usePropertyStore((state) => state.tenants);
  const extendLease = usePropertyStore((state) => state.extendLease);
  const openNewTicketModal = usePropertyStore((state) => state.openNewTicketModal);
  const openRecordPaymentModal = usePropertyStore((state) => state.openRecordPaymentModal);
  const isActionSubmitting = usePropertyStore((state) => state.isActionSubmitting);
  const showToast = usePropertyStore((state) => state.showToast);

  const [isExtending, setIsExtending] = useState(false);
  const [extensionMonths, setExtensionMonths] = useState(12);

  const unit = units.find((u) => u.id === selectedUnitId);
  if (!unit) return null;

  const tenant = tenants.find((t) => t.id === unit.currentTenantId);
  const lease = leases.find((l) => l.id === unit.currentLeaseId);

  // Simulated PDF download
  const handleDownloadPdf = () => {
    const contractContent = `===============================================================
CONTRATO DE ARRENDAMIENTO RESIDENCIAL — HABITAHUB PRO
Edificio Residencial Las Acacias · San Isidro, Lima, Perú
===============================================================

DATOS DE LA UNIDAD INMOBILIARIA:
- Unidad / Departamento: ${unit.unitNumber}
- Nivel / Piso: ${unit.floor}
- Tipología: ${unit.typology} (${unit.squareMeters} m²)
- Renta Acordada: $${unit.monthlyRent} USD mensuales

DATOS DEL ARRENDATARIO (INQUILINO):
- Nombre Completo: ${tenant ? tenant.fullName : 'Inquilino por definir'}
- DNI / Doc. Identidad: ${tenant ? tenant.nationalId : '—'}
- Teléfono: ${tenant ? tenant.phone : '—'}
- Correo Electrónico: ${tenant ? tenant.email : '—'}

VIGENCIA Y TÉRMINOS DEL CONTRATO:
- Fecha de Inicio: ${lease ? lease.startDate : '2026-01-01'}
- Fecha de Vencimiento: ${lease ? lease.endDate : '2026-12-31'}
- Depósito en Garantía: $${lease ? lease.depositAmount : unit.monthlyRent * 2} USD
- Cláusula de allanamiento futuro: Válida y aceptada bajo Ley N° 30933.

Documento generado y certificado digitalmente por el sistema HabitaHub Pro PMS.
Hash de integridad: 0x8a92fc012e84bc9f
===============================================================`;

    const blob = new Blob([contractContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Contrato_Arrendamiento_Depto_${unit.unitNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Descargado contrato digital para Dpto ${unit.unitNumber}`, 'success');
  };

  const handleExtend = async () => {
    if (!lease) return;
    await extendLease(lease.id, extensionMonths);
    setIsExtending(false);
  };

  return (
    <Drawer
      isOpen={Boolean(selectedUnitId)}
      onClose={closeUnitDetail}
      title={`Departamento ${unit.unitNumber}`}
      subtitle={`Edificio Las Acacias · Piso ${unit.floor} · ${unit.typology}`}
    >
      {/* Unit Status Overview Card */}
      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Ficha Inmobiliaria</span>
          </div>
          <Badge
            variant={
              unit.status === 'occupied'
                ? 'emerald'
                : unit.status === 'vacant'
                ? 'blue'
                : 'rose'
            }
            size="sm"
          >
            {unit.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[11px] block">Renta Pactada</span>
            <span className="text-slate-100 font-bold">${unit.monthlyRent}/mes</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Área Techada</span>
            <span className="text-slate-100 font-bold">{unit.squareMeters} m²</span>
          </div>
        </div>

        {unit.notes && (
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-500 font-mono text-[10px] block">Observaciones</span>
            {unit.notes}
          </div>
        )}
      </div>

      {/* Tenant Contact Information (if occupied) */}
      {tenant ? (
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-200">Titular del Contrato</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              Verificado
            </span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nombre:</span>
              <span className="font-semibold text-slate-100">{tenant.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                DNI / Identidad:
              </span>
              <span className="font-mono text-slate-300">{tenant.nationalId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                Teléfono:
              </span>
              <span className="font-mono text-slate-300">{tenant.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Email:
              </span>
              <span className="font-mono text-slate-300 truncate max-w-[200px]">{tenant.email}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-slate-850/50 border border-dashed border-slate-700 text-center text-xs text-slate-400 space-y-2">
          <FileCheck2 className="w-8 h-8 text-blue-400 mx-auto" />
          <p className="font-medium text-slate-200">Unidad actualmente sin ocupante</p>
          <p className="text-[11px] text-slate-500">Disponible para prospección comercial en portal inmobiliario.</p>
        </div>
      )}

      {/* Lease Contract Details */}
      {lease && (
        <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">Contrato de Arrendamiento</span>
            </div>
            <Badge
              variant={lease.status === 'expiring_soon' ? 'amber' : 'emerald'}
              size="sm"
            >
              {lease.status === 'expiring_soon' ? 'Vence pronto' : 'Activo'}
            </Badge>
          </div>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fecha de Inicio:</span>
              <span className="font-mono text-slate-200">{lease.startDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fecha de Término:</span>
              <span className="font-mono font-bold text-slate-100">{lease.endDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Depósito en Garantía:</span>
              <span className="font-mono text-emerald-400">${lease.depositAmount} USD</span>
            </div>
          </div>

          {/* Download Simulated PDF button */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              leftIcon={<Download className="w-3.5 h-3.5 text-slate-400" />}
              onClick={handleDownloadPdf}
            >
              Descargar Contrato Digital (PDF)
            </Button>
          </div>
        </div>
      )}

      {/* Extension Panel (if triggered) */}
      {lease && isExtending && (
        <div className="p-4 rounded-xl bg-slate-800 border border-emerald-500/40 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Extensión Formal de Arrendamiento</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Seleccioná el período adicional para renovar el contrato sin requerir renegociación de fianza:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setExtensionMonths(6)}
              className={`p-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                extensionMonths === 6
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              +6 Meses
            </button>
            <button
              onClick={() => setExtensionMonths(12)}
              className={`p-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                extensionMonths === 12
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              +12 Meses (Anual)
            </button>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="primary"
              size="sm"
              isLoading={isActionSubmitting}
              onClick={handleExtend}
              className="flex-1"
            >
              Confirmar Extensión
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExtending(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions Footer inside Drawer */}
      <div className="pt-2 space-y-2 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
          Acciones de Gestión
        </span>

        {lease && !isExtending && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-between"
            leftIcon={<Clock className="w-3.5 h-3.5 text-amber-400" />}
            onClick={() => setIsExtending(true)}
          >
            <span>Extender o Renovar Contrato</span>
            <span className="text-[10px] font-mono text-slate-400">+6/12m</span>
          </Button>
        )}

        {unit.status === 'occupied' && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-between"
            leftIcon={<CreditCard className="w-3.5 h-3.5 text-emerald-400" />}
            onClick={() => {
              closeUnitDetail();
              openRecordPaymentModal(unit.id);
            }}
          >
            <span>Registrar Pago de Arriendo</span>
            <span className="text-[10px] font-mono text-emerald-400">${unit.monthlyRent}</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between text-slate-300"
          leftIcon={<Wrench className="w-3.5 h-3.5 text-rose-400" />}
          onClick={() => {
            closeUnitDetail();
            openNewTicketModal(unit.id);
          }}
        >
          <span>Reportar Incidencia de Mantenimiento</span>
          <span className="text-[10px] text-slate-500">Ticket</span>
        </Button>
      </div>

      <div className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-[10px] text-slate-500 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Garantía y custodia legal bajo estándares de PropTech Perú.</span>
      </div>
    </Drawer>
  );
};
