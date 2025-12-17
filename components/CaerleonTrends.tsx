
import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, RefreshCw } from 'lucide-react';
import { GameServer } from '../types';

interface CaerleonTrendsProps {
  currentServer: GameServer;
}

const HOT_CAERLEON_ITEMS = [
  { id: "T4_BAG@1", name: "Bolsa T4.1", icon: "https://render.albiononline.com/v1/item/T4_BAG@1" },
  { id: "T5_BAG@1", name: "Bolsa T5.1", icon: "https://render.albiononline.com/v1/item/T5_BAG@1" },
  { id: "T6_BAG@1", name: "Bolsa T6.1", icon: "https://render.albiononline.com/v1/item/T6_BAG@1" },
  { id: "T4_CAPE@1", name: "Capa T4.1", icon: "https://render.albiononline.com/v1/item/T4_CAPE@1" },
  { id: "T5_CAPE@1", name: "Capa T5.1", icon: "https://render.albiononline.com/v1/item/T5_CAPE@1" },
  { id: "T6_CAPE@1", name: "Capa T6.1", icon: "https://render.albiononline.com/v1/item/T6_CAPE@1" },
  { id: "T4_MAIN_SWORD@1", name: "Espada T4.1", icon: "https://render.albiononline.com/v1/item/T4_MAIN_SWORD@1" },
  { id: "T5_MAIN_SWORD@1", name: "Espada T5.1", icon: "https://render.albiononline.com/v1/item/T5_MAIN_SWORD@1" },
  { id: "T4_ARMOR_LEATHER_SET1@1", name: "Merc. T4.1", icon: "https://render.albiononline.com/v1/item/T4_ARMOR_LEATHER_SET1@1" },
  { id: "T5_ARMOR_LEATHER_SET1@1", name: "Merc. T5.1", icon: "https://render.albiononline.com/v1/item/T5_ARMOR_LEATHER_SET1@1" },
  { id: "T4_MAIN_AXE@1", name: "Machado T4.1", icon: "https://render.albiononline.com/v1/item/T4_MAIN_AXE@1" },
  { id: "T4_2H_BOW@1", name: "Arco T4.1", icon: "https://render.albiononline.com/v1/item/T4_2H_BOW@1" },
  { id: "T4_HEAD_PLATE_SET3@1", name: "Guardião T4.1", icon: "https://render.albiononline.com/v1/item/T4_HEAD_PLATE_SET3@1" },
  { id: "T4_SHOES_CLOTH_SET2@1", name: "Sand. Clé. T4.1", icon: "https://render.albiononline.com/v1/item/T4_SHOES_CLOTH_SET2@1" },
  { id: "T4_ARMOR_CLOTH_SET2@1", name: "Clérigo T4.1", icon: "https://render.albiononline.com/v1/item/T4_ARMOR_CLOTH_SET2@1" },
  { id: "T4_HEAD_LEATHER_SET2@1", name: "Caçador T4.1", icon: "https://render.albiononline.com/v1/item/T4_HEAD_LEATHER_SET2@1" },
  { id: "T4_SHOES_PLATE_SET1@1", name: "Soldado T4.1", icon: "https://render.albiononline.com/v1/item/T4_SHOES_PLATE_SET1@1" },
  { id: "T4_2H_CROSSBOW@1", name: "Besta T4.1", icon: "https://render.albiononline.com/v1/item/T4_2H_CROSSBOW@1" },
  { id: "T4_2H_DUALSWORD@1", name: "Duplas T4.1", icon: "https://render.albiononline.com/v1/item/T4_2H_DUALSWORD@1" },
  { id: "T4_2H_HALBERD@1", name: "Alabarda T4.1", icon: "https://render.albiononline.com/v1/item/T4_2H_HALBERD@1" },
];

interface PriceInfo {
  buy: number;
  sell: number;
}

const CaerleonTrends: React.FC<CaerleonTrendsProps> = ({ currentServer }) => {
  const [prices, setPrices] = useState<Record<string, PriceInfo>>({});
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const ids = HOT_CAERLEON_ITEMS.map(i => i.id).join(',');
      const baseUrl = currentServer === 'west' ? "https://west.albion-online-data.com" : 
                    currentServer === 'east' ? "https://east.albion-online-data.com" : 
                    "https://europe.albion-online-data.com";
      
      const response = await fetch(`${baseUrl}/api/v2/stats/prices/${ids}?locations=Caerleon,Black%20Market`);
      const data = await response.json();

      const priceMap: Record<string, PriceInfo> = {};
      
      data.forEach((entry: any) => {
        if (!priceMap[entry.item_id]) {
          priceMap[entry.item_id] = { buy: 0, sell: 0 };
        }
        
        if (entry.city === "Caerleon") {
          priceMap[entry.item_id].buy = entry.sell_price_min;
        } else if (entry.city === "Black Market") {
          priceMap[entry.item_id].sell = entry.sell_price_min;
        }
      });

      setPrices(priceMap);
    } catch (error) {
      console.error("Erro ao buscar tendências de Caerleon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [currentServer]);

  const formatSilver = (val: number) => {
    if (val === 0) return '---';
    return (val / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k';
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/20 p-2 rounded-lg">
            <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">🔥 Valores Hot Caerleon (Encantados)</h2>
            <p className="text-slate-400 text-sm">Preços em tempo real: Compra (Caerleon) vs Venda (Mercado Negro)</p>
          </div>
        </div>
        <button 
          onClick={fetchPrices} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          Recarregar
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3">
        {HOT_CAERLEON_ITEMS.map((item) => {
          const itemPrice = prices[item.id] || { buy: 0, sell: 0 };
          const profit = itemPrice.sell > 0 && itemPrice.buy > 0 ? Math.floor(itemPrice.sell * 0.935 - itemPrice.buy) : 0;
          
          return (
            <div 
              key={item.id} 
              className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-col group cursor-pointer hover:border-orange-500/50 transition-all hover:-translate-y-1 shadow-md"
              onClick={() => window.open(`https://www.albiononline2d.com/en/item/id/${item.id}`, '_blank')}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 relative flex-shrink-0">
                  <img src={item.icon} alt={item.name} className="h-full w-full object-contain" />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border border-slate-900 shadow-sm">
                    <TrendingUp className="h-2 w-2 text-white" />
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-200 uppercase leading-tight truncate">
                  {item.name}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-slate-800">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter">Compra</span>
                  <span className="text-[11px] font-mono font-bold text-slate-300">
                    {formatSilver(itemPrice.buy)}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter">Venda (BM)</span>
                  <span className="text-[11px] font-mono font-bold text-amber-400">
                    {formatSilver(itemPrice.sell)}
                  </span>
                </div>
              </div>
              
              {profit > 0 && (
                <div className="mt-2 text-[9px] font-black text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5 text-center uppercase tracking-widest border border-emerald-500/20">
                  Lucro: +{formatSilver(profit)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 flex justify-center">
        <div className="bg-slate-950/50 px-6 py-2 rounded-full border border-slate-800 shadow-inner">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] text-center">
            Dica: Valores baseados no menor preço de venda atual (Sell Price Min).
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaerleonTrends;
