import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsHeader from './components/StatsHeader';
import MarketTable from './components/MarketTable';
import AnalysisModal from './components/AnalysisModal';
import RouteModal from './components/RouteModal'; // Importando novo modal
import { FlipOpportunity, GameServer } from './types';
import { fetchMarketData } from './services/albionApi';
import { analyzeTrade } from './services/geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<FlipOpportunity[]>([]);
  const [filteredData, setFilteredData] = useState<FlipOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiStatus, setApiStatus] = useState<'online' | 'offline'>('online');
  const [server, setServer] = useState<GameServer>('west');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  
  // Modal State for AI Analysis
  const [selectedFlip, setSelectedFlip] = useState<FlipOpportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Modal State for Map Route
  const [routeFlip, setRouteFlip] = useState<FlipOpportunity | null>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { opportunities, status } = await fetchMarketData(server);
      setData(opportunities);
      setApiStatus(status);
    } catch (err) {
      console.error(err);
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  }, [server]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Lista de itens únicos para o autocompletar
  const availableItems = useMemo(() => {
    const names = new Set(data.map(item => item.itemName));
    return Array.from(names).sort();
  }, [data]);

  // Efeito para filtrar os dados quando a busca, cidade, qualidade ou os dados mudam
  useEffect(() => {
    let result = data;

    // Filtro de Texto
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.itemName.toLowerCase().includes(lowerQuery) || 
        item.itemId.toLowerCase().includes(lowerQuery) ||
        item.buyCity.toLowerCase().includes(lowerQuery) ||
        item.sellCity.toLowerCase().includes(lowerQuery)
      );
    }

    // Filtro de Cidade de Compra (Origem)
    if (selectedCity) {
      result = result.filter(item => item.buyCity === selectedCity);
    }

    // Filtro de Qualidade
    if (selectedQuality) {
      result = result.filter(item => item.quality === parseInt(selectedQuality));
    }

    setFilteredData(result);
  }, [data, searchQuery, selectedCity, selectedQuality]);

  // Statistics Calculation (based on filtered data to show context stats)
  const statsData = filteredData.length > 0 ? filteredData : [];
  
  const avgMargin = statsData.length > 0 
    ? Math.round(statsData.reduce((acc, curr) => acc + curr.profitMargin, 0) / statsData.length) 
    : 0;
  
  const highestProfit = statsData.length > 0 
    ? Math.max(...statsData.map(d => d.profit)) 
    : 0;

  const handleAnalyze = async (flip: FlipOpportunity) => {
    setSelectedFlip(flip);
    setIsModalOpen(true);
    setIsAnalyzing(true);
    setAiAnalysis('');

    // Call Gemini
    const analysisText = await analyzeTrade(flip);
    setAiAnalysis(analysisText);
    setIsAnalyzing(false);
  };

  const handleShowRoute = (flip: FlipOpportunity) => {
    setRouteFlip(flip);
    setIsRouteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Navbar 
        apiStatus={apiStatus} 
        currentServer={server}
        onServerChange={setServer}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedQuality={selectedQuality}
        onQualityChange={setSelectedQuality}
        availableItems={availableItems}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Painel de Mercado</h1>
          <p className="text-slate-400 mt-2">
            Análise automatizada do mercado de Albion Online ({server === 'west' ? 'Américas' : server === 'europe' ? 'Europa' : 'Ásia'}). 
            <span className="hidden sm:inline"> Dados do Albion Data Project processados via algoritmos e IA.</span>
          </p>
        </div>

        {/* Stats Summary */}
        <StatsHeader 
          totalFlips={filteredData.length} 
          avgMargin={avgMargin} 
          highestProfit={highestProfit} 
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Table - Spans 2 cols on large screens, full on mobile */}
          <div className="lg:col-span-3">
             <MarketTable 
               data={filteredData} 
               isLoading={loading} 
               onAnalyze={handleAnalyze}
               onShowRoute={handleShowRoute} // Passando nova prop
               onRefresh={loadData}
             />
          </div>
        </div>
      </main>

      {/* AI Modal */}
      <AnalysisModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        flip={selectedFlip}
        analysis={aiAnalysis}
        isAnalyzing={isAnalyzing}
      />

      {/* Map Modal */}
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