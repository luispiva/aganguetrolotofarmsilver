import React from 'react';
import { Coins, Settings, Globe, MapPin, Crown, Youtube, Tv } from 'lucide-react';
import { GameServer } from '../types';

interface NavbarProps {
  apiStatus: 'online' | 'offline';
  currentServer: GameServer;
  onServerChange: (server: GameServer) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  hasPremium: boolean;
  onPremiumToggle: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentServer, 
  onServerChange, 
  selectedCity, 
  onCityChange,
  hasPremium,
  onPremiumToggle
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
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      {/* Top Utility Bar with Socials and Custom Phrase */}
      <div className="bg-slate-950 border-b border-slate-800/50 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
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
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Se for chorar manda áudio.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-amber-500 flex items-center gap-2 cursor-pointer">
              <Coins className="h-8 w-8" />
              <span className="font-black text-xl tracking-tighter uppercase hidden sm:block">Trololo <span className="text-slate-500 font-normal">Farm</span></span>
            </div>
          </div>
          
          <div className="flex items-center md:ml-6 space-x-3">
               <button 
                  onClick={() => onPremiumToggle(!hasPremium)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                    hasPremium 
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                  title={hasPremium ? "Status: PREMIUM (6.5% Taxa)" : "Status: NORMAL (10.5% Taxa)"}
               >
                  <Crown className={`h-4 w-4 ${hasPremium ? 'fill-amber-500' : ''}`} />
                  <span className="text-[10px] font-bold hidden lg:block uppercase tracking-wider">
                    {hasPremium ? 'Premium ON' : 'Premium OFF'}
                  </span>
               </button>

               <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <select 
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-medium max-w-[100px]"
                  >
                    <option value="" className="bg-slate-800">Origem: Todas</option>
                    {cities.map((city) => (
                      <option key={city} value={city} className="bg-slate-800">{city}</option>
                    ))}
                  </select>
               </div>

               <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
                  <Globe className="h-4 w-4 text-slate-400" />
                  <select 
                    value={currentServer}
                    onChange={(e) => onServerChange(e.target.value as GameServer)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="west" className="bg-slate-800">West</option>
                    <option value="europe" className="bg-slate-800">Europe</option>
                    <option value="east" className="bg-slate-800">East</option>
                  </select>
               </div>

               <Settings className="h-5 w-5 text-slate-500 hover:text-white cursor-pointer hidden md:block" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;