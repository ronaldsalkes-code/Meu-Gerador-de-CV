'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Sparkles, Briefcase, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Linkedin, Mail, MapPin, Phone, Wand2, Rocket, Timer
} from 'lucide-react'

export default function GeradorCVFinal() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // Começa no Dashboard
  const [loadingIA, setLoadingIA] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '', vagaTexto: '', cnh: 'Não'
  });

  // Salvar/Carregar
  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_v3');
    if (salvo) setDados(JSON.parse(salvo));
  }, []);

  const update = (obj: any) => {
    const novo = { ...dados, ...obj };
    setDados(novo);
    localStorage.setItem('cv_premium_v3', JSON.stringify(novo));
  };

  const usarIA = (campo: string) => {
    setLoadingIA(true);
    setTimeout(() => {
      const sugestoes: any = {
        resumo: `Profissional de ${dados.cargo || 'sua área'} com foco em resultados e otimização de processos.`,
        exp: `• Gestão de rotinas e liderança de equipe.\n• Foco em metas e qualidade de entrega.`,
        skills: "Liderança, Excel, Comunicação, Gestão de Tempo"
      };
      update({ [campo]: sugestoes[campo] });
      setLoadingIA(false);
    }, 600);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      
      {/* HEADER FIXO */}
      <header className="w-full bg-white border-b px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Rocket size={18}/></div>
          <h1 className="font-black tracking-tighter text-lg italic">CV<span className="text-blue-600">.AI</span></h1>
        </div>
        
        {fluxo < 11 && (
          <div className="flex-1 max-w-xs mx-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all" style={{width: `${(fluxo/10)*100}%`}}/>
          </div>
        )}

        <SignedIn><UserButton /></SignedIn>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR STATUS */}
        <aside className="hidden lg:flex w-64 bg-white border-r p-6 flex-col">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 mx-auto mb-3 overflow-hidden border border-slate-100">
              <img src={user?.imageUrl} alt="" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400">Status: Editando</p>
          </div>
          
          <nav className="space-y-2">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold flex items-center gap-2">
              <Sparkles size={14}/> IA Conectada
            </div>
          </nav>
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12 pb-32">
          <div className="max-w-2xl mx-auto">
            
            {/* BOTÃO VOLTAR */}
            {fluxo < 11 && (
              <button onClick={() => setFluxo(fluxo === 0 ? 12 : fluxo - 1)} className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-blue-600">
                <ArrowLeft size={16}/> Voltar
              </button>
            )}

            {/* DASHBOARD */}
            {fluxo === 12 && (
              <div className="space-y-6 animate-in fade-in">
                <h2 className="text-3xl font-black">Olá, {user?.firstName}!</h2>
                <button onClick={() => setFluxo(0)} className="w-full p-8 bg-blue-600 text-white rounded-[2rem] flex items-center justify-between shadow-xl shadow-blue-100 hover:scale-[1.01] transition-all group">
                   <div className="text-left">
                     <p className="font-black text-xl">Novo Currículo</p>
                     <p className="text-blue-100 text-xs">Começar agora com IA</p>
                   </div>
                   <Plus size={24} className="group-hover:rotate-90 transition-transform"/>
                </button>
              </div>
            )}

            {/* ETAPA 0: FOCO */}
            {fluxo === 0 && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-black italic">O que quer destacar?</h2>
                {['Experiências Relevantes', 'Minhas Habilidades', 'Formação Acadêmica'].map((t, i) => (
                  <button key={i} onClick={() => setFluxo(1)} className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-blue-600 font-bold transition-all">
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* ETAPA 1: NOME E CARGO */}
            {fluxo === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-2xl font-black uppercase italic">Identificação</h2>
                <div className="space-y-4">
                  <input className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="Seu Nome" value={dados.nome} onChange={e => update({nome: e.target.value})}/>
                  <input className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="Seu Cargo" value={dados.cargo} onChange={e => update({cargo: e.target.value})}/>
                </div>
              </div>
            )}

            {/* ETAPA 2: CONTATOS */}
            {fluxo === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-2xl font-black uppercase italic">Contatos</h2>
                <div className="space-y-4">
                  <div className="relative"><Phone className="absolute left-5 top-5 text-slate-300"/><input className="w-full p-5 pl-14 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="WhatsApp" value={dados.tel} onChange={e => update({tel: e.target.value})}/></div>
                  <div className="relative"><Mail className="absolute left-5 top-5 text-slate-300"/><input className="w-full p-5 pl-14 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="E-mail" value={dados.email} onChange={e => update({email: e.target.value})}/></div>
                </div>
              </div>
            )}

            {/* ETAPA 3: VAGA TEXTO */}
            {fluxo === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-2xl font-black uppercase italic">Descrição da Vaga</h2>
                <textarea className="w-full h-48 p-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="Cole a vaga aqui para a IA analisar..." value={dados.vagaTexto} onChange={e => update({vagaTexto: e.target.value})}/>
              </div>
            )}

            {/* ETAPA 4: RESUMO COM IA */}
            {fluxo === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase italic">Resumo</h2>
                  <button onClick={() => usarIA('resumo')} className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-2"><Wand2 size={12}/> Sugerir IA</button>
                </div>
                <textarea className="w-full h-48 p-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" value={dados.resumo} onChange={e => update({resumo: e.target.value})}/>
              </div>
            )}

            {/* ETAPA 5: EXPERIÊNCIA */}
            {fluxo === 5 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black uppercase italic">Experiência</h2>
                  <button onClick={() => usarIA('exp')} className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-2"><Wand2 size={12}/> Sugerir IA</button>
                </div>
                <textarea className="w-full h-64 p-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" value={dados.exp} onChange={e => update({exp: e.target.value})}/>
              </div>
            )}

            {/* ETAPA 6: ESTUDOS */}
            {fluxo === 6 && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                 <h2 className="text-2xl font-black uppercase italic">Estudos</h2>
                 <textarea className="w-full h-32 p-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="Formação e Instituição" value={dados.estudos} onChange={e => update({estudos: e.target.value})}/>
               </div>
            )}

            {/* ETAPA 7: SKILLS */}
            {fluxo === 7 && (
               <div className="space-y-6 animate-in slide-in-from-right-4">
                 <h2 className="text-2xl font-black uppercase italic">Habilidades</h2>
                 <input className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-600 font-bold" placeholder="Excel, Vendas, Inglês..." value={dados.skills} onChange={e => update({skills: e.target.value})}/>
               </div>
            )}

            {/* ETAPA 11: PAGAMENTO */}
            {fluxo === 11 && (
              <div className="text-center space-y-8 animate-in zoom-in duration-500">
                <div className="bg-white p-12 rounded-[3rem] border shadow-2xl">
                  <h2 className="text-3xl font-black italic">PRONTO!</h2>
                  <p className="text-slate-400 font-bold text-xs mb-8 uppercase tracking-widest">Seu currículo foi otimizado</p>
                  <div className="text-6xl font-black mb-8 text-slate-900">R$ 5,99</div>
                  <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-lg hover:bg-blue-700 transition-all">
                    BAIXAR AGORA
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* FOOTER NAVEGAÇÃO */}
      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={() => setFluxo(fluxo + 1)} 
            className="w-full max-w-xl py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            Continuar <ChevronRight size={16}/>
          </button>
        </footer>
      )}
    </div>
  )
}
