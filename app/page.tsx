'use client'

import { useState, useCallback, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus, Zap, 
  ChevronRight, Laptop, User, Linkedin, Mail, MapPin, Phone, Award, Star, Clock
} from 'lucide-react'

export default function GeradorLayoutPremium() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // Começa no Dashboard
  const [pago, setPago] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não possuo', disponibilidade: '', vagaTexto: '', referencias: ''
  });

  // Persistência
  useEffect(() => {
    const salvo = localStorage.getItem('cv_dados_cache');
    if (salvo) setDados(JSON.parse(salvo));
    if (localStorage.getItem('cv_pago_status') === 'true') setPago(true);
  }, []);

  const salvar = (novosDados: any) => {
    setDados(novosDados);
    localStorage.setItem('cv_dados_cache', JSON.stringify(novosDados));
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* 1. BARRA DE PROGRESSO (IGUAL A IMAGEM) */}
      <div className="w-full bg-white border-b flex items-center justify-between px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setFluxo(12)} className="text-slate-400 hover:text-slate-600"><ArrowLeft size={20}/></button>
          <span className="font-bold text-sm text-slate-700">Gerar CV</span>
        </div>
        <div className="flex-1 max-w-xl mx-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${(fluxo/11)*100}%`}}/>
        </div>
        <span className="text-xs font-bold text-slate-400">{fluxo}/11</span>
      </div>

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* 2. SIDEBAR LATERAL (STATUS DO USUÁRIO) */}
        <aside className="w-full md:w-64 bg-white border-r p-8 flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-lg">
              {user?.imageUrl ? <img src={user.imageUrl} alt="Perfil" /> : <User size={40} className="m-6 text-slate-300"/>}
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          
          <div className="text-center">
            <h3 className="font-bold text-slate-800 leading-tight">{user?.fullName || 'Candidato'}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Perfil Verificado</p>
          </div>

          <nav className="w-full space-y-2 pt-6 border-t">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs">
              <Sparkles size={16}/> SignedIn
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 font-bold text-xs hover:bg-slate-50 transition-all">
              <Linkedin size={16}/> LinkedIn
            </button>
            <div className="pt-4"><UserButton afterSignOutUrl="/" /></div>
          </nav>
        </aside>

        {/* 3. CONTEÚDO CENTRAL (ESTILO CARD DA IMAGEM) */}
        <main className="flex-1 p-4 md:p-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* PAINEL DE ANÁLISE DE IA (IGUAL A IMAGEM) */}
            {fluxo < 11 && (
              <div className="bg-[#EEF2FF] border border-blue-100 rounded-[2rem] p-8 relative overflow-hidden">
                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Sparkles size={20}/>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-slate-800">Análise de IA</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <CheckCircle2 size={16} className="text-green-500"/> Identificamos as palavras-chave ideais para seu cargo.
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <CheckCircle2 size={16} className="text-green-500"/> Seu perfil tem 85% de compatibilidade.
                      </div>
                    </div>
                    <div className="pt-4 border-t border-blue-200 text-xs font-bold text-blue-600 uppercase flex items-center gap-2">
                       <Zap size={14}/> Pronto! A IA está otimizando seus textos agora.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DASHBOARD (LISTAGEM) */}
            {fluxo === 12 && (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <h2 className="text-2xl font-black text-slate-800">Seus Currículos</h2>
                   <button onClick={() => setFluxo(0)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-100"><Plus size={16}/> NOVO CV</button>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 flex items-center gap-6 group hover:border-blue-200 transition-all">
                   <div className="w-16 h-20 bg-slate-50 rounded-xl border flex items-center justify-center text-slate-300 group-hover:text-blue-500"><FileText size={32}/></div>
                   <div className="flex-1">
                      <h3 className="font-black text-slate-700 uppercase text-xs">{dados.cargo || "Rascunho de Currículo"}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pago ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{pago ? 'LIBERADO' : 'AGUARDANDO PAGAMENTO'}</span>
                   </div>
                   {pago ? (
                     <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs">BAIXAR</button>
                   ) : (
                     <button onClick={() => setFluxo(11)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs">LIBERAR</button>
                   )}
                </div>
              </div>
            )}

            {/* ETAPA: ESCOLHER FOCO (ESTILO DA IMAGEM) */}
            {fluxo === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                   <h2 className="text-2xl font-black text-slate-800 italic">O que você quer destacar?</h2>
                   <p className="text-slate-400 text-sm">Escolha o foco principal do seu currículo</p>
                </div>
                <div className="grid gap-3">
                  {[
                    {t: 'Experiências relevantes', d: 'Destaque as posições que mais combinam com a vaga', i: <Briefcase/>},
                    {t: 'Resultados e Skills', d: 'Foco em tecnologias, ferramentas e competências', i: <Zap/>},
                    {t: 'Referências e Cursos', d: 'Ideal para quem busca o primeiro emprego', i: <Award/>}
                  ].map((item, idx) => (
                    <button key={idx} onClick={() => setFluxo(1)} className="w-full bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-600 transition-all flex items-center gap-6 text-left group">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600">{item.i}</div>
                      <div>
                        <h4 className="font-bold text-slate-800">{item.t}</h4>
                        <p className="text-xs text-slate-400">{item.d}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* OUTRAS ETAPAS (CORREÇÃO DAS FALTANTES) */}
            {fluxo === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">Dados de Contato</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="p-4 rounded-xl bg-white border outline-none focus:border-blue-500 font-bold" placeholder="WhatsApp" value={dados.tel} onChange={e => salvar({...dados, tel: e.target.value})}/>
                  <input className="p-4 rounded-xl bg-white border outline-none focus:border-blue-500 font-bold" placeholder="Cidade - UF" value={dados.cidade} onChange={e => salvar({...dados, cidade: e.target.value})}/>
                </div>
                <button onClick={() => setFluxo(2)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold">Continuar</button>
              </div>
            )}
            
            {/* ... REPETIR PARA OUTRAS ETAPAS ... */}

            {/* TELA DE PAGAMENTO */}
            {fluxo === 11 && (
              <div className="text-center space-y-8 animate-in zoom-in">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border-2 border-slate-50">
                   <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-100"><Lock size={32}/></div>
                   <h2 className="text-3xl font-black text-slate-800">Currículo Finalizado!</h2>
                   <p className="text-slate-500 mb-8 font-medium italic">Libere agora o download em PDF e Word por apenas:</p>
                   <div className="text-6xl font-black text-slate-900 mb-10">R$ 5,99</div>
                   <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                     LIBERAR DOWNLOAD <ChevronRight/>
                   </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* 4. RODAPÉ DE AÇÃO (IGUAL A IMAGEM) */}
      {fluxo < 11 && fluxo !== 12 && (
        <footer className="w-full bg-white border-t p-4 flex justify-center sticky bottom-0 z-50">
          <button onClick={() => setFluxo(fluxo + 1)} className="w-full max-w-2xl py-4 bg-slate-200 text-slate-500 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
            Continuar
          </button>
        </footer>
      )}
    </div>
  )
}
