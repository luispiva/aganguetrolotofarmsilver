
import React from 'react';
import { Trophy, Target, ShieldCheck, Heart, Users, ExternalLink, Youtube, Tv } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic mb-6">
          A Lenda da <span className="text-amber-500">Trololo Farm</span>
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
          Mais do que uma ferramenta de mercado, somos uma irmandade que nasceu da necessidade de dominar o caos econômico de Albion.
        </p>
      </div>

      {/* Grid de História */}
      <div className="space-y-24">
        <section className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 text-amber-500">
              <Trophy className="h-6 w-6" />
              <h3 className="text-xl font-black uppercase tracking-widest">O Começo de Tudo</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Tudo começou nos campos de Martlock, quando um grupo de renegados liderados por <span className="text-white font-bold">Dlopes</span> cansou de farmar recursos por migalhas. Percebemos que o verdadeiro poder em Albion não estava apenas na espada, mas na logística. 
            </p>
            <p className="text-slate-400">
              Enquanto muitos temiam as estradas de Caerleon, nós vimos nelas o caminho para a fortuna. Assim nasceu a "Gangue Trololo Farm", um nome que evoca o deboche contra quem tenta nos parar e a eficiência de quem sabe o que faz.
            </p>
          </div>
          <div className="w-full md:w-72 aspect-square bg-slate-800 rounded-3xl border border-slate-700 flex items-center justify-center p-8 shadow-2xl overflow-hidden relative group">
            <Users className="h-32 w-32 text-slate-700 group-hover:text-amber-500/20 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row-reverse gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3 text-indigo-400">
              <Target className="h-6 w-6" />
              <h3 className="text-xl font-black uppercase tracking-widest">A Filosofia Dlopes</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              "Fique rico ou morra tentando" não é apenas um lema, é o nosso protocolo de operação. Desenvolvemos este radar para que cada membro da gangue e nossos aliados pudessem visualizar o lucro onde outros veem apenas perigo.
            </p>
            <div className="flex gap-4">
               <a href="https://www.youtube.com/@DLopes94" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 rounded-lg border border-red-600/20 hover:bg-red-600 hover:text-white transition-all">
                  <Youtube className="h-4 w-4" /> YouTube
               </a>
               <a href="https://www.twitch.tv/Dlopes94" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 text-purple-400 rounded-lg border border-purple-600/20 hover:bg-purple-600 hover:text-white transition-all">
                  <Tv className="h-4 w-4" /> Twitch
               </a>
            </div>
          </div>
          <div className="w-full md:w-72 aspect-square bg-slate-800 rounded-3xl border border-slate-700 flex items-center justify-center p-8 shadow-2xl relative overflow-hidden">
             <Heart className="h-32 w-32 text-slate-700" />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-black text-amber-500 italic opacity-20">DLOPES</span>
             </div>
          </div>
        </section>

        <section className="bg-slate-800/50 p-12 rounded-3xl border border-slate-700 text-center space-y-8">
           <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto" />
           <h3 className="text-2xl font-black text-white uppercase italic">O Código da Gangue</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                 <p className="text-amber-500 font-black">01. LEALDADE</p>
                 <p className="text-xs text-slate-400">Ninguém transporta sozinho se o lucro for da gangue.</p>
              </div>
              <div className="space-y-2">
                 <p className="text-amber-500 font-black">02. SILÊNCIO</p>
                 <p className="text-xs text-slate-400">Se for chorar porque morreu com o inventário cheio, mande áudio.</p>
              </div>
              <div className="space-y-2">
                 <p className="text-amber-500 font-black">03. AMBIÇÃO</p>
                 <p className="text-xs text-slate-400">O objetivo é o Mamute de Cristal. Nada menos que isso.</p>
              </div>
           </div>
        </section>
      </div>

      <div className="mt-24 pt-12 border-t border-slate-800 text-center">
         <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.3em]">
           Criado por quem entende de prata. Feito para quem quer ser rei.
         </p>
      </div>
    </div>
  );
};

export default AboutPage;
