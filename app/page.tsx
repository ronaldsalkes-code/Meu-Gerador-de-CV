'use client'

import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, User, Linkedin, Mail, MapPin, Phone, Award, Timer, Trash2
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // 12 é o Dashboard
  const [pago, setPago] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: ''
  });

  // Carregar dados salvos
  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_data');
    if (salvo) setDados(JSON.parse(salvo));
    if (localStorage.getItem('cv_pago') === 'true') setPago(true);
  }, []);

  // Salvar automaticamente
  const atualizarDados = (novos: any) => {
    const atualizado = { ...dados, ...novos };
    setDados(atualizado);
    localStorage.setItem('cv_premium_data', JSON.stringify(atualizado));
  };

  const proximo = () => setFluxo((prev) => prev + 1);
  const voltar = () => setFluxo((prev) => (prev > 0 ? prev - 1 : 12));

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      
      {/* HEADER / PROGRESSO */}
      {fluxo < 12 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={voltar} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft size={18}/> <span className="text-xs font-bold uppercase">Voltar</span>
          </button>
          <div className="flex-1 max-w-md mx-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${(fluxo / 11) * 100}%`}}/>
          </div>
          <span className="text-[10px] font-black text-slate-400 tracking-tighter">{fluxo}/11</span>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* SIDEBAR (ESTILO IMAGEM) */}
        <aside className="w-full md:w-72 bg-white border-r p-8 hidden md:flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 border-4 border-white shadow-xl overflow-hidden">
            {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" /> : <User className="m-6 text-slate-300" size={40}/>}
          </div>
          <h3 className="font-black text-sm text-slate-800 uppercase tracking-tight text-center">{user?.firstName || 'Candidato'}</h3>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-8">Conta Verificada</p>
          
          <nav className="w-full space-y-2">
            <div className="p-4 rounded-2xl bg-blue-50 text-blue-700 flex items-center gap-3">
              <Sparkles size={18}/> <span className="text-xs font-black uppercase">Gerador IA</span>
            </div>
            <SignedIn><div className="flex justify-center p-4"><UserButton /></div></SignedIn>
          </nav>
        </aside>

        {/* ÁREA DE CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto">

            {/* DASHBOARD (FLUXO 12) */}
            {fluxo === 12 && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-black tracking-tighter">Meus Currículos</h1>
                  <button onClick={() => setFluxo(0)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-lg shadow-blue-200 hover:scale-105 transition-all">NOVO PROJETO</button>
                </div>
                <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] flex items-center gap-6 group hover:border-blue-300 transition-all cursor-pointer" onClick={() => setFluxo(11)}>
                  <div className="w-16 h-20 bg-slate-50 rounded-2xl border flex items-center justify-center text-slate-300 group-hover:text-blue-500"><FileText size={32}/></div>
                  <div className="flex-1">
                    <h2 className="font-black text-slate-800 uppercase text-sm tracking-tight">{dados.cargo || 'Currículo em Edição'}</h2>
                    <p className="text-xs text-slate-400 font-bold">Última alteração: Hoje</p>
                  </div>
                  {pago ? <CheckCircle2 className="text-green-500" /> : <Lock className="text-slate-200" />}
                </div>
              </div>
            )}

            {/* ETAPA 0: OBJETIVO (CARDS COLORIDOS) */}
            {fluxo === 0 && (
              <div className="space-y-8 text-center animate-in slide-in-from-bottom-4">
                <div className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">Currículo Otimizado por IA</div>
                <h2 className="text-4xl font-black tracking-tighter">Qual seu objetivo agora?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {t: 'Conseguir uma entrevista', d: 'Quero ser chamado para processos', c: 'border-blue-100 bg-blue-50/30'},
                    {t: 'Mudar de carreira', d: 'Estou em transição de área', c: 'border-purple-100 bg-purple-50/30'},
                    {t: 'Negociar aumento', d: 'Valorizar meu perfil atual', c: 'border-green-100 bg-green-50/30'},
                    {t: 'Voltar ao mercado', d: 'Retornando após um período', c: 'border-orange-100 bg-orange-50/30'}
                  ].map((obj, i) => (
                    <button key={i} onClick={proximo} className={`p-8 border-2 ${obj.c} rounded-[2rem] text-left hover:scale-[1.02] transition-all group`}>
                      <h4 className="font-black text-slate-800 mb-1">{obj.t}</h4>
                      <p className="text-xs text-slate-500 font-medium">{obj.d}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ETAPA 5: VAGA (TEXTAREA) */}
            {fluxo === 5 && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-3xl font-black tracking-tighter text-center italic">A Vaga dos Sonhos</h2>
                <textarea 
                  className="w-full h-64 p-8 rounded-[2.5rem] bg-white border-2 border-slate-100 outline-none focus:border-blue-600 transition-all font-medium text-slate-600 shadow-sm"
                  placeholder="Cole aqui a descrição da vaga..."
                  value={dados.vagaTexto}
                  onChange={(e) => atualizarDados({ vagaTexto: e.target.value })}
                />
              </div>
            )}

            {/* ETAPA 6: ANÁLISE DE IA (IGUAL A IMAGEM) */}
            {fluxo === 6 && (
              <div className="space-y-10 animate-in zoom-in-95">
                <div className="bg-[#EEF2FF] border border-blue-100 rounded-[2.5rem] p-10 relative">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-100"><Sparkles size={24}/></div>
                  <h3 className="text-2xl font-black text-slate-800 mb-6">Análise de IA</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600 font-bold text-sm"><CheckCircle2 className="text-green-500" size={18}/> Identificamos as palavras-chave ideais.</div>
                    <div className="flex items-center gap-3 text-slate-600 font-bold text-sm"><CheckCircle2 className="text-green-500" size={18}/> Seu perfil tem 85% de compatibilidade.</div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-blue-200 text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} fill="currentColor"/> Pronto! A IA está otimizando seus textos agora.
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">O que você quer destacar?</h4>
                  <div className="space-y-3">
                    {['Experiências relevantes', 'Habilidades técnicas', 'Resultados e conquistas'].map((f, i) => (
                      <button key={i} onClick={proximo} className="w-full p-6 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-between">
                        {f} <ChevronRight size={18} className="opacity-30"/>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 11: FINALIZAÇÃO / PAGAMENTO */}
            {fluxo === 11 && (
              <div className="text-center space-y-8 animate-in zoom-in">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-2 border-slate-50">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6"><Lock size={32}/></div>
                  <h2 className="text-3xl font-black">Currículo Pronto!</h2>
                  <p className="text-slate-400 font-bold italic mb-8">Libere o download em PDF por apenas:</p>
                  <div className="text-7xl font-black text-slate-900 mb-10">R$ 5,99</div>
                  <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-7 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4">
                    BAIXAR AGORA <Send size={24}/>
                  </button>
                </div>
              </div>
            )}

            {/* CAMPOS DE FORMULÁRIO (ETAPAS 1 A 4 E 7 A 10) */}
            {((fluxo >= 1 && fluxo <= 4) || (fluxo >= 7 && fluxo <= 10)) && (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-3xl font-black tracking-tighter italic">Preencha seus dados</h2>
                {fluxo === 1 && (
                   <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Nome Completo" value={dados.nome} onChange={(e)=>atualizarDados({nome: e.target.value})}/>
                )}
                {fluxo === 2 && (
                   <input className="w-full p-6 rounded-2xl bg-white border-2 border-slate-100 font-black outline-none focus:border-blue-600" placeholder="Seu Telefone/WhatsApp" value={dados.tel} onChange={(e)=>atualizarDados({tel: e.target.value})}/>
                )}
                {fluxo === 3 && (
                   <textarea className="w-full h-48 p-6 rounded-2xl bg-white border-2 border-slate-100 font-medium outline-none focus:border-blue-600" placeholder="Seu Resumo Profissional" value={dados.resumo} onChange={(e)=>atualizarDados({resumo: e.target.value})}/>
                )}
                {/* Outros campos seguem a mesma lógica... */}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* RODAPÉ FIXO DE NAVEGAÇÃO */}
      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={proximo} 
            className={`w-full max-w-2xl py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${fluxo === 6 ? 'hidden' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
          >
            Continuar
          </button>
        </footer>
      )}
    </div>
  )
}
