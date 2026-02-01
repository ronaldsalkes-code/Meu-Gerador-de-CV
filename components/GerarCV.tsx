'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs";
import { ArrowLeft, Rocket, ChevronRight, Plus, Mail, Phone, MapPin } from 'lucide-react'

// IMPORTAÇÃO DOS SEUS COMPONENTES (Vamos adicionando aqui um por um)
import Step1Identificacao from '@/components/cv-steps/Step1Identificacao'
import Step2Contato from '@/components/cv-steps/Step2Contato'

export default function SuperGeradorCV() {
  const { user, isLoaded } = useUser();
  const [fluxo, setFluxo] = useState(12); // 12 é o Dashboard inicial
  const [montado, setMontado] = useState(false);
  const [dados, setDados] = useState({
    nome: '', cargo: '', tel: '', email: '', cidade: '', linkedin: '',
    resumo: '', exp: '', estudos: '', skills: '', cnh: 'Não'
  });

  // Carrega dados salvos
  useEffect(() => {
    setMontado(true);
    const salvo = localStorage.getItem('cv_ultra_v1');
    if (salvo) try { setDados(JSON.parse(salvo)); } catch (e) {}
  }, []);

  // Função única para atualizar dados
  const update = (obj: any) => {
    const novo = { ...dados, ...obj };
    setDados(novo);
    localStorage.setItem('cv_ultra_v1', JSON.stringify(novo));
  };

  if (!isLoaded || !montado) return null;

  // Lógica de renderização das etapas
  const renderConteudo = () => {
    switch(fluxo) {
      case 1: return <Step1Identificacao dados={dados} update={update} />;
      case 2: return <Step2Contato dados={dados} update={update} />;
      // As próximas etapas entrarão aqui (case 3, 4, 5...)
      default: return <div className="p-10 text-center opacity-20">Em desenvolvimento...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F4F9] text-slate-900 flex flex-col font-sans">
      <header className="w-full bg-white border-b px-8 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white"><Rocket size={20} fill="white"/></div>
          <h1 className="text-xl font-black italic">CURRICULO<span className="text-blue-600">.PRO</span></h1>
        </div>
        <SignedIn><UserButton /></SignedIn>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex overflow-hidden">
          {/* COLUNA DO FORMULÁRIO */}
          <section className="flex-1 overflow-y-auto p-6 md:p-12 bg-white">
            <div className="max-w-xl mx-auto space-y-8 pb-32">
              {fluxo < 11 && (
                <button onClick={() => setFluxo(fluxo === 1 ? 12 : fluxo - 1)} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase hover:text-blue-600">
                  <ArrowLeft size={16}/> Voltar
                </button>
              )}

              {fluxo === 12 ? (
                <div className="space-y-8 py-10">
                  <h2 className="text-4xl font-black tracking-tighter">Olá, <span className="text-blue-600">{user?.firstName}!</span></h2>
                  <button onClick={() => setFluxo(1)} className="w-full p-8 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-between group shadow-xl transition-transform active:scale-95">
                    <div className="text-left"><p className="font-black text-xl">Criar Novo Currículo</p><p className="text-blue-100 text-xs">Rápido e profissional</p></div>
                    <Plus size={32}/>
                  </button>
                </div>
              ) : renderConteudo()}
            </div>
          </section>

          {/* PREVIEW LATERAL (VISUALIZAÇÃO) */}
          <section className="hidden xl:flex flex-1 bg-slate-100 p-12 items-center justify-center">
            <div className="w-[420px] h-[580px] bg-white shadow-2xl p-8 flex flex-col relative scale-90 origin-center">
               <div className="border-l-4 border-blue-600 pl-4 mb-6">
                 <h3 className="text-xl font-black uppercase">{dados.nome || 'NOME'}</h3>
                 <p className="text-blue-600 font-bold text-[10px] uppercase">{dados.cargo || 'CARGO'}</p>
               </div>
               <div className="space-y-4 text-[9px] text-slate-600">
                 <div className="flex flex-wrap gap-2 text-slate-400 font-bold border-b pb-2 uppercase">
                   <div>{dados.email || 'email@email.com'}</div>
                   <div>{dados.tel || '(00) 00000-0000'}</div>
                 </div>
                 <div className="font-medium italic">{dados.resumo || 'Preview do seu resumo...'}</div>
               </div>
            </div>
          </section>
        </main>
      </div>

      {/* BOTÃO FIXO DE PRÓXIMO */}
      {fluxo < 11 && (
        <footer className="w-full bg-white border-t p-6 flex justify-center sticky bottom-0 z-50">
          <button onClick={() => setFluxo(fluxo + 1)} className="w-full max-w-xl py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 flex items-center justify-center gap-2">
            Próxima Etapa <ChevronRight size={18}/>
          </button>
        </footer>
      )}
    </div>
  )
}
