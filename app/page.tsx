'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Linkedin, Mail, MapPin, Phone, Award, Timer, GraduationCap, Star, Download, Globe, Car, Calendar
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // Dashboard
  const [gerandoIA, setGerandoIA] = useState(false);
  
  // TODOS OS CAMPOS DETALHADOS
  const [dados, setDados] = useState({
    nome: '', 
    cargo: '', 
    tel: '', 
    email: '', 
    cidade: '', 
    linkedin: '',
    resumo: '', 
    exp: '', 
    estudos: '', 
    skills: '',
    cursos: '', 
    idiomas: '', 
    cnh: 'Não', 
    disponibilidade: '', 
    vagaTexto: ''
  });

  // Carrega rascunho
  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_data');
    if (salvo) setDados(JSON.parse(salvo));
  }, []);

  // Salva rascunho e atualiza estado
  const atualizarDados = (novos: any) => {
    const atualizado = { ...dados, ...novos };
    setDados(atualizado);
    localStorage.setItem('cv_premium_data', JSON.stringify(atualizado));
  };

  // REINÍCIO REAL: Limpa tudo para um novo preenchimento
  const reiniciarProcesso = () => {
    const limpo = { 
      nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '', 
      resumo: '', exp: '', estudos: '', skills: '', 
      cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: '' 
    };
    setDados(limpo);
    localStorage.removeItem('cv_premium_data');
    setFluxo(0);
  };

  const otimizarComIA = async () => {
    if (!dados.vagaTexto) return alert("Por favor, cole a descrição da vaga no passo 3 para que a IA possa otimizar seu texto!");
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
    } catch (e) {
      alert("Erro ao processar IA. Verifique sua API Route.");
    } finally {
      setGerandoIA(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 font-bold">
      
      {/* HEADER DE NAVEGAÇÃO */}
      {fluxo <= 11 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={() => setFluxo(prev => prev > 0 ? prev - 1 : 12)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={18}/> <span className="text-[10px] font-black uppercase tracking-widest">Voltar ao Início</span>
          </button>
          <div className="flex-1 max-w-xl mx-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${(fluxo / 11) * 100}%`}}/>
          </div>
          <span className="text-[10px] font-black text-slate-400 tracking-tighter">{fluxo}/11</span>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* SIDEBAR PREMIUM */}
        <aside className="w-full md:w-72 bg-white border-r p-8 hidden md:flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 border-4 border-white shadow-xl overflow-hidden">
            {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" /> : <User className="m-6 text-slate-300" size={40}/>}
          </div>
          <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight text-center">{user?.firstName || 'Candidato'}</h3>
          <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-8">Conta Premium Ativa</p>
          
          <nav className="w-full space-y-2">
            <div className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${fluxo < 11 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
              <Sparkles size={18}/> <span className="text-[10px] font-black uppercase">Otimizador IA</span>
            </div>
            <div className="p-4 rounded-2xl flex items-center gap-3 text-slate-400 bg-slate-50">
              <FileText size={18}/> <span className="text-[10px] font-black uppercase">Templates PDF</span>
            </div>
            <div className="flex justify-center pt-8"><UserButton /></div>
          </nav>
        </aside>

        {/* ÁREA DE CONTEÚDO */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto">

            {/* FLUXO 12: DASHBOARD (SEU DESIGN ORIGINAL) */}
            {fluxo === 12 && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-black tracking-tighter uppercase">Meus Currículos</h1>
                  <button onClick={reiniciarProcesso} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-lg shadow-blue-100 hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest">
                    <Plus size={16}/> Novo Currículo
                  </button>
                </div>
                
                <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-blue-300 transition-all cursor-pointer shadow-sm" onClick={() => setFluxo(11)}>
                  <div className="w-16 h-20 bg-slate-50 rounded-2xl border flex items-center justify-center text-slate-300 group-hover:text-blue-500 transition-colors">
                    <FileText size={32}/>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-black text-slate-800 uppercase text-sm tracking-tight">{dados.cargo || 'Currículo em Andamento'}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                        <Lock size={10}/> Aguardando Pagamento
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-blue-500 transition-colors"/>
                </div>
              </div>
            )}

            {/* ETAPAS DO FORMULÁRIO (0-10) */}
            <div className="space-y-6">
              {fluxo === 0 && (
                <div className="space-y-8 text-center animate-in slide-in-from-bottom-4">
                  <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">O que vamos destacar <br/> no seu currículo?</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {[{t: 'Minha Experiência Profissional', i: <Briefcase/>}, {t: 'Minhas Skills e Conquistas', i: <Zap/>}, {t: 'Minha Formação Acadêmica', i: <GraduationCap/>}].map((obj, i) => (
                      <button key={i} onClick={() => setFluxo(1)} className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] text-left hover:border-blue-600 transition-all flex items-center gap-6 group shadow-sm">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{obj.i}</div>
                        <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">{obj.t}</h4>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {fluxo === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Dados Pessoais</h2>
                  <div className="grid gap-4">
                    <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Nome Completo" value={dados.nome} onChange={(e)=>atualizarDados({nome: e.target.value})}/>
                    <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Seu Principal Cargo" value={dados.cargo} onChange={(e)=>atualizarDados({cargo: e.target.value})}/>
                  </div>
                </div>
              )}

              {fluxo === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Contatos & Localização</h2>
                  <div className="grid gap-4">
                    <div className="flex gap-4">
                      <div className="flex-1 relative"><Phone className="absolute left-6 top-6 text-slate-300" size={18}/><input className="w-full p-6 pl-14 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="WhatsApp" value={dados.tel} onChange={(e)=>atualizarDados({tel: e.target.value})}/></div>
                      <div className="flex-1 relative"><Mail className="absolute left-6 top-6 text-slate-300" size={18}/><input className="w-full p-6 pl-14 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="E-mail" value={dados.email} onChange={(e)=>atualizarDados({email: e.target.value})}/></div>
                    </div>
                    <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Cidade / Estado" value={dados.cidade} onChange={(e)=>atualizarDados({cidade: e.target.value})}/>
                    <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Link do LinkedIn" value={dados.linkedin} onChange={(e)=>atualizarDados({linkedin: e.target.value})}/>
                  </div>
                </div>
              )}

              {fluxo === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white">
                    <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2"><Sparkles/> O segredo da aprovação</h2>
                    <p className="text-[10px] font-black uppercase opacity-80 mt-2">Cole abaixo a descrição da vaga que você quer se candidatar. Nossa IA vai ler a vaga e adaptar seu currículo para ela.</p>
                  </div>
                  <textarea className="w-full h-64 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Ex: Buscamos profissional com experiência em vendas, prospecção e CRM..." value={dados.vagaTexto} onChange={(e)=>atualizarDados({vagaTexto: e.target.value})}/>
                </div>
              )}

              {fluxo === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Resumo Profissional</h2>
                  <p className="text-[10px] text-slate-400 uppercase">Escreva um pouco sobre sua trajetória ou deixe para a IA gerar no final.</p>
                  <textarea className="w-full h-64 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" value={dados.resumo} onChange={(e)=>atualizarDados({resumo: e.target.value})}/>
                </div>
              )}

              {fluxo === 5 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-600">Experiência Profissional</h2>
                  <p className="text-[10px] text-slate-400 uppercase font-black">Liste suas últimas empresas, cargos e o que você fazia lá.</p>
                  <textarea className="w-full h-80 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Ex: Empresa X | Cargo Y | 2020-2023: Responsável por..." value={dados.exp} onChange={(e)=>atualizarDados({exp: e.target.value})}/>
                </div>
              )}

              {fluxo === 6 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Formação Acadêmica</h2>
                  <textarea className="w-full h-64 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Ex: Graduação em Administração - USP (2015-2019)" value={dados.estudos} onChange={(e)=>atualizarDados({estudos: e.target.value})}/>
                </div>
              )}

              {fluxo === 7 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Habilidades & Soft Skills</h2>
                  <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Ex: Liderança, Excel Avançado, Gestão de Tempo..." value={dados.skills} onChange={(e)=>atualizarDados({skills: e.target.value})}/>
                </div>
              )}

              {fluxo === 8 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Cursos & Certificações</h2>
                  <textarea className="w-full h-64 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Ex: Certificação Google Ads, Workshop de Vendas..." value={dados.cursos} onChange={(e)=>atualizarDados({cursos: e.target.value})}/>
                </div>
              )}

              {fluxo === 9 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-blue-600">Idiomas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Ex: Inglês - Avançado" value={dados.idiomas} onChange={(e)=>atualizarDados({idiomas: e.target.value})}/>
                    <div className="flex items-center gap-3 p-6 bg-white border-2 border-slate-100 rounded-2xl">
                      <Globe className="text-slate-300"/> <span className="text-[10px] uppercase font-black">Nível de proficiência</span>
                    </div>
                  </div>
                </div>
              )}

              {fluxo === 10 && (
                <div className="space-y-6 animate-in slide-in-from-right-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Informações Adicionais</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-slate-400 flex items-center gap-1"><Car size={12}/> Possui CNH?</label>
                        <select className="bg-transparent outline-none font-black uppercase text-sm" value={dados.cnh} onChange={(e)=>atualizarDados({cnh: e.target.value})}>
                          <option>Não</option><option>Sim - Categoria A</option><option>Sim - Categoria B</option><option>Sim - Categoria AB</option>
                        </select>
                     </div>
                     <div className="p-6 bg-white border-2 border-slate-100 rounded-2xl flex flex-col gap-2">
                        <label className="text-[10px] uppercase text-slate-400 flex items-center gap-1"><Calendar size={12}/> Disponibilidade</label>
                        <input className="bg-transparent outline-none font-black uppercase text-sm" placeholder="Ex: Imediata" value={dados.disponibilidade} onChange={(e)=>atualizarDados({disponibilidade: e.target.value})}/>
                     </div>
                  </div>
                </div>
              )}

              {/* FLUXO 11: PREVIEW DETALHADO (VISUALIZAÇÃO ANTES DO PAGAMENTO) */}
              {fluxo === 11 && (
                <div className="space-y-8 animate-in zoom-in duration-500">
                  <div className="text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Pronto para o Download!</h2>
                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mt-2">Confira como ficou seu currículo premium</p>
                  </div>

                  {/* REPRESENTAÇÃO DO PDF */}
                  <div className="bg-white shadow-2xl p-12 rounded-sm border border-slate-200 min-h-[800px] text-left relative transition-all">
                    
                    {/* CABEÇALHO CV */}
                    <div className="border-b-[6px] border-blue-600 pb-8 mb-8">
                      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{dados.nome || 'Seu Nome Completo'}</h1>
                      <p className="text-xl font-bold text-blue-600 uppercase tracking-widest">{dados.cargo || 'Seu Cargo Pretendido'}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-6 text-slate-500 font-black text-[10px] uppercase">
                        {dados.tel && <span className="flex items-center gap-1"><Phone size={14}/> {dados.tel}</span>}
                        {dados.email && <span className="flex items-center gap-1"><Mail size={14}/> {dados.email}</span>}
                        {dados.cidade && <span className="flex items-center gap-1"><MapPin size={14}/> {dados.cidade}</span>}
                      </div>
                    </div>

                    {/* CONTEÚDO DO CV NO PREVIEW */}
                    <div className="grid grid-cols-1 gap-10">
                      <section>
                        <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-100 mb-3 tracking-[0.2em]">Resumo Profissional</h3>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{dados.resumo || 'Clique no botão de IA abaixo para gerar um resumo matador...'}</p>
                      </section>

                      <section>
                        <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-100 mb-3 tracking-[0.2em]">Experiências Profissionais</h3>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{dados.exp || 'Suas experiências aparecerão aqui detalhadas...'}</p>
                      </section>

                      <div className="grid grid-cols-2 gap-8">
                        <section>
                          <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-100 mb-3 tracking-[0.2em]">Formação</h3>
                          <p className="text-[11px] text-slate-600 font-bold whitespace-pre-wrap">{dados.estudos}</p>
                        </section>
                        <section>
                          <h3 className="text-xs font-black uppercase text-slate-900 border-b-2 border-slate-100 mb-3 tracking-[0.2em]">Habilidades</h3>
                          <p className="text-[11px] text-slate-600 font-bold uppercase">{dados.skills}</p>
                        </section>
                      </div>
                    </div>

                    {/* BOTÃO IA DENTRO DO PREVIEW (MOMENTO DA MÁGICA) */}
                    <div className="mt-12 p-8 bg-blue-50 rounded-[2.5rem] border-2 border-dashed border-blue-200 text-center">
                      <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-4 text-blue-600"><Sparkles size={24}/></div>
                      <h4 className="text-sm font-black uppercase text-blue-900 mb-2 tracking-tight">Quer deixar esses textos mais profissionais?</h4>
                      <p className="text-[10px] font-black text-blue-400 uppercase mb-6 tracking-widest leading-relaxed">Nossa IA vai reescrever seu currículo focando na vaga do passo 3</p>
                      
                      <button 
                        onClick={otimizarComIA} 
                        disabled={gerandoIA} 
                        className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-blue-200 hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {gerandoIA ? "Reescrevendo Currículo..." : "Aplicar Inteligência Artificial Agora"}
                      </button>
                    </div>
                  </div>

                  {/* BOTÃO DE TRANSIÇÃO PARA O PAGAMENTO */}
                  <button 
                    onClick={() => setFluxo(13)} 
                    className="w-full py-8 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs flex items-center justify-center gap-4 shadow-2xl hover:bg-blue-600 transition-all group"
                  >
                    BAIXAR CURRÍCULO EM PDF <Download className="group-hover:translate-y-1 transition-transform" size={20}/>
                  </button>
                </div>
              )}

              {/* FLUXO 13: CHECKOUT / PREÇO (SÓ APÓS CLICAR EM BAIXAR NO PREVIEW) */}
              {fluxo === 13 && (
                <div className="text-center space-y-10 animate-in zoom-in duration-500 py-10">
                  <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-2 border-slate-50 relative overflow-hidden max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100"><Lock size={32}/></div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none mb-4">Currículo Bloqueado</h2>
                    <p className="text-slate-400 font-black mb-8 text-sm uppercase tracking-tight">Pague uma pequena taxa única para baixar seu <br/> currículo em PDF de alta qualidade:</p>
                    
                    <div className="text-7xl font-black text-slate-900 mb-10 tracking-tighter">R$ 5,99</div>
                    
                    <button 
                      onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} 
                      className="w-full py-8 bg-blue-600 text-white rounded-[2rem] font-black text-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-blue-200"
                    >
                      PAGAR E BAIXAR <Send size={24}/>
                    </button>

                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-[10px] font-black uppercase text-slate-400">PDF Gerado</div>
                        <CheckCircle2 size={16} className="text-green-500 mt-1"/>
                      </div>
                      <div className="w-[1px] h-8 bg-slate-100"></div>
                      <div className="flex flex-col items-center">
                        <div className="text-[10px] font-black uppercase text-slate-400">Otimizado</div>
                        <CheckCircle2 size={16} className="text-green-500 mt-1"/>
                      </div>
                      <div className="w-[1px] h-8 bg-slate-100"></div>
                      <div className="flex flex-col items-center">
                        <div className="text-[10px] font-black uppercase text-slate-400">Acesso Vitalício</div>
                        <CheckCircle2 size={16} className="text-green-500 mt-1"/>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* FOOTER DE NAVEGAÇÃO FIXO (ETAPAS 0 A 10) */}
      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={() => setFluxo(prev => prev + 1)} 
            className="w-full max-w-3xl py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600 active:scale-95 shadow-xl text-xs flex items-center justify-center gap-2"
          >
            Continuar para etapa {fluxo + 1} <ChevronRight size={18}/>
          </button>
        </footer>
      )}
    </div>
  )
}
