import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsHeader from './components/StatsHeader';
import MarketTable from './components/MarketTable';
import RouteModal from './components/RouteModal';
import CaerleonTrends from './components/CaerleonTrends';
import { FlipOpportunity, GameServer } from './types';
import { fetchMarketData } from './services/albionApi';

const App: React.FC = () => {
  const [data, setData] = useState<FlipOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('online');
  const [server, setServer] = useState<GameServer>('west');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [hasPremium, setHasPremium] = useState<boolean>(true);
  
  const [routeFlip, setRouteFlip] = useState<FlipOpportunity | null>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { opportunities, status } = await fetchMarketData(server);
      setData(opportunities);
      setApiStatus(status);
    } catch (err) {
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  }, [server]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const processedData = useMemo(() => {
    const totalTaxRate = hasPremium ? 0.065 : 0.105;

    return data.map(item => {
      const revenueAfterTaxes = item.sellPrice * (1 - totalTaxRate);
      const profit = Math.floor(revenueAfterTaxes - item.buyPrice);
      const profitMargin = (profit / item.buyPrice) * 100;

      return {
        ...item,
        profit,
        profitMargin: parseFloat(profitMargin.toFixed(2))
      };
    }).filter(item => item.profit > 0);
  }, [data, hasPremium]);

  const statsData = useMemo(() => {
    let result = processedData;
    if (selectedCity) {
      result = result.filter(item => item.buyCity === selectedCity);
    }
    return result;
  }, [processedData, selectedCity]);

  const availableItems = useMemo(() => {
    return Array.from(new Set(data.map(item => item.itemName))).sort();
  }, [data]);

  const avgMargin = statsData.length > 0 
    ? Math.round(statsData.reduce((acc, curr) => acc + curr.profitMargin, 0) / statsData.length) 
    : 0;
  
  const highestProfit = statsData.length > 0 
    ? Math.max(...statsData.map(d => d.profit)) 
    : 0;

  const handleShowRoute = (flip: FlipOpportunity) => {
    setRouteFlip(flip);
    setIsRouteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans pb-20">
      <Navbar 
        apiStatus={apiStatus} 
        currentServer={server}
        onServerChange={setServer}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        hasPremium={hasPremium}
        onPremiumToggle={setHasPremium}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Fique rico ou morra tentando</h1>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-2xl">
              Se não usar o Radar de Prata para ficar rico, cole na <span className="text-indigo-400 font-bold">gangue do Dlopinho</span> que é prata na certa! 🐬
            </p>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border shadow-lg ${hasPremium ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
            Status Financeiro: {hasPremium ? 'Premium (6.5% Tax)' : 'Normal (10.5% Tax)'}
          </div>
        </div>

        <StatsHeader 
          totalFlips={statsData.length} 
          avgMargin={avgMargin} 
          highestProfit={highestProfit} 
        />

        <div className="space-y-12">
           <MarketTable 
             data={processedData} 
             isLoading={loading} 
             selectedCity={selectedCity}
             searchQuery={searchQuery}
             onSearchChange={setSearchQuery}
             availableItems={availableItems}
             onShowRoute={handleShowRoute}
             onRefresh={loadData}
           />

           <CaerleonTrends />
        </div>
      </main>

      {routeFlip && (
        <RouteModal 
          isOpen={isRouteModalOpen}
          onClose={() => setIsRouteModalOpen(false)}
          buyCity={routeFlip.buyCity}
          sellCity={routeFlip.sellCity}
        />
      )}
    </div>
  );
};

export default App;