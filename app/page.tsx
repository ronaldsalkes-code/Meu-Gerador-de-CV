'use client'

import { useState, useEffect, useRef } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Linkedin, Mail, MapPin, Phone, Award, Timer, GraduationCap, 
  Wand2, Save, Download, Globe, Rocket, Info
} from 'lucide-react'

// --- LOGICA DE INTELIGÊNCIA ARTIFICIAL ---
const gerarSugestaoIA = (campo: string, cargo: string) => {
  const base: any = {
    resumo: [
      `Profissional de ${cargo || 'sua área'} com forte capacidade analítica e foco em resultados. Especialista em otimização de fluxos de trabalho e entrega de metas de alta performance.`,
      `Especialista em ${cargo || 'sua área'} com vasta experiência em gestão de projetos e liderança de equipes multidisciplinares, focado em inovação e eficiência operacional.`
    ],
    exp: [
      `• Liderança estratégica de processos e otimização de recursos.\n• Implementação de novas metodologias que reduziram custos em 15%.\n• Gestão direta de relacionamento com clientes e stakeholders.`,
      `• Execução de rotinas operacionais com foco em excelência e agilidade.\n• Desenvolvimento de relatórios de desempenho para tomada de decisão.`
    ],
    skills: "Comunicação Assertiva, Resolução de Problemas Complexos, Pensamento Analítico, Gestão de Tempo, Adaptabilidade"
  };
  const lista = base[campo];
  return Array.isArray(lista) ? lista[Math.floor(Math.random() * lista.length)] : lista;
};

