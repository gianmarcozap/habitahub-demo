import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { PaymentMethod } from '../../../domain/payment';
import { usePropertyStore } from '../../../store/usePropertyStore';
import { Check, AlertCircle } from 'lucide-react';

export const RecordPaymentModal: React.FC = () => {
  const isRecordPaymentModalOpen = usePropertyStore((state) => state.isRecordPaymentModalOpen);
  const recordPaymentUnitId = usePropertyStore((state) => state.recordPaymentUnitId);
  const closeRecordPaymentModal = usePropertyStore((state) => state.closeRecordPaymentModal);
  const units = usePropertyStore((state) => state.units);
  const tenants = usePropertyStore((state) => state.tenants);
  const payments = usePropertyStore((state) => state.payments);
  const recordPayment = usePropertyStore((state) => state.recordPayment);
  const isActionSubmitting = usePropertyStore((state) => state.isActionSubmitting);

  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [amount, setAmount] = useState<number>(1100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  // Initial unit selection on modal open
  useEffect(() => {
    if (isRecordPaymentModalOpen) {
      if (recordPaymentUnitId) {
        setSelectedUnitId(recordPaymentUnitId);
      } else {
        // Default to first overdue unit if available, else first unit
        const overduePayment = payments.find((p) => p.status === 'overdue');
        if (overduePayment) {
          setSelectedUnitId(overduePayment.unitId);
        } else if (units.length > 0) {
          setSelectedUnitId(units[0].id);
        }
      }
    }
  }, [isRecordPaymentModalOpen, recordPaymentUnitId, payments, units]);

  // Update amount & generate reference number when unit changes
  useEffect(() => {
    const unit = units.find((u) => u.id === selectedUnitId);
    if (unit) {
      setAmount(unit.monthlyRent);
      const prefix = paymentMethod === 'transfer' ? 'BCP-TR' : paymentMethod === 'yape_plin' ? 'YAPE' : 'REC';
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setReferenceNumber(`${prefix}-${randomNum}`);
    }
  }, [selectedUnitId, paymentMethod, units]);

  if (!isRecordPaymentModalOpen) return null;

  const currentUnit = units.find((u) => u.id === selectedUnitId);
  const currentTenant = tenants.find((t) => t.id === currentUnit?.currentTenantId);
  const currentOverduePayment = payments.find(
    (p) => p.unitId === selectedUnitId && p.status === 'overdue'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId) return;

    await recordPayment({
      unitId: selectedUnitId,
      amount: Number(amount),
      paymentMethod,
      referenceNumber: referenceNumber || `REF-${Date.now().toString().slice(-6)}`,
    });
  };

  return (
    <Modal
      isOpen={isRecordPaymentModalOpen}
      onClose={closeRecordPaymentModal}
      title="Registrar Cobro de Arrendamiento"
      subtitle="Escritura idempotente simulando API REST en Go con persistencia PostgreSQL"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Unit Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Departamento / Unidad Inmobiliaria
          </label>
          <select
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            required
          >
            {units.map((u) => {
              const hasOverdue = payments.some((p) => p.unitId === u.id && p.status === 'overdue');
              return (
                <option key={u.id} value={u.id}>
                  Dpto {u.unitNumber} (Piso {u.floor}) — ${u.monthlyRent}/mes {hasOverdue ? '⚠️ [EN MORA]' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Tenant Details Card */}
        {currentTenant && (
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500">Inquilino registrado:</span>
              <span className="font-semibold text-slate-100">{currentTenant.fullName}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
              <span>DNI: {currentTenant.nationalId}</span>
              <span>Tel: {currentTenant.phone}</span>
            </div>
            {currentOverduePayment && (
              <div className="pt-1 mt-1 border-t border-slate-800 flex items-center gap-1.5 text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Factura vencida hace {currentOverduePayment.daysOverdue} días (${currentOverduePayment.amount})</span>
              </div>
            )}
          </div>
        )}

        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Monto a Cobrar (USD $)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
              $
            </span>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm font-mono font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Método de Pago
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'transfer', label: 'Transferencia', sub: 'BCP / BBVA' },
              { id: 'yape_plin', label: 'Yape / Plin', sub: 'Móvil QR' },
              { id: 'cash', label: 'Efectivo', sub: 'En caja' },
            ].map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  paymentMethod === m.id
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">{m.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{m.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Reference Number */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>N° de Operación / Código de Voucher</span>
            <span className="text-[10px] text-slate-500 font-mono">Autogenerado o manual</span>
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="ej. BCP-TR-819203"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500 uppercase"
            required
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={closeRecordPaymentModal}
            disabled={isActionSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isActionSubmitting}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Confirmar y Asentar Pago
          </Button>
        </div>

        <div className="text-[11px] text-slate-500 text-center font-mono pt-1">
          Simulación de write con latencia artificial (~150ms) y actualización en caliente de MRR.
        </div>
      </form>
    </Modal>
  );
};
