'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, Sparkles, Briefcase, Send, FileText, Lock, Plus, 
  ChevronRight, User, Download, Trash2
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  // Começamos no 12 (Dashboard)
  const [fluxo, setFluxo] = useState(12); 
  const [gerandoIA, setGerandoIA] = useState(false);
  
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não Possuo', disponibilidade: '', vagaTexto: ''
  });

  // CARREGA DADOS (Mas vamos ter um botão para limpar isso se der erro)
  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_data');
    if (salvo) setDados(JSON.parse(salvo));
  }, []);

  const atualizarDados = (novos: any) => {
    const atualizado = { ...dados, ...novos };
    setDados(atualizado);
    localStorage.setItem('cv_premium_data', JSON.stringify(atualizado));
  };

  // FUNÇÃO DE EMERGÊNCIA - USE ISSO SE BUGAR
  const resetarTudo = () => {
    localStorage.removeItem('cv_premium_data');
    setDados({
      nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
      resumo: '', exp: '', estudos: '', skills: '',
      cursos: '', idiomas: '', cnh: 'Não Possuo', disponibilidade: '', vagaTexto: ''
    });
    setFluxo(12); // Volta pra dashboard
    alert("Memória limpa! Agora clique em 'Novo Currículo'");
  };

  const otimizarComIA = async () => {
    if (!dados.vagaTexto) return alert("Preencha a vaga no passo 3!");
    setGerandoIA(true);
    try {
      const response = await fetch('/api/gerar-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados }),
      });
      const result = await response.json();
      atualizarDados({ resumo: result.resumo, exp: result.exp, skills: result.skills });
      alert("IA finalizou a otimização!");
    } catch (e) {
      alert("Erro na IA. Verifique se o arquivo route.ts existe.");
    } finally {
      setGerandoIA(false);
    }
  };

  // NAVEGAÇÃO SEGURA
  const irParaProximaEtapa = () => {
    if (fluxo === 10) {
      // FORÇA BRUTA: Se ta no 10, VAI PRO 11
      console.log("Indo para o Preview...");
      setFluxo(11);
    } else {
      setFluxo(prev => prev + 1);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 font-bold">
      
      {/* --- DEBUGGER (PARA VOCÊ VER O QUE ESTÁ ACONTECENDO) --- */}
      <div className="bg-red-600 text-white p-2 text-center text-xs flex justify-between items-center px-8 font-mono">
         <span>STATUS DO SISTEMA: Etapa Atual = {fluxo}</span>
         <button onClick={resetarTudo} className="bg-white text-red-600 px-3 py-1 rounded font-bold flex items-center gap-2">
            <Trash2 size={12}/> LIMPAR ERROS (RESET)
         </button>
      </div>

      {/* HEADER */}
      {fluxo <= 11 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={() => setFluxo(12)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600">
            <ArrowLeft size={18}/> <span className="text-[10px] font-black uppercase">Voltar p/ Dashboard</span>
          </button>
          <div className="font-black text-blue-600 uppercase text-xs tracking-widest">
            {fluxo === 11 ? "MODO PREVIEW" : `Passo ${fluxo}/10`}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-72 bg-white border-r p-8 hidden md:flex flex-col items-center">
           <UserButton />
           <p className="mt-4 text-xs font-black uppercase text-slate-400">Painel Admin</p>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto">

            {/* FLUXO 12: DASHBOARD */}
            {fluxo === 12 && (
              <div className="space-y-8 animate-in fade-in">
                <h1 className="text-4xl font-black uppercase">Painel</h1>
                <div className="grid grid-cols-2 gap-4">
                  {/* BOTÃO NOVO */}
                  <button onClick={() => setFluxo(0)} className="bg-blue-600 text-white p-8 rounded-[2rem] text-left hover:scale-105 transition-all shadow-xl">
                    <Plus size={32} className="mb-4"/>
                    <div className="font-black uppercase text-xl">Novo Currículo</div>
                    <div className="text-[10px] opacity-70 uppercase mt-1">Criar do Zero</div>
                  </button>
                  
                  {/* BOTÃO EDITAR (VAI PRO PREVIEW - 11) */}
                  <button onClick={() => setFluxo(11)} className="bg-white border-2 border-slate-100 p-8 rounded-[2rem] text-left hover:border-blue-400 transition-all">
                    <FileText size={32} className="mb-4 text-slate-300"/>
                    <div className="font-black uppercase text-xl text-slate-800">Editar Rascunho</div>
                    <div className="text-[10px] text-slate-400 uppercase mt-1">Voltar ao Preview</div>
                  </button>
                </div>
              </div>
            )}

            {/* FORMULÁRIO RÁPIDO (0 a 10) */}
            {fluxo === 0 && <div className="animate-in zoom-in"><h2 className="text-3xl font-black uppercase mb-6">Começar</h2><button onClick={()=>setFluxo(1)} className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase">Iniciar Preenchimento</button></div>}
            
            {/* CAMPOS SIMPLIFICADOS PARA TESTE */}
            {fluxo === 1 && <div className="space-y-4"><h2 className="text-2xl font-black text-blue-600">01. Nome e Cargo</h2><input className="w-full p-5 border-2 rounded-xl font-bold" placeholder="Nome" value={dados.nome} onChange={e=>atualizarDados({nome:e.target.value})}/><input className="w-full p-5 border-2 rounded-xl font-bold" placeholder="Cargo" value={dados.cargo} onChange={e=>atualizarDados({cargo:e.target.value})}/></div>}
            {fluxo === 2 && <div className="space-y-4"><h2 className="text-2xl font-black text-blue-600">02. Contato</h2><input className="w-full p-5 border-2 rounded-xl font-bold" placeholder="Email" value={dados.email} onChange={e=>atualizarDados({email:e.target.value})}/></div>}
            {fluxo === 3 && <div className="space-y-4"><h2 className="text-2xl font-black text-blue-600">03. Vaga (IA)</h2><textarea className="w-full h-40 p-5 border-2 rounded-xl font-bold" placeholder="Cole a vaga aqui" value={dados.vagaTexto} onChange={e=>atualizarDados({vagaTexto:e.target.value})}/></div>}
            
            {/* OUTROS PASSOS (4 a 10) - SÓ O BÁSICO PRA NÃO OCUPAR ESPAÇO NO CÓDIGO */}
            {(fluxo >= 4 && fluxo <= 10) && (
               <div className="space-y-4 animate-in slide-in-from-right">
                  <h2 className="text-2xl font-black text-blue-600 uppercase">Passo {fluxo}: Preenchimento</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase">Preencha os dados desta etapa:</p>
                  
                  {fluxo === 4 && <textarea className="w-full h-40 p-5 border-2 rounded-xl font-bold" placeholder="Resumo Profissional" value={dados.resumo} onChange={e=>atualizarDados({resumo:e.target.value})}/>}
                  {fluxo === 5 && <textarea className="w-full h-40 p-5 border-2 rounded-xl font-bold" placeholder="Experiência" value={dados.exp} onChange={e=>atualizarDados({exp:e.target.value})}/>}
                  {fluxo === 6 && <textarea className="w-full h-40 p-5 border-2 rounded-xl font-bold" placeholder="Estudos" value={dados.estudos} onChange={e=>atualizarDados({estudos:e.target.value})}/>}
                  {fluxo === 7 && <input className="w-full p-5 border-2 rounded-xl font-bold" placeholder="Skills (ex: Excel, Vendas)" value={dados.skills} onChange={e=>atualizarDados({skills:e.target.value})}/>}
                  {fluxo >= 8 && <div className="p-10 bg-slate-100 rounded-xl text-center font-bold text-slate-400">Etapa extra (pode pular para teste)</div>}
               </div>
            )}

            {/* --- AQUI ESTÁ O PREVIEW (FLUXO 11) --- */}
            {fluxo === 11 && (
              <div className="space-y-8 animate-in zoom-in pb-20 border-4 border-blue-600 rounded-3xl p-6 bg-blue-50">
                <div className="text-center">
                   <h1 className="text-3xl font-black uppercase text-blue-600">PREVIEW DO CURRÍCULO</h1>
                   <p className="font-bold text-slate-500">Se você está vendo isso, o bug foi resolvido!</p>
                </div>

                {/* SIMULAÇÃO DO PAPEL */}
                <div className="bg-white p-10 shadow-xl rounded-sm min-h-[500px]">
                   <h2 className="text-4xl font-black uppercase">{dados.nome || 'Seu Nome Aqui'}</h2>
                   <p className="text-xl text-blue-600 font-bold uppercase mb-8">{dados.cargo || 'Seu Cargo'}</p>
                   
                   <div className="space-y-4 text-sm text-slate-700">
                      <p><strong>Resumo:</strong> {dados.resumo}</p>
                      <p><strong>Experiência:</strong> {dados.exp}</p>
                      <p><strong>Skills:</strong> {dados.skills}</p>
                   </div>
                </div>

                {/* BOTÕES DE AÇÃO DO PREVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={otimizarComIA} disabled={gerandoIA} className="py-4 bg-indigo-600 text-white rounded-xl font-black uppercase shadow-lg">
                     {gerandoIA ? "Carregando..." : "Melhorar com IA"}
                  </button>
                  <button onClick={() => setFluxo(13)} className="py-4 bg-green-600 text-white rounded-xl font-black uppercase shadow-lg flex items-center justify-center gap-2">
                     Baixar PDF (Pagar) <Download/>
                  </button>
                </div>
              </div>
            )}

            {/* --- AQUI ESTÁ O PAGAMENTO (FLUXO 13) --- */}
            {fluxo === 13 && (
              <div className="text-center animate-in zoom-in py-20">
                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={40}/></div>
                <h1 className="text-4xl font-black uppercase mb-4">Pagamento Seguro</h1>
                <p className="text-2xl font-bold text-slate-900 mb-8">Valor: R$ 5,99</p>
                <button 
                  onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'}
                  className="w-full max-w-md py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xl shadow-2xl hover:bg-black transition-all"
                >
                  Pagar Agora
                </button>
                <button onClick={() => setFluxo(11)} className="block w-full mt-8 text-slate-400 font-bold uppercase text-xs">Voltar ao Preview</button>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* FOOTER DE NAVEGAÇÃO (SÓ ATÉ O 10) */}
      {fluxo <= 10 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button 
            onClick={irParaProximaEtapa} 
            className="w-full max-w-xl py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {fluxo === 10 ? "GERAR PREVIEW FINAL" : "PRÓXIMA ETAPA"} <ChevronRight/>
          </button>
        </footer>
