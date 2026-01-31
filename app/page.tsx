'use client'

import { useState, useCallback, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Camera, X, Sparkles, Target, Briefcase, 
  TrendingUp, RefreshCcw, Send, AlertTriangle, Lightbulb, Languages, 
  Phone, Mail, MapPin, Award, Link, Star, BookOpen, Clock, Linkedin, Users, Timer, FileText, Lock, Plus, Zap, ChevronRight, GraduationCap, Laptop
} from 'lucide-react'

// --- MOTOR DE IA PARA OTIMIZAÇÃO (Seu original aprimorado) ---
const IA_Otimizar = (dados: any) => {
  const glossario: { [key: string]: string } = {
    "limpeza": "Higiene e organização de ambientes operacionais",
    "ajudei": "Contribuí ativamente na execução de",
    "atendimento": "Excelência no suporte ao cliente e resolução de demandas",
    "vendi": "Gestão comercial e conversão de vendas",
    "caixa": "Operação financeira e conciliação de PDV"
  };
  let resumo = dados.resumo || "Profissional em busca de novos desafios...";
  let exp = dados.exp || "";
  
  Object.keys(glossario).forEach(termo => {
    const regex = new RegExp(termo, "gi");
    resumo = resumo.replace(regex, glossario[termo]);
    exp = exp.replace(regex, glossario[termo]);
  });

  return { 
    ...dados, 
    resumo, 
    exp: exp.split('\n').filter((l:string)=>l.trim()).map((l:string)=>l.startsWith('•')?l:`• ${l.trim()}`).join('\n') 
  };
};

