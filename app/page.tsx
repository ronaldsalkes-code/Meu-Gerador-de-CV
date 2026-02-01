'use client' 

import { useState, useEffect } from 'react'
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, Sparkles, Briefcase, FileText, Lock, Plus, 
  ChevronRight, Download, Trash2, LayoutDashboard, CheckCircle2,
  Phone, Mail, Linkedin, MapPin, Star, GraduationCap, Languages, Award
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
      alert("IA finalizou a otimização com sucesso!");
    } catch (e) {
      alert("Erro na conexão com a IA.");
    } finally {
      setGerandoIA(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* HEADER LUXURY */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg">
            <Briefcase size={22} />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">CV MASTER <span className="text-blue-600">PRO</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setFluxo(12)} className="hidden md:flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest">
            <LayoutDashboard size={16}/> Painel
          </button>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center p-4 md:p-10">
        <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[750px] relative">
          
          {/* PROGRESS BAR */}
          {fluxo <= 10 && (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
              <div className="h-full bg-blue-600 transition-all duration-700 ease-in-out" style={{width: `${(fluxo+1)*9}%`}}></div>
            </div>
          )}

          <main className="flex-1 p-8 md:p-16 overflow-y-auto">
            
            {/* 12. DASHBOARD */}
            {fluxo === 12 && (
              <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
                <div className="space-y-2">
                  <h2 className="text-5xl font-black tracking-tight text-slate-900">Olá, {user?.firstName}</h2>
                  <p className="text-slate-400 text-lg font-medium italic">Seu próximo salto profissional começa aqui.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button onClick={() => setFluxo(0)} className="group bg-slate-900 hover:bg-blue-600 p-10 rounded-[2.5rem] text-left transition-all duration-500 shadow-2xl">
                    <Plus size={40} className="text-blue-400 mb-6 group-hover:text-white transition-all" />
                    <div className="font-bold text-white text-2xl uppercase">Novo Currículo</div>
                    <p className="text-slate-400 group-hover:text-blue-100 text-sm mt-3 font-medium">Criação guiada por IA para alta performance.</p>
                  </button>
                  <button onClick={() => setFluxo(11)} className="group bg-white border-2 border-slate-100 hover:border-blue-600 p-10 rounded-[2.5rem] text-left transition-all duration-500 shadow-sm">
                    <FileText size={40} className="text-slate-300 mb-6 group-hover:text-blue-600" />
                    <div className="font-bold text-slate-800 text-2xl uppercase">Ver Rascunho</div>
                    <p className="text-slate-400 text-sm mt-3 font-medium">Continue editando de onde parou.</p>
                  </button>
                </div>
              </div>
            )}

            {/* FORMULÁRIO COMPLETO (ETAPAS 0-10) */}
            {fluxo >= 0 && fluxo <= 10 && (
              <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-8 duration-500">
                <header className="flex items-center justify-between border-b border-slate-50 pb-6">
                   <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Etapa {fluxo + 1} de 11</span>
                </header>

                {fluxo === 0 && <div className="text-center py-12"><h2 className="text-5xl font-black mb-6 tracking-tighter">Vamos criar algo épico?</h2><button onClick={()=>setFluxo(1)} className="px-16 py-6 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all">Iniciar Agora</button></div>}
                
                {fluxo === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Informações Pessoais</h3>
                    <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 font-bold text-lg border-none" placeholder="Nome Completo" value={dados.nome} onChange={e=>atualizarDados({nome:e.target.value})}/>
                    <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 font-bold text-lg border-none" placeholder="Cargo Desejado" value={dados.cargo} onChange={e=>atualizarDados({cargo:e.target.value})}/>
                  </div>
                )}

                {fluxo === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Canais de Contato</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold border-none" placeholder="E-mail" value={dados.email} onChange={e=>atualizarDados({email:e.target.value})}/>
                      <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold border-none" placeholder="WhatsApp" value={dados.tel} onChange={e=>atualizarDados({tel:e.target.value})}/>
                    </div>
                    <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold border-none" placeholder="Cidade/Estado" value={dados.cidade} onChange={e=>atualizarDados({cidade:e.target.value})}/>
                    <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold border-none" placeholder="Link do LinkedIn" value={dados.linkedin} onChange={e=>atualizarDados({linkedin:e.target.value})}/>
                  </div>
                )}

                {fluxo === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-blue-600 italic">O Alvo da IA</h3>
                    <p className="text-slate-400 font-medium">Cole aqui os requisitos da vaga para a IA personalizar seu texto.</p>
                    <textarea className="w-full h-64 p-8 bg-slate-50 rounded-[2.5rem] outline-none font-bold border-none text-slate-700 resize-none" placeholder="Descrição da vaga..." value={dados.vagaTexto} onChange={e=>atualizarDados({vagaTexto:e.target.value})}/>
                  </div>
                )}

                {fluxo === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Resumo Profissional</h3>
                    <textarea className="w-full h-64 p-8 bg-slate-50 rounded-[2.5rem] outline-none font-bold border-none resize-none" placeholder="Fale brevemente sobre sua carreira..." value={dados.resumo} onChange={e=>atualizarDados({resumo:e.target.value})}/>
                  </div>
                )}

                {fluxo === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Experiência Profissional</h3>
                    <textarea className="w-full h-64 p-8 bg-slate-50 rounded-[2.5rem] outline-none font-bold border-none resize-none" placeholder="Ex: Empresa X | Cargo Y | 2020 - Presente | Principais resultados..." value={dados.exp} onChange={e=>atualizarDados({exp:e.target.value})}/>
                  </div>
                )}

                {fluxo === 6 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Formação Acadêmica</h3>
                    <textarea className="w-full h-64 p-8 bg-slate-50 rounded-[2.5rem] outline-none font-bold border-none resize-none" placeholder="Ex: Graduação em Administração | Faculdade Z..." value={dados.estudos} onChange={e=>atualizarDados({estudos:e.target.value})}/>
                  </div>
                )}

                {fluxo === 7 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Habilidades & Soft Skills</h3>
                    <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold border-none" placeholder="Ex: Gestão de Pessoas, Excel Avançado, Vendas..." value={dados.skills} onChange={e=>atualizarDados({skills:e.target.value})}/>
                  </div>
                )}

                {fluxo === 8 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Cursos e Certificações</h3>
                    <textarea className="w-full h-48 p-8 bg-slate-50 rounded-[2.5rem] outline-none font-bold border-none resize-none" placeholder="Ex: Curso de Marketing Digital, Certificação Google..." value={dados.cursos} onChange={e=>atualizarDados({cursos:e.target.value})}/>
                  </div>
                )}

                {fluxo === 9 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Idiomas</h3>
                    <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold border-none" placeholder="Ex: Inglês Avançado, Espanhol Básico..." value={dados.idiomas} onChange={e=>atualizarDados({idiomas:e.target.value})}/>
                  </div>
                )}

                {fluxo === 10 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black">Disponibilidade & Outros</h3>
                    <input className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold border-none mb-4" placeholder="Ex: Disponibilidade para viagens, CNH B..." value={dados.disponibilidade} onChange={e=>atualizarDados({disponibilidade:e.target.value})}/>
                  </div>
                )}
              </div>
            )}

            {/* PREVIEW FINAL (ETAPA 11) */}
            {fluxo === 11 && (
              <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-32">
                {/* PAPEL DO CV */}
                <div className="bg-white border border-slate-200 shadow-2xl rounded-sm p-16 min-h-[1000px] relative">
                  <div className="absolute top-0 left-0 w-full h-4 bg-slate-900"></div>
                  
                  {/* HEADER CV */}
                  <div className="border-b-2 border-slate-900 pb-8 mb-10 flex justify-between items-end">
                    <div>
                      <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{dados.nome || 'SEU NOME'}</h2>
                      <p className="text-2xl text-blue-600 font-bold uppercase tracking-widest mt-2">{dados.cargo || 'CARGO'}</p>
                    </div>
                    <div className="text-right text-sm font-bold text-slate-500 space-y-1 uppercase">
                      <p>{dados.tel}</p>
                      <p>{dados.email}</p>
                      <p>{dados.cidade}</p>
                    </div>
                  </div>

                  {/* CONTEÚDO CV */}
                  <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-12 space-y-8">
                       <section>
                         <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4">Perfil Profissional</h4>
                         <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{dados.resumo}</p>
                       </section>
                       <section>
                         <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4">Experiência</h4>
                         <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{dados.exp}</p>
                       </section>
                       <section>
                         <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4">Formação</h4>
                         <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{dados.estudos}</p>
                       </section>
                       <div className="grid grid-cols-2 gap-8">
                          <section>
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4">Habilidades</h4>
                            <p className="text-slate-700 leading-relaxed font-medium">{dados.skills}</p>
                          </section>
                          <section>
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4">Idiomas</h4>
                            <p className="text-slate-700 leading-relaxed font-medium">{dados.idiomas}</p>
                          </section>
                       </div>
                    </div>
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex flex-col md:flex-row gap-6">
                  <button onClick={otimizarComIA} disabled={gerandoIA} className="flex-1 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 active:scale-95 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4">
                    {gerandoIA ? "A IA está processando..." : "Turbinar com IA"} <Sparkles size={24}/>
                  </button>
                  <button onClick={() => setFluxo(13)} className="px-12 py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl">
                    Baixar PDF <Download size={22}/>
                  </button>
                </div>
              </div>
            )}

            {/* 13. PAGAMENTO */}
            {fluxo === 13 && (
              <div className="text-center py-20 animate-in zoom-in duration-500 space-y-10">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><Lock size={44}/></div>
                <div className="space-y-2">
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic">Premium Ativado</h2>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Pague uma vez e tenha o currículo perfeito</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[3rem] max-w-sm mx-auto border border-slate-100">
                  <div className="text-5xl font-black text-slate-900">R$ 5,99</div>
                </div>
                <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="px-16 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl uppercase shadow-2xl hover:scale-110 transition-all">Pagar via PIX</button>
                <button onClick={() => setFluxo(11)} className="block w-full text-slate-400 font-black uppercase text-[10px] tracking-widest">Revisar mais uma vez</button>
              </div>
            )}
          </main>

          {/* FOOTER FIXO */}
          {fluxo <= 10 && (
            <footer className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-12">
               <button onClick={() => setFluxo(prev => Math.max(0, prev - 1))} className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors">Anterior</button>
               <button 
                  onClick={() => fluxo === 10 ? setFluxo(11) : setFluxo(prev => prev + 1)} 
                  className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95"
               >
                 {fluxo === 10 ? "Ver Preview Final" : "Próximo"} <ChevronRight size={18}/>
               </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
