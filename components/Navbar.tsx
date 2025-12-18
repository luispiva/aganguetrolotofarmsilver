
import React from 'react';
import { Coins, Globe, MapPin, Crown, Youtube, Tv, BarChart2, Users, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { GameServer } from '../types';

interface NavbarProps {
  apiStatus: 'online' | 'offline';
  currentServer: GameServer;
  onServerChange: (server: GameServer) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  hasPremium: boolean;
  onPremiumToggle: (val: boolean) => void;
  currentView: 'market' | 'about';
  onViewChange: (view: 'market' | 'about') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  apiStatus,
  currentServer, 
  onServerChange, 
  selectedCity, 
  onCityChange,
  hasPremium,
  onPremiumToggle,
  currentView,
  onViewChange
}) => {
  const cities = [
    "Caerleon",
    "Bridgewatch",
    "Fort Sterling",
    "Lymhurst",
    "Martlock",
    "Thetford"
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
      {/* Top Bar - Socials, Slogan & API Status */}
      <div className="bg-slate-950 border-b border-slate-800/50 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 order-2 sm:order-1">
            <a 
              href="https://www.youtube.com/@DLopes94" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider"
            >
              <Youtube className="h-3.5 w-3.5" />
              YouTube
            </a>
            <a 
              href="https://www.twitch.tv/Dlopes94" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-purple-500 transition-colors uppercase tracking-wider"
            >
              <Tv className="h-3.5 w-3.5" />
              Twitch
            </a>
          </div>
          
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 order-1 sm:order-2">
            A Gangue Trololo Farm • <span className="text-amber-500">Se for chorar manda áudio</span>
          </div>

          <div className="flex items-center gap-3 order-3">
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter transition-all ${
              apiStatus === 'online' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}>
              {apiStatus === 'online' ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>API Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>API Offline</span>
                  <Loader2 className="h-2.5 w-2.5 animate-spin ml-0.5" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Side: Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <div 
              className="flex-shrink-0 text-amber-500 flex items-center gap-2 cursor-pointer group"
              onClick={() => onViewChange('market')}
            >
              <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-900 transition-all">
                <Coins className="h-6 w-6" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase hidden sm:block text-white">Trololo <span className="text-amber-500">Farm</span></span>
            </div>

            <div className="hidden lg:flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => onViewChange('market')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  currentView === 'market' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                <BarChart2 className="h-4 w-4" />
                Mercado
              </button>
              <button 
                onClick={() => onViewChange('about')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  currentView === 'about' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Users className="h-4 w-4" />
                Nossa História
              </button>
            </div>
          </div>
          
          {/* Right Side: Filters & Controls */}
          <div className="flex items-center space-x-2 md:space-x-3">
               {/* Premium Toggle */}
               <button 
                  onClick={() => onPremiumToggle(!hasPremium)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all active:scale-95 ${
                    hasPremium 
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                  title={hasPremium ? "Status: PREMIUM (6.5% Taxa)" : "Status: NORMAL (10.5% Taxa)"}
               >
                  <Crown className={`h-4 w-4 ${hasPremium ? 'fill-amber-500' : ''}`} />
                  <span className="text-[10px] font-black hidden xl:block uppercase tracking-wider">
                    {hasPremium ? 'Premium' : 'Normal'}
                  </span>
               </button>

               {/* City Filter */}
               <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 hover:border-indigo-500 transition-all group shadow-inner">
                  <MapPin className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-500 uppercase font-black leading-none mb-0.5 tracking-tighter">Cidade Origem</span>
                    <select 
                      value={selectedCity}
                      onChange={(e) => onCityChange(e.target.value)}
                      className="bg-transparent text-xs text-slate-100 focus:outline-none cursor-pointer font-bold appearance-none pr-4"
                    >
                      <option value="" className="bg-slate-900">Todas as Cidades</option>
                      {cities.map((city) => (
                        <option key={city} value={city} className="bg-slate-900">{city}</option>
                      ))}
                    </select>
                  </div>
               </div>

               {/* Server Selector */}
               <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 hover:border-indigo-500 transition-all group shadow-inner">
                  <Globe className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-500 uppercase font-black leading-none mb-0.5 tracking-tighter">Servidor</span>
                    <select 
                      value={currentServer}
                      onChange={(e) => onServerChange(e.target.value as GameServer)}
                      className="bg-transparent text-xs text-slate-100 focus:outline-none cursor-pointer font-bold appearance-none pr-4"
                    >
                      <option value="west" className="bg-slate-900">West</option>
                      <option value="europe" className="bg-slate-900">Europe</option>
                      <option value="east" className="bg-slate-900">East</option>
                    </select>
                  </div>
               </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
