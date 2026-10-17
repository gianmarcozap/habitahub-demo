import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Building, Check, Bell } from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export const Topbar: React.FC = () => {
  const selectedProperty = usePropertyStore((state) => state.selectedProperty);
  const setSelectedProperty = usePropertyStore((state) => state.setSelectedProperty);
  const setQuickSearchOpen = usePropertyStore((state) => state.setQuickSearchOpen);
  const tickets = usePropertyStore((state) => state.tickets);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const urgentCount = tickets.filter((t) => t.priority === 'urgent' && t.status !== 'resolved').length;

  const properties = [
    {
      name: 'Edificio Residencial Las Acacias',
      address: 'Av. Javier Prado Este 2450, San Isidro',
      details: '5 pisos · 20 unidades · 80% ocupación',
    },
    {
      name: 'Torre Empresarial Los Sauces',
      address: 'Calle Begonias 441, San Isidro',
      details: '12 pisos · 48 oficinas · Próxima apertura',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-20 px-6 flex items-center justify-between shadow-sm">
      {/* Left: Building Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left group"
        >
          <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {selectedProperty}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
            <p className="text-[11px] text-slate-500">San Isidro, Lima · 20 Unidades</p>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
                  selectedProperty === p.name ? 'bg-slate-50 text-slate-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5 text-slate-900">
                    {p.name}
                    {selectedProperty === p.name && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{p.address}</div>
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5">{p.details}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Center: Centralized Clean Search Input */}
      <div className="flex-1 max-w-md mx-6">
        <button
          onClick={() => setQuickSearchOpen(true)}
          className="w-full h-10 px-3.5 rounded-lg bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-500 text-xs flex items-center justify-between transition-all shadow-inner hover:shadow-sm group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span>Buscar unidad, inquilino o contrato...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-xs">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Quick notification bell */}
        <div className="relative">
          <button
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title={`${urgentCount} incidencia(s) urgente(s)`}
          >
            <Bell className="w-4 h-4" />
            {urgentCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              GZ
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-900">Gianmarco Zapata</div>
              <div className="text-[11px] text-slate-500">Property Manager</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-700">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">Gianmarco Zapata</p>
                <p className="text-[11px] text-slate-500">gianmarcozap97@gmail.com</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700"
                >
                  Configuración del Edificio
                </button>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700"
                >
                  Exportar Reporte Mensual (Excel)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
