'use client'

import { useState, useEffect } from 'react'
import { useUser } from "@clerk/nextjs";
import { 
  ArrowLeft, Sparkles, Send, FileText, Lock, Plus, 
  Mail, MapPin, Phone, Eye, Download
} from 'lucide-react'

export default function GeradorCV() {
  const { user, isLoaded } = useUser();
  // Fluxo 11 será o Preview, Fluxo 12 será o Pagamento, Fluxo 13 o Dashboard
  const [fluxo, setFluxo] = useState(13); 
  const [gerandoIA, setGerandoIA] = useState(false);
  
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '',
    cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: ''
  });

  // Limpa e reinicia para garantir que novos currículos não "puxem" o anterior
  const reiniciarProcesso = () => {
    const limpo = { nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '', resumo: '', exp: '', estudos: '', skills: '', cursos: '', idiomas: '', cnh: 'Não', disponibilidade: '', vagaTexto: '' };
    setDados(limpo);
    localStorage.removeItem('cv_premium_data');
    setFluxo(0);
  };

  const atualizarDados = (novos: any) => {
    const atualizado = { ...dados, ...novos };
    setDados(atualizado);
    localStorage.setItem('cv_premium_data', JSON.stringify(atualizado));
  };

  const otimizarComIA = async () => {
    setGerandoIA(true);
    try {
      const response = await fetch('/api/gerar-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados }),
      });
      const data = await response.json();
      atualizarDados({ resumo: data.resumo, exp: data.exp, skills: data.skills });
    } finally {
      setGerandoIA(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      
      {/* HEADER DE NAVEGAÇÃO */}
      {fluxo <= 12 && (
        <div className="w-full bg-white border-b flex items-center justify-between px-6 py-4 sticky top-0 z-50">
          <button onClick={() => setFluxo(prev => prev > 0 ? prev - 1 : 13)} className="flex items-center gap-2 text-slate-400">
            <ArrowLeft size={18}/> <span className="text-[10px] font-black uppercase">Voltar</span>
          </button>
          <div className="flex-1 max-w-xl mx-10 h-1.5 bg-slate-100 rounded-full">
            <div className="h-full bg-blue-600 transition-all" style={{width: `${(fluxo / 12) * 100}%`}}/>
          </div>
          <span className="text-[10px] font-black text-slate-400">{fluxo}/12</span>
        </div>
      )}

      <main className="flex-1 p-6 md:p-12 pb-32">
        <div className="max-w-3xl mx-auto">

          {/* DASHBOARD */}
          {fluxo === 13 && (
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-black uppercase">Gerador de Currículos</h1>
              <button onClick={reiniciarProcesso} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-2 mx-auto">
                <Plus size={20}/> CRIAR NOVO CURRÍCULO
              </button>
            </div>
          )}

          {/* ... CAMPOS DE FORMULÁRIO (0 a 10) ... */}

          {/* FLUXO 11: PREVIEW FINAL (A MÁGICA) */}
          {fluxo === 11 && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="text-center">
                <h2 className="text-2xl font-black uppercase tracking-tight">Seu Currículo está pronto!</h2>
                <p className="text-slate-500 font-bold text-sm">Confira como ficou antes de gerar o arquivo final.</p>
              </div>

              {/* FOLHA DE CURRÍCULO REALÍSTICA */}
              <div className="bg-white shadow-2xl p-10 rounded-sm border border-slate-200 min-h-[700px] relative overflow-hidden">
                <div className="border-b-4 border-blue-600 pb-6 mb-6">
                  <h1 className="text-3xl font-black text-slate-900 uppercase">{dados.nome || 'Nome Completo'}</h1>
                  <p className="text-lg font-bold text-blue-600 uppercase tracking-wide">{dados.cargo || 'Cargo Pretendido'}</p>
                  <div className="flex flex-wrap gap-4 mt-4 text-slate-500 font-bold text-xs">
                    <span className="flex items-center gap-1"><Mail size={14}/> {dados.email}</span>
                    <span className="flex items-center gap-1"><Phone size={14}/> {dados.tel}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {dados.cidade}</span>
                  </div>
                </div>

                <div className="space-y-8 text-sm">
                  <div>
                    <h3 className="font-black text-slate-900 uppercase border-b-2 mb-2 text-xs tracking-widest">Resumo Profissional</h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{dados.resumo}</p>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase border-b-2 mb-2 text-xs tracking-widest">Experiência Profissional</h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{dados.exp}</p>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase border-b-2 mb-2 text-xs tracking-widest">Habilidades & Competências</h3>
                    <p className="text-slate-700 font-bold">{dados.skills}</p>
                  </div>
                </div>

                {/* BOTÃO DE IA DENTRO DO PREVIEW */}
                <div className="mt-10 p-6 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 text-center">
                  <p className="text-xs font-black text-indigo-600 uppercase mb-4">A IA pode deixar esses textos ainda melhores</p>
                  <button onClick={otimizarComIA} disabled={gerandoIA} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black flex items-center gap-2 mx-auto hover:bg-indigo-700 transition-all">
                    {gerandoIA ? "REESCREVENDO..." : <><Sparkles size={16}/> TURBINAR COM IA</>}
                  </button>
                </div>
              </div>

              <button onClick={() => setFluxo(12)} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl">
                BAIXAR CURRÍCULO EM PDF <Download size={24}/>
              </button>
            </div>
          )}

          {/* FLUXO 12: PÁGINA DE PREÇO */}
          {fluxo === 12 && (
            <div className="max-w-md mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-slate-50">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6"><Lock size={30}/></div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Quase lá!</h2>
                <p className="text-slate-400 font-bold text-sm mb-6">Seu currículo otimizado está pronto para download.</p>
                <div className="text-6xl font-black text-slate-900 mb-8 tracking-tighter">R$ 5,99</div>
                <button onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                  PAGAR E BAIXAR <Send size={20}/>
                </button>
                <p className="mt-6 text-[10px] text-slate-400 font-black uppercase tracking-widest leading-loose">Acesso vitalício + Otimizações ilimitadas</p>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* RODAPÉ DE NAVEGAÇÃO (ESCONDER NO PREVIEW E PAGAMENTO) */}
      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center fixed bottom-0 z-50">
          <button onClick={() => setFluxo(f => f + 1)} className="w-full max-w-lg py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em]">
            Próxima Etapa
          </button>
        </footer>
      )}
    </div>
  )
}
