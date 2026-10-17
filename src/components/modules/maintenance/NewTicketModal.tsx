import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Priority } from '../../../domain/ticket';
import { usePropertyStore } from '../../../store/usePropertyStore';
import { Check } from 'lucide-react';

export const NewTicketModal: React.FC = () => {
  const isNewTicketModalOpen = usePropertyStore((state) => state.isNewTicketModalOpen);
  const newTicketUnitId = usePropertyStore((state) => state.newTicketUnitId);
  const closeNewTicketModal = usePropertyStore((state) => state.closeNewTicketModal);
  const units = usePropertyStore((state) => state.units);
  const createTicket = usePropertyStore((state) => state.createTicket);
  const isActionSubmitting = usePropertyStore((state) => state.isActionSubmitting);

  const [unitId, setUnitId] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('Conserje / Recepción');

  useEffect(() => {
    if (isNewTicketModalOpen) {
      if (newTicketUnitId) {
        setUnitId(newTicketUnitId);
      } else if (units.length > 0) {
        setUnitId(units[0].id);
      }
      setTitle('');
      setDescription('');
      setPriority('medium');
      setReporterName('Conserje / Recepción');
    }
  }, [isNewTicketModalOpen, newTicketUnitId, units]);

  if (!isNewTicketModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    await createTicket({
      unitId,
      title: title.trim(),
      description: description.trim(),
      reporterName: reporterName.trim(),
      priority,
    });
  };

  return (
    <Modal
      isOpen={isNewTicketModalOpen}
      onClose={closeNewTicketModal}
      title="Registrar Incidencia de Mantenimiento"
      subtitle="Genera una orden de trabajo asociada a una unidad o área común"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Unit Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Ubicación del Incidente
          </label>
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
            required
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                Departamento {u.unitNumber} (Piso {u.floor})
              </option>
            ))}
          </select>
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Nivel de Prioridad & Severidad
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'urgent', label: 'Urgente', desc: 'Afecta habitabilidad', color: 'border-rose-500 text-rose-300 bg-rose-950/70' },
              { id: 'medium', label: 'Medio', desc: 'Atención 48h', color: 'border-amber-500 text-amber-300 bg-amber-950/70' },
              { id: 'low', label: 'Bajo', desc: 'Preventivo', color: 'border-blue-500 text-blue-300 bg-blue-950/70' },
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setPriority(p.id as Priority)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  priority === p.id
                    ? p.color + ' shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">{p.label}</div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Título del Reporte
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ej. Fuga de agua en lavabo, cerradura trabada..."
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Descripción Detallada
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles de la avería, síntomas, acciones preliminares tomadas..."
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            required
          />
        </div>

        {/* Reporter */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Persona que Reporta
          </label>
          <input
            type="text"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={closeNewTicketModal}
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
            Registrar Incidencia
          </Button>
        </div>
      </form>
    </Modal>
  );
};
