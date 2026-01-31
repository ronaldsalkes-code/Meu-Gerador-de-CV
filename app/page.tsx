'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Linkedin, Mail, MapPin, Phone, Award, Timer, GraduationCap, 
  Wand2, Rocket, Star, Globe
} from 'lucide-react'

export default function SuperGeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // Começa no Dashboard
  const [loadingIA, setLoadingIA] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: ''
  });

  // Persistência de Dados
  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_ultra');
    if (salvo) setDados(JSON.parse(salvo));
  }, []);

  const update = (obj: any) => {
    const novo = { ...dados, ...obj };
    setDados(novo);
    localStorage.setItem('cv_premium_ultra', JSON.stringify(novo));
  };

  const usarIA = (campo: string) => {
    setLoadingIA(true);
    setTimeout(() => {
      const sugestoes: any = {
        resumo: `Especialista em ${dados.cargo || 'sua área'} com foco em alta performance e entrega de resultados estratégicos.`,
        exp: `• Gestão de processos internos e liderança de equipes multidisciplinares.\n• Implementação de melhorias que elevaram a eficiência do setor.`,
        skills: "Liderança, Inteligência Emocional, Gestão de Tempo, Negociação, Excel Avançado"
      };
      update({ [campo]: sugestoes[campo] });
      setLoadingIA(false);
    }, 800);
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F1F4F9] text-slate-900 flex flex-col font-sans selection:bg-blue-100">
      
      {/* HEADER PREMIUM */}
      <header className="w-full bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Rocket size={20} fill="white"/></div>
          <h1 className="text-xl font-black tracking-tighter italic uppercase">Curriculo<span className="text-blue-600">.Pro</span></h1>
        </div>
        {fluxo < 11 && (
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-10">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-700" style={{width: `${(fluxo/11)*100}%`}}/>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fluxo}/11</span>
          </div>
        )}
        <div className="flex items-center gap-4"><SignedIn><UserButton/></SignedIn></div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        
        {/* SIDEBAR DE STATUS (FOTO E PROGRESSO) */}
        <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 p-8 flex-col">
          <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-6 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-white shadow-xl overflow-hidden">
              <img src={user?.imageUrl} alt="Perfil" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight">{user?.firstName}</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 italic">Perfil Verificado</p>
          </div>
          <nav className="space-y-2 flex-1">
             <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center gap-3 text-xs font-black uppercase">
               <Sparkles size={18}/> IA Otimizando
             </div>
             <div className="p-4 rounded-2xl text-slate-400 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
               <Globe size={18}/> Formato ATS/PDF
             </div>
          </nav>
        </aside>

        {/* ÁREA CENTRAL DIVIDIDA */}
        <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-72px)] overflow-hidden">
          
          {/* COLUNA DO FORMULÁRIO (ESQUERDA) */}
          <section className="flex-1 overflow-y-auto p-6 md:p-12 bg-white scrollbar-hide">
            <div className="max-w-xl mx-auto space-y-10 pb-20">
              
              {fluxo < 11 && (
                <button onClick={() => setFluxo(fluxo === 0 ? 12 : fluxo - 1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-black text-[10px] uppercase tracking-[0.2em]">
                  <ArrowLeft size={16}/> Voltar
                </button>
              )}

              {/* CONTEÚDO DINÂMICO POR ETAPA */}
              <div className="animate-in slide-in-from-right-10 duration-500">
                {fluxo === 12 && (
                  <div className="space-y-8">
                    <h2 className="text-4xl font-black tracking-tighter">Olá, <span className="text-blue-600">{user?.firstName}!</span></h2>
                    <button onClick={() => setFluxo(0)} className="w-full p-8 bg-blue-600 rounded-[2.5rem] text-white flex items-center justify-between group shadow-2xl shadow-blue-100 transition-all hover:scale-[1.02]">
                      <div className="text-left"><p className="font-black text-xl uppercase italic">Criar Novo Projeto</p><p className="text-blue-100 text-xs font-bold">Gerador com Inteligência Artificial</p></div>
                      <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500"/>
                    </button>
                  </div>
                )}

                {fluxo === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black tracking-tighter italic">O QUE VOCÊ QUER DESTACAR?</h2>
                    <div className="grid gap-3">
                      {['Experiências Relevantes', 'Resultados e Skills', 'Formação e Cursos'].map((t, i) => (
                        <button key={i} onClick={() => setFluxo(1)} className="p-6 bg-white border-2 border-slate-100 rounded-2xl text-left hover:border-blue-600 font-black text-sm uppercase transition-all flex items-center justify-between group">
                          {t} <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all"/>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {fluxo === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Quem é o candidato?</h2>
                    <div className="space-y-4">
                      <input className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none font-bold shadow-sm" placeholder="Seu Nome Completo" value={dados.nome} onChange={e => update({nome: e.target.value})}/>
                      <input className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none font-bold shadow-sm" placeholder="Qual o cargo que deseja?" value={dados.cargo} onChange={e => update({cargo: e.target.value})}/>
                    </div>
                  </div>
                )}

                {fluxo === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black uppercase italic">Contatos Diretos</h2>
                    <div className="space-y-4">
                      <div className="relative"><Phone className="absolute left-6 top-6 text-slate-300"/><input className="w-full p-6 pl-16 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] outline-none font-bold shadow-sm" placeholder="WhatsApp (com DDD)" value={dados.tel} onChange={e => update({tel: e.target.value})}/></div>
                      <div className="relative"><Mail className="absolute left-6 top-6 text-slate-300"/><input className="w-full p-6 pl-16 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] outline-none font-bold shadow-sm" placeholder="Seu melhor e-mail" value={dados.email} onChange={e => update({email: e.target.value})}/></div>
                      <div className="relative"><MapPin className="absolute left-6 top-6 text-slate-300"/><input className="w-full p-6 pl-16 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] outline-none font-bold shadow-sm" placeholder="Cidade / Estado" value={dados.cidade} onChange={e => update({cidade: e.target.value})}/></div>
                    </div>
                  </div>
                )}

                {fluxo === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black uppercase italic text-blue-600">Descrição da Vaga</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cole aqui para a IA otimizar seus textos para o robô da empresa</p>
                    <textarea className="w-full h-64 p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[2rem] outline-none font-medium leading-relaxed shadow-inner" placeholder="Cole o texto da vaga..." value={dados.vagaTexto} onChange={e => update({vagaTexto: e.target.value})}/>
                  </div>
                )}

                {fluxo === 4 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Seu Perfil</h2>
                      <button onClick={() => usarIA('resumo')} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-blue-600 transition-all uppercase tracking-widest">
                        {loadingIA ? <Timer className="animate-spin" size={14}/> : <Wand2 size={14}/>} IA Sugerir
                      </button>
                    </div>
                    <textarea className="w-full h-64 p-8 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[2.5rem] outline-none font-medium leading-relaxed shadow-inner" placeholder="Escreva sobre você..." value={dados.resumo} onChange={e => update({resumo: e.target.value})}/>
                  </div>
                )}

                {fluxo === 5 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Experiências</h2>
                      <button onClick={() => usarIA('exp')} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 hover:bg-blue-600 transition-all uppercase tracking-widest">
                        <Wand2 size={14}/> IA Sugerir
                      </button>
                    </div>
                    <textarea className="w-full h-80 p-8 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[2.5rem] outline-none font-medium leading-relaxed shadow-inner" placeholder="Empresa - Cargo - Período..." value={dados.exp} onChange={e => update({exp: e.target.value})}/>
                  </div>
                )}

                {fluxo === 6 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Formação Acadêmica</h2>
                    <textarea className="w-full h-48 p-8 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[2.5rem] outline-none font-medium shadow-inner" placeholder="Curso, Instituição e Ano..." value={dados.estudos} onChange={e => update({estudos: e.target.value})}/>
                  </div>
                )}

                {fluxo === 7 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Habilidades Técnicas</h2>
                    <input className="w-full p-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-[1.5rem] outline-none font-bold shadow-sm" placeholder="Ex: Excel, Liderança, Inglês..." value={dados.skills} onChange={e => update({skills: e.target.value})}/>
                  </div>
                )}

                {fluxo === 8 && <div className="space-y-6"><h2 className="text-2xl font-black uppercase italic">Cursos Extras</h2><textarea className="w-full h-48 p-6 bg-slate-50 rounded-[2rem] outline-none font-medium" value={dados.cursos} onChange={e => update({cursos: e.target.value})}/></div>}
                {fluxo === 9 && <div className="space-y-6"><h2 className="text-2xl font-black uppercase italic">LinkedIn</h2><input className="w-full p-6 bg-slate-50 rounded-[1.5rem] outline-none font-bold" value={dados.linkedin} onChange={e => update({linkedin: e.target.value})}/></div>}
                {fluxo === 10 && <div className="space-y-6"><h2 className="text-2xl font-black uppercase italic">Dados Finais (CNH/Disponibilidade)</h2><input className="w-full p-6 bg-slate-50 rounded-[1.5rem] outline-none font-bold" placeholder="Ex: CNH B, Disponibilidade para Viagens" value={dados.disponibilidade} onChange={e => update({disponibilidade: e.target.value})}/></div>}

                {fluxo === 11 && (
                  <div className="animate-in zoom-in duration-500 space-y-8 text-center py-10">
                    <div className="bg-white p-12 rounded-[3.5rem] border-4 border-blue-50 shadow-2xl relative overflow-hidden">
                      <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100"><Lock size={32}/></div>
                      <h2 className="text-4xl font-black tracking-tighter italic">Otimização Concluída!</h2>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-10">Formato ATS profissional liberado</p>
                      <div className="text-7xl font-black text-slate-900 tracking-tighter mb-10">R$ 5,99</div>
                      <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-2xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-4">LIBERAR DOWNLOAD <Send size={24}/></button>
                      <p className="mt-8 text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center justify-center gap-2"><Timer size={14}/> Aguarde 5 segundos após pagar para liberar.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* COLUNA DE PREVIEW (DIREITA) */}
          <section className="hidden xl:flex flex-1 bg-slate-100 p-12 items-center justify-center overflow-hidden relative">
             <div className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
               <Eye size={16}/> Preview Automático
             </div>
             <div className="w-[450px] h-[630px] bg-white shadow-2xl rounded-sm p-10 flex flex-col scale-[0.9] origin-center animate-in fade-in zoom-in duration-1000">
                <div className="border-l-8 border-blue-600 pl-6 mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{dados.nome || 'SEU NOME'}</h3>
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-widest">{dados.cargo || 'CARGO PRETENDIDO'}</p>
                </div>
                <div className="flex-1 space-y-6 overflow-hidden">
                  <div className="text-[9px] text-slate-400 font-bold uppercase border-b pb-1">Perfil Profissional</div>
                  <div className="text-[10px] text-slate-600 font-medium leading-relaxed italic">{dados.resumo || 'O resumo aparecerá aqui...'}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase border-b pb-1">Experiência</div>
                  <div className="text-[10px] text-slate-500 whitespace-pre-wrap">{dados.exp || 'As experiências aparecerão aqui...'}</div>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between text-[7px] font-black uppercase text-slate-300 tracking-[0.4em]">
                   <span>Curriculo.PRO IA v1.0</span>
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
            className="w-full max-w-xl py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 group"
          >
            Continuar para etapa {fluxo + 1} <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform"/>
          </button>
        </footer>
      )}
    </div>
  )
}
