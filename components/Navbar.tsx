import React from 'react';
import { Coins, Settings, Search, Wifi, WifiOff, Globe, MapPin, Gem } from 'lucide-react';
import { GameServer, City } from '../types';

interface NavbarProps {
  apiStatus: 'online' | 'offline';
  currentServer: GameServer;
  onServerChange: (server: GameServer) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedQuality: string;
  onQualityChange: (quality: string) => void;
  availableItems: string[]; // Nova prop para o datalist
}

const Navbar: React.FC<NavbarProps> = ({ 
  apiStatus, 
  currentServer, 
  onServerChange, 
  searchQuery, 
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedQuality,
  onQualityChange,
  availableItems
}) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-amber-500">
              <Coins className="h-8 w-8" />
            </div>
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <span className="text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer bg-slate-800">Mercado</span>
                <span className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Análises</span>
                <span className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium cursor-pointer">Rotas</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
               
               {/* City Selector */}
               <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <select 
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer font-medium max-w-[140px]"
                  >
                    <option value="" className="bg-slate-800">Todas as Cidades</option>
                    {Object.values(City).map((city) => (
                      <option key={city} value={city} className="bg-slate-800">
                        {city}
                      </option>
                    ))}
                  </select>
               </div>

               {/* Quality Selector */}
               <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                  <Gem className="h-4 w-4 text-slate-400" />
                  <select 
                    value={selectedQuality}
                    onChange={(e) => onQualityChange(e.target.value)}
                    className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="" className="bg-slate-800">Todas Qualidades</option>
                    <option value="1" className="bg-slate-800">Normal</option>
                    <option value="2" className="bg-slate-800">Bom</option>
                    <option value="3" className="bg-slate-800">Excepcional</option>
                    <option value="4" className="bg-slate-800">Ótimo</option>
                    <option value="5" className="bg-slate-800 text-amber-400">Obra-prima</option>
                  </select>
               </div>

               {/* Server Selector */}
               <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <select 
                    value={currentServer}
                    onChange={(e) => onServerChange(e.target.value as GameServer)}
                    className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="west" className="bg-slate-800">Américas</option>
                    <option value="europe" className="bg-slate-800">Europa</option>
                    <option value="east" className="bg-slate-800">Ásia</option>
                  </select>
               </div>

               {/* Status Indicator */}
               <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${
                 apiStatus === 'online' 
                 ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                 : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
               }`}>
                 {apiStatus === 'online' ? (
                   <>
                    <Wifi className="h-3 w-3 mr-2" />
                    Online
                   </>
                 ) : (
                   <>
                    <WifiOff className="h-3 w-3 mr-2" />
                    Offline
                   </>
                 )}
               </div>

               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Search className="h-4 w-4 text-slate-400" />
                 </div>
                 <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => onSearchChange(e.target.value)}
                   list="items-list" // Conecta ao datalist
                   className="bg-slate-800 text-sm rounded-full pl-10 pr-4 py-1.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-slate-700 w-48 xl:w-56 placeholder-slate-500"
                   placeholder="Nome ou ID do item..."
                 />
                 <datalist id="items-list">
                    {availableItems.map((item) => (
                      <option key={item} value={item} />
                    ))}
                 </datalist>
               </div>
               <button className="bg-amber-600 hover:bg-amber-700 text-white p-1 rounded-full text-xs font-bold px-3">
                 PRO
               </button>
               <Settings className="h-6 w-6 text-slate-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;