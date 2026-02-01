'use client' 

import { useState, useEffect } from 'react'
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, Sparkles, Briefcase, Send, FileText, Lock, Plus, 
  ChevronRight, User, Download, Trash2, CheckCircle2
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); 
  const [gerandoIA, setGerandoIA] = useState(false);
  
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não Possuo', disponibilidade: '', vagaTexto: ''
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
    if (!dados.vagaTexto) return alert("Por favor, cole a descrição da vaga no Passo 3 para a IA saber o que fazer!");
    setGerandoIA(true);
    try {
      const response = await fetch('/api/gerar-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados }),
      });
      const result = await response.json();
      
      // Aqui a IA complementa em vez de apagar
      atualizarDados({ 
        resumo: result.resumo || dados.resumo, 
        exp: result.exp || dados.exp, 
        skills: result.skills || dados.skills 
      });
      alert("IA finalizou a otimização com sucesso!");
    } catch (e) {
      alert("Erro na conexão com a IA.");
    } finally {
      setGerandoIA(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-slate-900 selection:bg-blue-100">
      
      {/* HEADER ULTRA MODERNO */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Briefcase size={20} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tighter text-slate-800">CV Master AI</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Premium Edition</p>
          </div>
        </div>
        <UserButton afterSignOutUrl="/"/>
      </nav>

      <div className="flex flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 gap-8">
        
        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          
          <div className="p-8 md:p-12 overflow-y-auto max-h-[75vh]">
            
            {/* DASHBOARD MODERNA */}
            {fluxo === 12 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="max-w-md">
                  <h2 className="text-4xl font-black text-slate-900 leading-none">Olá, {user?.firstName}! <br/><span className="text-blue-600">Pronto para o próximo nível?</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button onClick={() => setFluxo(0)} className="group bg-slate-900 hover:bg-blue-600 p-8 rounded-[2rem] text-left transition-all duration-500 shadow-2xl shadow-slate-200">
                    <Plus size={40} className="text-blue-400 group-hover:text-white mb-6 transition-colors" />
                    <div className="font-bold text-white text-2xl">Criar Novo</div>
                    <p className="text-slate-400 group-hover:text-blue-100 text-sm mt-2">Inicie um currículo do zero com auxílio da nossa inteligência.</p>
                  </button>
                  <button onClick={() => setFluxo(11)} className="group bg-white border-2 border-slate-100 hover:border-blue-400 p-8 rounded-[2rem] text-left transition-all duration-500">
                    <FileText size={40} className="text-slate-300 group-hover:text-blue-500 mb-6 transition-colors" />
                    <div className="font-bold text-slate-800 text-2xl">Ver Rascunho</div>
                    <p className="text-slate-400 text-sm mt-2">Continue editando seu último projeto salvo automaticamente.</p>
                  </button>
                </div>
              </div>
            )}

            {/* FORMULÁRIO ESTILIZADO */}
            {fluxo >= 0 && fluxo <= 10 && (
              <div className="max-w-xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Etapa {fluxo + 1} de 11
                </div>
                
                {fluxo === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-slate-900">Quem é você?</h3>
                    <div className="space-y-4">
                      <input className="w-full p-5 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 ring-blue-500 transition-all outline-none" placeholder="Nome Completo" value={dados.nome} onChange={e=>atualizarDados({nome:e.target.value})}/>
                      <input className="w-full p-5 bg-slate-50 border-none rounded-2xl font-medium focus:ring-2 ring-blue-500 transition-all outline-none" placeholder="Cargo Desejado" value={dados.cargo} onChange={e=>atualizarDados({cargo:e.target.value})}/>
                    </div>
                  </div>
                )}
                
                {/* PREVIEW FINAL ESTILO "FOLHA DE PAPEL" */}
                {fluxo === 11 && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="bg-white border border-slate-200 shadow-2xl rounded-sm p-12 min-h-[700px] relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                       <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{dados.nome || 'Seu Nome'}</h2>
                       <p className="text-xl text-blue-600 font-bold mt-2 uppercase tracking-widest">{dados.cargo || 'Cargo'}</p>
                       
                       <div className="mt-12 space-y-8">
                          <section>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                              <Sparkles size={14} className="text-blue-500"/> Resumo Profissional Otimizado
                            </h4>
                            <p className="text-slate-700 leading-relaxed font-medium">{dados.resumo || 'Aguardando otimização da IA...'}</p>
                          </section>
                          {/* Adicione outras seções aqui */}
                       </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <button onClick={otimizarComIA} disabled={gerandoIA} className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3">
                        {gerandoIA ? "Reescrevendo seu futuro..." : "Turbinar com Inteligência Artificial"} <Sparkles size={20}/>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BARRA DE NAVEGAÇÃO INFERIOR */}
          {fluxo <= 10 && (
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
               <button onClick={() => setFluxo(prev => Math.max(0, prev - 1))} className="text-slate-400 font-bold uppercase text-xs hover:text-slate-900 transition-colors">Anterior</button>
               <button onClick={() => setFluxo(prev => prev + 1)} className="px-10 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-lg shadow-slate-200">Próximo Passo</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
