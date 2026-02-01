'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, Send, AlertTriangle, CheckCircle2, Sparkles, Target, 
  RefreshCw, TrendingUp, Briefcase, User, GraduationCap, Lightbulb, 
  Award, Loader2, Download, Eye, FileText, Lock, Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function GeradorCVProfissional() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  
  // Estados de Dados
  const [selectedGoal, setSelectedGoal] = useState('')
  const [personalData, setPersonalData] = useState({
    name: '', email: '', phone: '', location: '', summary: ''
  })
  const [jobDescription, setJobDescription] = useState('')
  const [selectedFocus, setSelectedFocus] = useState('')

  // Simulação de Processamento
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
            setCurrentStep(6) // Vai para o Checkout/Resultado
          }, 1000)
        }
      }, 1000)
    }
  }, [currentStep])

  const next = () => setCurrentStep(prev => prev + 1)
  const back = () => setCurrentStep(prev => prev - 1)

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Navbar Minimalista */}
      <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <FileText className="text-white h-5 w-5" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase italic">CV<span className="text-blue-600">AI</span></span>
          </div>
          {currentStep < 5 && (
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${currentStep >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        
        {/* STEP 1: OBJETIVO */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">Qual o seu objetivo hoje?</h1>
              <p className="text-slate-500 font-medium text-lg">A IA ajustará o tom de voz do currículo para sua meta.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'job', title: 'Novo Emprego', icon: Target, desc: 'Foco em passar em filtros ATS' },
                { id: 'change', title: 'Mudar Carreira', icon: RefreshCw, desc: 'Destaque habilidades transferíveis' },
                { id: 'promo', title: 'Promoção', icon: TrendingUp, desc: 'Foco em resultados e liderança' },
                { id: 'first', title: 'Primeiro Job', icon: Rocket, desc: 'Destaque potencial e estudos' }
              ].map(item => (
                <Card 
                  key={item.id}
                  onClick={() => { setSelectedGoal(item.id); next(); }}
                  className={cn("p-6 cursor-pointer border-2 transition-all hover:border-blue-600 group", selectedGoal === item.id ? "border-blue-600 bg-blue-50" : "border-slate-100")}
                >
                  <item.icon className="mb-4 h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DADOS PESSOAIS */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quem é você?</h2>
            </div>
            <div className="space-y-4 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <Input placeholder="Nome Completo" value={personalData.name} onChange={e => setPersonalData({...personalData, name: e.target.value})} className="h-14 rounded-xl border-slate-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="WhatsApp" value={personalData.phone} onChange={e => setPersonalData({...personalData, phone: e.target.value})} className="h-14 rounded-xl border-slate-200" />
                <Input placeholder="E-mail" value={personalData.email} onChange={e => setPersonalData({...personalData, email: e.target.value})} className="h-14 rounded-xl border-slate-200" />
              </div>
              <Input placeholder="Cidade - UF" value={personalData.location} onChange={e => setPersonalData({...personalData, location: e.target.value})} className="h-14 rounded-xl border-slate-200" />
              <Button onClick={next} disabled={!personalData.name} className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-bold">Continuar</Button>
            </div>
          </div>
        )}

        {/* STEP 3: VAGA DESEJADA */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cole a descrição da vaga</h2>
              <p className="text-slate-500 font-medium italic">A IA vai ler os requisitos e "hackear" as palavras-chave.</p>
            </div>
            <div className="space-y-4">
              <Textarea 
                placeholder="Cole aqui o texto da vaga ou cargo desejado..." 
                className="min-h-[250px] rounded-[2rem] border-slate-200 p-8 shadow-sm focus:ring-blue-500"
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
              />
              <Button onClick={next} className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-bold">Analisar Vaga com IA</Button>
            </div>
          </div>
        )}

        {/* STEP 4: FOCO ESTRATÉGICO */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Quase lá! Qual o foco?</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'exp', title: 'Minhas Experiências', desc: 'Focar no que eu já fiz' },
                { id: 'skill', title: 'Minhas Habilidades', desc: 'Focar no que eu sei fazer' },
                { id: 'result', title: 'Meus Resultados', desc: 'Focar em números e conquistas' }
              ].map(f => (
                <div key={f.id} onClick={() => { setSelectedFocus(f.id); next(); }} className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-blue-600 transition-all">
                  <div>
                    <h4 className="font-bold text-slate-900">{f.title}</h4>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${selectedFocus === f.id ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: PROCESSING IA */}
        {currentStep === 5 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 text-center animate-in fade-in duration-1000">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl animate-pulse rounded-full" />
              <Loader2 className="h-20 w-20 text-blue-600 animate-spin relative z-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Gerando seu currículo de elite...</h2>
              <div className="space-y-2 max-w-[300px] mx-auto">
                {['Analisando palavras-chave...', 'Otimizando para robôs ATS...', 'Estruturando layout...', 'Finalizando Design...'].map((t, i) => (
                  <div key={i} className={`text-sm font-bold flex items-center gap-2 transition-opacity duration-500 ${processingStep >= i ? 'opacity-100 text-blue-600' : 'opacity-20'}`}>
                    <CheckCircle2 size={14} /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: RESULTADO + CHECKOUT */}
        {currentStep === 6 && (
          <div className="space-y-10 animate-in zoom-in duration-500">
            <div className="bg-green-50 border border-green-100 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm">
              <div className="bg-green-500 p-3 rounded-full text-white">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-green-900 tracking-tight">Currículo Pronto!</h2>
                <p className="text-green-700 font-bold text-sm">Sua pontuação ATS estimada: <span className="text-xl">98/100</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Preview Fake */}
              <div className="bg-white border-4 border-slate-900 rounded-[2rem] p-6 shadow-2xl scale-95 opacity-80 pointer-events-none relative overflow-hidden h-[400px]">
                <div className="space-y-4">
                  <div className="h-8 bg-slate-100 w-2/3 rounded" />
                  <div className="h-4 bg-slate-50 w-full rounded" />
                  <div className="h-20 bg-slate-50 w-full rounded" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-4 bg-slate-100 rounded" />
                    <div className="h-4 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent flex items-center justify-center">
                   <Lock className="text-slate-400" size={48} />
                </div>
              </div>

              {/* Checkout Card */}
              <div className="space-y-6 flex flex-col justify-center">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Liberar meu <span className="text-blue-600">acesso</span></h3>
                  <p className="text-slate-500 font-bold">Baixe agora em PDF e Word para começar a ser chamado para entrevistas.</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-600 uppercase text-xs tracking-widest">Plano Único</span>
                    <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded">OFERTA ATIVA</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">R$ 27,90</span>
                    <span className="text-slate-400 line-through font-bold text-sm">R$ 97,00</span>
                  </div>
                </div>

                <Button className="w-full h-20 rounded-[2rem] bg-green-500 hover:bg-green-600 shadow-xl shadow-green-100 text-xl font-black uppercase tracking-tight flex flex-col leading-none">
                  <span>Baixar Currículo Agora</span>
                  <span className="text-[10px] opacity-80 mt-1 font-bold">Acesso Vitalício + Bônus</span>
                </Button>
                
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Lock size={12} /> Pagamento 100% Seguro
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Botão de Voltar Flutuante */}
      {currentStep > 1 && currentStep < 5 && (
        <button onClick={back} className="fixed bottom-8 left-8 bg-white border border-slate-200 p-4 rounded-full shadow-lg text-slate-400 hover:text-blue-600 transition-all">
          <ArrowLeft size={24} />
        </button>
      )}
    </div>
  )
}
