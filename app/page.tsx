'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  ArrowLeft, Send, AlertTriangle, CheckCircle2, Sparkles, Target, 
  RefreshCw, TrendingUp, Briefcase, Upload, User, Lightbulb, 
  Award, Loader2, Download, Eye, FileText, Lock, ShieldCheck, Zap, ChevronRight 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function QuizFunnelPremium() {
  // --- ESTADOS DO SEU QUIZ ---
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [cvsSent, setCvsSent] = useState('')
  const [gettingInterviews, setGettingInterviews] = useState('')
  const [showProblemSolution, setShowProblemSolution] = useState(false)
  const [personalData, setPersonalData] = useState({
    name: '', email: '', phone: '', location: '', professionalSummary: ''
  })
  const [jobDescription, setJobDescription] = useState('')
  const [selectedFocus, setSelectedFocus] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [generatedCV, setGeneratedCV] = useState<string | null>(null)

  const totalSteps = 9
  const progress = (currentStep / totalSteps) * 100

  // --- LÓGICA DE GERAÇÃO (O "OURO") ---
  const generateCV = () => {
    const nameParts = (personalData.name || 'Usuário').split(' ')
    const initials = nameParts.length >= 2 
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (personalData.name || 'CV').substring(0, 2).toUpperCase()

    const cvHTML = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <div style="border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          <h1 style="margin: 0; color: #1a1a1a;">${personalData.name.toUpperCase()}</h1>
          <p style="color: #2563eb; font-weight: bold;">Candidato Otimizado para ATS</p>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="text-transform: uppercase; font-size: 14px; border-bottom: 1px solid #eee;">Resumo Profissional</h3>
          <p style="font-size: 13px;">${personalData.professionalSummary || 'Experiência sólida em resultados...'}</p>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="text-transform: uppercase; font-size: 14px; border-bottom: 1px solid #eee;">Competências Chave</h3>
          <p style="font-size: 13px;">• Otimização de Processos • Liderança • Foco em Metas</p>
        </div>
      </div>
    `
    setGeneratedCV(cvHTML)
  }

  // Efeito de Simulação de IA
  useEffect(() => {
    if (currentStep === 8) {
      setIsProcessing(true)
      let step = 0
      const interval = setInterval(() => {
        step++
        setProcessingStep(step)
        if (step >= 5) {
          clearInterval(interval)
          setTimeout(() => {
            generateCV()
            setIsProcessing(false)
            setCurrentStep(9)
          }, 800)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [currentStep])

  const handleNext = () => setCurrentStep(s => s + 1)
  const handleBack = () => currentStep > 1 && setCurrentStep(s => s - 1)

  // --- COMPONENTES DE INTERFACE ---
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header com Barra de Progresso */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="text-blue-600 fill-current" size={20} />
            <span className="font-black tracking-tighter text-xl">CV<span className="text-blue-600">IA</span></span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{Math.round(progress)}%</span>
             <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-12">
        
        {/* STEP 1: OBJETIVO */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">QUAL SEU <span className="text-blue-600 italic underline">OBJETIVO</span> HOJE?</h2>
              <p className="text-gray-500 font-medium">A IA ajustará o tom de voz do currículo conforme sua meta.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'job', icon: Target, title: 'Novo Emprego', sub: 'Passar nos robôs ATS.', color: 'blue' },
                { id: 'change', icon: RefreshCw, title: 'Transição', sub: 'Mudar de área.', color: 'orange' },
                { id: 'promo', icon: TrendingUp, title: 'Promoção', sub: 'Destaque resultados.', color: 'green' },
                { id: 'first', icon: Briefcase, title: '1º Emprego', sub: 'Foco em potencial.', color: 'purple' }
              ].map(item => (
                <Card 
                  key={item.id} 
                  className={cn("p-6 cursor-pointer border-2 transition-all hover:border-blue-500", selectedGoal === item.id ? "border-blue-600 bg-blue-50/50" : "border-gray-200")}
                  onClick={() => { setSelectedGoal(item.id); handleNext(); }}
                >
                  <item.icon className={cn("mb-4", `text-${item.color}-500`)} />
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.sub}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 & 3: DIAGNÓSTICO (PROBLEMA/SOLUÇÃO) */}
        {(currentStep === 2 || currentStep === 3) && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4">
            <h2 className="text-3xl font-black text-center uppercase tracking-tighter">
              {currentStep === 2 ? "Frequência de Envio" : "Status de Entrevistas"}
            </h2>
            <div className="space-y-4">
              {currentStep === 2 ? (
                ['Nenhum ainda', '1 a 5 por semana', 'Mais de 10'].map(opt => (
                  <Button key={opt} variant="outline" className="w-full h-16 text-lg font-bold justify-between px-6 rounded-2xl" onClick={handleNext}>
                    {opt} <ChevronRight size={18} />
                  </Button>
                ))
              ) : (
                <div className="space-y-6">
                   <Button variant="outline" className="w-full h-16 text-lg font-bold" onClick={() => setShowProblemSolution(true)}>Tenho poucas/nenhuma entrevista</Button>
                   {showProblemSolution && (
                     <div className="space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3">
                           <AlertTriangle className="text-red-500 shrink-0" />
                           <p className="text-sm text-red-800"><b>Atenção:</b> 75% dos currículos são descartados por robôs (ATS) antes de um humano ler. Você está sendo filtrado injustamente.</p>
                        </div>
                        <Button className="w-full h-16 bg-blue-600 text-lg font-black" onClick={handleNext}>VAMOS RESOLVER ISSO AGORA</Button>
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 & 5: DADOS PESSOAIS */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
             <h2 className="text-3xl font-black text-center italic">QUEM É O <span className="text-blue-600">TALENTO?</span></h2>
             <Card className="p-8 space-y-4 rounded-[2rem] shadow-xl border-none">
                <Input placeholder="Nome Completo" className="h-14 font-bold" value={personalData.name} onChange={e => setPersonalData({...personalData, name: e.target.value})} />
                <Input placeholder="WhatsApp" className="h-14 font-bold" value={personalData.phone} onChange={e => setPersonalData({...personalData, phone: e.target.value})} />
                <Textarea placeholder="Seu resumo profissional (ou deixe em branco para a IA criar)" className="min-h-[120px]" value={personalData.professionalSummary} onChange={e => setPersonalData({...personalData, professionalSummary: e.target.value})} />
                <Button className="w-full h-14 bg-slate-900 text-lg font-black" onClick={handleNext} disabled={!personalData.name}>PRÓXIMO PASSO</Button>
             </Card>
          </div>
        )}

        {/* STEP 6 & 7: VAGA ALVO & FOCO */}
        {currentStep === 6 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
             <h2 className="text-3xl font-black text-center italic uppercase">A <span className="text-blue-600">Vaga</span> no Radar</h2>
             <Textarea 
               placeholder="Cole aqui a descrição da vaga (Requisitos/Responsabilidades)..." 
               className="min-h-[250px] p-6 text-lg rounded-[2rem] shadow-inner bg-white"
               value={jobDescription}
               onChange={e => setJobDescription(e.target.value)}
             />
             <Button className="w-full h-16 bg-blue-600 text-xl font-black" onClick={handleNext}>ANALISAR VAGA COM IA</Button>
          </div>
        )}

        {/* STEP 8: LOADING IA */}
        {currentStep === 8 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 text-center">
            <div className="relative">
              <Loader2 size={80} className="text-blue-600 animate-spin" />
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">
                {processingStep === 1 && "Analisando Requisitos..."}
                {processingStep === 2 && "Injetando Palavras-Chave ATS..."}
                {processingStep === 3 && "Estruturando Layout..."}
                {processingStep === 4 && "Finalizando Design..."}
                {processingStep >= 5 && "Tudo Pronto!"}
              </h3>
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Otimizando para máxima conversão</p>
            </div>
          </div>
        )}

        {/* STEP 9: PÁGINA DE VENDAS / CHECKOUT (O FINAL BOSS) */}
        {currentStep === 9 && (
          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            {/* Banner Sucesso */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden border-b-4 border-blue-600">
              <div className="bg-green-500 p-6 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-4xl font-black italic uppercase leading-tight tracking-tighter">Currículo <span className="text-blue-400 underline">Blindado!</span></h2>
                <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest">Aderência de 98% para a vaga informada</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Preview Borrado */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-[3rem] blur-2xl" />
                <div className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl h-[550px] overflow-hidden">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-10 text-center">
                    <div className="bg-slate-900 p-5 rounded-3xl text-white mb-6 shadow-2xl rotate-3"><Lock size={40} /></div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Arquivo <br/> Bloqueado</h4>
                    <p className="text-sm text-slate-500 font-bold mt-2 leading-tight">Complete o acesso para baixar seu <br/> currículo otimizado com IA.</p>
                  </div>
                  {/* Fundo do CV borrado */}
                  <div className="opacity-20 grayscale pointer-events-none select-none" dangerouslySetInnerHTML={{ __html: generatedCV || '' }} />
                </div>
              </div>

              {/* Card de Pagamento */}
              <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Liberado Agora</div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Versão <span className="text-blue-600 underline">Premium</span></h3>
                  <ul className="space-y-4">
                    {['Arquivo PDF + Word Editável', 'Score ATS de 98%', 'Checklist de Entrevista (Bônus)'].map(i => (
                      <li key={i} className="flex items-center gap-3 font-bold text-slate-600 text-sm">
                        <CheckCircle2 size={18} className="text-blue-600 shrink-0" /> {i}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 space-y-6">
                  <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center border border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 line-through font-bold">R$ 97,00</span>
                      <p className="text-5xl font-black text-slate-900 tracking-tighter">R$ 27,90</p>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-2 rounded-xl uppercase">Pix ou <br/> Cartão</span>
                  </div>

                  <a href="https://pay.kiwify.com.br/SEU_LINK" className="block">
                    <Button className="w-full h-24 bg-green-500 hover:bg-green-600 text-white rounded-[2rem] shadow-[0_20px_40px_rgba(34,197,94,0.3)] flex flex-col items-center justify-center transition-transform hover:scale-[1.02] active:scale-95 border-b-4 border-green-700">
                      <span className="text-2xl font-black italic uppercase tracking-tighter">LIBERAR AGORA</span>
                      <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Acesso imediato no E-mail</span>
                    </Button>
                  </a>

                  <div className="flex justify-center gap-6 opacity-30 grayscale">
                    <ShieldCheck size={24} /> <Award size={24} /> <Lock size={24} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

      </main>

      {/* Botão de Voltar Flutuante */}
      {currentStep > 1 && currentStep < 9 && (
        <button 
          onClick={handleBack}
          className="fixed bottom-8 left-8 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-2xl border border-gray-200 text-gray-400 hover:text-blue-600 transition-all z-50"
        >
          <ArrowLeft size={24} />
        </button>
      )}
    </div>
  )
}
