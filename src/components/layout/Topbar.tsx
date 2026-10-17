import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Building2,
  Building,
  Check,
  Bell,
  RotateCcw,
  Menu,
  Layers,
} from 'lucide-react';
import { usePropertyStore } from '../../store/usePropertyStore';

export interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const selectedProperty = usePropertyStore((state) => state.selectedProperty);
  const setSelectedProperty = usePropertyStore((state) => state.setSelectedProperty);
  const setQuickSearchOpen = usePropertyStore((state) => state.setQuickSearchOpen);
  const units = usePropertyStore((state) => state.units);
  const tickets = usePropertyStore((state) => state.tickets);
  const resetDemo = usePropertyStore((state) => state.resetDemo);
  const isActionSubmitting = usePropertyStore((state) => state.isActionSubmitting);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const occupiedCount = units.filter((u) => u.status === 'occupied').length;
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
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle, Brand & Property Selector */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Icon (shown prominently on tablet/mobile if sidebar hidden) */}
        <div className="flex lg:hidden items-center gap-2 mr-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 text-sm">HabitaHub</span>
        </div>

        {/* Property Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition-all text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Building className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {selectedProperty}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">San Isidro, Lima · 20 Unidades</p>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Propiedades Gestionadas
              </div>
              {properties.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setSelectedProperty(p.name);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start justify-between transition-colors cursor-pointer ${
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
      </div>

      {/* Center: Clean Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={() => setQuickSearchOpen(true)}
          className="w-full h-9.5 px-3.5 rounded-lg bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-500 text-xs flex items-center justify-between transition-all shadow-inner hover:shadow-xs group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            <span>Buscar unidad, inquilino o incidencia...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded shadow-xs">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Sandbox Pill + Reset + Quick Stats + Profile */}
      <div className="flex items-center gap-3">
        {/* Single subtle Demo Sandbox badge + ghost reset button */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/90 rounded-full px-2.5 py-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>Demo Sandbox</span>
          </span>
          <span className="text-slate-300 font-light">|</span>
          <button
            onClick={resetDemo}
            disabled={isActionSubmitting}
            className="text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Restablecer datos al seed inicial"
          >
            <RotateCcw className={`w-3 h-3 text-slate-500 ${isActionSubmitting ? 'animate-spin' : ''}`} />
            <span>↻ Reiniciar datos</span>
          </button>
        </div>

        {/* Quick Stats: 16/20 Ocupadas */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>{occupiedCount}/20 Ocupadas</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setQuickSearchOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={`${urgentCount} incidencia(s) urgente(s)`}
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {urgentCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
              GZ
            </div>
            <div className="hidden lg:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight">Gianmarco Zapata</div>
              <div className="text-[10px] text-slate-500">Property Manager</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 text-xs text-slate-700">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">Gianmarco Zapata</p>
                <p className="text-[11px] text-slate-500">gianmarcozap97@gmail.com</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    resetDemo();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Restablecer Demo Seed</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
