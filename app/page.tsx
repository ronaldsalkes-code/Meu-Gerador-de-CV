'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, CheckCircle2, Target, RefreshCw, TrendingUp, 
  FileText, Lock, Rocket, Loader2
} from 'lucide-react'

export default function GeradorCV() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  
  const [personalData, setPersonalData] = useState({ name: '', email: '', phone: '', location: '' })
  const [jobDescription, setJobDescription] = useState('')

  useEffect(() => {
    if (currentStep === 5 && !isProcessing) {
      setIsProcessing(true)
      let step = 0
      const interval = setInterval(() => {
        setProcessingStep(step)
        step++
        if (step > 4) {
          clearInterval(interval)
          setTimeout(() => {
            setIsProcessing(false)
            setCurrentStep(6)
          }, 1000)
        }
      }, 1000)
    }
  }, [currentStep])

  const next = () => setCurrentStep(prev => prev + 1)
  const back = () => setCurrentStep(prev => prev - 1)

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* HEADER */}
      <nav className="bg-white border-b px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic">CV<span className="text-blue-600">AI</span></span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Passo {currentStep} de 6
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-12 pb-24">
        
        {/* STEP 1: OBJETIVO */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black tracking-tight italic uppercase">Qual seu <span className="text-blue-600">objetivo</span>?</h1>
              <p className="text-slate-500 font-bold">A IA vai adaptar seu currículo para a meta escolhida.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'job', title: 'Conseguir novo emprego', icon: Target, desc: 'Foco total em passar nos robôs ATS' },
                { id: 'change', title: 'Mudar de carreira', icon: RefreshCw, desc: 'Destaque para habilidades que você já tem' },
                { id: 'first', title: 'Primeiro emprego', icon: Rocket, desc: 'Ideal para quem não tem experiência' }
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => { next() }}
                  className="flex items-center gap-4 p-6 bg-white border-2 border-slate-100 rounded-3xl hover:border-blue-600 transition-all text-left group"
                >
                  <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase italic text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-400 font-bold">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DADOS PESSOAIS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center">Informações <span className="text-blue-600">Pessoais</span></h2>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-4 border border-slate-100">
              <input 
                type="text" placeholder="Nome Completo" 
                className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold"
                value={personalData.name} onChange={e => setPersonalData({...personalData, name: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="WhatsApp" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold" />
                <input type="email" placeholder="E-mail" className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none font-bold" />
              </div>
              <button onClick={next} className="w-full p-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                Próximo Passo
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DESCRIÇÃO DA VAGA */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center">Dados da <span className="text-blue-600">Vaga</span></h2>
            <textarea 
              placeholder="Cole aqui a descrição da vaga ou o cargo que você deseja..."
              className="w-full h-64 p-8 bg-white rounded-[2.5rem] border-2 border-slate-100 focus:border-blue-600 outline-none font-medium shadow-inner resize-none"
              value={jobDescription} onChange={e => setJobDescription(e.target.value)}
            />
            <button onClick={next} className="w-full p-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Analisar com IA
            </button>
          </div>
        )}

        {/* STEP 4: FOCO */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-center">Foco <span className="text-blue-600">Estratégico</span></h2>
            <div className="grid grid-cols-1 gap-4">
              {['Experiência Profissional', 'Habilidades Técnicas', 'Conquistas e Resultados'].map(f => (
                <button key={f} onClick={next} className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl font-black uppercase italic text-left hover:border-blue-600 transition-all flex justify-between items-center">
                  {f}
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: LOADING IA */}
        {currentStep === 5 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 animate-pulse" />
              <Loader2 className="animate-spin text-blue-600 relative" size={64} />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter italic">Nossa IA está criando sua <br/> melhor versão...</h2>
              <div className="space-y-2 inline-block text-left">
                {['Mapeando Vaga...', 'Extraindo Keywords...', 'Formatando Layout...', 'Finalizando Design...'].map((t, i) => (
                  <div key={i} className={`flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-opacity duration-500 ${processingStep >= i ? 'text-blue-600' : 'opacity-20 text-slate-400'}`}>
                    <CheckCircle2 size={14} /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: CHECKOUT */}
        {currentStep === 6 && (
          <div className="space-y-10 animate-in zoom-in duration-500">
            <div className="bg-emerald-500 p-6 rounded-[2.5rem] text-white flex items-center gap-4 shadow-xl shadow-emerald-100">
              <CheckCircle2 size={40} />
              <div>
                <h2 className="font-black uppercase italic text-xl tracking-tighter">Currículo Gerado com Sucesso!</h2>
                <p className="text-xs font-bold opacity-90 uppercase tracking-widest">Score ATS Atual: 98% (Excelente)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Fake Preview */}
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20" />
                <div className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl h-[400px] overflow-hidden opacity-40 grayscale pointer-events-none">
                  <div className="space-y-4">
                    <div className="h-6 bg-slate-100 w-3/4 rounded" />
                    <div className="h-2 bg-slate-50 w-full rounded" />
                    <div className="h-20 bg-slate-50 w-full rounded" />
                    <div className="h-2 bg-slate-50 w-full rounded" />
                    <div className="h-2 bg-slate-50 w-full rounded" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock size={48} className="text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Checkout */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Liberar seu <br/> <span className="text-blue-600 text-4xl">Currículo</span></h3>
                  <p className="text-slate-400 font-bold text-sm">Acesso vitalício, download em PDF e Word + Bônus exclusivo.</p>
                </div>

                <div className="bg-slate-900 p-6 rounded-[2rem] text-white relative overflow-hidden group">
                  <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Preço Especial</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black">R$ 27,90</span>
                        <span className="text-slate-500 line-through text-xs font-bold font-sans">R$ 97,00</span>
                      </div>
                    </div>
                    <button className="bg-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                      <ArrowLeft className="rotate-180" />
                    </button>
                  </div>
                </div>

                <button className="w-full bg-emerald-500 py-6 rounded-[2rem] text-white font-black uppercase italic tracking-tighter text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95">
                  Baixar Currículo Agora
                </button>
                <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                   <Lock size={12} /> Pagamento 100% Seguro
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* BACK BUTTON */}
      {currentStep > 1 && currentStep < 5 && (
        <button onClick={back} className="fixed bottom-8 left-8 bg-white p-4 rounded-full shadow-2xl border border-slate-100 text-slate-400 hover:text-blue-600 transition-all">
          <ArrowLeft size={24} />
        </button>
      )}
    </div>
  )
}
