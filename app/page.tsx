'use client'

import { useState, useCallback, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, CheckCircle2, Eye, Camera, X, Sparkles, Target, Briefcase, 
  TrendingUp, RefreshCcw, Send, AlertTriangle, Lightbulb, Languages, 
  Phone, Mail, MapPin, Award, Link, Star, BookOpen, Clock, Linkedin, Users, Timer, FileText, Lock, Plus
} from 'lucide-react'

// --- MOTOR DE IA (Mantido o seu original) ---
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
  if (dados.vagaTexto && dados.vagaTexto.length > 20) {
    resumo = `Especialista com competências alinhadas aos requisitos de ${dados.cargo}. Focado em entregar resultados baseados nas necessidades da vaga de ${dados.cargo}. ` + resumo;
  }
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

export default function GeradorCurriculoMaster() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(0); // 0 = Início, 1-10 = Form, 11 = Pagamento, 12 = Dashboard (Lista)
  const [foto, setFoto] = useState<string | null>(null);
  const [pago, setPago] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não possuo', disponibilidade: '', vagaTexto: '', referencias: ''
  });

  // CARREGAR DADOS E CHECAR SE VAI PARA A LISTA
  useEffect(() => {
    const salvo = localStorage.getItem('cv_dados_cache');
    const statusPago = localStorage.getItem('cv_pago_status');
    
    if (salvo) {
      setDados(JSON.parse(salvo));
      setFluxo(12); // Se tem dado salvo, manda direto para a lista (Dashboard)
    }
    if (statusPago === 'true') setPago(true);

    const params = new URLSearchParams(window.location.search);
    if (params.get('pago') === 'true') {
      setPago(true);
      localStorage.setItem('cv_pago_status', 'true');
      setFluxo(11); // Vai para a tela de baixar
    }
  }, []);

  // SALVAR SEMPRE
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans">
      
      {/* HEADER DO USUÁRIO */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Sparkles size={20}/></div>
           <span className="font-black text-slate-800 uppercase tracking-tighter">Currículo Pro</span>
        </div>
        <SignedIn><UserButton afterSignOutUrl="/"/></SignedIn>
      </div>

      <SignedOut>
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl text-center border">
           <h1 className="text-3xl font-black text-slate-800 mb-4 uppercase">Olá!</h1>
           <p className="text-slate-500 mb-8 font-medium">Faça login com sua conta Google para começar seu currículo.</p>
           <SignInButton mode="modal">
             <button className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">ENTRAR COM GOOGLE</button>
           </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border">
          
          {/* SE ESTIVER NO DASHBOARD (LISTA) */}
          {fluxo === 12 && (
            <div className="p-8 md:p-12 space-y-8 animate-in zoom-in">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Seus currículos</h2>
                  <p className="text-slate-400 text-sm font-medium">Olá, {user?.firstName}!</p>
                </div>
                <button onClick={() => setFluxo(0)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"><Plus/></button>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 flex items-center gap-6 relative group">
                <div className="w-16 h-20 bg-white rounded-lg shadow-sm border flex items-center justify-center text-slate-300">
                  <FileText size={32}/>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-slate-700 uppercase text-sm tracking-tight">{dados.cargo || "Currículo em rascunho"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {pago ? (
                      <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">LIBERADO</span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock size={10}/> BLOQUEADO</span>
                    )}
                  </div>
                </div>
                {pago ? (
                  <button onClick={gerarCV} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg hover:scale-105 transition-all tracking-widest uppercase">BAIXAR PDF</button>
                ) : (
                  <button onClick={() => setFluxo(11)} className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg hover:scale-105 transition-all tracking-widest uppercase">LIBERAR</button>
                )}
              </div>
            </div>
          )}

          {/* O RESTANTE DO FLUXO (0 A 11) - CONSERVADO CONFORME SEU CÓDIGO */}
          {fluxo < 12 && (
            <>
              <div className="bg-slate-50 border-bottom p-6 flex items-center gap-4">
                <button onClick={() => setFluxo(f => f === 0 ? 12 : f - 1)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ArrowLeft/></button>
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full"><div className="h-full bg-blue-600 transition-all" style={{width: `${(fluxo/11)*100}%`}}/></div>
              </div>
              <div className="p-8 md:p-12">
                {fluxo === 0 && (
                  <div className="text-center space-y-6">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Novo Currículo</h1>
                    <p className="text-slate-500 font-medium">Siga as etapas para criar seu documento otimizado.</p>
                    <button onClick={() => setFluxo(1)} className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black shadow-lg uppercase">Começar agora</button>
                  </div>
                )}
                
                {/* ETAPAS DE 1 A 10 (Você já tem elas, mantive a lógica simplificada aqui para o código não ficar gigante) */}
                {fluxo >= 1 && fluxo <= 10 && (
                  <div className="space-y-4">
                     {/* EX: NOME E CARGO (Etapa 2 no seu código original) */}
                     {fluxo === 2 && (
                        <>
                          <input className="w-full h-14 px-6 rounded-xl border-2 border-slate-100 outline-none" placeholder="Nome Completo" value={dados.nome} onChange={(e)=>setDados({...dados, nome:e.target.value})}/>
                          <input className="w-full h-14 px-6 rounded-xl border-2 border-slate-100 outline-none" placeholder="Cargo que busca" value={dados.cargo} onChange={(e)=>setDados({...dados, cargo:e.target.value})}/>
                        </>
                     )}
                     {/* BOTAO PROXIMO GENERICO PARA TESTE - Substitua pelos seus inputs originais */}
                     <button onClick={() => setFluxo(f => f + 1)} className="w-full h-16 bg-blue-600 text-white rounded-xl font-black uppercase">Próximo</button>
                  </div>
                )}

                {/* TELA DE PAGAMENTO (ETAPA 11) */}
                {fluxo === 11 && (
                  <div className="text-center space-y-6 animate-in zoom-in">
                    {!pago ? (
                      <div className="space-y-6">
                        <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                          <Sparkles className="absolute top-4 right-4 opacity-20" size={60}/>
                          <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter">Falta pouco!</h2>
                          <p className="text-blue-100 text-sm font-medium">Libere seu PDF otimizado por IA.</p>
                        </div>
                        <div className="text-5xl font-black text-slate-800">R$ 5,99</div>
                        <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-2xl flex gap-4 text-left">
                          <Timer size={20} className="text-amber-500 shrink-0"/>
                          <p className="text-amber-700 text-xs font-medium">Pague o Pix e aguarde 5 segundos sem fechar o navegador para o sistema liberar seu download.</p>
                        </div>
                        <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full h-20 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 border-b-[6px] border-blue-800">LIBERAR AGORA <Send/></button>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl"><CheckCircle2 size={48}/></div>
                        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Liberado!</h1>
                        <button onClick={gerarCV} className="w-full h-24 bg-blue-600 text-white rounded-3xl font-black text-2xl shadow-2xl flex items-center justify-center gap-4 border-b-[10px] border-blue-800"><Eye size={32}/> BAIXAR PDF</button>
                        <button onClick={() => setFluxo(12)} className="text-blue-600 font-bold underline">Voltar para meus currículos</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SignedIn>
    </div>
  )
}
