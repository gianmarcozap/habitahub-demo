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

  const handleDownloadPdf = () => {
    const contractContent = `===============================================================
CONTRATO DE ARRENDAMIENTO RESIDENCIAL — HABITAHUB PMS
Edificio Residencial Las Acacias · San Isidro, Lima, Perú
===============================================================

DATOS DE LA UNIDAD INMOBILIARIA:
- Unidad / Departamento: ${unit.unitNumber}
- Nivel / Piso: ${unit.floor}
- Tipología: ${unit.typology} (${unit.squareMeters} m²)
- Renta Acordada: $${unit.monthlyRent} USD mensuales

DATOS DEL ARRENDATARIO (INQUILINO):
- Nombre Completo: ${tenant ? tenant.fullName : 'Inquilino por definir'}
- Documento de Identidad: ${tenant ? tenant.nationalId : '—'}
- Teléfono: ${tenant ? tenant.phone : '—'}
- Correo Electrónico: ${tenant ? tenant.email : '—'}

VIGENCIA Y TÉRMINOS DEL CONTRATO:
- Fecha de Inicio: ${lease ? lease.startDate : '2026-01-01'}
- Fecha de Vencimiento: ${lease ? lease.endDate : '2026-12-31'}
- Depósito en Garantía: $${lease ? lease.depositAmount : unit.monthlyRent * 2} USD
- Cláusula de allanamiento futuro: Registrada bajo Ley N° 30933.

Documento certificado por la administración de Edificio Las Acacias.
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
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-900">Ficha Inmobiliaria</span>
          </div>
          <Badge
            variant={
              unit.status === 'occupied'
                ? 'emerald'
                : unit.status === 'vacant'
                ? 'slate'
                : 'rose'
            }
            size="sm"
          >
            {unit.status.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[11px] font-sans block">Renta Pactada</span>
            <span className="text-slate-900 font-bold">${unit.monthlyRent}/mes</span>
          </div>
          <div>
            <span className="text-slate-500 text-[11px] font-sans block">Área Techada</span>
            <span className="text-slate-900 font-bold">{unit.squareMeters} m²</span>
          </div>
        </div>

        {unit.notes && (
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700">
            <span className="text-slate-400 font-medium text-[10px] block">Observaciones</span>
            {unit.notes}
          </div>
        )}
      </div>

      {/* Tenant Contact Information (if occupied) */}
      {tenant ? (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-semibold text-slate-900">Titular del Contrato</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
              Verificado
            </span>
          </div>

          <div className="space-y-2 pt-1 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Nombre:</span>
              <span className="font-semibold text-slate-900">{tenant.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Doc. Identidad:
              </span>
              <span className="font-mono text-slate-800">{tenant.nationalId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Teléfono:
              </span>
              <span className="font-mono text-slate-800">{tenant.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email:
              </span>
              <span className="font-mono text-slate-800 truncate max-w-[200px]">{tenant.email}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-2">
          <FileCheck2 className="w-8 h-8 text-blue-500 mx-auto" />
          <p className="font-semibold text-slate-900">Unidad actualmente desocupada</p>
          <p className="text-[11px] text-slate-500">Disponible para visitas y nuevo contrato de arriendo.</p>
        </div>
      )}

      {/* Lease Contract Details */}
      {lease && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-slate-900">Contrato de Arrendamiento</span>
            </div>
            <Badge
              variant={lease.status === 'expiring_soon' ? 'amber' : 'emerald'}
              size="sm"
            >
              {lease.status === 'expiring_soon' ? 'Vence pronto' : 'Activo'}
            </Badge>
          </div>

          <div className="space-y-2 text-xs pt-1 text-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Fecha de Inicio:</span>
              <span className="font-mono text-slate-800">{lease.startDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Fecha de Término:</span>
              <span className="font-mono font-bold text-slate-900">{lease.endDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Depósito en Garantía:</span>
              <span className="font-mono text-emerald-700 font-semibold">${lease.depositAmount} USD</span>
            </div>
          </div>

          {/* Download Simulated PDF button */}
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center"
              leftIcon={<Download className="w-3.5 h-3.5 text-slate-500" />}
              onClick={handleDownloadPdf}
            >
              Descargar Contrato Digital (PDF)
            </Button>
          </div>
        </div>
      )}

      {/* Extension Panel (if triggered) */}
      {lease && isExtending && (
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Extensión Formal de Arrendamiento</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Seleccioná el período adicional para renovar el contrato de alquiler:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setExtensionMonths(6)}
              className={`p-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                extensionMonths === 6
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              +6 Meses
            </button>
            <button
              onClick={() => setExtensionMonths(12)}
              className={`p-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
                extensionMonths === 12
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200'
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
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
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
      <div className="pt-2 space-y-2 border-t border-slate-200">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
          Acciones de Gestión
        </span>

        {lease && !isExtending && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-between"
            leftIcon={<Clock className="w-3.5 h-3.5 text-amber-600" />}
            onClick={() => setIsExtending(true)}
          >
            <span>Extender o Renovar Contrato</span>
            <span className="text-[10px] font-mono text-slate-500">+6/12m</span>
          </Button>
        )}

        {unit.status === 'occupied' && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-between"
            leftIcon={<CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={() => {
              closeUnitDetail();
              openRecordPaymentModal(unit.id);
            }}
          >
            <span>Registrar Cobro de Arriendo</span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold">${unit.monthlyRent}</span>
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="w-full justify-between"
          leftIcon={<Wrench className="w-3.5 h-3.5 text-rose-600" />}
          onClick={() => {
            closeUnitDetail();
            openNewTicketModal(unit.id);
          }}
        >
          <span>Reportar Incidencia Técnica</span>
          <span className="text-[10px] text-slate-400">Ticket</span>
        </Button>
      </div>

      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Garantía de arrendamiento y contrato registrado en administración.</span>
      </div>
    </Drawer>
  );
};
