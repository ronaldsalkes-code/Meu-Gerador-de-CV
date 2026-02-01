'use client' 

import { useState, useEffect } from 'react'
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, Sparkles, Briefcase, FileText, Lock, Plus, 
  ChevronRight, Download, Trash2, LayoutDashboard, CheckCircle2,
  Phone, Mail, Linkedin, MapPin, Star
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); 
  const [gerandoIA, setGerandoIA] = useState(false);
  
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    vagaTexto: ''
  });

  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_data');
    if (salvo) setDados(JSON.parse(salvo));
  }, []);

  const atualizarDados = (novos: any) => {
    const atualizado = { ...dados, ...novos };
    setDados(atualizado);
    localStorage.setItem('cv_premium_data', JSON.stringify(atualizado));
  };

  const otimizarComIA = async () => {
    if (!dados.vagaTexto) return alert("Por favor, cole a descrição da vaga no Passo 3!");
    setGerandoIA(true);
    try {
      const response = await fetch('/api/gerar-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados }),
      });
      const result = await response.json();
      atualizarDados({ 
        resumo: result.resumo || dados.resumo, 
        exp: result.exp || dados.exp, 
        skills: result.skills || dados.skills 
      });
      alert("Currículo otimizado com sucesso pela IA!");
    } catch (e) {
      alert("Conexão instável. Tente novamente.");
    } finally {
      setGerandoIA(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* HEADER LUXURY */}
      <nav className="w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-blue-200 text-white">
            <Briefcase size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-base font-black uppercase tracking-tighter leading-none text-slate-800">CV AI <span className="text-blue-600">PRO</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">High Standard Builder</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setFluxo(12)} className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest">
            <LayoutDashboard size={14}/> Dashboard
          </button>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden flex flex-col min-h-[700px] relative">
          
          {/* PROGRESS BAR (SUTIL) */}
          {fluxo <= 10 && (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out" style={{width: `${(fluxo+1)*10}%`}}></div>
            </div>
          )}

          <main className="flex-1 p-8 md:p-16 overflow-y-auto">
            
            {/* 0. DASHBOARD */}
            {fluxo === 12 && (
              <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700">
                <div className="space-y-4">
                  <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Painel de Controle</span>
                  <h2 className="text-5xl font-black tracking-tight text-slate-900 leading-[0.9]">Bem-vindo de volta,<br/><span className="text-blue-600 underline decoration-blue-100 underline-offset-8">{user?.firstName}</span>.</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button onClick={() => setFluxo(0)} className="group relative bg-slate-900 hover:bg-blue-600 p-10 rounded-[2.5rem] text-left transition-all duration-500 shadow-2xl shadow-slate-200 overflow-hidden">
                    <Plus size={40} className="text-blue-400 mb-6 group-hover:text-white transition-transform group-hover:rotate-90 duration-500" />
                    <div className="font-bold text-white text-2xl">Criar Currículo Elite</div>
                    <p className="text-slate-400 group-hover:text-blue-100 text-sm mt-3 font-medium">Use nossa inteligência para vencer filtros de RH.</p>
                  </button>
                  <button onClick={() => setFluxo(11)} className="group bg-white border-2 border-slate-100 hover:border-blue-600 p-10 rounded-[2.5rem] text-left transition-all duration-500 shadow-sm">
                    <FileText size={40} className="text-slate-300 mb-6 group-hover:text-blue-600" />
                    <div className="font-bold text-slate-800 text-2xl">Editar Rascunho</div>
                    <p className="text-slate-400 text-sm mt-3 font-medium">Acesse o seu último documento salvo.</p>
                  </button>
                </div>
              </div>
            )}

            {/* 1. FORMULARIO MULTI-ETAPAS */}
            {fluxo >= 0 && fluxo <= 10 && (
              <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-500">
                
                {fluxo === 0 && (
                   <div className="text-center py-10 space-y-6">
                      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star size={32} fill="currentColor"/>
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter">Pronto para ser o Candidato #1?</h2>
                      <p className="text-slate-500 font-medium max-w-xs mx-auto text-lg leading-snug">Vamos transformar seus dados em um currículo de alto impacto em minutos.</p>
                      <button onClick={()=>setFluxo(1)} className="px-14 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">Iniciar Jornada</button>
                   </div>
                )}

                {fluxo === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tight">Identidade Profissional</h3>
                      <p className="text-slate-400 font-medium">Como você quer ser apresentado às empresas?</p>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black uppercase text-slate-400 ml-4">Nome Completo</label>
                      <input className="w-full p-6 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 ring-blue-500/10 font-bold text-lg border-none placeholder:text-slate-300" placeholder="Ex: Ronald Silva" value={dados.nome} onChange={e=>atualizarDados({nome:e.target.value})}/>
                      <label className="block text-[10px] font-black uppercase text-slate-400 ml-4 mt-4">Cargo Desejado</label>
                      <input className="w-full p-6 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 ring-blue-500/10 font-bold text-lg border-none placeholder:text-slate-300" placeholder="Ex: Gerente de Operações" value={dados.cargo} onChange={e=>atualizarDados({cargo:e.target.value})}/>
                    </div>
                  </div>
                )}

                {fluxo === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tight">Canais de Contato</h3>
                      <p className="text-slate-400 font-medium">Onde os recrutadores devem te ligar?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input className="w-full p-6 bg-slate-50 rounded-3xl outline-none focus:ring-4 ring-blue-500/10 font-bold border-none" placeholder="E-mail" value={dados.email} onChange={e=>atualizarDados({email:e.target.value})}/>
                      <input className="w-full p-6 bg-slate-50 rounded-3xl outline-none focus:ring-4 ring-blue-500/10 font-bold border-none" placeholder="WhatsApp/Tel" value={dados.tel} onChange={e=>atualizarDados({tel:e.target.value})}/>
                    </div>
                    <input className="w-full p-6 bg-slate-50 rounded-3xl outline-none focus:ring-4 ring-blue-500/10 font-bold border-none" placeholder="Cidade/Estado" value={dados.cidade} onChange={e=>atualizarDados({cidade:e.target.value})}/>
                  </div>
                )}

                {fluxo === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tight text-blue-600 italic">O Alvo da IA</h3>
                      <p className="text-slate-400 font-medium leading-relaxed">Cole a descrição da vaga. Nossa IA vai "escanear" as palavras-chave que o RH busca e injetar no seu currículo.</p>
                    </div>
                    <textarea className="w-full h-64 p-8 bg-slate-50 rounded-[2.5rem] outline-none focus:ring-4 ring-blue-500/10 font-bold border-none text-slate-700 resize-none" placeholder="Cole aqui os requisitos e responsabilidades da vaga..." value={dados.vagaTexto} onChange={e=>atualizarDados({vagaTexto:e.target.value})}/>
                  </div>
                )}

                {fluxo >= 4 && fluxo <= 10 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black tracking-tight">Conteúdo Principal</h3>
                      <p className="text-slate-400 font-medium">Descreva suas experiências de forma simples. A IA cuidará do texto difícil depois.</p>
                    </div>
                    {fluxo === 4 && <textarea className="w-full h-64 p-8 bg-slate-50 rounded-[2.5rem] outline-none focus:ring-4 ring-blue-500/10 font-bold border-none resize-none" placeholder="Seu resumo profissional atual..." value={dados.resumo} onChange={e=>atualizarDados({resumo:e.target.value})}/>}
                    {fluxo === 5 && <textarea className="w-full h-64 p-8 bg-slate-50 rounded-[2.5rem] outline-none focus:ring-4 ring-blue-500/10 font-bold border-none resize-none" placeholder="Experiências (Ex: Empresa X, Cargo Y, Atividades...)" value={dados.exp} onChange={e=>atualizarDados({exp:e.target.value})}/>}
                    {fluxo >= 6 && (
                       <div className="text-center py-16 animate-pulse">
                         <div className="bg-blue-600/10 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={32}/></div>
                         <h4 className="text-2xl font-black uppercase">Dados Processados</h4>
                         <p className="text-slate-400 font-medium">Clique em próximo para ver o Preview Final.</p>
                       </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 2. PREVIEW LUXO (ETAPA 11) */}
            {fluxo === 11 && (
              <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-700 pb-20">
                <div className="bg-white border border-slate-200/60 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] rounded-sm p-16 min-h-[1000px] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-4 bg-slate-900"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-100 pb-12">
                    <div className="space-y-2">
                      <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{dados.nome || 'SEU NOME'}</h2>
                      <p className="text-2xl text-blue-600 font-black uppercase tracking-widest italic">{dados.cargo || 'CARGO PRETENDIDO'}</p>
                    </div>
                    <div className="space-y-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-500 font-bold text-sm"><Phone size={14} className="text-blue-500"/> {dados.tel || 'Telefone'}</div>
                      <div className="flex items-center justify-end gap-2 text-slate-500 font-bold text-sm"><Mail size={14} className="text-blue-500"/> {dados.email || 'Email'}</div>
                      <div className="flex items-center justify-end gap-2 text-slate-500 font-bold text-sm"><MapPin size={14} className="text-blue-500"/> {dados.cidade || 'Localização'}</div>
                    </div>
                  </div>

                  <div className="mt-12 grid grid-cols-12 gap-12">
                    <div className="col-span-12 space-y-12">
                      <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded">Executive Summary</h4>
                        <p className="text-slate-700 leading-[1.8] font-medium text-lg whitespace-pre-wrap">{dados.resumo || 'Clique no botão abaixo para gerar um resumo épico com IA...'}</p>
                      </section>
                      <section className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded">Professional Experience</h4>
                        <p className="text-slate-700 leading-[1.8] font-medium text-lg whitespace-pre-wrap">{dados.exp || 'Descreva suas experiências no fluxo para vê-las aqui...'}</p>
                      </section>
                    </div>
                  </div>
                </div>

                {/* ACOES FINAIS */}
                <div className="flex flex-col md:flex-row gap-6 pt-10">
                  <button onClick={otimizarComIA} disabled={gerandoIA} className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02] active:scale-[0.98] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4">
                    {gerandoIA ? "A IA está reescrevendo seu futuro..." : "Otimizar com Inteligência Artificial"} <Sparkles size={24}/>
                  </button>
                  <button onClick={() => setFluxo(13)} className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-all">
                    Baixar PDF <Download size={22}/>
                  </button>
                </div>
              </div>
            )}

            {/* 3. PAGAMENTO (ETAPA 13) */}
            {fluxo === 13 && (
              <div className="text-center py-20 animate-in zoom-in-95 duration-500 space-y-10">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><Lock size={44}/></div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black tracking-tighter">Currículo Desbloqueado.</h2>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Pagamento único • Acesso Vitalício • IA Ilimitada</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[3rem] max-w-sm mx-auto border border-slate-100">
                  <span className="text-slate-400 line-through font-bold">R$ 49,90</span>
                  <div className="text-5xl font-black text-slate-900 mt-2">R$ 5,99</div>
                </div>
                <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="px-16 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl uppercase shadow-2xl shadow-blue-200 hover:scale-110 transition-all active:scale-95">Pagar via PIX</button>
                <button onClick={() => setFluxo(11)} className="block w-full text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Ajustar mais uma coisa</button>
              </div>
            )}
          </main>

          {/* FOOTER NAVEGAÇÃO FIXO */}
          {fluxo <= 10 && (
            <footer className="p-8 bg-white border-t border-slate-100 flex justify-between items-center px-12">
               <button onClick={() => setFluxo(prev => Math.max(0, prev - 1))} className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-900 transition-colors">Anterior</button>
               <button 
                  onClick={() => fluxo === 10 ? setFluxo(11) : setFluxo(prev => prev + 1)} 
                  className="px-14 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95"
               >
                 {fluxo === 10 ? "Ver Resultado" : "Próximo Passo"} <ChevronRight size={16} strokeWidth={3}/>
               </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
