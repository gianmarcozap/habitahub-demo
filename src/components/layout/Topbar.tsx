import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Building, Check, Layers, UserCheck } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const Topbar: React.FC = () => {
  const selectedProperty = usePropertyStore((state) => state.selectedProperty);
  const setSelectedProperty = usePropertyStore((state) => state.setSelectedProperty);
  const setQuickSearchOpen = usePropertyStore((state) => state.setQuickSearchOpen);
  const units = usePropertyStore((state) => state.units);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const properties = [
    {
      name: 'Edificio Residencial Las Acacias',
      address: 'Av. Javier Prado Este 2450, San Isidro',
      details: '5 pisos · 20 unidades · 80% ocupación',
      active: true,
    },
    {
      name: 'Torre Empresarial Los Sauces (Próximamente)',
      address: 'Calle Begonias 441, San Isidro',
      details: '12 pisos · 48 oficinas · En desarrollo',
      active: false,
    },
  ];

  const occupiedCount = units.filter((u) => u.status === 'occupied').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between z-20">
      {/* Property Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600 transition-all text-left"
        >
          <div className="w-6 h-6 rounded-md bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
            <Building className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-100">{selectedProperty}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-[10px] text-slate-400">San Isidro, Lima · 20 Unidades</p>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-2 py-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Propiedades Gestionadas
            </div>
            {properties.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setSelectedProperty(p.name);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-lg flex items-start justify-between transition-colors ${
                  selectedProperty === p.name ? 'bg-slate-800/90 text-slate-100' : 'hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    {p.name}
                    {selectedProperty === p.name && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400">{p.address}</div>
                  <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">{p.details}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={() => setQuickSearchOpen(true)}
          className="w-full h-9 px-3.5 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
            <span>Buscar unidad, inquilino, contrato o ticket...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right User & Live Status */}
      <div className="flex items-center gap-4 text-xs">
        <div className="hidden lg:flex items-center gap-3 text-slate-400 font-mono text-[11px] border-r border-slate-800 pr-4">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{occupiedCount}/20 Ocupadas</span>
          </span>
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>16 Contratos</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-xs font-bold text-emerald-300">
            GZ
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-slate-200">Gianmarco Zapata</div>
            <div className="text-[10px] text-emerald-400 font-mono">Property Manager</div>
          </div>
        </div>
      </div>
    </header>
  );
};
