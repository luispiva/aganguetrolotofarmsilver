
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsHeader from './components/StatsHeader';
import MarketTable from './components/MarketTable';
import RouteModal from './components/RouteModal';
import AnalysisModal from './components/AnalysisModal';
import ItemDetailModal from './components/ItemDetailModal';
import CaerleonTrends from './components/CaerleonTrends';
import AboutPage from './components/AboutPage';
import Footer from './components/Footer';
import { FlipOpportunity, GameServer } from './types';
import { fetchMarketData } from './services/albionApi';
import { analyzeTrade, getMarketOverview } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'market' | 'about'>('market');
  const [data, setData] = useState<FlipOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('online');
  const [server, setServer] = useState<GameServer>('west');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [hasPremium, setHasPremium] = useState<boolean>(true);
  
  const [routeFlip, setRouteFlip] = useState<FlipOpportunity | null>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  // AI Analysis State
  const [analysisFlip, setAnalysisFlip] = useState<FlipOpportunity | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [marketSummary, setMarketSummary] = useState('');

  // Item Details State
  const [detailFlip, setDetailFlip] = useState<FlipOpportunity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  useEffect(() => {
    if (data.length > 0) {
      getMarketOverview(data.slice(0, 10)).then(setMarketSummary);
    }
  }, [data]);

  /**
   * REGRAS DE CÁLCULO ALBION ONLINE:
   * 1. Taxa de Venda (Market Fee + Tax):
   *    - Premium: 2.5% (Listing Fee) + 4% (Sales Tax) = 6.5% total
   *    - Normal: 2.5% (Listing Fee) + 8% (Sales Tax) = 10.5% total
   * 2. O lucro é calculado apenas subtraindo a taxa do PREÇO DE VENDA FINAL.
   * 3. O Preço de Compra é o valor bruto pago ao vendedor (ou o custo de aquisição).
   */
  const processedData = useMemo(() => {
    const totalTaxRate = hasPremium ? 0.065 : 0.105;
    
    return data.map(item => {
      // Cálculo exato: Valor que entra na bolsa após as taxas do mercado de destino
      const revenueAfterTaxes = item.sellPrice * (1 - totalTaxRate);
      
      // Lucro Líquido Real = (Receita Pós-Taxas) - (Custo de Compra na Origem)
      const profit = Math.floor(revenueAfterTaxes - item.buyPrice);
      
      // ROI (Retorno sobre Investimento) baseado no custo de compra
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

  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    data.forEach(item => {
      suggestions.add(item.itemName);
      suggestions.add(item.itemId);
    });
    return Array.from(suggestions).sort();
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

  const handleShowAnalysis = async (flip: FlipOpportunity) => {
    setAnalysisFlip(flip);
    setIsAnalysisModalOpen(true);
    setIsAnalyzing(true);
    setAnalysisText('');
    const result = await analyzeTrade(flip);
    setAnalysisText(result);
    setIsAnalyzing(false);
  };

  const handleShowDetails = (flip: FlipOpportunity) => {
    setDetailFlip(flip);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Navbar 
        apiStatus={apiStatus} 
        currentServer={server}
        onServerChange={setServer}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        hasPremium={hasPremium}
        onPremiumToggle={setHasPremium}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {currentView === 'market' ? (
          <>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Fique rico ou morra tentando</h1>
                <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-2xl min-h-[1.25rem]">
                  {marketSummary || "Se não usar o Radar de Prata para ficar rico, cole na gangue do Dlopinho que é prata na certa! 🐬"}
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
                 availableItems={searchSuggestions}
                 onShowRoute={handleShowRoute}
                 onShowAnalysis={handleShowAnalysis}
                 onShowDetails={handleShowDetails}
                 onRefresh={loadData}
               />
               <CaerleonTrends currentServer={server} />
            </div>
          </>
        ) : (
          <AboutPage />
        )}
      </main>

      <Footer />

      {routeFlip && (
        <RouteModal 
          isOpen={isRouteModalOpen}
          onClose={() => setIsRouteModalOpen(false)}
          buyCity={routeFlip.buyCity}
          sellCity={routeFlip.sellCity}
        />
      )}

      {analysisFlip && (
        <AnalysisModal 
          isOpen={isAnalysisModalOpen}
          onClose={() => setIsAnalysisModalOpen(false)}
          flip={analysisFlip}
          analysis={analysisText}
          isAnalyzing={isAnalyzing}
        />
      )}

      {detailFlip && (
        <ItemDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          flip={detailFlip}
          server={server}
        />
      )}
    </div>
  );
};

export default App;
