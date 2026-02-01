'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Linkedin, Mail, MapPin, Phone, Award, Timer, GraduationCap, Star, Download, Globe, Car, Calendar, AlignLeft
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

  const reiniciarProcesso = () => {
    const limpo = { 
      nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '', 
      resumo: '', exp: '', estudos: '', skills: '', 
      cursos: '', idiomas: '', cnh: 'Não Possuo', disponibilidade: '', vagaTexto: '' 
    };
    setDados(limpo);
    localStorage.removeItem('cv_premium_data');
    setFluxo(0);
  };

  const otimizarComIA = async () => {
    if (!dados.vagaTexto) return alert("Por favor, cole a descrição da vaga no passo 3!");
    setGerandoIA(true);
    try {
      const response = await fetch('/api/gerar-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados }),
      });
      const result = await response.json();
      atualizarDados({ 
        resumo: result.resumo, 
        exp: result.exp, 
        skills: result.skills 
      });
      alert("IA: Currículo otimizado com sucesso!");
    } catch (e) {
      alert("Erro ao processar IA. Verifique se criou o arquivo api/gerar-cv/route.ts");
    } finally {
      setGerandoIA(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 font-bold">
      
      {/* HEADER DE PROGRESSO */}
      {fluxo <= 11 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={() => setFluxo(prev => prev > 0 ? prev - 1 : 12)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={18}/> <span className="text-[10px] font-black uppercase tracking-widest">Voltar</span>
          </button>
          <div className="flex-1 max-w-xl mx-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${(fluxo / 11) * 100}%`}}/>
          </div>
          <span className="text-[10px] font-black text-slate-400 tracking-tighter">{fluxo}/11</span>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-72 bg-white border-r p-8 hidden md:flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 border-4 border-white shadow-xl overflow-hidden ring-4 ring-blue-50">
            {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" /> : <User className="m-6 text-slate-300" size={40}/>}
          </div>
          <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight text-center">{user?.firstName || 'Candidato'}</h3>
          <p className="text-[9px] text-blue-600 font-black uppercase tracking-[0.2em] mt-2 mb-8">Perfil Verificado</p>
          <nav className="w-full space-y-2">
            <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${fluxo < 11 ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
              <Sparkles size={18}/> <span className="text-[10px] font-black uppercase">Gerador IA</span>
            </div>
            <div className="flex justify-center pt-8"><UserButton /></div>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto">

            {/* DASHBOARD */}
            {fluxo === 12 && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-black tracking-tighter uppercase">Meus Currículos</h1>
                  <button onClick={reiniciarProcesso} className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest">
                    <Plus size={18}/> Novo Currículo
                  </button>
                </div>
                <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] flex items-center gap-6 group hover:border-blue-400 transition-all cursor-pointer shadow-sm" onClick={() => setFluxo(11)}>
                  <div className="w-20 h-24 bg-slate-50 rounded-2xl border flex items-center justify-center text-slate-200 group-hover:text-blue-500 transition-all">
                    <FileText size={40}/>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-black text-slate-800 uppercase text-lg">{dados.cargo || 'Rascunho Premium'}</h2>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-3 py-1 rounded-full uppercase flex items-center gap-1 w-fit mt-2">
                      <Lock size={12}/> Aguardando Pagamento
                    </span>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-blue-500" size={32}/>
                </div>
              </div>
            )}

            {/* FORMULÁRIO (0-10) */}
            {fluxo === 0 && (
              <div className="space-y-10 text-center animate-in zoom-in-95">
                <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">O que vamos <br/> destacar?</h2>
                <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
                  {['Experiência', 'Skills e Prêmios', 'Formação'].map((item, i) => (
                    <button key={i} onClick={() => setFluxo(1)} className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] text-left hover:border-blue-600 transition-all flex items-center gap-6 group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all"><Zap/></div>
                      <h4 className="font-black text-slate-800 uppercase text-lg">{item}</h4>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {fluxo === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-600 italic">01. Identificação</h2>
                <input className="w-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600 transition-all" placeholder="Nome Completo" value={dados.nome} onChange={(e)=>atualizarDados({nome: e.target.value})}/>
                <input className="w-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600 transition-all" placeholder="Cargo Desejado" value={dados.cargo} onChange={(e)=>atualizarDados({cargo: e.target.value})}/>
              </div>
            )}

            {fluxo === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-600 italic">02. Contatos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="w-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="WhatsApp" value={dados.tel} onChange={(e)=>atualizarDados({tel: e.target.value})}/>
                  <input className="w-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="E-mail" value={dados.email} onChange={(e)=>atualizarDados({email: e.target.value})}/>
                </div>
                <input className="w-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Cidade / Estado" value={dados.cidade} onChange={(e)=>atualizarDados({cidade: e.target.value})}/>
                <input className="w-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="LinkedIn URL" value={dados.linkedin} onChange={(e)=>atualizarDados({linkedin: e.target.value})}/>
              </div>
            )}

            {fluxo === 3 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                  <h2 className="text-2xl font-black uppercase flex items-center gap-2"><Sparkles/> Sincronização IA</h2>
                  <p className="text-[11px] font-bold opacity-70 uppercase mt-2">Cole a descrição da vaga abaixo para a IA adaptar seu texto.</p>
                </div>
                <textarea className="w-full h-72 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Ex: Buscamos vendedor com experiência..." value={dados.vagaTexto} onChange={(e)=>atualizarDados({vagaTexto: e.target.value})}/>
              </div>
            )}

            {/* FLUXOS 4-10 (Resumo, Exp, Estudos, etc) seguem o mesmo padrão de input/textarea */}
            {fluxo === 4 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-600 italic">04. Resumo Profissional</h2>
                <textarea className="w-full h-72 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" value={dados.resumo} onChange={(e)=>atualizarDados({resumo: e.target.value})}/>
              </div>
            )}

            {fluxo === 5 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-600 italic">05. Experiência Profissional</h2>
                <textarea className="w-full h-96 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" value={dados.exp} onChange={(e)=>atualizarDados({exp: e.target.value})}/>
              </div>
            )}

            {fluxo === 6 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-600 italic">06. Formação Acadêmica</h2>
                <textarea className="w-full h-64 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" value={dados.estudos} onChange={(e)=>atualizarDados({estudos: e.target.value})}/>
              </div>
            )}

            {fluxo === 7 && (
              <div className="space-y-6 animate-in slide-in-from-right-8">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-blue-600 italic">07. Skills</h2>
                <input className="w-full p-7 rounded-[2rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Ex: Liderança, Excel, CRM" value={dados.skills} onChange={(e)=>atualizarDados({skills: e.target.value})}/>
              </div>
            )}

            {/* TELA 11: PREVIEW OBRIGATÓRIO ANTES DO PAGAMENTO */}
            {fluxo === 11 && (
              <div className="space-y-10 animate-in zoom-in-95 duration-500 pb-20">
                <div className="text-center">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Seu Currículo <span className="text-blue-600">Pronto</span></h2>
                  <p className="text-slate-400 text-[10px] font-black uppercase mt-2">Visualize o resultado final abaixo</p>
                </div>

                <div className="bg-white shadow-2xl p-12 rounded-sm border border-slate-200 min-h-[800px] text-left relative overflow-hidden">
                  <div className="border-b-[6px] border-blue-600 pb-8 mb-8">
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{dados.nome || 'Seu Nome'}</h1>
                    <p className="text-xl font-bold text-blue-600 uppercase tracking-widest">{dados.cargo || 'Seu Cargo'}</p>
                  </div>
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-100 mb-3 tracking-widest">Resumo Profissional</h3>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{dados.resumo}</p>
                    </section>
                    <section>
                      <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-100 mb-3 tracking-widest">Experiência</h3>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{dados.exp}</p>
                    </section>
                  </div>

                  {/* Gatilho da IA no Preview */}
                  <div className="mt-12 p-10 bg-blue-50 rounded-[3rem] border-2 border-dashed border-blue-200 text-center">
                    <h4 className="text-lg font-black uppercase text-slate-800 mb-2">Quer um texto de alto nível?</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest">Nossa IA reescreve seu currículo para a vaga desejada</p>
                    <button 
                      onClick={otimizarComIA} 
                      disabled={gerandoIA} 
                      className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3 mx-auto"
                    >
                      {gerandoIA ? "Processando..." : <><Sparkles size={18}/> Otimizar com IA</>}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setFluxo(13)} 
                  className="w-full py-9 bg-slate-900 text-white rounded-[3rem] font-black uppercase text-xs flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-600 transition-all"
                >
                  BAIXAR CURRÍCULO EM PDF <Download size={24}/>
                </button>
              </div>
            )}

            {/* TELA 13: PAGAMENTO */}
            {fluxo === 13 && (
              <div className="text-center space-y-10 animate-in zoom-in-90 duration-500 py-10">
                <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-2 border-slate-50 max-w-lg mx-auto">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl"><Lock size={32}/></div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">Liberação Imediata</h2>
                  <p className="text-slate-400 font-black mb-8 text-xs uppercase">Pague uma taxa única para baixar em PDF:</p>
                  <div className="text-7xl font-black text-slate-900 mb-10 tracking-tighter">R$ 5,99</div>
                  <button 
                    onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} 
                    className="w-full py-8 bg-blue-600 text-white rounded-[3rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95"
                  >
                    PAGAR AGORA <Send size={24}/>
                  </button>
                </div>
                <button onClick={() => setFluxo(11)} className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Voltar para o Preview</button>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* RODAPÉ DINÂMICO: DO PASSO 0 AO 10 */}
      {fluxo <= 10 && (
        <footer className="w-full bg-white border-t p-7 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={() => setFluxo(prev => prev === 10 ? 11 : prev + 1)} 
            className="w-full max-w-3xl py-7 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.25em] transition-all hover:bg-blue-600 shadow-xl text-xs flex items-center justify-center gap-3"
          >
            {fluxo === 10 ? "Gerar Preview Final" : `Continuar etapa ${fluxo + 1}`} <ChevronRight size={20}/>
          </button>
        </footer>
      )}
    </div>
  )
}
