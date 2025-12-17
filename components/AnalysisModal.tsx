import React from 'react';
import { FlipOpportunity } from '../types';
import { X, Sparkles, AlertCircle } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  flip: FlipOpportunity | null;
  analysis: string;
  isAnalyzing: boolean;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, flip, analysis, isAnalyzing }) => {
  if (!isOpen || !flip) return null;

  // Lógica de cores duplicada do MarketTable para consistência visual
  const getEnchantmentConfig = (enchantment: number) => {
    switch(enchantment) {
      case 1: return {
        border: 'border-green-500',
        shadow: 'shadow-[0_0_20px_-5px_rgba(34,197,94,0.7)]', 
        badgeBg: 'bg-green-600',
        text: 'text-green-400'
      };
      case 2: return {
        border: 'border-blue-500',
        shadow: 'shadow-[0_0_20px_-5px_rgba(59,130,246,0.7)]', 
        badgeBg: 'bg-blue-600',
        text: 'text-blue-400'
      };
      case 3: return {
        border: 'border-purple-500',
        shadow: 'shadow-[0_0_20px_-5px_rgba(168,85,247,0.7)]', 
        badgeBg: 'bg-purple-600',
        text: 'text-purple-400'
      };
      case 4: return {
        border: 'border-yellow-400',
        shadow: 'shadow-[0_0_20px_-5px_rgba(250,204,21,0.7)]', 
        badgeBg: 'bg-yellow-500',
        text: 'text-yellow-400'
      };
      default: return {
        border: 'border-slate-600',
        shadow: '',
        badgeBg: 'bg-slate-700',
        text: 'text-slate-400'
      };
    }
  };

  const enchConfig = getEnchantmentConfig(flip.enchantment);

  // Formatter function to strip decimals and ensure correct locale (pt-BR)
  const formatSilver = (value: number) => {
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-700 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 p-6 flex justify-between items-start border-b border-slate-700 relative overflow-hidden">
          {/* Fundo decorativo sutil */}
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <Sparkles className="w-32 h-32 text-white" />
          </div>

          <div className="flex gap-5 relative z-10">
            {/* Imagem do Item em destaque */}
            <div className={`h-20 w-20 bg-slate-900 rounded-xl border-2 p-1 flex-shrink-0 relative ${enchConfig.border} ${enchConfig.shadow}`}>
               <img 
                  src={flip.iconUrl} 
                  alt={flip.itemName}
                  className="h-full w-full object-contain"
                />
               
               {/* Badge de Encantamento na Modal */}
               {flip.enchantment > 0 && (
                  <div className={`absolute -top-3 -right-3 h-7 w-7 flex items-center justify-center rounded-full text-sm font-bold border-2 border-slate-800 text-white ${enchConfig.badgeBg} shadow-lg`}>
                    {flip.enchantment}
                  </div>
               )}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">Consultor Gemini AI</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {flip.itemName} 
                {flip.enchantment > 0 && <span className={`${enchConfig.text} ml-1`}>.{flip.enchantment}</span>}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                 <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded font-mono">
                   Tier {flip.tier.replace('T', '')}
                 </span>
                 <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
                   flip.quality === 1 ? 'border-slate-600 text-slate-400' : 
                   flip.quality === 2 ? 'border-green-800 bg-green-900/20 text-green-400' : 
                   'border-blue-800 bg-blue-900/20 text-blue-400'
                 }`}>
                   {flip.quality === 1 ? 'Normal' : flip.quality === 2 ? 'Bom' : flip.quality === 3 ? 'Excepcional' : flip.quality === 4 ? 'Ótimo' : 'Obra-prima'}
                 </span>
              </div>
              <p className="text-slate-400 text-xs mt-2 flex items-center gap-2">
                Rota: <span className="text-white">{flip.buyCity}</span> <span className="text-slate-600">➔</span> <span className="text-white">{flip.sellCity}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-slate-700 opacity-30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-slate-300 text-sm animate-pulse">Analisando riscos de mercado e liquidez...</p>
            </div>
          ) : (
            <div className="space-y-4">
               <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700">
                 <p className="text-slate-300 leading-relaxed text-sm">
                   {analysis}
                 </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                    <p className="text-xs text-slate-400 uppercase">Lucro Est.</p>
                    <p className="text-lg font-bold text-green-400">{formatSilver(flip.profit)} prata</p>
                 </div>
                 <div className="bg-slate-700/30 p-3 rounded border border-slate-600">
                    <p className="text-xs text-slate-400 uppercase">Margem</p>
                    <p className="text-lg font-bold text-amber-400">{flip.profitMargin.toFixed(0)}%</p>
                 </div>
               </div>
               
               <div className="flex items-start gap-2 text-xs text-slate-500 mt-2 bg-amber-900/10 p-2 rounded border border-amber-900/20">
                 <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                 <p>Os dados de mercado mudam rapidamente. Sempre verifique os preços no jogo antes de comprometer grandes capitais.</p>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;