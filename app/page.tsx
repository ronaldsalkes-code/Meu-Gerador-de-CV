'use client'

import { useState, useEffect, useCallback } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Linkedin, Mail, MapPin, Phone, Award, Timer, GraduationCap, Star, Book
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // Dashboard inicial
  const [pago, setPago] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: ''
  });

  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_data');
    if (salvo) setDados(JSON.parse(salvo));
    if (localStorage.getItem('cv_pago') === 'true') setPago(true);
  }, []);

  const atualizarDados = (novos: any) => {
    const atualizado = { ...dados, ...novos };
    setDados(atualizado);
    localStorage.setItem('cv_premium_data', JSON.stringify(atualizado));
  };

  const proximo = () => setFluxo((prev) => prev + 1);
  const voltar = () => setFluxo((prev) => (prev > 0 ? prev - 1 : 12));

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 font-bold">
      
      {/* 1. BARRA DE PROGRESSO */}
      {fluxo < 12 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={voltar} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={18}/> <span className="text-[10px] font-black uppercase tracking-widest">Gerar CV</span>
          </button>
          <div className="flex-1 max-w-xl mx-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${(fluxo / 11) * 100}%`}}/>
          </div>
          <span className="text-[10px] font-black text-slate-400 tracking-tighter">{fluxo}/11</span>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* 2. SIDEBAR */}
        <aside className="w-full md:w-72 bg-white border-r p-8 hidden md:flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 border-4 border-white shadow-xl overflow-hidden">
            {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" /> : <User className="m-6 text-slate-300" size={40}/>}
          </div>
          <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight text-center">{user?.firstName || 'Candidato'}</h3>
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-8">Perfil Verificado</p>
          
          <nav className="w-full space-y-2">
            <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${fluxo < 11 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
              <Sparkles size={18}/> <span className="text-[10px] font-black uppercase">Gerador Premium</span>
            </div>
            <SignedIn><div className="flex justify-center p-4"><UserButton /></div></SignedIn>
          </nav>
        </aside>

        {/* 3. CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto">

            {/* FLUXO 12: DASHBOARD */}
            {fluxo === 12 && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-black tracking-tighter uppercase">Meus Currículos</h1>
                  <button onClick={() => setFluxo(0)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-lg shadow-blue-100 hover:scale-105 transition-all flex items-center gap-2 tracking-widest uppercase"><Plus size={16}/> Novo Currículo</button>
                </div>
                <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-blue-300 transition-all cursor-pointer shadow-sm" onClick={() => setFluxo(11)}>
                  <div className="w-16 h-20 bg-slate-50 rounded-2xl border flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors"><FileText size={32}/></div>
                  <div className="flex-1">
                    <h2 className="font-black text-slate-800 uppercase text-sm tracking-tight">{dados.cargo || 'Rascunho do Currículo'}</h2>
                    <div className="flex items-center gap-2 mt-2">
                       {pago ? <span className="text-[9px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded uppercase">Pago</span> : <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase flex items-center gap-1"><Lock size={10}/> Aguardando Pagamento</span>}
                    </div>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-blue-500 transition-colors"/>
                </div>
              </div>
            )}

            {/* PAINEL DE ANÁLISE IA */}
            {fluxo >= 1 && fluxo <= 10 && (
              <div className="bg-[#EEF2FF] border border-blue-100 rounded-[2.5rem] p-8 mb-10 relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"><Sparkles size={20}/></div>
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-slate-800">Análise de IA</h2>
                    <div className="space-y-2">
                       <p className="text-sm font-black text-slate-600 flex items-center gap-2"><CheckCircle2 className="text-green-500" size={16}/> Otimizando palavras-chave para {dados.cargo || 'sua vaga'}.</p>
                       <p className="text-sm font-black text-slate-600 flex items-center gap-2"><CheckCircle2 className="text-green-500" size={16}/> Estrutura profissional validada pelo sistema.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 0: ESCOLHA DE FOCO */}
            {fluxo === 0 && (
              <div className="space-y-8 text-center animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-4xl font-black tracking-tighter uppercase">O que você quer destacar?</h2>
                <p className="text-slate-500 font-black">Escolha o foco principal do seu currículo</p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {t: 'Experiências relevantes', d: 'Destaque posições que combinam com a vaga', i: <Briefcase size={22}/>},
                    {t: 'Resultados e Skills', d: 'Foco em tecnologias e competências técnicas', i: <Zap size={22}/>},
                    {t: 'Formação e Cursos', d: 'Ideal para quem busca o primeiro emprego', i: <GraduationCap size={22}/>}
                  ].map((obj, i) => (
                    <button key={i} onClick={proximo} className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] text-left hover:border-blue-600 transition-all flex items-center gap-6 group">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{obj.i}</div>
                      <div>
                        <h4 className="font-black text-slate-800">{obj.t}</h4>
                        <p className="text-xs text-slate-500 font-black">{obj.d}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ETAPAS DO FORMULÁRIO */}
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              {fluxo === 1 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Identificação</h2>
                  <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Nome Completo" value={dados.nome} onChange={(e)=>atualizarDados({nome: e.target.value})}/>
                  <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Cargo Pretendido" value={dados.cargo} onChange={(e)=>atualizarDados({cargo: e.target.value})}/>
                </>
              )}

              {fluxo === 2 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Contatos</h2>
                  <div className="relative">
                    <Phone className="absolute left-6 top-6 text-slate-300" size={20}/>
                    <input className="w-full p-6 pl-16 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="WhatsApp (com DDD)" value={dados.tel} onChange={(e)=>atualizarDados({tel: e.target.value})}/>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-6 top-6 text-slate-300" size={20}/>
                    <input className="w-full p-6 pl-16 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="E-mail profissional" value={dados.email} onChange={(e)=>atualizarDados({email: e.target.value})}/>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-6 text-slate-300" size={20}/>
                    <input className="w-full p-6 pl-16 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Cidade / Estado" value={dados.cidade} onChange={(e)=>atualizarDados({cidade: e.target.value})}/>
                  </div>
                </>
              )}

              {fluxo === 3 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-600">Descrição da Vaga</h2>
                  <p className="text-xs font-black text-slate-400">Cole aqui a vaga para a IA adaptar seu currículo</p>
                  <textarea className="w-full h-64 p-6 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600 leading-relaxed" placeholder="Cole aqui o texto da vaga..." value={dados.vagaTexto} onChange={(e)=>atualizarDados({vagaTexto: e.target.value})}/>
                </>
              )}

              {fluxo === 4 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Seu Resumo Profissional</h2>
                  <textarea className="w-full h-64 p-6 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600 leading-relaxed" placeholder="Fale sobre sua carreira e pontos fortes..." value={dados.resumo} onChange={(e)=>atualizarDados({resumo: e.target.value})}/>
                </>
              )}

              {fluxo === 5 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Experiências</h2>
                  <textarea className="w-full h-80 p-6 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600 leading-relaxed" placeholder="Empresa - Cargo - Período&#10;• Descreva suas tarefas..." value={dados.exp} onChange={(e)=>atualizarDados({exp: e.target.value})}/>
                </>
              )}

              {fluxo === 6 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Formação Acadêmica</h2>
                  <textarea className="w-full h-48 p-6 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600 leading-relaxed" placeholder="Curso - Instituição - Conclusão" value={dados.estudos} onChange={(e)=>atualizarDados({estudos: e.target.value})}/>
                </>
              )}

              {fluxo === 7 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Habilidades Técnicas</h2>
                  <div className="relative">
                     <Star className="absolute left-6 top-6 text-slate-300" size={20}/>
                     <input className="w-full p-6 pl-16 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Excel, Vendas, Liderança (separado por vírgula)" value={dados.skills} onChange={(e)=>atualizarDados({skills: e.target.value})}/>
                  </div>
                </>
              )}

              {fluxo === 8 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Cursos e Idiomas</h2>
                  <textarea className="w-full h-48 p-6 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600 leading-relaxed" placeholder="Ex: Inglês Intermediário, Curso de Atendimento..." value={dados.cursos} onChange={(e)=>atualizarDados({cursos: e.target.value})}/>
                </>
              )}

              {fluxo === 9 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Redes Sociais</h2>
                  <div className="relative">
                     <Linkedin className="absolute left-6 top-6 text-slate-300" size={20}/>
                     <input className="w-full p-6 pl-16 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Link do seu perfil LinkedIn" value={dados.linkedin} onChange={(e)=>atualizarDados({linkedin: e.target.value})}/>
                  </div>
                </>
              )}

              {fluxo === 10 && (
                <>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Detalhes Finais</h2>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Categoria de CNH</label>
                     <div className="grid grid-cols-4 gap-2">
                        {['Não', 'A', 'B', 'AB', 'D'].map(c => (
                          <button key={c} onClick={() => atualizarDados({cnh: c})} className={`p-4 rounded-xl font-black transition-all border-2 ${dados.cnh === c ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{c}</button>
                        ))}
                     </div>
                     <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600 mt-6" placeholder="Disponibilidade (Ex: Imediata)" value={dados.disponibilidade} onChange={(e)=>atualizarDados({disponibilidade: e.target.value})}/>
                  </div>
                </>
              )}

              {/* TELA DE PAGAMENTO */}
              {fluxo === 11 && (
                <div className="text-center space-y-10 animate-in zoom-in duration-500 py-10">
                  <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-slate-50 relative overflow-hidden">
                    <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100 transition-transform hover:rotate-12"><Lock size={32}/></div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">Otimização Concluída!</h2>
                    <p className="text-slate-400 font-black mb-8">Libere o acesso total e gere seu PDF agora:</p>
                    <div className="text-7xl font-black text-slate-900 mb-10 tracking-tighter">R$ 5,99</div>
                    <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95">
                       LIBERAR AGORA <Send size={24}/>
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-2 text-amber-500 font-black text-[9px] uppercase tracking-widest">
                       <Timer size={14}/> Aguarde 5 segundos após pagar para liberar.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* RODAPÉ FIXO */}
      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={proximo} 
            className="w-full max-w-3xl py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600 active:scale-95 shadow-xl text-xs"
          >
            Continuar para etapa {fluxo + 1}
          </button>
        </footer>
      )}
    </div>
  )
}