export default function SuperGeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); 
  const [pago, setPago] = useState(false);
  const [loadingIA, setLoadingIA] = useState(false);
  
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: ''
  });

  // Salva automaticamente
  useEffect(() => {
    const salvo = localStorage.getItem('cv_ultra_v1');
    if (salvo) setDados(JSON.parse(salvo));
    if (localStorage.getItem('cv_pago') === 'true') setPago(true);
  }, []);

  const update = (obj: any) => {
    const novo = { ...dados, ...obj };
    setDados(novo);
    localStorage.setItem('cv_ultra_v1', JSON.stringify(novo));
  };

  const usarIA = (campo: string) => {
    setLoadingIA(true);
    setTimeout(() => {
      const texto = gerarSugestaoIA(campo, dados.cargo);
      update({ [campo]: texto });
      setLoadingIA(false);
    }, 800);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F1F4F9] text-slate-900 flex flex-col font-sans selection:bg-blue-100">
      
      {/* HEADER PREMIUM */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <Rocket size={20} fill="white"/>
          </div>
          <h1 className="text-xl font-black tracking-tighter italic">CURRICULO<span className="text-blue-600">.PRO</span></h1>
        </div>
        
        {fluxo < 11 && (
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-10">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-700" style={{width: `${(fluxo/10)*100}%`}}/>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fluxo*10}%</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          <SignedIn><UserButton afterSignOutUrl="/"/></SignedIn>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        
        {/* SIDEBAR DE STATUS (ESTILO APPLE) */}
        <aside className="hidden lg:flex w-80 bg-white border-r border-slate-200 p-8 flex-col">
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-sm">
                <img src={user?.imageUrl} alt="" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Candidato</p>
                <p className="font-bold text-sm truncate">{user?.firstName || 'Entrar'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className={`h-1.5 rounded-full ${dados.nome ? 'bg-green-500' : 'bg-slate-200'}`}/>
              <div className={`h-1.5 rounded-full ${dados.resumo ? 'bg-green-500' : 'bg-slate-200'}`}/>
              <div className={`h-1.5 rounded-full ${dados.exp ? 'bg-green-500' : 'bg-slate-200'}`}/>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
             <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center gap-3 text-xs font-black uppercase tracking-tight">
               <Wand2 size={18}/> Sugestão de IA Ativa
             </div>
             <div className="p-4 rounded-2xl text-slate-400 flex items-center gap-3 text-xs font-bold">
               <Globe size={18}/> Idioma: Português (BR)
             </div>
          </nav>

          <div className="mt-auto bg-slate-900 rounded-2xl p-4 text-white">
             <p className="text-[10px] font-bold opacity-60 uppercase mb-2">Dica Profissional</p>
             <p className="text-xs font-medium leading-relaxed">Currículos com LinkedIn têm 3x mais chances de visualização.</p>
          </div>
        </aside>

        {/* ÁREA DE TRABALHO CENTRAL */}
        <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-72px)] overflow-hidden">
          
          {/* COLUNA DO FORMULÁRIO */}
          <section className="flex-1 overflow-y-auto p-6 md:p-12 bg-white">
            <div className="max-w-xl mx-auto space-y-10 pb-20">
              
              {/* NAVEGAÇÃO INTERNA */}
              {fluxo < 11 && (
                <button onClick={voltar} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest">
                  <ArrowLeft size={16}/> Voltar
                </button>
              )}

              {/* ETAPA 12: DASHBOARD */}
              {fluxo === 12 && (
                <div className="animate-in fade-in duration-700 space-y-8">
                  <h2 className="text-4xl font-black tracking-tighter">Bem-vindo, <br/><span className="text-blue-600">{user?.firstName}!</span></h2>
                  <div className="grid gap-4">
                    <button onClick={() => setFluxo(0)} className="w-full p-8 bg-blue-600 rounded-[2.5rem] text-white flex items-center justify-between group shadow-xl shadow-blue-100">
                      <div className="text-left">
                        <p className="font-black text-xl">Criar Novo Currículo</p>
                        <p className="text-blue-100 text-xs font-medium">Inicie um projeto do zero com IA</p>
                      </div>
                      <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500"/>
                    </button>
                    
                    <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm"><FileText size={32}/></div>
                      <div className="flex-1">
                        <h4 className="font-black text-slate-700 uppercase text-xs">{dados.cargo || 'Rascunho atual'}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Última edição: Hoje</p>
                      </div>
                      <button onClick={() => setFluxo(11)} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg">Continuar</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPAS DINÂMICAS (EXEMPLO ETAPA 1) */}
              {fluxo === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter">Quem é você?</h2>
                    <p className="text-slate-400 font-bold text-sm">Insira seus dados básicos de identificação.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-1 block group-focus-within:text-blue-600">Nome Completo</label>
                      <input className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none font-bold transition-all shadow-sm" value={dados.nome} onChange={e => update({nome: e.target.value})} placeholder="Ex: João Silva"/>
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-1 block group-focus-within:text-blue-600">Cargo Desejado</label>
                      <input className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none font-bold transition-all shadow-sm" value={dados.cargo} onChange={e => update({cargo: e.target.value})} placeholder="Ex: Gerente de Vendas"/>
                    </div>
                  </div>
                </div>
              )}

              {/* ETAPA IA WRITER (EXEMPLO RESUMO) */}
              {fluxo === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-10">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-black tracking-tighter italic text-blue-600 uppercase">Perfil</h2>
                      <p className="text-slate-400 font-bold text-sm">Resuma sua carreira profissional.</p>
                    </div>
                    <button 
                      onClick={() => usarIA('resumo')} 
                      disabled={loadingIA}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-blue-600 transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                      {loadingIA ? <Timer className="animate-spin" size={14}/> : <Wand2 size={14}/>} IA Sugerir
                    </button>
                  </div>
                  <textarea className="w-full h-64 p-8 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2.5rem] outline-none font-medium leading-relaxed transition-all shadow-inner" value={dados.resumo} onChange={e => update({resumo: e.target.value})} placeholder="Escreva ou deixe a IA sugerir..."/>
                </div>
              )}

              {/* PAGAMENTO E FINALIZAÇÃO */}
              {fluxo === 11 && (
                <div className="animate-in zoom-in duration-500 space-y-8 text-center">
                   <div className="bg-white p-12 rounded-[3.5rem] border-4 border-blue-50 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10"><Lock size={120}/></div>
                      <h2 className="text-4xl font-black tracking-tighter mb-4 italic">QUASE LÁ!</h2>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-10 italic">Otimização completa • Formato ATS aprovado</p>
                      
                      <div className="flex items-center justify-center gap-4 mb-10">
                        <div className="text-6xl font-black text-slate-900 tracking-tighter">R$ 5,99</div>
                        <div className="text-left"><p className="text-[10px] font-black text-green-500 uppercase">Pagamento Único</p><p className="text-[10px] font-bold text-slate-300 line-through uppercase">R$ 29,90</p></div>
                      </div>

                      <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-blue-200 hover:scale-105 transition-all flex items-center justify-center gap-4">
                        LIBERAR PDF <Send size={24}/>
                      </button>
                      
                      <p className="mt-8 text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle2 size={12} className="text-green-500"/> Download ilimitado por 1 ano
                      </p>
                   </div>
                </div>
              )}

            </div>
          </section>

          {/* COLUNA DE VISUALIZAÇÃO (PREVIEW) */}
          <section className="hidden xl:flex flex-1 bg-slate-100 p-12 items-center justify-center overflow-hidden relative">
             <div className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
               <Eye size={16}/> Preview em Tempo Real
             </div>
             <div className="w-[450px] h-[630px] bg-white shadow-2xl rounded-sm p-10 flex flex-col scale-[0.85] origin-center animate-in fade-in zoom-in duration-1000">
                <div className="border-l-8 border-blue-600 pl-6 mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{dados.nome || 'SEU NOME'}</h3>
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-widest">{dados.cargo || 'CARGO'}</p>
                </div>
                <div className="flex-1 space-y-6 overflow-hidden">
                  <div className="space-y-2">
                    <div className="h-1.5 w-20 bg-slate-200 rounded-full"/>
                    <div className="text-[8px] text-slate-400 font-medium leading-relaxed truncate">{dados.resumo || 'Sua descrição profissional aparecerá aqui automaticamente conforme você preenche os campos do formulário.'}</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-1.5 w-32 bg-slate-100 rounded-full"/>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-slate-50 rounded-full"/>
                      <div className="h-2 w-full bg-slate-50 rounded-full"/>
                      <div className="h-2 w-2/3 bg-slate-50 rounded-full"/>
                    </div>
                  </div>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between text-[7px] font-black uppercase text-slate-300 tracking-widest">
                   <span>Curriculo.PRO IA</span>
                   <span>Pág 1 de 1</span>
                </div>
             </div>
          </section>

        </main>
      </div>

      {/* FOOTER NAVEGAÇÃO */}
      {fluxo < 11 && (
        <footer className="w-full bg-white border-t border-slate-200 p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={() => setFluxo(prev => prev + 1)} 
            className="w-full max-w-xl py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            Próxima Etapa <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform"/>
          </button>
        </footer>
      )}
    </div>
  )
}
