import React from 'react';
import { Coins, Heart, Youtube, Tv, ShieldCheck, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Slogan */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-amber-500">
              <Coins className="h-8 w-8" />
              <span className="font-black text-2xl tracking-tighter uppercase">Trololo <span className="text-slate-500 font-normal">Farm</span></span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              A ferramenta definitiva para transporte e arbitragem no Albion Online. 
              Sincronizado com Albion Data Project para garantir que sua jornada a Caerleon valha cada risco.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@DLopes94" target="_blank" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://www.twitch.tv/Dlopes94" target="_blank" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-purple-500 transition-colors">
                <Tv className="h-5 w-5" />
              </a>
              <a href="mailto:contato@trololofarm.com" className="p-2 bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Plataforma</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="hover:text-amber-500 cursor-pointer transition-colors">Mercado em Tempo Real</li>
              <li className="hover:text-amber-500 cursor-pointer transition-colors">Análise de IA (Gemini)</li>
              <li className="hover:text-amber-500 cursor-pointer transition-colors">Calculadora de Taxas</li>
              <li className="hover:text-amber-500 cursor-pointer transition-colors">Tendências de Caerleon</li>
            </ul>
          </div>

          {/* Créditos Especiais */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Créditos</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                 <ShieldCheck className="h-5 w-5 text-emerald-500 mt-1 flex-shrink-0" />
                 <div>
                    <p className="text-xs font-bold text-white uppercase">Dados do Mercado</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black">Albion Data Project</p>
                 </div>
              </div>
              <div className="flex items-start gap-3">
                 <Heart className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                 <div>
                    <p className="text-xs font-bold text-white uppercase">Idealização</p>
                    {/* Fixed missing closing bracket on p tag below */}
                    <p className="text-[10px] text-slate-500 uppercase font-black">L1zard</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Trololo Farm - Todos os direitos reservados à gangue.
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
             <span className="hover:text-slate-400 cursor-pointer">Privacidade</span>
             <span className="hover:text-slate-400 cursor-pointer">Termos de Uso</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;