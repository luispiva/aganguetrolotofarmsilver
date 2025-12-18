
import React, { useState, useEffect } from 'react';
import { Flame, TrendingUp, RefreshCw, AlertCircle, ShoppingCart, Target } from 'lucide-react';
import { GameServer } from '../types';

interface CaerleonTrendsProps {
  currentServer: GameServer;
}

const HOT_CAERLEON_ITEMS = [
  { id: "T4_BAG@2", name: "Bolsa T4.2", icon: "https://render.albiononline.com/v1/item/T4_BAG@2" },
  { id: "T4_BAG@3", name: "Bolsa T4.3", icon: "https://render.albiononline.com/v1/item/T4_BAG@3" },
  { id: "T5_BAG@2", name: "Bolsa T5.2", icon: "https://render.albiononline.com/v1/item/T5_BAG@2" },
  { id: "T5_BAG@3", name: "Bolsa T5.3", icon: "https://render.albiononline.com/v1/item/T5_BAG@3" },
  { id: "T6_BAG@2", name: "Bolsa T6.2", icon: "https://render.albiononline.com/v1/item/T6_BAG@2" },
  { id: "T4_CAPE@2", name: "Capa T4.2", icon: "https://render.albiononline.com/v1/item/T4_CAPE@2" },
  { id: "T4_CAPE@3", name: "Capa T4.3", icon: "https://render.albiononline.com/v1/item/T4_CAPE@3" },
  { id: "T5_CAPE@2", name: "Capa T5.2", icon: "https://render.albiononline.com/v1/item/T5_CAPE@2" },
  { id: "T6_CAPE@2", name: "Capa T6.2", icon: "https://render.albiononline.com/v1/item/T6_CAPE@2" },
  { id: "T4_MAIN_SWORD@2", name: "Espada T4.2", icon: "https://render.albiononline.com/v1/item/T4_MAIN_SWORD@2" },
  { id: "T4_MAIN_SWORD@3", name: "Espada T4.3", icon: "https://render.albiononline.com/v1/item/T4_MAIN_SWORD@3" },
  { id: "T5_MAIN_SWORD@2", name: "Espada T5.2", icon: "https://render.albiononline.com/v1/item/T5_MAIN_SWORD@2" },
  { id: "T4_ARMOR_LEATHER_SET1@2", name: "Merc. T4.2", icon: "https://render.albiononline.com/v1/item/T4_ARMOR_LEATHER_SET1@2" },
  { id: "T4_ARMOR_LEATHER_SET1@3", name: "Merc. T4.3", icon: "https://render.albiononline.com/v1/item/T4_ARMOR_LEATHER_SET1@3" },
  { id: "T4_2H_BOW@2", name: "Arco T4.2", icon: "https://render.albiononline.com/v1/item/T4_2H_BOW@2" },
  { id: "T4_2H_BOW@3", name: "Arco T4.3", icon: "https://render.albiononline.com/v1/item/T4_2H_BOW@3" },
  { id: "T4_HEAD_PLATE_SET3@2", name: "Guardião T4.2", icon: "https://render.albiononline.com/v1/item/T4_HEAD_PLATE_SET3@2" },
  { id: "T4_ARMOR_CLOTH_SET2@2", name: "Clérigo T4.2", icon: "https://render.albiononline.com/v1/item/T4_ARMOR_CLOTH_SET2@2" },
  { id: "T6_MAIN_AXE@2", name: "Machado T6.2", icon: "https://render.albiononline.com/v1/item/T6_MAIN_AXE@2" },
  { id: "T7_BAG@2", name: "Bolsa T7.2", icon: "https://render.albiononline.com/v1/item/T7_BAG@2" },
];

interface PriceInfo {
  buy: number;  // Preço de venda em Caerleon (nossa compra)
  sell: number; // Preço de compra no Mercado Negro (nossa venda)
}

