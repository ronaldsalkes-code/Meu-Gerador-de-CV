'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, Sparkles, Briefcase, Send, FileText, Lock, Plus, 
  ChevronRight, User, Phone, Mail, MapPin, Download, Car, Calendar, AlignLeft
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // 12 = Dashboard Inicial
  const [gerandoIA, setGerandoIA] = useState(false);
  
  // ESTADO DOS DADOS
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não Possuo', disponibilidade: '', vagaTexto: ''
  });

  // CARREGAR DADOS SALVOS
  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_data');
    if (salvo) setDados(JSON.parse(salvo));
  }, []);

  // SALVAR DADOS AUTOMATICAMENTE
  const atualizarDados = (novos: any) => {
    const atualizado = { ...dados, ...novos };
    setDados(atualizado);
    localStorage.setItem('cv_premium_data', JSON.stringify(atualizado));
  };

  // LIMPAR TUDO (NOVO CURRÍCULO)
  const reiniciarProcesso = () => {
    const limpo = { 
      nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '', 
      resumo: '', exp: '', estudos: '', skills: '', 
      cursos: '', idiomas: '', cnh: 'Não Possuo', disponibilidade: '', vagaTexto: '' 
    };
    setDados(limpo);
    localStorage.removeItem('cv_premium_data');
    setFluxo(0); // Vai para o passo 0
  };

  // CHAMADA DA IA (INTEGRAÇÃO COM O ARQUIVO 2)
  const otimizarComIA = async () => {
    if (!dados.vagaTexto) return alert("Cole a descrição da vaga no passo 3 primeiro!");
    setGerandoIA(true);
    try {
      const response = await fetch('/api/gerar-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados }),
      });
      
      if (!response.ok) throw new Error("Falha na API");
      
      const result = await response.json();
      atualizarDados({ 
        resumo: result.resumo, 
        exp: result.exp, 
        skills: result.skills 
      });
      alert("Sucesso! O texto foi reescrito pela IA.");
    } catch (e) {
      alert("Erro: Verifique se você criou o arquivo 'app/api/gerar-cv/route.ts' no GitHub e se a chave GEMINI_API_KEY está na Vercel.");
    } finally {
      setGerandoIA(false);
    }
  };

  // LÓGICA DE NAVEGAÇÃO BLINDADA
  const avancarEtapa = () => {
    if (fluxo === 10) {
      setFluxo(11); // Força ir para o PREVIEW
    } else {
      setFluxo(prev => prev + 1);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 font-bold">
      
      {/* BARRA DE PROGRESSO (0 a 11) */}
      {fluxo <= 11 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={() => setFluxo(prev => prev > 0 ? prev - 1 : 12)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600">
            <ArrowLeft size={18}/> <span className="text-[10px] font-black uppercase">Voltar</span>
          </button>
          <div className="flex-1 max-w-xl mx-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${(fluxo / 11) * 100}%`}}/>
          </div>
          <span className="text-[10px] font-black text-slate-400">{fluxo}/11</span>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-72 bg-white border-r p-8 hidden md:flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 border-4 border-white shadow-xl overflow-hidden">
            {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" /> : <User className="m-6 text-slate-300" size={40}/>}
          </div>
          <h3 className="font-black text-sm text-slate-800 uppercase text-center">{user?.firstName}</h3>
          <p className="text-[9px] text-blue-600 font-black uppercase mt-2 mb-8">Conta Premium</p>
          <div className="flex justify-center"><UserButton /></div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto">

            {/* TELA 12: DASHBOARD */}
            {fluxo === 12 && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <h1 className="text-4xl font-black uppercase">Meus Currículos</h1>
                  <button onClick={reiniciarProcesso} className="bg-blue-600 text-white px-6 py-4 rounded-xl font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2 uppercase">
                    <Plus size={18}/> Novo
                  </button>
                </div>
                {/* CARD DE RASCUNHO -> LEVA PRO PREVIEW (11) */}
                <div onClick={() => setFluxo(11)} className="bg-white border-2 border-slate-100 p-8 rounded-[2rem] flex items-center gap-6 cursor-pointer hover:border-blue-400 hover:shadow-xl transition-all">
                  <div className="w-16 h-20 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300"><FileText size={30}/></div>
                  <div className="flex-1">
                    <h2 className="font-black text-slate-800 uppercase text-lg">{dados.cargo || 'Rascunho Sem Título'}</h2>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-3 py-1 rounded-full uppercase flex items-center gap-1 w-fit mt-2"><Lock size={10}/> Pendente</span>
                  </div>
                  <ChevronRight className="text-slate-200"/>
                </div>
              </div>
            )}

            {/* FORMULÁRIO (0 a 10) - RESUMIDO PARA FUNCIONAR PERFEITO */}
            {fluxo === 0 && <div className="space-y-8 animate-in zoom-in-95"><h2 className="text-4xl font-black uppercase">Começar por onde?</h2><button onClick={() => setFluxo(1)} className="w-full p-8 bg-white border-2 border-slate-100 rounded-[2rem] text-left hover:border-blue-600 font-black uppercase text-xl flex items-center gap-4"><Briefcase/> Experiência Profissional</button></div>}
            
            {fluxo === 1 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">01. Dados Básicos</h2><input className="w-full p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" placeholder="Nome Completo" value={dados.nome} onChange={(e)=>atualizarDados({nome: e.target.value})}/><input className="w-full p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" placeholder="Cargo Pretendido" value={dados.cargo} onChange={(e)=>atualizarDados({cargo: e.target.value})}/></div>}
            
            {fluxo === 2 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">02. Contatos</h2><input className="w-full p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" placeholder="Telefone" value={dados.tel} onChange={(e)=>atualizarDados({tel: e.target.value})}/><input className="w-full p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" placeholder="Email" value={dados.email} onChange={(e)=>atualizarDados({email: e.target.value})}/><input className="w-full p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" placeholder="Cidade" value={dados.cidade} onChange={(e)=>atualizarDados({cidade: e.target.value})}/></div>}
            
            {fluxo === 3 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">03. A Vaga (Para IA)</h2><textarea className="w-full h-64 p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" placeholder="Cole a descrição da vaga aqui..." value={dados.vagaTexto} onChange={(e)=>atualizarDados({vagaTexto: e.target.value})}/></div>}
            
            {fluxo === 4 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">04. Resumo</h2><textarea className="w-full h-64 p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" value={dados.resumo} onChange={(e)=>atualizarDados({resumo: e.target.value})}/></div>}
            
            {fluxo === 5 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">05. Experiência</h2><textarea className="w-full h-80 p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" value={dados.exp} onChange={(e)=>atualizarDados({exp: e.target.value})}/></div>}
            
            {fluxo === 6 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">06. Estudos</h2><textarea className="w-full h-64 p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" value={dados.estudos} onChange={(e)=>atualizarDados({estudos: e.target.value})}/></div>}
            
            {fluxo === 7 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">07. Skills</h2><input className="w-full p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" value={dados.skills} onChange={(e)=>atualizarDados({skills: e.target.value})}/></div>}
            
            {fluxo === 8 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">08. Cursos Extras</h2><textarea className="w-full h-64 p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" value={dados.cursos} onChange={(e)=>atualizarDados({cursos: e.target.value})}/></div>}
            
            {fluxo === 9 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">09. Idiomas</h2><input className="w-full p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" value={dados.idiomas} onChange={(e)=>atualizarDados({idiomas: e.target.value})}/></div>}
            
            {fluxo === 10 && <div className="space-y-4 animate-in slide-in-from-right-8"><h2 className="text-2xl font-black uppercase text-blue-600">10. Detalhes</h2><input className="w-full p-6 rounded-[1.5rem] bg-white border-2 border-slate-100 font-black outline-none" placeholder="Disponibilidade" value={dados.disponibilidade} onChange={(e)=>atualizarDados({disponibilidade: e.target.value})}/></div>}

            {/* TELA 11: PREVIEW (AQUI QUE O USUÁRIO VÊ ANTES DE PAGAR) */}
            {fluxo === 11 && (
              <div className="space-y-8 animate-in zoom-in-95 pb-20">
                <div className="text-center">
                  <h2 className="text-3xl font-black uppercase">Seu Currículo <span className="text-blue-600">Pronto</span></h2>
                  <p className="text-slate-400 text-xs font-black uppercase mt-2">Veja como ficou antes de baixar</p>
                </div>

                <div className="bg-white shadow-2xl p-10 rounded-sm border border-slate-200 min-h-[700px] text-left relative">
                   <div className="border-b-4 border-blue-600 pb-6 mb-6">
                      <h1 className="text-3xl font-black uppercase">{dados.nome || 'Seu Nome'}</h1>
                      <p className="text-lg font-bold text-blue-600 uppercase">{dados.cargo}</p>
                   </div>
                   <div className="space-y-6 text-sm">
                      <div><h3 className="font-black uppercase border-b mb-2">Resumo</h3><p>{dados.resumo}</p></div>
                      <div><h3 className="font-black uppercase border-b mb-2">Experiência</h3><p>{dados.exp}</p></div>
                      <div><h3 className="font-black uppercase border-b mb-2">Habilidades</h3><p>{dados.skills}</p></div>
                   </div>

                   {/* BOTÃO DA IA DENTRO DO PREVIEW */}
                   <div className="mt-10 p-6 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 text-center">
                      <h4 className="font-black uppercase text-slate-700">Otimização com IA</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Melhore seu texto para a vaga colada no passo 3</p>
                      <button onClick={otimizarComIA} disabled={gerandoIA} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-xs shadow-lg flex items-center gap-2 mx-auto hover:bg-blue-700">
                        {gerandoIA ? "Reescrevendo..." : <><Sparkles size={16}/> Aplicar Inteligência Artificial</>}
                      </button>
                   </div>
                </div>

                {/* BOTÃO QUE VAI PARA O PAGAMENTO (13) */}
                <button onClick={() => setFluxo(13)} className="w-full py-8 bg-slate-900 text-white rounded-[2rem] font-black uppercase flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-800 transition-all">
                  BAIXAR PDF (IR PARA PAGAMENTO) <Download/>
                </button>
              </div>
            )}

            {/* TELA 13: PAGAMENTO (FINAL) */}
            {fluxo === 13 && (
              <div className="text-center space-y-8 animate-in zoom-in-95 py-10">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock size={24}/></div>
                  <h2 className="text-2xl font-black uppercase mb-2">Liberar Download</h2>
                  <p className="text-slate-400 text-xs font-black uppercase mb-8">Acesso vitalício ao gerador + IA</p>
                  <div className="text-6xl font-black text-slate-900 mb-8">R$ 5,99</div>
                  <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-blue-700 flex items-center justify-center gap-3">
                    PAGAR AGORA <Send/>
                  </button>
                </div>
                <button onClick={() => setFluxo(11)} className="text-slate-400 font-black uppercase text-[10px]">Voltar</button>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* FOOTER FIXO (SÓ APARECE ATÉ O PASSO 10) */}
      {fluxo <= 10 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={avancarEtapa} 
            className="w-full max-w-2xl py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl text-xs flex items-center justify-center gap-3"
          >
            {fluxo === 10 ? "Visualizar Currículo" : "Próxima Etapa"} <ChevronRight size={18}/>
          </button>
        </footer>
      )}
    </div>
  )
}
