
import React from 'react';
import { BookOpen, MousePointer2, TrendingUp, ShieldAlert, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ManualPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 mb-4">
          <BookOpen className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Manual do <span className="text-amber-500">Trader</span></h2>
        <p className="text-slate-400 mt-2">Aprenda a dominar a economia de Albion e carregar o bolso de prata.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Passo 1 */}
        <section className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl">
          <div className="flex items-start gap-6">
            <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center font-black text-white shrink-0">1</div>
            <div>
              <h3 className="text-xl font-bold text-white uppercase mb-3 flex items-center gap-2">
                Configure seu Ambiente <TrendingUp className="h-5 w-5 text-indigo-400" />
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Antes de começar, certifique-se de que o <strong>Servidor</strong> (West, East ou Europe) e seu status de <strong>Premium</strong> estão corretos no topo da página. O sistema recalcula o lucro real automaticamente baseado na taxa de 6.5% (Premium) ou 10.5% (Normal).
              </p>
            </div>
          </div>
        </section>

        {/* Passo 2 */}
        <section className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl">
          <div className="flex items-start gap-6">
            <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center font-black text-white shrink-0">2</div>
            <div>
              <h3 className="text-xl font-bold text-white uppercase mb-3 flex items-center gap-2">
                Filtre as Oportunidades <MousePointer2 className="h-5 w-5 text-indigo-400" />
              </h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                  <span><strong>Cidade de Origem:</strong> Selecione a cidade onde você está para ver o que comprar agora.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                  <span><strong>Qualidade e Encanto:</strong> Filtre itens .2 ou .3 para maiores margens, ou Normal para giro rápido.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Alerta de Busca */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl flex items-start gap-4">
          <Info className="h-6 w-6 text-indigo-400 shrink-0" />
          <div>
            <h4 className="text-white font-bold text-sm uppercase">Por que alguns itens não aparecem?</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              O radar foca em itens de <strong>Alta Liquidez</strong> (os que vendem mais rápido). Itens muito raros ou artefatos específicos podem não estar na lista de monitoramento constante para evitar dados obsoletos e garantir que o lucro mostrado seja real.
            </p>
          </div>
        </div>

        {/* Riscos */}
        <section className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 shadow-xl">
          <div className="flex items-start gap-6">
            <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center font-black text-white shrink-0">!</div>
            <div>
              <h3 className="text-xl font-bold text-white uppercase mb-3 flex items-center gap-2">
                Entendendo os Riscos <ShieldAlert className="h-5 w-5 text-red-500" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <p className="text-red-400 font-bold text-xs uppercase mb-1">Zona Letal</p>
                  <p className="text-[11px] text-slate-500">Rotas para <strong>Caerleon</strong> ou <strong>Mercado Negro</strong> exigem atravessar Zonas Vermelhas. Use montarias de peso e alta resistência.</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <p className="text-amber-400 font-bold text-xs uppercase mb-1">Dados Obsoletos</p>
                  <p className="text-[11px] text-slate-500">Confira a coluna <strong>Status</strong>. Se o preço foi atualizado há mais de 4h, confirme o valor no jogo antes de comprar grandes quantidades.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dica de Ouro */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-emerald-500 shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed italic">
            "Sempre clique no ícone do item para ver os detalhes e links externos. O ROI (Retorno sobre Investimento) ideal para iniciantes é entre 15% e 30% em zonas seguras."
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManualPage;
