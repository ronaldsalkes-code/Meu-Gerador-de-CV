'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, Eye, Sparkles, Send, FileText, Lock, Plus, 
  ChevronRight, User, Rocket, Timer, Wand2, Mail, Phone, MapPin, Linkedin
} from 'lucide-react'

// --- IA ADAPTATIVA MELHORADA ---
const gerarSugestaoIA = (campo: string, cargo: string) => {
  const c = (cargo || '').toLowerCase();
  const ehAuxiliar = c.includes('auxiliar') || c.includes('ajudante') || c.includes('assistente');
  
  const sugestoes: any = {
    resumo: ehAuxiliar 
      ? `Profissional focado em suporte operacional na área de ${cargo}. Possuo facilidade em organização de fluxos e aprendizado rápido.` 
      : `Especialista em ${cargo} com foco em resultados e otimização de processos.`,
    exp: ehAuxiliar
      ? `• Auxílio na organização de documentos e rotinas.\n• Suporte operacional ao time.\n• Controle de planilhas e prazos.`
      : `• Gestão de indicadores de performance.\n• Liderança de processos estratégicos.\n• Implementação de melhorias.`,
    skills: ehAuxiliar 
      ? "Organização, Pontualidade, Microsoft Office, Trabalho em Equipe" 
      : "Liderança, Gestão de Projetos, Visão Estratégica, Inglês"
  };
  return sugestoes[campo] || "Texto sugerido...";
};

