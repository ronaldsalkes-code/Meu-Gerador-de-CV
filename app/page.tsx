'use client' 

import { useState, useEffect } from 'react'
import { useUser, UserButton } from "@clerk/nextjs";
import { 
  ArrowLeft, Sparkles, Briefcase, Send, FileText, Lock, Plus, 
  ChevronRight, User, Download, Trash2
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); 
  const [gerandoIA, setGerandoIA] = useState(false);
  
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não Possuo', disponibilidade: '', vagaTexto: ''
  });

  useEffect(() => {
    const salvo = localStorage.getItem('cv_premium_data');
    if (salvo) setDados(JSON.parse(salvo));
  }, []);

  const atualizarDados = (novos: any) => {
    const atualizado = { ...dados, ...novos };
    setDados(atualizado);
    localStorage.setItem('cv_premium_data', JSON.stringify(atualizado));
  };

  const resetarTudo = () => {
    localStorage.removeItem('cv_premium_data');
    setDados({
      nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
      resumo: '', exp: '', estudos: '', skills: '',
      cursos: '', idiomas: '', cnh: 'Não Possuo', disponibilidade: '', vagaTexto: ''
    });
    setFluxo(12);
    alert("Memória limpa!");
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

  const irParaProximaEtapa = () => {
    if (fluxo === 10) {
      setFluxo(11);
    } else {
      setFluxo(prev => prev + 1);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      
      {/* STATUS BAR */}
      <div className="bg-red-600 text-white p-2 text-center text-[10px] flex justify-between items-center px-8 font-mono">
           <span>MODO DEBUG: ETAPA {fluxo}</span>
           <button onClick={resetarTudo} className="bg-white text-red-600 px-2 py-0.5 rounded font-bold uppercase text-[9px]">
             Resetar Sistema
           </button>
      </div>

      {/* HEADER */}
      {fluxo <= 11 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={() => setFluxo(12)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600">
            <ArrowLeft size={18}/> <span className="text-[10px] font-black uppercase">Dashboard</span>
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
           <p className="mt-4 text-[10px] font-black uppercase text-slate-400">Perfil Ativo</p>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto pb-32">
          <div className="max-w-3xl mx-auto">

            {/* FLUXO 12: DASHBOARD */}
            {fluxo === 12 && (
              <div className="space-y-8 animate-in fade-in">
                <h1 className="text-4xl font-black uppercase italic">Meus Currículos</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setFluxo(0)} className="bg-blue-600 text-white p-8 rounded-[2rem] text-left hover:scale-105 transition-all shadow-xl">
                    <Plus size={32} className="mb-4"/>
                    <div className="font-black uppercase text-xl">Novo Currículo</div>
                    <div className="text-[10px] opacity-70 uppercase mt-1">Clique para começar</div>
                  </button>
                  <button onClick={() => setFluxo(11)} className="bg-white border-2 border-slate-100 p-8 rounded-[2rem] text-left hover:border-blue-400 transition-all">
                    <FileText size={32} className="mb-4 text-slate-300"/>
                    <div className="font-black uppercase text-xl text-slate-800">Ver Rascunho</div>
                    <div className="text-[10px] text-slate-400 uppercase mt-1">Continuar edição</div>
                  </button>
                </div>
              </div>
            )}

            {/* FORMULÁRIO (0 a 10) */}
            {fluxo === 0 && <div className="animate-in zoom-in"><h2 className="text-3xl font-black uppercase mb-6">Pronto?</h2><button onClick={()=>setFluxo(1)} className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black uppercase">Iniciar Agora</button></div>}
            {fluxo === 1 && <div className="space-y-4"><h2 className="text-2xl font-black text-blue-600">01. Nome e Cargo</h2><input className="w-full p-5 border-2 rounded-xl font-bold" placeholder="Nome" value={dados.nome} onChange={e=>atualizarDados({nome:e.target.value})}/><input className="w-full p-5 border-2 rounded-xl font-bold" placeholder="Cargo desejado" value={dados.cargo} onChange={e=>atualizarDados({cargo:e.target.value})}/></div>}
            {fluxo === 2 && <div className="space-y-4"><h2 className="text-2xl font-black text-blue-600">02. Contato</h2><input className="w-full p-5 border-2 rounded-xl font-bold" placeholder="Email" value={dados.email} onChange={e=>atualizarDados({email:e.target.value})}/></div>}
            {fluxo === 3 && <div className="space-y-4"><h2 className="text-2xl font-black text-blue-600">03. Vaga (IA)</h2><textarea className="w-full h-40 p-5 border-2 rounded-xl font-bold" placeholder="Cole aqui a descrição da vaga..." value={dados.vagaTexto} onChange={e=>atualizarDados({vagaTexto:e.target.value})}/></div>}
            
            {(fluxo >= 4 && fluxo <= 10) && (
               <div className="space-y-4">
                  <h2 className="text-2xl font-black text-blue-600 uppercase">Passo {fluxo}</h2>
                  {fluxo === 4 && <textarea className="w-full h-40 p-5 border-2 rounded-xl font-bold" placeholder="Fale sobre você" value={dados.resumo} onChange={e=>atualizarDados({resumo:e.target.value})}/>}
                  {fluxo === 5 && <textarea className="w-full h-40 p-5 border-2 rounded-xl font-bold" placeholder="Experiências anteriores" value={dados.exp} onChange={e=>atualizarDados({exp:e.target.value})}/>}
                  {fluxo === 6 && <textarea className="w-full h-40 p-5 border-2 rounded-xl font-bold" placeholder="Formação acadêmica" value={dados.estudos} onChange={e=>atualizarDados({estudos:e.target.value})}/>}
                  {fluxo >= 7 && <div className="p-10 bg-slate-100 rounded-xl text-center font-bold text-slate-400 uppercase text-xs">Informações adicionais registradas</div>}
               </div>
            )}

            {/* PREVIEW (FLUXO 11) */}
            {fluxo === 11 && (
              <div className="space-y-8 animate-in zoom-in pb-20">
                <div className="bg-white p-10 shadow-2xl rounded-sm min-h-[600px] border-t-8 border-blue-600">
                   <h2 className="text-4xl font-black uppercase leading-tight">{dados.nome || 'Seu Nome'}</h2>
                   <p className="text-xl text-blue-600 font-bold uppercase mb-8">{dados.cargo || 'Cargo'}</p>
                   <div className="space-y-6 text-sm text-slate-700">
                      <div><p className="font-black text-slate-900 uppercase underline mb-1">Resumo</p><p>{dados.resumo}</p></div>
                      <div><p className="font-black text-slate-900 uppercase underline mb-1">Experiência</p><p>{dados.exp}</p></div>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={otimizarComIA} disabled={gerandoIA} className="py-4 bg-indigo-600 text-white rounded-xl font-black uppercase flex items-center justify-center gap-2">
                     <Sparkles size={18}/> {gerandoIA ? "IA Analisando..." : "Otimizar com IA"}
                  </button>
                  <button onClick={() => setFluxo(13)} className="py-4 bg-green-600 text-white rounded-xl font-black uppercase flex items-center justify-center gap-2">
                     Download PDF <Download size={18}/>
                  </button>
                </div>
              </div>
            )}

            {/* PAGAMENTO (FLUXO 13) */}
            {fluxo === 13 && (
              <div className="text-center animate-in zoom-in py-10">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={32}/></div>
                <h1 className="text-3xl font-black uppercase mb-2">Liberação Imediata</h1>
                <p className="text-xl font-bold text-slate-600 mb-8">R$ 5,90 via PIX</p>
                <button 
                  onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'}
                  className="w-full max-w-xs py-5 bg-slate-900 text-white rounded-full font-black uppercase text-lg shadow-2xl"
                >
                  Pagar e Baixar
                </button>
                <button onClick={() => setFluxo(11)} className="block w-full mt-6 text-slate-400 font-bold uppercase text-[10px]">Voltar e Editar</button>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* FOOTER NAVEGAÇÃO */}
      {fluxo <= 10 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center fixed bottom-0 z-50">
          <button 
            onClick={irParaProximaEtapa} 
            className="w-full max-w-md py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            {fluxo === 10 ? "Ver Currículo Final" : "Continuar"} <ChevronRight/>
          </button>
        </footer>
      )}
    </div>
  );
}
