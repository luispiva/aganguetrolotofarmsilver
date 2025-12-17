import React from 'react';
import { X, Map as MapIcon, Navigation } from 'lucide-react';
import { City } from '../types';

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  buyCity: string;
  sellCity: string;
}

// Coordenadas aproximadas em um grid 1000x1000 para o Continente Real
const CITY_COORDS: Record<string, { x: number; y: number; color: string; label: string }> = {
  [City.Thetford]: { x: 250, y: 300, color: '#a855f7', label: 'Thetford' }, // Purple
  [City.FortSterling]: { x: 700, y: 250, color: '#f8fafc', label: 'Fort Sterling' }, // White
  [City.Lymhurst]: { x: 800, y: 700, color: '#4ade80', label: 'Lymhurst' }, // Green
  [City.Bridgewatch]: { x: 500, y: 850, color: '#fb923c', label: 'Bridgewatch' }, // Orange
  [City.Martlock]: { x: 200, y: 700, color: '#60a5fa', label: 'Martlock' }, // Blue
  [City.Caerleon]: { x: 500, y: 500, color: '#ef4444', label: 'Caerleon' }, // Red
  [City.BlackMarket]: { x: 520, y: 480, color: '#1e293b', label: 'Black Market' }, // Dark offset
};

const RouteModal: React.FC<RouteModalProps> = ({ isOpen, onClose, buyCity, sellCity }) => {
  if (!isOpen) return null;

  const start = CITY_COORDS[buyCity] || { x: 0, y: 0, color: '#ccc' };
  const end = CITY_COORDS[sellCity] || { x: 0, y: 0, color: '#ccc' };
  
  // Cálculo de distância simples para mostrar na UI
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const isCrossContinent = distance > 400;

  // Lógica de Zona Vermelha
  const passesRedZone = 
    buyCity === City.Caerleon || 
    sellCity === City.Caerleon || 
    sellCity === City.BlackMarket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <MapIcon className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Rota de Transporte</h3>
              <p className="text-xs text-slate-400">Visualização simplificada do Continente Real</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Map Area */}
        <div className="relative w-full aspect-square md:aspect-video bg-[#0f172a] overflow-hidden p-4">
          {/* Background Decorativo (Grid) */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-2xl">
            {/* Definições de Marcadores */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Conexões (Estradas Abstratas entre vizinhos para contexto) */}
            <path d="M250 300 L700 250 L800 700 L500 850 L200 700 Z" fill="none" stroke="#1e293b" strokeWidth="4" />
            <path d="M500 500 L250 300 M500 500 L700 250 M500 500 L800 700 M500 500 L500 850 M500 500 L200 700" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,5" />

            {/* Rota Ativa */}
            <line 
              x1={start.x} y1={start.y} 
              x2={end.x} y2={end.y} 
              stroke={passesRedZone ? "#ef4444" : "#fbbf24"} 
              strokeWidth="6" 
              strokeDasharray="10,10"
              markerEnd="url(#arrowhead)"
              className="animate-pulse"
            >
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
            </line>

            {/* Cidades */}
            {Object.entries(CITY_COORDS).map(([name, coords]) => {
              const isStart = name === buyCity;
              const isEnd = name === sellCity;
              const isActive = isStart || isEnd;

              return (
                <g key={name} className="cursor-pointer hover:opacity-80 transition-opacity">
                  {/* Outer Glow for Active Cities */}
                  {isActive && (
                    <circle cx={coords.x} cy={coords.y} r="35" fill={coords.color} opacity="0.2" className="animate-ping" />
                  )}
                  
                  {/* City Circle */}
                  <circle 
                    cx={coords.x} 
                    cy={coords.y} 
                    r={isActive ? 18 : 10} 
                    fill={coords.color} 
                    stroke="#0f172a" 
                    strokeWidth="3"
                    filter={isActive ? "url(#glow)" : ""}
                  />

                  {/* Labels */}
                  <text 
                    x={coords.x} 
                    y={coords.y + 40} 
                    fill={isActive ? "white" : "#64748b"} 
                    fontSize={isActive ? "32" : "24"} 
                    fontWeight={isActive ? "bold" : "normal"}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                    style={{ textShadow: '2px 2px 4px black' }}
                  >
                    {coords.label}
                  </text>
                  
                  {isStart && (
                     <text x={coords.x} y={coords.y - 30} fill="#4ade80" fontSize="24" textAnchor="middle" fontWeight="bold">INÍCIO</text>
                  )}
                  {isEnd && (
                     <text x={coords.x} y={coords.y - 30} fill="#fbbf24" fontSize="24" textAnchor="middle" fontWeight="bold">FIM</text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legenda de Risco Sobreposta */}
          <div className="absolute top-4 right-4 bg-slate-900/80 border border-slate-700 p-3 rounded-lg backdrop-blur-md">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-bold text-white">Detalhes da Logística</span>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <p>Distância Relativa: <span className="text-white">{isCrossContinent ? "Longa Distância" : "Média/Curta"}</span></p>
              <p>Tipo de Zona: 
                <span className={`font-bold ml-1 ${passesRedZone ? "text-red-400" : "text-blue-400"}`}>
                  {passesRedZone ? "RED / LETHAL" : "BLUE / YELLOW (SAFE)"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-between items-center">
            <div className="flex gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div>Zona Segura</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Zona Vermelha (Caerleon)</div>
            </div>
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
                Fechar Mapa
            </button>
        </div>
      </div>
    </div>
  );
};

export default RouteModal;