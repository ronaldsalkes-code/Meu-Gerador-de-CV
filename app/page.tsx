'use client'

import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Linkedin, Mail, MapPin, Phone, Award, Timer, GraduationCap, Star, Wand2
} from 'lucide-react'

export default function GeradorCVIA() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12);
  const [pago, setPago] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: ''
  });

  // Sugestões Automáticas da IA para facilitar o preenchimento
  const sugerirTextoIA = (campo: string) => {
    const sugestoes: any = {
      resumo: `Profissional focado em resultados com experiência em ${dados.cargo || 'minha área'}. Especialista em otimização de processos e atendimento ao cliente, buscando contribuir para o crescimento da empresa através de dedicação e aprendizado contínuo.`,
      exp: `• Gestão de rotinas operacionais e suporte à equipe.\n• Atendimento especializado focado na satisfação do cliente.\n• Alcance de metas mensais estabelecidas pela diretoria.\n• Organização de documentos e processos internos.`,
      skills: "Liderança, Proatividade, Pacote Office, Comunicação Assertiva, Resolução de Conflitos"
    };
    atualizarDados({ [campo]: sugestoes[campo] });
  };

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
      
      {/* HEADER PROGRESSO */}
      {fluxo < 12 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={voltar} className="flex items-center gap-2 text-slate-400">
            <ArrowLeft size={18}/> <span className="text-xs uppercase tracking-tight">Gerar CV</span>
          </button>
          <div className="flex-1 max-w-xl mx-8 h-2 bg-slate-100 rounded-full">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{width: `${(fluxo / 11) * 100}%`}}/>
          </div>
          <span className="text-xs text-slate-400">{fluxo}/11</span>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-white border-r p-8 hidden md:flex flex-col items-center shrink-0">
          <div className="w-20 h-20 rounded-full bg-slate-100 mb-4 border border-slate-200 overflow-hidden">
            {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" /> : <User className="m-5 text-slate-300" size={30}/>}
          </div>
          <h3 className="text-sm text-slate-800 uppercase tracking-tight text-center">{user?.firstName || 'Usuário'}</h3>
          <p className="text-[10px] text-blue-600 uppercase mt-1">Perfil Ativo</p>
          
          <nav className="w-full mt-8 space-y-2">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700 flex items-center gap-3 text-xs">
              <Sparkles size={16}/> Inteligência Artificial
            </div>
            <SignedIn><div className="flex justify-center pt-4"><UserButton /></div></SignedIn>
          </nav>
        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
          <div className="max-w-2xl mx-auto">

            {/* DASHBOARD */}
            {fluxo === 12 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl tracking-tighter uppercase">Meus Currículos</h1>
                  <button onClick={() => setFluxo(0)} className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all">
                    <Plus size={16}/> NOVO CV
                  </button>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center gap-4 hover:border-blue-400 transition-all cursor-pointer shadow-sm" onClick={() => setFluxo(11)}>
                  <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300"><FileText size={24}/></div>
                  <div className="flex-1">
                    <h2 className="text-sm uppercase tracking-tight text-slate-700">{dados.cargo || 'Currículo sem título'}</h2>
                    <p className="text-[10px] text-slate-400 uppercase">Documento salvo</p>
                  </div>
                  {pago ? <CheckCircle2 className="text-green-500" size={20}/> : <Lock className="text-slate-200" size={20}/>}
                </div>
              </div>
            )}

            {/* PAINEL IA STATUS */}
            {fluxo >= 1 && fluxo <= 10 && (
              <div className="bg-[#EEF2FF] border border-blue-100 rounded-3xl p-6 mb-8 flex items-start gap-4">
                <div className="bg-blue-600 p-2 rounded-lg text-white"><Sparkles size={18}/></div>
                <div>
                  <h4 className="text-sm text-slate-800">IA Geradora de Conteúdo</h4>
                  <p className="text-[11px] text-slate-500 font-normal">Estou analisando as melhores práticas do mercado para você.</p>
                </div>
              </div>
            )}

            {/* FORMULÁRIO DINÂMICO */}
            <div className="space-y-6">
              {fluxo === 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl tracking-tight uppercase">O que deseja agora?</h2>
                  <div className="grid gap-3">
                    {['Destaque Minhas Experiências', 'Focar em Novas Habilidades', 'Primeiro Emprego'].map((t, i) => (
                      <button key={i} onClick={proximo} className="p-6 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-600 hover:bg-blue-50/50 transition-all group">
                        <span className="text-slate-700 group-hover:text-blue-700 uppercase text-sm tracking-tight">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {fluxo === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg uppercase">Identificação Básica</h2>
                  <input className="w-full p-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-600 shadow-sm" placeholder="Nome Completo" value={dados.nome} onChange={(e)=>atualizarDados({nome: e.target.value})}/>
                  <input className="w-full p-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-600 shadow-sm" placeholder="Cargo dos Sonhos" value={dados.cargo} onChange={(e)=>atualizarDados({cargo: e.target.value})}/>
                </div>
              )}

              {fluxo === 4 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg uppercase">Seu Perfil</h2>
                    <button onClick={() => sugerirTextoIA('resumo')} className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-600 transition-colors uppercase">
                      <Wand2 size={12}/> IA Sugerir Texto
                    </button>
                  </div>
                  <textarea className="w-full h-48 p-5 rounded-2xl border border-slate-200 outline-none focus:border-blue-600 shadow-sm font-normal text-sm" placeholder="Escreva sobre você ou use a IA..." value={dados.resumo} onChange={(e)=>atualizarDados({resumo: e.target.value})}/>
                </div>
              )}

              {fluxo === 5 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg uppercase">Experiência</h2>
                    <button onClick={() => sugerirTextoIA('exp')} className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-600 transition-colors uppercase">
                      <Wand2 size={12}/> IA Sugerir Texto
                    </button>
                  </div>
                  <textarea className="w-full h-64 p-5 rounded-2xl border border-slate-200 outline-none focus:border-blue-600 shadow-sm font-normal text-sm" placeholder="Liste suas experiências..." value={dados.exp} onChange={(e)=>atualizarDados({exp: e.target.value})}/>
                </div>
              )}

              {/* TELA PAGAMENTO (FLUXO 11) */}
              {fluxo === 11 && (
                <div className="text-center py-6 space-y-6">
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100"><Lock size={28}/></div>
                    <h2 className="text-2xl uppercase tracking-tighter">Currículo Pronto!</h2>
                    <p className="text-xs text-slate-400 font-normal mt-2">O pagamento via Pix libera o download instantaneamente.</p>
                    <div className="text-5xl font-black text-slate-900 my-8">R$ 5,99</div>
                    <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-5 bg-blue-600 text-white rounded-2xl text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95">
                      PAGAR VIA PIX <Send size={20}/>
                    </button>
                    <div className="mt-6 text-[10px] text-amber-500 flex items-center justify-center gap-2">
                      <Timer size={14}/> AGUARDE 5 SEGUNDOS APÓS PAGAR PARA LIBERAR.
                    </div>
                  </div>
                </div>
              )}

              {/* TODAS AS OUTRAS ETAPAS (SÓ APARECEM SE O FLUXO CORRESPONDER) */}
              {fluxo === 2 && <div className="space-y-4"><h2 className="text-lg uppercase">Contatos</h2><input className="w-full p-4 rounded-xl border border-slate-200" placeholder="WhatsApp" value={dados.tel} onChange={(e)=>atualizarDados({tel:e.target.value})}/><input className="w-full p-4 rounded-xl border border-slate-200" placeholder="Email" value={dados.email} onChange={(e)=>atualizarDados({email:e.target.value})}/></div>}
              {fluxo === 3 && <div className="space-y-4"><h2 className="text-lg uppercase text-blue-600 italic">Vaga Alvo</h2><textarea className="w-full h-40 p-4 rounded-xl border border-slate-200 font-normal" placeholder="Cole a vaga para a IA analisar..." value={dados.vagaTexto} onChange={(e)=>atualizarDados({vagaTexto:e.target.value})}/></div>}
              {fluxo === 6 && <div className="space-y-4"><h2 className="text-lg uppercase">Educação</h2><textarea className="w-full h-32 p-4 rounded-xl border border-slate-200 font-normal" placeholder="Curso e Instituição..." value={dados.estudos} onChange={(e)=>atualizarDados({estudos:e.target.value})}/></div>}
              {fluxo === 7 && <div className="space-y-4"><div className="flex justify-between items-center"><h2 className="text-lg uppercase">Habilidades</h2><button onClick={()=>sugerirTextoIA('skills')} className="text-[10px] bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase"><Wand2 size={12}/> Sugerir IA</button></div><input className="w-full p-4 rounded-xl border border-slate-200" placeholder="Ex: Vendas, Office..." value={dados.skills} onChange={(e)=>atualizarDados({skills:e.target.value})}/></div>}
              {fluxo === 8 && <div className="space-y-4"><h2 className="text-lg uppercase">Idiomas/Cursos</h2><textarea className="w-full h-32 p-4 rounded-xl border border-slate-200 font-normal" value={dados.cursos} onChange={(e)=>atualizarDados({cursos:e.target.value})}/></div>}
              {fluxo === 9 && <div className="space-y-4"><h2 className="text-lg uppercase tracking-tight">LinkedIn</h2><input className="w-full p-4 rounded-xl border border-slate-200" placeholder="Link do perfil..." value={dados.linkedin} onChange={(e)=>atualizarDados({linkedin:e.target.value})}/></div>}
              {fluxo === 10 && <div className="space-y-4"><h2 className="text-lg uppercase italic tracking-tighter">Dados Finais</h2><div className="grid grid-cols-4 gap-2">{['A','B','AB','D','E'].map(c=><button key={c} onClick={()=>atualizarDados({cnh:c})} className={`p-3 rounded-lg border-2 ${dados.cnh === c ? 'bg-blue-600 text-white' : 'border-slate-100'}`}>{c}</button>)}</div><input className="w-full p-4 rounded-xl border border-slate-200 mt-4" placeholder="Disponibilidade" value={dados.disponibilidade} onChange={(e)=>atualizarDados({disponibilidade:e.target.value})}/></div>}
            </div>

          </div>
        </main>
      </div>

      {/* BOTÃO CONTINUAR FIXO */}
      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={proximo} 
            className="w-full max-w-2xl py-5 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg text-xs"
          >
            Continuar Etapa {fluxo + 1}
          </button>
        </footer>
      )}
    </div>
  )
}