export default function SuperGeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); 
  const [montado, setMontado] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '', cnh: 'Não'
  });

  useEffect(() => {
    setMontado(true);
    const salvo = localStorage.getItem('cv_ultra_v1');
    if (salvo) try { setDados(JSON.parse(salvo)); } catch (e) {}
  }, []);

  const update = (obj: any) => {
    const novo = { ...dados, ...obj };
    setDados(novo);
    localStorage.setItem('cv_ultra_v1', JSON.stringify(novo));
  };

  const usarIA = (campo: string) => {
    setLoadingIA(true);
    setTimeout(() => {
      update({ [campo]: gerarSugestaoIA(campo, dados.cargo) });
      setLoadingIA(false);
    }, 600);
  };

  if (!isLoaded || !montado) return null;

  const renderEtapas = () => {
    switch(fluxo) {
      case 1: return (
        <div className="space-y-4 animate-in slide-in-from-right-5">
          <h2 className="text-2xl font-black italic uppercase">1. Identificação</h2>
          <input className="w-full p-5 bg-slate-50 border-2 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="NOME COMPLETO" value={dados.nome} onChange={e => update({nome: e.target.value})}/>
          <input className="w-full p-5 bg-slate-50 border-2 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="CARGO DESEJADO" value={dados.cargo} onChange={e => update({cargo: e.target.value})}/>
        </div>
      );
      case 2: return (
        <div className="space-y-4 animate-in slide-in-from-right-5">
          <h2 className="text-2xl font-black italic uppercase">2. Contato</h2>
          <div className="grid grid-cols-2 gap-4">
            <input className="p-5 bg-slate-50 border-2 rounded-2xl outline-none" placeholder="WHATSAPP" value={dados.tel} onChange={e => update({tel: e.target.value})}/>
            <input className="p-5 bg-slate-50 border-2 rounded-2xl outline-none" placeholder="EMAIL" value={dados.email} onChange={e => update({email: e.target.value})}/>
          </div>
          <input className="w-full p-5 bg-slate-50 border-2 rounded-2xl outline-none" placeholder="CIDADE / ESTADO" value={dados.cidade} onChange={e => update({cidade: e.target.value})}/>
          <input className="w-full p-5 bg-slate-50 border-2 rounded-2xl outline-none" placeholder="LINK DO LINKEDIN" value={dados.linkedin} onChange={e => update({linkedin: e.target.value})}/>
        </div>
      );
      case 3: return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black italic uppercase">3. Resumo Profissional</h2>
            <button onClick={() => usarIA('resumo')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2">
              {loadingIA ? <Timer className="animate-spin" size={14}/> : <Wand2 size={14}/>} IA SUGERIR
            </button>
          </div>
          <textarea className="w-full h-48 p-6 bg-slate-50 border-2 rounded-2xl outline-none" value={dados.resumo} onChange={e => update({resumo: e.target.value})} placeholder="Fale brevemente sobre sua carreira..."/>
        </div>
      );
      case 4: return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black italic uppercase">4. Experiências</h2>
            <button onClick={() => usarIA('exp')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2">
              <Wand2 size={14}/> IA SUGERIR
            </button>
          </div>
          <textarea className="w-full h-48 p-6 bg-slate-50 border-2 rounded-2xl outline-none" value={dados.exp} onChange={e => update({exp: e.target.value})} placeholder="Empresa - Cargo - Período - Atividades..."/>
        </div>
      );
      case 11: return (
        <div className="text-center space-y-6 py-10">
          <div className="bg-white p-10 rounded-[3rem] border shadow-2xl">
            <Lock className="mx-auto mb-4 text-blue-600" size={40}/>
            <h2 className="text-3xl font-black uppercase italic">Finalizado!</h2>
            <p className="text-slate-400 font-bold text-sm mb-6">Seu currículo está pronto para download.</p>
            <div className="text-5xl font-black mb-8">R$ 5,99</div>
            <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg hover:scale-105 transition-all">LIBERAR DOWNLOAD</button>
          </div>
        </div>
      );
      default: return <div className="p-20 text-center font-black opacity-10">EM BREVE</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F4F9] text-slate-900 flex flex-col font-sans">
      <header className="w-full bg-white border-b px-8 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white"><Rocket size={20} fill="white"/></div>
          <h1 className="text-xl font-black italic">CURRICULO<span className="text-blue-600">.PRO</span></h1>
        </div>
        <SignedIn><UserButton /></SignedIn>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex overflow-hidden">
          <section className="flex-1 overflow-y-auto p-6 md:p-12 bg-white">
            <div className="max-w-xl mx-auto space-y-8 pb-32">
              {fluxo < 11 && (
                <button onClick={() => setFluxo(fluxo === 1 ? 12 : fluxo - 1)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">
                  <ArrowLeft size={16}/> Voltar
                </button>
              )}
              {fluxo === 12 ? (
                <div className="space-y-8 py-10">
                  <h2 className="text-4xl font-black tracking-tighter">Olá, <span className="text-blue-600">{user?.firstName}!</span></h2>
                  <button onClick={() => setFluxo(1)} className="w-full p-8 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-between group shadow-xl">
                    <div className="text-left"><p className="font-black text-xl">Criar Currículo</p><p className="text-blue-100 text-xs">Rápido e com IA</p></div>
                    <Plus size={32}/>
                  </button>
                </div>
              ) : renderEtapas()}
            </div>
          </section>

          {/* PREVIEW EM TEMPO REAL */}
          <section className="hidden xl:flex flex-1 bg-slate-100 p-12 items-center justify-center">
            <div className="w-[420px] h-[580px] bg-white shadow-2xl p-8 flex flex-col relative scale-90">
               <div className="border-l-4 border-blue-600 pl-4 mb-6">
                 <h3 className="text-xl font-black uppercase leading-none">{dados.nome || 'NOME'}</h3>
                 <p className="text-blue-600 font-bold text-[10px] mt-1">{dados.cargo || 'CARGO'}</p>
               </div>
               <div className="space-y-4 text-[9px] text-slate-600 leading-relaxed">
                 <div className="flex flex-wrap gap-2 text-slate-400 font-bold border-b pb-2 uppercase">
                   <div className="flex items-center gap-1"><Mail size={8}/> {dados.email || 'email@email.com'}</div>
                   <div className="flex items-center gap-1"><Phone size={8}/> {dados.tel || '(00) 00000-0000'}</div>
                   <div className="flex items-center gap-1"><MapPin size={8}/> {dados.cidade || 'Cidade - UF'}</div>
                 </div>
                 <div className="font-medium italic border-b pb-4">{dados.resumo || 'O resumo profissional aparecerá aqui...'}</div>
                 <div className="space-y-2">
                    <p className="font-black text-blue-600 text-[10px]">EXPERIÊNCIAS</p>
                    <div className="whitespace-pre-line">{dados.exp || 'Detalhes da experiência...'}</div>
                 </div>
               </div>
            </div>
          </section>
        </main>
      </div>

      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button onClick={() => setFluxo(fluxo + 1)} className="w-full max-w-xl py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 flex items-center justify-center gap-2 transition-all active:scale-95">
            Próxima Etapa <ChevronRight size={18}/>
          </button>
        </footer>
      )}
    </div>
  )
}
