
import React from 'react';
import { X, Map as MapIcon, Navigation, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { City } from '../types';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyCity: string;
  sellCity: string;
}

const CITY_COORDS: Record<string, { x: number; y: number; color: string; label: string }> = {
  [City.Thetford]: { x: 250, y: 300, color: '#a855f7', label: 'Thetford' }, 
  [City.FortSterling]: { x: 700, y: 250, color: '#f8fafc', label: 'Fort Sterling' },
  [City.Lymhurst]: { x: 800, y: 700, color: '#4ade80', label: 'Lymhurst' },
  [City.Bridgewatch]: { x: 500, y: 850, color: '#fb923c', label: 'Bridgewatch' },
  [City.Martlock]: { x: 200, y: 700, color: '#60a5fa', label: 'Martlock' },
  [City.Caerleon]: { x: 500, y: 500, color: '#ef4444', label: 'Caerleon' },
  [City.BlackMarket]: { x: 515, y: 485, color: '#1e293b', label: 'Mercado Negro' },
};

const RouteModal: React.FC<RouteModalProps> = ({ isOpen, onClose, buyCity, sellCity }) => {
  if (!isOpen) return null;

  const start = CITY_COORDS[buyCity] || { x: 0, y: 0, color: '#ccc' };
  const end = CITY_COORDS[sellCity] || { x: 0, y: 0, color: '#ccc' };
  
  const passesRedZone = 
    buyCity === City.Caerleon || 
    sellCity === City.Caerleon || 
    sellCity === City.BlackMarket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/95 backdrop-blur-md transition-all">
      <div className="bg-slate-900 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-6 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shadow-inner ${passesRedZone ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
              <MapIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Logística de Transporte</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Plano de Rota: Continente Real</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-full transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Status Banner */}
        <div className={`px-6 py-3 flex items-center gap-3 border-b ${passesRedZone ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
          {passesRedZone ? <ShieldAlert className="h-5 w-5 animate-pulse" /> : <ShieldCheck className="h-5 w-5" />}
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Risco da Rota: {passesRedZone ? 'Extremo (Zona de Abate)' : 'Seguro (Zonas Azul/Amarela)'}
          </span>
        </div>

        {/* Map Area */}
        <div className="relative w-full aspect-square md:aspect-video bg-[#0c121e] overflow-hidden p-8">
          <div className="absolute inset-0 opacity-5" 
               style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>

          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            <defs>
              <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
              </marker>
              <marker id="arrowhead-safe" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
              </marker>
              <filter id="glow-city">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Ghost Paths */}
            <path d="M250 300 L700 250 L800 700 L500 850 L200 700 Z" fill="none" stroke="#1e293b" strokeWidth="4" />
            <path d="M500 500 L250 300 M500 500 L700 250 M500 500 L800 700 M500 500 L500 850 M500 500 L200 700" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="8,8" />

            {/* Active Path Line */}
            <line 
              x1={start.x} y1={start.y} 
              x2={end.x} y2={end.y} 
              stroke={passesRedZone ? "#ef4444" : "#fbbf24"} 
              strokeWidth="8" 
              strokeDasharray="15,15"
              markerEnd={passesRedZone ? "url(#arrowhead-red)" : "url(#arrowhead-safe)"}
            >
              <animate attributeName="stroke-dashoffset" from="120" to="0" dur="2.5s" repeatCount="indefinite" />
            </line>

            {/* Cities Rendering */}
            {Object.entries(CITY_COORDS).map(([name, coords]) => {
              const isStart = name === buyCity;
              const isEnd = name === sellCity;
              const isActive = isStart || isEnd;

              return (
                <g key={name}>
                  {isActive && (
                    <circle cx={coords.x} cy={coords.y} r="45" fill={coords.color} opacity="0.1" className="animate-pulse" />
                  )}
                  
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r={isActive ? 22 : 12} 
                    fill={coords.color} 
                    stroke="#0c121e" 
                    strokeWidth="4"
                    filter={isActive ? "url(#glow-city)" : ""}
                  />

                  <text 
                    x={coords.x} 
                    y={coords.y + 55} 
                    fill={isActive ? "white" : "#475569"} 
                    fontSize={isActive ? "38" : "28"} 
                    fontWeight="900"
                    textAnchor="middle"
                    className="uppercase tracking-tighter pointer-events-none select-none"
                    style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.8)' }}
                  >
                    {coords.label}
                  </text>
                  
                  {isStart && (
                     <text x={coords.x} y={coords.y - 40} fill="#4ade80" fontSize="30" textAnchor="middle" fontWeight="900" style={{ textShadow: '2px 2px 0px black' }}>COMPRA</text>
                  )}
                  {isEnd && (
                     <text x={coords.x} y={coords.y - 40} fill="#fbbf24" fontSize="30" textAnchor="middle" fontWeight="900" style={{ textShadow: '2px 2px 0px black' }}>VENDA</text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Logistics Legend Overlay */}
          <div className="absolute top-6 right-6 bg-slate-900/90 border border-slate-700 p-4 rounded-2xl backdrop-blur-xl shadow-2xl max-w-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="h-4 w-4 text-indigo-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Informações</span>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-black">Trajeto</span>
                <span className="text-xs font-bold text-slate-200">Intercontinental</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-black">Ambiente</span>
                <span className={`text-xs font-bold ${passesRedZone ? "text-red-500" : "text-indigo-400"}`}>
                  {passesRedZone ? "Lethal PvP" : "Zonas de Punição"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Box */}
        <div className="p-6 bg-slate-950 border-t border-slate-800">
           <div className={`flex items-start gap-4 p-4 rounded-2xl border ${passesRedZone ? 'bg-red-500/5 border-red-500/20 text-red-400' : 'bg-indigo-500/5 border-indigo-500/20 text-slate-400'}`}>
              <AlertTriangle className={`h-6 w-6 flex-shrink-0 ${passesRedZone ? 'text-red-500' : 'text-amber-500'}`} />
              <p className="text-xs leading-relaxed font-medium">
                {passesRedZone 
                  ? "ATENÇÃO: Esta rota exige atravessar zonas vermelhas. Recomendamos escolta ou montaria de alta resistência (ex: Boi T8/Urso). Gankers operam frequentemente nesta área."
                  : "Rota considerada segura. Evite apenas faccionar se houver facções inimigas no caminho. O lucro é garantido pela diferença de preço regional."
                }
              </p>
           </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-slate-800 flex justify-end">
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg border border-slate-600"
            >
                Fechar Mapa
            </button>
        </div>
      </div>
    </div>
  );
};

export default RouteModal;
