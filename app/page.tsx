'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Sparkles, Plus, ChevronRight, User, 
  Linkedin, Mail, Phone, Wand2, Rocket, Timer, Briefcase, Zap, GraduationCap, FileText
} from 'lucide-react'

export default function GeradorCVFiel() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12);
  const [montado, setMontado] = useState(false); // TRAVA DE SEGURANÇA
  
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '', vagaTexto: '', cnh: 'Não'
  });

  // Só executa no navegador (evita erro de client-side exception)
  useEffect(() => {
    setMontado(true);
    const salvo = localStorage.getItem('cv_fiel_v1');
    if (salvo) {
      try {
        setDados(JSON.parse(salvo));
      } catch (e) {
        console.error("Erro ao ler dados salvos");
      }
    }
  }, []);

  const update = (obj: any) => {
    const novo = { ...dados, ...obj };
    setDados(novo);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cv_fiel_v1', JSON.stringify(novo));
    }
  };

  // Se o Clerk não carregou ou o componente não montou, não renderiza nada ainda
  if (!isLoaded || !montado) return null;

  const renderEtapa = () => {
    switch (fluxo) {
      case 0:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black tracking-tight italic uppercase">O que quer destacar?</h2>
              <p className="text-slate-500 font-bold">Escolha o foco principal do seu currículo hoje</p>
            </div>
            <div className="grid gap-4">
              {[
                {t: 'Experiências Relevantes', d: 'Focar em trajetória e cargos anteriores', i: <Briefcase className="text-blue-600"/>},
                {t: 'Resultados e Skills', d: 'Destaque para competências e conquistas', i: <Zap className="text-amber-500"/>},
                {t: 'Formação e Cursos', d: 'Ideal para quem está começando agora', i: <GraduationCap className="text-purple-600"/>}
              ].map((item, i) => (
                <button key={i} onClick={() => setFluxo(1)} className="flex items-center gap-6 p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-blue-600 transition-all group text-left shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">{item.i}</div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tight">{item.t}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.d}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-8 animate-in zoom-in-95">
            <div className="bg-[#EEF2FF] border border-blue-100 rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200"><Sparkles size={24}/></div>
                <h3 className="text-2xl font-black text-slate-800 mb-6 italic uppercase tracking-tighter">Análise de IA</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600 font-bold"><CheckCircle2 className="text-green-500" size={20}/> Identificamos as palavras-chave ideais.</div>
                  <div className="flex items-center gap-3 text-slate-600 font-bold"><CheckCircle2 className="text-green-500" size={20}/> Seu perfil tem 85% de compatibilidade.</div>
                </div>
                <div className="mt-10 pt-6 border-t border-blue-200 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
                  <Timer size={14}/> IA está otimizando seus textos agora...
                </div>
              </div>
            </div>
            <div className="space-y-3">
               <h4 className="text-center font-black text-slate-400 text-[10px] uppercase tracking-[0.3em] mb-4">Escolha uma opção para prosseguir</h4>
               {['Refinar Experiências', 'Otimizar Habilidades', 'Gerar Resumo Profissional'].map((opt, i) => (
                 <button key={i} onClick={() => setFluxo(7)} className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-between group uppercase text-xs tracking-widest">
                   {opt} <ChevronRight size={18} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all"/>
                 </button>
               ))}
            </div>
          </div>
        )
      case 11:
        return (
          <div className="text-center space-y-8 animate-in zoom-in duration-500 py-10">
            <div className="bg-white p-12 rounded-[3.5rem] border shadow-2xl relative">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100"><Rocket size={32}/></div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Currículo Pronto!</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-10">Download em PDF liberado</p>
              <div className="text-7xl font-black text-slate-900 tracking-tighter mb-10">R$ 5,99</div>
              <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 uppercase italic">
                Liberar Agora <ChevronRight size={24}/>
              </button>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Preencha os dados</h2>
            <div className="space-y-4">
              {fluxo === 1 && (
                <>
                  <input className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-black shadow-sm" placeholder="NOME COMPLETO" value={dados.nome} onChange={e => update({nome: e.target.value})}/>
                  <input className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-black shadow-sm" placeholder="CARGO PRETENDIDO" value={dados.cargo} onChange={e => update({cargo: e.target.value})}/>
                </>
              )}
              {fluxo === 2 && (
                <>
                  <input className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-black shadow-sm" placeholder="WHATSAPP" value={dados.tel} onChange={e => update({tel: e.target.value})}/>
                  <input className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-black shadow-sm" placeholder="E-MAIL" value={dados.email} onChange={e => update({email: e.target.value})}/>
                </>
              )}
              {(fluxo >= 3 && fluxo <= 10 && fluxo !== 6) && (
                <textarea 
                  className="w-full h-64 p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] outline-none focus:border-blue-600 font-bold text-slate-600 shadow-sm"
                  placeholder="Descreva aqui os detalhes desta etapa..."
                  value={dados.resumo} 
                  onChange={e => update({resumo: e.target.value})}
                />
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-blue-100">
      
      {fluxo < 11 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-8 py-5 sticky top-0 z-50">
          <button onClick={() => setFluxo(fluxo === 0 ? 12 : fluxo - 1)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
            <ArrowLeft size={16}/> Voltar
          </button>
          <div className="flex-1 max-w-xl mx-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${(fluxo/11)*100}%`}}/>
          </div>
          <span className="text-[10px] font-black text-slate-400 tracking-widest">{fluxo}/11</span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-72 bg-white border-r p-8 flex-col items-center shrink-0">
          <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
            {user?.imageUrl ? (
              <img src={user.imageUrl} className="w-full h-full object-cover" alt="User" />
            ) : (
              <User size={40} className="text-slate-300" />
            )}
          </div>
          <h3 className="font-black text-sm text-slate-800 uppercase tracking-tighter">{user?.firstName || 'Usuário'}</h3>
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1 italic">Conta Ativa</p>
          
          <nav className="w-full mt-10 space-y-2">
            <div className="p-4 rounded-2xl bg-[#EEF2FF] text-blue-700 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border border-blue-100">
              <Sparkles size={18}/> Gerador IA
            </div>
            <SignedIn><div className="flex justify-center pt-6"><UserButton /></div></SignedIn>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-[#F8FAFC]">
          <div className="max-w-2xl mx-auto pb-32">
            {fluxo === 12 && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-black italic uppercase tracking-tighter">Meus Currículos</h1>
                  <button onClick={() => setFluxo(0)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl shadow-blue-100 hover:scale-105 transition-all uppercase italic">Novo Projeto</button>
                </div>
                <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] flex items-center gap-6 cursor-pointer" onClick={() => setFluxo(11)}>
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300"><FileText size={28}/></div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 uppercase text-xs">{dados.cargo || 'Currículo em Edição'}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Salvo Automaticamente</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-200"/>
                </div>
              </div>
            )}
            {fluxo !== 12 && renderEtapa()}
          </div>
        </main>
      </div>

      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={() => setFluxo(fluxo + 1)} 
            className={`w-full max-w-2xl py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs transition-all hover:bg-blue-600 shadow-2xl ${fluxo === 6 ? 'hidden' : 'flex'} items-center justify-center gap-2`}
          >
            Continuar <ChevronRight size={16}/>
          </button>
        </footer>
      )}
    </div>
  )
}
