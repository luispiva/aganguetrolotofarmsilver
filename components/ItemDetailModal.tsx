
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, History, Info, ExternalLink, ArrowUpRight, ArrowDownRight, Minus, ShoppingCart, DollarSign, Activity, Globe } from 'lucide-react';
import { FlipOpportunity, GameServer } from '../types';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  flip: FlipOpportunity | null;
  server: GameServer;
}

interface HistoryPoint {
  item_count: number;
  avg_price: number;
  timestamp: string;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ isOpen, onClose, flip, server }) => {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && flip) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const baseUrl = server === 'west' ? "https://west.albion-online-data.com" : 
                        server === 'east' ? "https://east.albion-online-data.com" : 
                        "https://europe.albion-online-data.com";
          
          // Busca histórico das últimas 24h para tentar obter dados recentes
          const response = await fetch(
            `${baseUrl}/api/v2/stats/history/${flip.itemId}?locations=${flip.buyCity},${flip.sellCity}&qualities=${flip.quality}&time-scale=6`
          );
          const data = await response.json();
          
          // Processa os dados de histórico para as duas cidades
          if (data && Array.isArray(data)) {
             // Vamos focar no histórico do destino (sellCity) para ver tendências de lucro
             const sellCityData = data.find((d: any) => d.location === flip.sellCity);
             if (sellCityData && sellCityData.data) {
                setHistory(sellCityData.data.slice(-12).reverse()); // Últimos 12 pontos (72h aprox)
             }
          }
        } catch (error) {
          console.error("Erro ao buscar histórico:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, flip, server]);

  if (!isOpen || !flip) return null;

  const formatSilver = (value: number) => value.toLocaleString('pt-BR');
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + 
           d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getPriceTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUpRight className="h-4 w-4 text-green-400" />;
    if (current < previous) return <ArrowDownRight className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-slate-500" />;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header Section */}
        <div className="relative p-6 bg-slate-800 border-b border-slate-700">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="h-32 w-32 bg-slate-950 rounded-2xl border-2 border-slate-700 p-2 relative group shadow-2xl">
              <img src={flip.iconUrl} alt={flip.itemName} className="h-full w-full object-contain" />
              {flip.enchantment > 0 && (
                <div className="absolute -top-3 -right-3 h-8 w-8 bg-amber-600 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-white shadow-lg">
                  .{flip.enchantment}
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-indigo-500/30">
                  Tier {flip.tier}
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/30">
                  Qualidade {flip.quality}
                </span>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-amber-500/30">
                  Servidor {server.toUpperCase()}
                </span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                {flip.itemName}
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Compra em {flip.buyCity}</p>
                  <p className="text-lg font-mono font-bold text-slate-200">{formatSilver(flip.buyPrice)}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Venda em {flip.sellCity}</p>
                  <p className="text-lg font-mono font-bold text-amber-400">{formatSilver(flip.sellPrice)}</p>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <p className="text-[10px] text-emerald-500 uppercase font-bold mb-1">Lucro Líquido</p>
                  <p className="text-lg font-mono font-bold text-emerald-400">+{formatSilver(flip.profit)}</p>
                </div>
                <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                  <p className="text-[10px] text-indigo-400 uppercase font-bold mb-1">Retorno (ROI)</p>
                  <p className="text-lg font-mono font-bold text-indigo-400">{flip.profitMargin.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details & History Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: History */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <History className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-white uppercase text-sm tracking-widest">Histórico de Preços ({flip.sellCity})</h3>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Activity className="h-8 w-8 text-indigo-500 animate-pulse" />
                  <p className="text-xs text-slate-500 uppercase font-bold">Buscando registros históricos...</p>
                </div>
              ) : history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((point, idx) => {
                    const nextPoint = history[idx + 1];
                    return (
                      <div key={point.timestamp} className="bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg border border-slate-700/50 flex items-center justify-between transition-colors">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">{formatDate(point.timestamp)}</span>
                          <span className="text-sm font-mono font-bold text-slate-200">{formatSilver(point.avg_price)} <span className="text-[10px] text-slate-600 font-normal">prata</span></span>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex flex-col items-end">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">Volume</span>
                              <span className="text-xs font-bold text-slate-300">{point.item_count} un.</span>
                           </div>
                           {nextPoint && getPriceTrendIcon(point.avg_price, nextPoint.avg_price)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-800/30 p-8 rounded-xl border border-dashed border-slate-700 flex flex-col items-center text-center">
                  <Info className="h-8 w-8 text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">Sem registros históricos suficientes no Albion Data Project para este item recentemente.</p>
                </div>
              )}
            </div>

            {/* Right Column: External Links & Info */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                  <Globe className="h-5 w-5 text-amber-400" />
                  <h3 className="font-bold text-white uppercase text-sm tracking-widest">Links de Verificação</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <a 
                    href={`https://www.albiononline2d.com/en/item/id/${flip.itemId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-800 hover:bg-indigo-900/40 border border-slate-700 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-indigo-500/20">
                        <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">Albion Online 2D</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Gráficos de Longo Prazo</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-white" />
                  </a>

                  <a 
                    href={`https://albion-online-data.com/api/v2/stats/prices/${flip.itemId}?locations=Caerleon,Bridgewatch,FortSterling,Lymhurst,Martlock,Thetford`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-800 hover:bg-emerald-900/40 border border-slate-700 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-emerald-500/20">
                        <Activity className="h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">API Raw Data</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Verificar JSON Bruto</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-white" />
                  </a>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                  <h4 className="font-black text-amber-500 uppercase text-xs tracking-[0.2em]">Análise de Viabilidade</h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "Itens com volume de histórico alto (>5 unidades por ponto) são mais fáceis de vender rapidamente. Itens com ROI muito alto (>50%) podem ser manipulação de mercado ou itens raros de baixo giro."
                </p>
                <div className="mt-4 pt-4 border-t border-amber-500/20 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Confiabilidade</span>
                      <span className="text-xs font-black text-emerald-400 uppercase">Alta (Dados Recentes)</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Giro Estimado</span>
                      <span className="text-xs font-black text-amber-400 uppercase">Médio</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="flex items-center gap-4 text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-[10px] uppercase font-bold">{flip.buyCity}</span>
              </div>
              <div className="h-px w-8 bg-slate-800"></div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span className="text-[10px] uppercase font-bold">{flip.sellCity}</span>
              </div>
           </div>
           
           <div className="flex gap-3 w-full sm:w-auto">
             <button 
                onClick={onClose}
                className="flex-1 sm:flex-none px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
             >
               Fechar
             </button>
             <button 
                onClick={() => window.open(`https://www.albiononline2d.com/en/item/id/${flip.itemId}`, '_blank')}
                className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
             >
               Confirmar no 2D <ExternalLink className="h-3 w-3" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