const CaerleonTrends: React.FC<CaerleonTrendsProps> = ({ currentServer }) => {
  const [prices, setPrices] = useState<Record<string, PriceInfo>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    setError(false);
    try {
      const ids = HOT_CAERLEON_ITEMS.map(i => i.id).join(',');
      const baseUrl = currentServer === 'west' ? "https://west.albion-online-data.com" : 
                    currentServer === 'east' ? "https://east.albion-online-data.com" : 
                    "https://europe.albion-online-data.com";
      
      // Buscando qualidades Normal(1), Bom(2) e Excepcional(3) para itens de alto tier
      const response = await fetch(`${baseUrl}/api/v2/stats/prices/${ids}?locations=Caerleon,Black%20Market&qualities=1,2,3`);
      
      if (!response.ok) throw new Error("API Connection Error");
      
      const data = await response.json();
      const priceMap: Record<string, PriceInfo> = {};
      
      data.forEach((entry: any) => {
        const itemId = entry.item_id;
        if (!priceMap[itemId]) {
          priceMap[itemId] = { buy: 0, sell: 0 };
        }
        
        const cityName = entry.city.trim();
        if (cityName === "Caerleon") {
          const currentBuy = entry.sell_price_min || 0;
          if (priceMap[itemId].buy === 0 || (currentBuy > 0 && currentBuy < priceMap[itemId].buy)) {
             priceMap[itemId].buy = currentBuy;
          }
        } else if (cityName === "Black Market") {
          const currentSell = entry.buy_price_max || 0;
          if (currentSell > priceMap[itemId].sell) {
            priceMap[itemId].sell = currentSell;
          }
        }
      });

      setPrices(priceMap);
      if (data.length === 0) setError(true);
    } catch (error) {
      console.error("Erro ao buscar tendências de Caerleon:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [currentServer]);

  const formatSilver = (val: number) => {
    if (val === 0) return 'S/ Dados';
    return (val / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'k';
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-2 rounded-lg">
            <Flame className="h-6 w-6 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Top 20 High-Enchant (Caerleon ➔ BM)</h2>
            <p className="text-slate-400 text-sm">Focado em itens .2 e .3 para maior margem de lucro</p>
          </div>
        </div>
        <button 
          onClick={fetchPrices} 
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-50 border border-slate-600 shadow-lg"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Sincronizando...' : 'Atualizar Preços'}
        </button>
      </div>

      {error && !loading && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">Os preços do Albion Data Project estão demorando para responder. Tente recarregar.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {HOT_CAERLEON_ITEMS.map((item) => {
          const itemPrice = prices[item.id] || { buy: 0, sell: 0 };
          const profit = itemPrice.sell > 0 && itemPrice.buy > 0 ? Math.floor(itemPrice.sell * 0.935 - itemPrice.buy) : 0;
          
          return (
            <div 
              key={item.id} 
              className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex flex-col group transition-all shadow-md hover:shadow-amber-500/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-slate-950 rounded-xl border border-slate-800 p-1 flex-shrink-0 relative">
                  <img src={item.icon} alt={item.name} className="h-full w-full object-contain" />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 border border-slate-900 shadow-sm">
                    <Target className="h-2 w-2 text-slate-900" />
                  </div>
                </div>
                <span className="text-xs font-black text-slate-200 uppercase leading-tight truncate">
                  {item.name}
                </span>
              </div>
              
              <div className="space-y-3 mt-auto">
                <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded-lg border border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-black flex items-center gap-1">
                       <ShoppingCart className="h-2 w-2" /> Compra (Cae)
                    </span>
                    <span className={`text-sm font-mono font-bold ${itemPrice.buy > 0 ? 'text-slate-100' : 'text-slate-600 italic'}`}>
                      {formatSilver(itemPrice.buy)}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-slate-700"></div>
                  <div className="flex flex-col text-right">
                    <span className="text-[9px] text-slate-500 uppercase font-black flex items-center justify-end gap-1">
                      Venda (BM) <TrendingUp className="h-2 w-2" />
                    </span>
                    <span className={`text-sm font-mono font-bold ${itemPrice.sell > 0 ? 'text-amber-400' : 'text-slate-600 italic'}`}>
                      {formatSilver(itemPrice.sell)}
                    </span>
                  </div>
                </div>
                
                {profit > 0 ? (
                  <div className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 rounded-lg py-1.5 text-center uppercase tracking-widest border border-emerald-500/20 shadow-inner">
                    Lucro: +{formatSilver(profit)}
                  </div>
                ) : (
                  <div className="text-[10px] font-black text-slate-600 bg-slate-800/50 rounded-lg py-1.5 text-center uppercase tracking-widest border border-slate-800">
                    Sem Margem
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 flex justify-center">
        <div className="bg-slate-950/50 px-8 py-3 rounded-full border border-slate-800 shadow-inner flex items-center gap-4">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-center">
             Itens com encantamentos altos costumam ter menor volume, mas lucros individuais massivos.
          </p>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-[10px] text-amber-500/70 font-bold uppercase">Taxa BM: 6.5%</span>
        </div>
      </div>
    </div>
  );
};

export default CaerleonTrends;
