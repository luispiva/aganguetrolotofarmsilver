import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';

const HOT_CAERLEON_ITEMS = [
  { id: "T4_BAG", name: "Bolsa T4", icon: "https://render.albiononline.com/v1/item/T4_BAG" },
  { id: "T5_BAG", name: "Bolsa T5", icon: "https://render.albiononline.com/v1/item/T5_BAG" },
  { id: "T6_BAG", name: "Bolsa T6", icon: "https://render.albiononline.com/v1/item/T6_BAG" },
  { id: "T4_CAPE", name: "Capa T4", icon: "https://render.albiononline.com/v1/item/T4_CAPE" },
  { id: "T5_CAPE", name: "Capa T5", icon: "https://render.albiononline.com/v1/item/T5_CAPE" },
  { id: "T4_MAIN_SWORD", name: "Espada Larga T4", icon: "https://render.albiononline.com/v1/item/T4_MAIN_SWORD" },
  { id: "T4_ARMOR_LEATHER_SET1", name: "Casaco Mercenário T4", icon: "https://render.albiononline.com/v1/item/T4_ARMOR_LEATHER_SET1" },
  { id: "T4_MOUNT_HORSE", name: "Cavalo de Montar T4", icon: "https://render.albiononline.com/v1/item/T4_MOUNT_HORSE" },
];

const CaerleonTrends: React.FC = () => {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500/20 p-2 rounded-lg">
          <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">🔥 Itens Hot em Caerleon</h2>
          <p className="text-slate-400 text-sm">Alta liquidez e giro rápido no Mercado Negro e arredores.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {HOT_CAERLEON_ITEMS.map((item) => (
          <div 
            key={item.id} 
            className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex flex-col items-center group cursor-pointer hover:border-orange-500/50 transition-all hover:-translate-y-1 shadow-md"
            onClick={() => window.open(`https://www.albiononline2d.com/en/item/id/${item.id}`, '_blank')}
          >
            <div className="h-16 w-16 mb-2 relative">
              <img src={item.icon} alt={item.name} className="h-full w-full object-contain" />
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-slate-900">
                <TrendingUp className="h-2 w-2 text-white" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-300 text-center leading-tight group-hover:text-white transition-colors">
              {item.name}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">
          Dica: Estes itens costumam ter volume garantido de venda diária.
        </p>
      </div>
    </div>
  );
};

export default CaerleonTrends;