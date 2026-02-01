'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Globe, Rocket, Timer, Wand2
} from 'lucide-react'

// --- LOGICA DE INTELIGÊNCIA ARTIFICIAL ---
const gerarSugestaoIA = (campo: string, cargo: string) => {
  const base: any = {
    resumo: [
      `Profissional de ${cargo || 'sua área'} com forte capacidade analítica e foco em resultados.`,
      `Especialista em ${cargo || 'sua área'} com vasta experiência em gestão de projetos.`
    ],
    exp: `• Liderança estratégica de processos.\n• Implementação de novas metodologias.\n• Foco em resultados.`,
    skills: "Comunicação, Liderança, Excel, Gestão de Projetos"
  };
  return base[campo] || "Texto sugerido pela IA para este campo.";
};

export default function SuperGeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); 
  const [montado, setMontado] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: ''
  });

  useEffect(() => {
    setMontado(true);
    const salvo = localStorage.getItem('cv_ultra_v1');
    if (salvo) {
      try { setDados(JSON.parse(salvo)); } catch (e) { console.error(e); }
    }
  }, []);

  const update = (obj: any) => {
    const novo = { ...dados, ...obj };
    setDados(novo);
    if (typeof window !== 'undefined') localStorage.setItem('cv_ultra_v1', JSON.stringify(novo));
  };

  const usarIA = (campo: string) => {
    setLoadingIA(true);
    setTimeout(() => {
      const texto = gerarSugestaoIA(campo, dados.cargo);
      update({ [campo]: typeof texto === 'string' ? texto : texto[0] });
      setLoadingIA(false);
    }, 800);
  };

  if (!isLoaded || !montado) return null;

  // FUNÇÃO QUE RENDERIZA O CONTEÚDO DE CADA ETAPA
  const renderConteudo = () => {
    if (fluxo === 1) {
      return (
        <div className="space-y-6 animate-in slide-in-from-right-10">
          <h2 className="text-3xl font-black tracking-tighter">Quem é você?</h2>
          <div className="space-y-4">
            <input className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold" placeholder="NOME COMPLETO" value={dados.nome} onChange={e => update({nome: e.target.value})}/>
            <input className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold" placeholder="CARGO DESEJADO" value={dados.cargo} onChange={e => update({cargo: e.target.value})}/>
          </div>
        </div>
      );
    }

    if (fluxo === 11) {
      return (
        <div className="animate-in zoom-in text-center space-y-8">
          <div className="bg-white p-12 rounded-[3.5rem] border-4 border-blue-50 shadow-2xl">
            <h2 className="text-4xl font-black italic">PRONTO!</h2>
            <div className="text-6xl font-black text-slate-900 my-8">R$ 5,99</div>
            <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-8 bg-blue-600 text-white rounded-3xl font-black text-2xl shadow-xl hover:bg-blue-700 transition-all uppercase">Liberar PDF</button>
          </div>
        </div>
      );
    }

    // PARA TODAS AS OUTRAS ETAPAS (2, 3, 4, 5, 6, 7, 8, 9, 10)
    return (
      <div className="space-y-6 animate-in slide-in-from-right-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase text-blue-600">Etapa {fluxo}</h2>
            <p className="text-slate-400 font-bold">Preencha os detalhes ou use a IA.</p>
          </div>
          <button onClick={() => usarIA('resumo')} disabled={loadingIA} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            {loadingIA ? <Timer className="animate-spin" size={14}/> : <Wand2 size={14}/>} IA Sugerir
          </button>
        </div>
        <textarea 
          className="w-full h-64 p-8 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none font-medium leading-relaxed shadow-inner" 
          value={dados.resumo} 
          onChange={e => update({resumo: e.target.value})} 
          placeholder="Escreva as informações desta etapa aqui..."
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F4F9] text-slate-900 flex flex-col font-sans">
      <header className="w-full bg-white border-b px-8 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white"><Rocket size={20} fill="white"/></div>
          <h1 className="text-xl font-black tracking-tighter italic">CURRICULO<span className="text-blue-600">.PRO</span></h1>
        </div>
        {fluxo < 11 && (
          <div className="flex-1 max-w-md mx-10 hidden md:flex items-center gap-4">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all" style={{width: `${(fluxo/11)*100}%`}}/>
            </div>
          </div>
        )}
        <SignedIn><UserButton /></SignedIn>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:flex w-72 bg-white border-r p-8 flex-col">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white">
              {user?.imageUrl && <img src={user.imageUrl} />}
            </div>
            <p className="font-bold text-xs truncate">{user?.firstName}</p>
          </div>
          <nav className="space-y-2">
            <div className="p-4 rounded-xl bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-tight flex items-center gap-2"><Wand2 size={16}/> IA Ativada</div>
          </nav>
        </aside>

        <main className="flex-1 flex overflow-hidden">
          <section className="flex-1 overflow-y-auto p-6 md:p-12 bg-white">
            <div className="max-w-xl mx-auto space-y-8">
              {fluxo < 11 && (
                <button onClick={() => setFluxo(fluxo === 1 ? 12 : fluxo - 1)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600">
                  <ArrowLeft size={16}/> Voltar
                </button>
              )}

              {fluxo === 12 ? (
                <div className="space-y-8">
                  <h2 className="text-4xl font-black tracking-tighter">Olá, <span className="text-blue-600">{user?.firstName}!</span></h2>
                  <button onClick={() => setFluxo(1)} className="w-full p-8 bg-blue-600 rounded-[2.5rem] text-white flex items-center justify-between group shadow-xl transition-all hover:scale-[1.01]">
                    <div className="text-left"><p className="font-black text-xl">Novo Currículo</p><p className="text-blue-100 text-xs">Começar agora com IA</p></div>
                    <Plus size={32}/>
                  </button>
                </div>
              ) : renderConteudo()}
            </div>
          </section>

          <section className="hidden xl:flex flex-1 bg-slate-100 p-12 items-center justify-center relative">
            <div className="w-[400px] h-[560px] bg-white shadow-2xl p-10 flex flex-col scale-90">
              <div className="border-l-4 border-blue-600 pl-4 mb-6">
                <h3 className="text-xl font-black uppercase">{dados.nome || 'SEU NOME'}</h3>
                <p className="text-blue-600 font-bold text-[10px] uppercase">{dados.cargo || 'CARGO'}</p>
              </div>
              <div className="text-[9px] text-slate-500 leading-relaxed italic">{dados.resumo || 'Visualização do texto...'}</div>
            </div>
          </section>
        </main>
      </div>

      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button onClick={() => setFluxo(fluxo + 1)} className="w-full max-w-xl py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 flex items-center justify-center gap-2">
            Próxima Etapa <ChevronRight size={18}/>
          </button>
        </footer>
      )}
    </div>
  )
}