export default function GeradorCurriculoPro() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // Inicia no Dashboard
  const [foto, setFoto] = useState<string | null>(null);
  const [pago, setPago] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não possuo', disponibilidade: '', vagaTexto: '', referencias: ''
  });

  const dicasIA = [
    "Dica: Tente focar em um cargo específico para atrair mais recrutadores.",
    "IA: Cole a vaga aqui para eu identificar as palavras-chave ideais.",
    "Dica: Uma foto profissional aumenta suas chances em até 40%.",
    "Importante: Confira se seu WhatsApp está correto para receber convites.",
    "IA: Adicione o link do LinkedIn para passar mais credibilidade.",
    "Dica: Um resumo forte deve ter entre 3 e 5 linhas de conquistas.",
    "Dica: Liste suas experiências da mais atual para a mais antiga.",
    "IA: Destaque sua formação principal e cursos relevantes.",
    "Dica: Referências profissionais ajudam muito na decisão final.",
    "IA: Quase lá! Revise tudo com calma antes de finalizar.",
    "Dica: Escolha sua disponibilidade e categoria de CNH corretamente."
  ];

  useEffect(() => {
    const salvo = localStorage.getItem('cv_dados_cache');
    const statusPago = localStorage.getItem('cv_pago_status');
    if (salvo) setDados(JSON.parse(salvo));
    if (statusPago === 'true') setPago(true);

    const params = new URLSearchParams(window.location.search);
    if (params.get('pago') === 'true') {
      setPago(true);
      localStorage.setItem('cv_pago_status', 'true');
      setFluxo(11);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cv_dados_cache', JSON.stringify(dados));
  }, [dados]);

  const gerarCV = useCallback(() => {
    const f = IA_Otimizar(dados);
    const html = `<html><head><style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');@page { size: A4; margin: 0; } * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',sans-serif; } body { width: 210mm; padding: 25mm 20mm; color: #333; line-height: 1.6; } .header { border-bottom: 6px solid #2563eb; padding-bottom: 25px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; } .nome { font-size: 28pt; font-weight: 800; text-transform: uppercase; letter-spacing: -1.5px; } .cargo { font-size: 18pt; color: #2563eb; font-weight: 700; text-transform: uppercase; } .grid { display: grid; grid-template-columns: 1.6fr 1.1fr; gap: 40px; } .secao { margin-bottom: 25px; } .titulo { font-size: 12pt; color: #2563eb; font-weight: 800; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; padding-bottom: 5px; margin-bottom: 10px; } .texto { font-size: 10.5pt; text-align: justify; white-space: pre-wrap; } .tag { display: inline-block; background: #eff6ff; border: 1px solid #bfdbfe; padding: 3px 8px; margin: 0 4px 4px 0; font-size: 8.5pt; font-weight: 700; border-radius: 4px; color: #1e40af; } .foto { width: 110px; height: 130px; border-radius: 10px; object-fit: cover; border: 1px solid #ddd; } .item-contato { font-size: 9.5pt; font-weight: 600; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }</style></head><body><div class="header"><div><h1 class="nome">${f.nome || 'NOME'}</h1><div class="cargo">${f.cargo || 'CARGO'}</div></div>${foto ? `<img src="${foto}" class="foto" />` : ''}</div><div class="grid"><div><div class="secao"><h2 class="titulo">Perfil Profissional</h2><div class="texto">${f.resumo}</div></div><div class="secao"><h2 class="titulo">Experiência Profissional</h2><div class="texto">${f.exp}</div></div>${f.referencias ? `<div class="secao"><h2 class="titulo">Referências Profissionais</h2><div class="texto">${f.referencias}</div></div>` : ''}${f.cursos ? `<div class="secao"><h2 class="titulo">Cursos e Certificações</h2><div class="texto">${f.cursos}</div></div>` : ''}</div><div><div class="secao"><h2 class="titulo">Contato</h2><div class="item-contato">📍 ${f.cidade}</div><div class="item-contato">📞 ${f.tel}</div><div class="item-contato">✉️ ${f.email}</div>${f.linkedin ? `<div class="item-contato">🔗 ${f.linkedin}</div>` : ''}</div><div class="secao"><h2 class="titulo">Habilidades</h2><div>${f.skills.split(',').map(s=>`<span class="tag">${s.trim()}</span>`).join('')}</div></div><div class="secao"><h2 class="titulo">Formação</h2><div class="texto">${f.estudos}</div></div>${f.idiomas ? `<div class="secao"><h2 class="titulo">Idiomas</h2><div class="texto">${f.idiomas}</div></div>` : ''}<div class="secao"><h2 class="titulo">Adicionais</h2><div class="item-contato"><b>CNH:</b> ${f.cnh}</div><div class="item-contato"><b>Disponibilidade:</b> ${f.disponibilidade}</div></div></div></div></body></html>`;
    const win = window.open('','_blank'); win?.document.write(html); win?.document.close();
    setTimeout(() => win?.print(), 500);
  }, [dados, foto]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col items-center font-sans">
      
      {/* HEADER FIXO COM ESTILO APPLE */}
      <nav className="w-full max-w-2xl px-6 py-6 flex justify-between items-center backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-white/50 shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200"><Zap size={20} fill="white"/></div>
           <span className="font-black tracking-tighter text-lg">CURRICULO.AI</span>
        </div>
        <SignedIn><UserButton appearance={{elements: {avatarBox: "w-9 h-9 rounded-lg border-2 border-white"}}} /></SignedIn>
      </nav>

      <main className="w-full max-w-2xl p-4 md:p-6 space-y-6">
        
        <SignedOut>
          <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200 border border-white text-center mt-10">
            <h1 className="text-4xl font-black mb-4 tracking-tighter">CONSIGA O <br/><span className="text-blue-600">EMPREGO IDEAL.</span></h1>
            <p className="text-slate-500 font-medium mb-10">Otimizamos seu currículo com inteligência artificial para passar nos filtros de RH.</p>
            <SignInButton mode="modal">
              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                COMEÇAR AGORA <ChevronRight size={20}/>
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          {/* DASHBOARD - ÁREA DO CLIENTE */}
          {fluxo === 12 && (
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-sm font-bold opacity-70 uppercase tracking-[0.2em] mb-1">Candidato</h2>
                  <p className="text-3xl font-black mb-6 leading-none">Olá, {user?.firstName}!</p>
                  <button onClick={() => { localStorage.removeItem('cv_dados_cache'); setFluxo(0); }} className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center gap-2">
                    <Plus size={16}/> NOVO CURRÍCULO
                  </button>
                </div>
                <Sparkles size={140} className="absolute -right-8 -bottom-8 opacity-10 rotate-12"/>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                   <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Meus Documentos</h3>
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-100 flex items-center gap-5 hover:border-blue-100 transition-all">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center text-blue-600">
                    <FileText size={32}/>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight truncate">{dados.cargo || "Inicie seu currículo"}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {pago ? (
                        <span className="text-[10px] font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-md">LIBERADO</span>
                      ) : (
                        <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1"><Lock size={10}/> BLOQUEADO</span>
                      )}
                    </div>
                  </div>
                  {pago ? (
                    <button onClick={gerarCV} className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg hover:scale-110 transition-transform shadow-blue-200"><Eye size={22}/></button>
                  ) : (
                    <button onClick={() => setFluxo(11)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-blue-600 transition-all">PAGAR</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FORMULÁRIO DO GERADOR */}
          {fluxo < 12 && (
            <div className="bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden transition-all">
              
              {/* STATUS DE IA */}
              <div className="bg-blue-600 p-6 flex items-start gap-4 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Lightbulb className="text-white animate-pulse" size={20}/>
                </div>
                <p className="text-xs font-bold leading-relaxed">{dicasIA[fluxo]}</p>
              </div>

              {/* PROGRESSO */}
              <div className="px-10 pt-8 flex items-center gap-4">
                <button onClick={() => setFluxo(f => f === 0 ? 12 : f - 1)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ArrowLeft size={24}/></button>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-700" style={{width: `${(fluxo/11)*100}%`}}/>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase">{fluxo + 1}/11</span>
              </div>

              <div className="p-10 pt-4 space-y-6">
                
                {/* ETAPA 0: INTRO */}
                {fluxo === 0 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    <h2 className="text-3xl font-black tracking-tighter">O que você busca?</h2>
                    <div className="grid grid-cols-1 gap-3">
                      {["Primeiro Emprego", "Promoção de Cargo", "Mudar de Área", "Vaga Urgente"].map(t => (
                        <button key={t} onClick={()=>setFluxo(1)} className="p-6 border-2 border-slate-50 rounded-3xl text-left hover:border-blue-600 hover:bg-blue-50 transition-all group">
                          <span className="font-bold text-slate-700 group-hover:text-blue-700">{t}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ETAPA 2: DADOS PESSOAIS */}
                {fluxo === 2 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h2 className="text-2xl font-black">Dados Básicos</h2>
                    <div className="relative">
                      <Users className="absolute left-5 top-5 text-slate-300" size={20}/>
                      <input className="w-full h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" placeholder="Seu Nome Completo" value={dados.nome} onChange={(e)=>setDados({...dados, nome:e.target.value})}/>
                    </div>
                    <div className="relative">
                      <Target className="absolute left-5 top-5 text-slate-300" size={20}/>
                      <input className="w-full h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" placeholder="Cargo Pretendido" value={dados.cargo} onChange={(e)=>setDados({...dados, cargo:e.target.value})}/>
                    </div>
                  </div>
                )}

                {/* ETAPA 3: CONTATO */}
                {fluxo === 3 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h2 className="text-2xl font-black">Como te encontrar?</h2>
                    <div className="relative">
                      <Phone className="absolute left-5 top-5 text-slate-300" size={20}/>
                      <input className="w-full h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" placeholder="WhatsApp (com DDD)" value={dados.tel} onChange={(e)=>setDados({...dados, tel:e.target.value})}/>
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-5 top-5 text-slate-300" size={20}/>
                      <input className="w-full h-16 pl-14 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold" placeholder="Seu melhor e-mail" value={dados.email} onChange={(e)=>setDados({...dados, email:e.target.value})}/>
                    </div>
                  </div>
                )}

                {/* ETAPA 6: EXPERIÊNCIA (TEXTAREA) */}
                {fluxo === 6 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h2 className="text-2xl font-black flex items-center gap-2"><Briefcase className="text-blue-600"/> Experiência</h2>
                    <textarea className="w-full h-48 p-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-medium text-sm leading-relaxed" placeholder="Empresa - Cargo (Ano início a Ano fim)&#10;Diga o que você fazia lá..." value={dados.exp} onChange={(e)=>setDados({...dados, exp:e.target.value})}/>
                  </div>
                )}

                {/* ETAPA 11: PAGAMENTO PIX */}
                {fluxo === 11 && (
                  <div className="text-center space-y-8 animate-in zoom-in">
                    {!pago ? (
                      <>
                        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden">
                          <Lock size={80} className="absolute -right-4 -top-4 opacity-10"/>
                          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Quase pronto!</h2>
                          <div className="text-5xl font-black text-blue-500">R$ 5,99</div>
                          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Acesso vitalício ao PDF</p>
                        </div>
                        <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full h-20 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all">
                          PAGAR E BAIXAR <Send size={24}/>
                        </button>
                        <div className="bg-amber-50 p-4 rounded-2xl flex gap-3 text-left">
                           <Timer className="text-amber-500 shrink-0" size={18}/>
                           <p className="text-[10px] text-amber-700 font-bold uppercase leading-tight">Aguarde 5 segundos após o Pix para o sistema liberar automaticamente.</p>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-8 border-green-100 animate-bounce"><CheckCircle2 size={48}/></div>
                        <h2 className="text-3xl font-black tracking-tighter">PARABÉNS!</h2>
                        <button onClick={gerarCV} className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl flex items-center justify-center gap-4">
                          <Eye size={32}/> BAIXAR PDF AGORA
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* BOTÃO NAVEGAÇÃO */}
                {fluxo !== 0 && fluxo < 11 && (
                  <button onClick={() => setFluxo(f => f + 1)} className="w-full h-18 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                    PRÓXIMO PASSO <ChevronRight size={20}/>
                  </button>
                )}
              </div>
            </div>
          )}
        </SignedIn>

      </main>

      <footer className="mt-auto py-10 opacity-30 text-[10px] font-black uppercase tracking-[0.3em]">
        Inteligência Artificial • Direitos Reservados 2024
      </footer>
    </div>
  )
}
