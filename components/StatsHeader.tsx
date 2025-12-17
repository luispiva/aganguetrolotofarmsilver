import React from 'react';
import { TrendingUp, DollarSign, Activity, AlertTriangle } from 'lucide-react';

interface StatsHeaderProps {
  totalFlips: number;
  avgMargin: number;
  highestProfit: number;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ totalFlips, avgMargin, highestProfit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Oportunidades Ativas</p>
            <p className="text-2xl font-bold text-white mt-1">{totalFlips}</p>
          </div>
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Margem Média</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{avgMargin}%</p>
          </div>
          <div className="bg-green-500/20 p-2 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Maior Potencial</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{highestProfit.toLocaleString()}</p>
          </div>
          <div className="bg-amber-500/20 p-2 rounded-lg">
            <DollarSign className="h-6 w-6 text-amber-400" />
          </div>
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Nível de Risco</p>
            <p className="text-2xl font-bold text-red-400 mt-1">Médio</p>
          </div>
          <div className="bg-red-500/20 p-2 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;