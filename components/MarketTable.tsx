import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FlipOpportunity } from '../types';
import { ArrowRight, BrainCircuit, RefreshCw, ExternalLink, Clock, TrendingDown, BarChart3, Map as MapIcon } from 'lucide-react';

interface MarketTableProps {
  data: FlipOpportunity[];
  isLoading: boolean;
  onAnalyze: (flip: FlipOpportunity) => void;
  onShowRoute: (flip: FlipOpportunity) => void;
  onRefresh: () => void;
}

const ROW_HEIGHT = 88; // Altura estimada da linha em pixels (incluindo padding)
const VISIBLE_ROWS = 10; // Quantidade de linhas visíveis aproximada
const BUFFER_ROWS = 5; // Linhas extras para renderizar antes/depois da viewport para suavidade

const MarketTable: React.FC<MarketTableProps> = ({ data, isLoading, onAnalyze, onShowRoute, onRefresh }) => {
  const [sortField, setSortField] = useState<keyof FlipOpportunity>('profit');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  
  // Virtual Scroll State
  const [scrollTop, setScrollTop] = useState(0);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: keyof FlipOpportunity) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    // Reset scroll ao ordenar
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  };

  // Otimização: Memoizar a ordenação para não recalcular a cada scroll
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (sortField === 'lastUpdate') {
         return sortDir === 'asc' 
           ? new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()
           : new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [data, sortField, sortDir]);

  // Lógica de Virtual Scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = sortedData.length * ROW_HEIGHT;
  const startNode = Math.floor(scrollTop / ROW_HEIGHT);
  const startIndex = Math.max(0, startNode - BUFFER_ROWS);
  const endIndex = Math.min(
    sortedData.length,
    startNode + VISIBLE_ROWS + BUFFER_ROWS
  );

  const visibleData = sortedData.slice(startIndex, endIndex);
  const paddingTop = startIndex * ROW_HEIGHT;
  const paddingBottom = Math.max(0, totalHeight - (endIndex * ROW_HEIGHT));

  const getProfitColor = (margin: number) => {
    if (margin > 30) return 'text-green-400';
    if (margin > 15) return 'text-green-200';
    return 'text-slate-300';
  };

  const getCityColor = (city: string) => {
    switch(city) {
      case 'Caerleon': return 'text-red-400 font-bold';
      case 'Thetford': return 'text-purple-400';
      case 'Fort Sterling': return 'text-slate-100';
      case 'Lymhurst': return 'text-green-400';
      case 'Bridgewatch': return 'text-orange-400';
      case 'Martlock': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getQualityLabel = (quality: number) => {
    switch(quality) {
      case 1: return { text: 'Normal', class: 'text-slate-400 border-slate-600 bg-slate-800' };
      case 2: return { text: 'Bom', class: 'text-green-400 border-green-900 bg-green-900/20' };
      case 3: return { text: 'Exc.', class: 'text-blue-400 border-blue-900 bg-blue-900/20' };
      case 4: return { text: 'Ótimo', class: 'text-purple-400 border-purple-900 bg-purple-900/20' };
      case 5: return { text: 'Obra', class: 'text-amber-400 border-amber-900 bg-amber-900/20' };
      default: return { text: '?', class: 'text-slate-400' };
    }
  };

  const getEnchantmentConfig = (enchantment: number) => {
    switch(enchantment) {
      case 1: return { border: 'border-green-500', shadow: 'shadow-[0_0_15px_-3px_rgba(34,197,94,0.6)]', badgeBg: 'bg-green-600', text: 'text-green-400' };
      case 2: return { border: 'border-blue-500', shadow: 'shadow-[0_0_15px_-3px_rgba(59,130,246,0.6)]', badgeBg: 'bg-blue-600', text: 'text-blue-400' };
      case 3: return { border: 'border-purple-500', shadow: 'shadow-[0_0_15px_-3px_rgba(168,85,247,0.6)]', badgeBg: 'bg-purple-600', text: 'text-purple-400' };
      case 4: return { border: 'border-yellow-400', shadow: 'shadow-[0_0_15px_-3px_rgba(250,204,21,0.6)]', badgeBg: 'bg-yellow-500', text: 'text-yellow-400' };
      default: return { border: 'border-slate-600', shadow: '', badgeBg: 'bg-slate-700', text: 'text-slate-400' };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const diff = (new Date().getTime() - new Date(dateString + 'Z').getTime()) / 1000;
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}m atrás`;
    return 'Agora';
  };

  const getTimeColor = (dateString: string) => {
    const diffHours = (new Date().getTime() - new Date(dateString + 'Z').getTime()) / (1000 * 60 * 60);
    if (diffHours < 1) return 'text-green-400';
    if (diffHours < 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatSilver = (value: number) => {
    const adjustedValue = value / 1000;
    return adjustedValue.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[800px]">
      {/* Header Fixo do Card */}
      <div className="p-6 border-b border-slate-700 flex justify-between items-center flex-wrap gap-4 bg-slate-800 z-10">
        <div>
          <h2 className="text-xl font-bold text-white">Oportunidades de Mercado</h2>
          <p className="text-slate-400 text-sm mt-1">Comparando preços entre cidades ({sortedData.length} itens encontrados)</p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Escaneando...' : 'Atualizar Dados'}
        </button>
      </div>
      
      {/* Container com Scroll */}
      <div 
        className="overflow-y-auto flex-1 relative" 
        ref={tableContainerRef}
        onScroll={handleScroll}
      >
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-900 text-xs uppercase font-medium text-slate-500 sticky top-0 z-20 shadow-md">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:text-slate-300 w-1/4" onClick={() => handleSort('itemName')}>Item / Verificar</th>
              <th className="px-6 py-4 cursor-pointer hover:text-slate-300" onClick={() => handleSort('buyCity')}>Rota</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-300" onClick={() => handleSort('buyPrice')}>Compra</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-300" onClick={() => handleSort('sellPrice')}>Venda</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-300" title="Média de preço em todas as cidades">Média Mkt</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-300" onClick={() => handleSort('profit')}>Lucro</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-slate-300" onClick={() => handleSort('profitMargin')}>ROI</th>
              <th className="px-6 py-4 cursor-pointer hover:text-slate-300" onClick={() => handleSort('lastUpdate')}>Atualizado</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedData.length === 0 ? (
               <tr>
                 <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                   {isLoading ? 'Buscando dados mais recentes do mercado...' : 'Nenhuma oportunidade encontrada com os critérios atuais.'}
                 </td>
               </tr>
            ) : (
              <>
                {/* Espaçador Superior - Simula os itens acima do scroll */}
                {paddingTop > 0 && (
                  <tr style={{ height: `${paddingTop}px` }}>
                    <td colSpan={9} />
                  </tr>
                )}

                {/* Itens Visíveis */}
                {visibleData.map((flip) => {
                  const qualityInfo = getQualityLabel(flip.quality);
                  const enchConfig = getEnchantmentConfig(flip.enchantment);
                  const isSellAboveAverage = flip.sellPrice > flip.marketAverage;
                  
                  return (
                    <tr key={flip.id} className="hover:bg-slate-700/50 transition-colors group h-[88px]">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <a 
                            href={`https://albion-online-data.com/view/charts?item=${flip.itemId}&quality=${flip.quality}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`relative h-14 w-14 flex-shrink-0 rounded-lg border-2 p-0.5 cursor-pointer hover:scale-105 transition-all bg-slate-900 ${enchConfig.border} ${enchConfig.shadow}`}
                            title="Clique para verificar no site oficial"
                          >
                            <img 
                              src={flip.iconUrl} 
                              alt={flip.itemName}
                              className="h-full w-full object-contain"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://render.albiononline.com/v1/item/T1_TRASH`; 
                              }}
                            />
                            
                            {flip.enchantment > 0 && (
                              <div className={`absolute -top-2 -right-2 ${enchConfig.badgeBg} text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm z-10 border border-slate-900`}>
                                {flip.enchantment}
                              </div>
                            )}

                            <div className="absolute -bottom-2 -left-2 bg-slate-800 text-[9px] font-bold px-1 py-0.5 rounded border border-slate-600 text-slate-300 shadow-sm z-10">
                              {flip.tier}
                            </div>
                          </a>

                          <div className="flex flex-col">
                            <span className="truncate max-w-[150px] md:max-w-xs flex items-center gap-2 text-base">
                               {flip.itemName}
                               {flip.enchantment > 0 && <span className={`${enchConfig.text} font-bold`}>.{flip.enchantment}</span>}
                            </span>
                            <div className="flex gap-2 mt-1">
                               <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border w-fit ${qualityInfo.class}`}>
                                  {qualityInfo.text}
                               </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <span className={getCityColor(flip.buyCity)}>{flip.buyCity}</span>
                          <ArrowRight className="h-3 w-3 text-slate-600" />
                          <span className={getCityColor(flip.sellCity)}>{flip.sellCity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-300">
                        <div className="flex flex-col items-end">
                          <span>{formatSilver(flip.buyPrice)}</span>
                          {flip.discount > 15 && (
                             <span className="text-[10px] text-green-400 flex items-center gap-1 bg-green-500/10 px-1 rounded mt-0.5 border border-green-500/20" title={`Este item está ${flip.discount.toFixed(0)}% mais barato que a média das outras cidades.`}>
                               <TrendingDown size={10} /> {flip.discount.toFixed(0)}% média
                             </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-300">
                        {formatSilver(flip.sellPrice)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs">
                         <div className="flex flex-col items-end gap-1">
                           <span className="text-slate-400">{formatSilver(flip.marketAverage)}</span>
                           {isSellAboveAverage && (
                             <span className="text-[10px] text-indigo-400 flex items-center gap-1 bg-indigo-500/10 px-1 rounded border border-indigo-500/20" title="Preço de venda acima da média global">
                               <BarChart3 size={10} /> Acima Média
                             </span>
                           )}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-amber-400 font-bold">
                        +{formatSilver(flip.profit)}
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${getProfitColor(flip.profitMargin)}`}>
                        {flip.profitMargin.toFixed(0)}%
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${getTimeColor(flip.lastUpdate)}`}>
                          <Clock className="h-3 w-3" />
                          {getTimeAgo(flip.lastUpdate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => onShowRoute(flip)}
                            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="Ver Rota no Mapa"
                          >
                            <MapIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => onAnalyze(flip)}
                            className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors hover:scale-105 transform duration-200"
                            title="Análise com IA"
                          >
                            <BrainCircuit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Espaçador Inferior - Simula os itens abaixo do scroll */}
                {paddingBottom > 0 && (
                  <tr style={{ height: `${paddingBottom}px` }}>
                    <td colSpan={9} />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;