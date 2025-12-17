import React, { useState, useMemo, useRef } from 'react';
import { FlipOpportunity } from '../types';
import { RefreshCw, ExternalLink, Clock, Map as MapIcon, Info, Sparkles, Gem, Search } from 'lucide-react';

interface MarketTableProps {
  data: FlipOpportunity[];
  isLoading: boolean;
  selectedCity: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableItems: string[];
  onShowRoute: (flip: FlipOpportunity) => void;
  onRefresh: () => void;
}

const ROW_HEIGHT = 88;
const VISIBLE_ROWS = 10;
const BUFFER_ROWS = 5;

const MarketTable: React.FC<MarketTableProps> = ({ 
  data, 
  isLoading, 
  selectedCity, 
  searchQuery,
  onSearchChange,
  availableItems,
  onShowRoute, 
  onRefresh 
}) => {
  const [sortField, setSortField] = useState<keyof FlipOpportunity>('profit');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedEnchantment, setSelectedEnchantment] = useState<string>('all');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');
  
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleSort = (field: keyof FlipOpportunity) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.itemName.toLowerCase().includes(lowerQuery) || 
        item.itemId.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCity) {
      result = result.filter(item => item.buyCity === selectedCity);
    }

    if (selectedQuality !== 'all') {
      const qLevel = parseInt(selectedQuality, 10);
      result = result.filter(item => item.quality === qLevel);
    }

    if (selectedEnchantment !== 'all') {
      const enchLevel = parseInt(selectedEnchantment, 10);
      result = result.filter(item => item.enchantment === enchLevel);
    }

    return result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [data, sortField, sortDir, selectedEnchantment, selectedQuality, selectedCity, searchQuery]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const totalHeight = filteredAndSortedData.length * ROW_HEIGHT;
  const startNode = Math.floor(scrollTop / ROW_HEIGHT);
  const startIndex = Math.max(0, startNode - BUFFER_ROWS);
  const endIndex = Math.min(filteredAndSortedData.length, startNode + VISIBLE_ROWS + BUFFER_ROWS);
  const visibleData = filteredAndSortedData.slice(startIndex, endIndex);
  const paddingTop = startIndex * ROW_HEIGHT;
  const paddingBottom = Math.max(0, totalHeight - (endIndex * ROW_HEIGHT));

  const formatSilver = (value: number) => (value / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + 'k';

  const getQualityName = (q: number) => {
    switch(q) {
      case 1: return 'Normal';
      case 2: return 'Bom';
      case 3: return 'Excepcional';
      case 4: return 'Excelente';
      case 5: return 'Obra-prima';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col h-[750px]">
      <div className="p-6 border-b border-slate-700 bg-slate-800 z-10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Radar de Oportunidades</h2>
            <p className="text-slate-400 text-sm mt-1">{filteredAndSortedData.length} itens encontrados para transporte</p>
          </div>
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all active:scale-95 disabled:opacity-50 shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Escaneando...' : 'Atualizar Dados'}
          </button>
        </div>

        <div className="space-y-4">
          {/* Primeira linha: Seletores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
              <Gem className="h-4 w-4 text-emerald-400" />
              <select 
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer font-medium w-full"
              >
                <option value="all" className="bg-slate-800">Filtrar por Qualidade</option>
                <option value="1" className="bg-slate-800">Normal</option>
                <option value="2" className="bg-slate-800">Bom</option>
                <option value="3" className="bg-slate-800">Excepcional</option>
                <option value="4" className="bg-slate-800">Excelente</option>
                <option value="5" className="bg-slate-800">Obra-prima</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 focus-within:ring-1 focus-within:ring-amber-500 transition-all">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <select 
                value={selectedEnchantment}
                onChange={(e) => setSelectedEnchantment(e.target.value)}
                className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer font-medium w-full"
              >
                <option value="all" className="bg-slate-800">Filtrar por Encanto</option>
                <option value="0" className="bg-slate-800">Sem encantamento (@0)</option>
                <option value="1" className="bg-slate-800">Encantamento @1</option>
                <option value="2" className="bg-slate-800">Encantamento @2</option>
                <option value="3" className="bg-slate-800">Encantamento @3</option>
                <option value="4" className="bg-slate-800">Encantamento @4</option>
              </select>
            </div>
          </div>

          {/* Segunda linha: Busca (abaixo dos seletores) */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              list="items-list-table"
              className="bg-slate-900 text-sm rounded-lg pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-slate-700 w-full placeholder-slate-500 transition-all shadow-inner"
              placeholder="Digite o nome do item para buscar rapidamente..."
            />
            <datalist id="items-list-table">
               {availableItems.map((item) => (
                 <option key={item} value={item} />
               ))}
            </datalist>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 relative scrollbar-thin scrollbar-thumb-slate-600" ref={tableContainerRef} onScroll={handleScroll}>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-[10px] uppercase font-bold text-slate-500 sticky top-0 z-20 shadow-md">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => handleSort('itemName')}>Item</th>
              <th className="px-6 py-4">Rota</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('buyPrice')}>Compra</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('sellPrice')}>Venda</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('profit')}>Lucro Real</th>
              <th className="px-6 py-4 text-right cursor-pointer hover:text-white group relative" onClick={() => handleSort('profitMargin')}>
                <div className="flex items-center justify-end gap-1">
                  ROI <Info className="h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Mapa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {paddingTop > 0 && <tr style={{ height: `${paddingTop}px` }}><td colSpan={8} /></tr>}

            {visibleData.map((flip) => (
              <tr key={flip.id} className="hover:bg-slate-700/30 transition-colors h-[88px]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-12 w-12 bg-slate-900 rounded border border-slate-600 p-1 flex-shrink-0 relative group cursor-pointer"
                      onClick={() => window.open(`https://www.albiononline2d.com/en/item/id/${flip.itemId}`, '_blank')}
                    >
                      <img src={flip.iconUrl} alt="" className="h-full w-full object-contain" />
                      <div className="absolute inset-0 bg-indigo-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                         <ExternalLink className="h-4 w-4 text-white" />
                      </div>
                      {flip.enchantment > 0 && (
                        <div className="absolute -top-1 -right-1 bg-amber-600 text-[8px] font-bold px-1 rounded-full border border-slate-800 text-white shadow-sm">
                          @{flip.enchantment}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium truncate">{flip.itemName}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${
                          flip.quality === 5 ? 'text-amber-400' : 'text-slate-500'
                        }`}>
                          {getQualityName(flip.quality)}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-300">{flip.buyCity}</span>
                    <span className="text-slate-600">➔</span>
                    <span className="text-slate-300 font-bold">{flip.sellCity}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-300">{formatSilver(flip.buyPrice)}</td>
                <td className="px-6 py-4 text-right font-mono text-slate-300">{formatSilver(flip.sellPrice)}</td>
                <td className="px-6 py-4 text-right font-mono text-amber-400 font-bold">+{formatSilver(flip.profit)}</td>
                <td className={`px-6 py-4 text-right font-bold ${flip.profitMargin > 20 ? 'text-green-400' : flip.profitMargin > 5 ? 'text-yellow-400' : 'text-slate-400'}`}>
                  {flip.profitMargin.toFixed(0)}%
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    {flip.lastUpdate.split('T')[1]?.substring(0, 5) || 'Recente'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onShowRoute(flip)} 
                    className="p-2.5 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white rounded-lg transition-all active:scale-95 shadow-lg border border-slate-600" 
                  >
                    <MapIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}

            {paddingBottom > 0 && <tr style={{ height: `${paddingBottom}px` }}><td colSpan={8} /></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;