'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, CheckCircle2, Target, RefreshCw, TrendingUp, 
  Briefcase, Loader2, Download, Lock, ShieldCheck, Zap, ChevronRight 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Componente principal com Suspense para evitar erro de build no Next.js por causa do useSearchParams
export default function QuizFunnelFinal() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>}>
      <QuizContent />
    </Suspense>
  )
}

function QuizContent() {
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get('status')

  // --- ESTADOS DO FUNIL ---
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [personalData, setPersonalData] = useState({ name: '', email: '', phone: '' })
  const [jobDescription, setJobDescription] = useState('')
  const [processingStep, setProcessingStep] = useState(0)
  const [generatedCV, setGeneratedCV] = useState<string | null>(null)

  // --- LOGICA DE REDIRECIONAMENTO PÓS-PAGAMENTO ---
  useEffect(() => {
    if (paymentStatus === 'success') {
      setCurrentStep(10)
      generateCV()
    }
  }, [paymentStatus])

  // --- GERADOR DE CONTEÚDO (O CV) ---
  const generateCV = () => {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 30px; line-height: 1.5;">
        <h1 style="color: #2563eb; margin-bottom: 5px;">${personalData.name || 'Candidato'}</h1>
        <p><strong>Contato:</strong> ${personalData.phone || '(00) 00000-0000'} | ${personalData.email || 'email@teste.com'}</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <h3 style="color: #444; text-transform: uppercase;">Objetivo Profissional</h3>
        <p>Atuar estrategicamente visando ${selectedGoal || 'crescimento mútuo'}.</p>
        <h3 style="color: #444; text-transform: uppercase; margin-top: 20px;">Resumo</h3>
        <p>Profissional altamente qualificado com foco em resultados e adaptabilidade para a vaga de interesse.</p>
      </div>
    `
    setGeneratedCV(html)
  }

  // --- EFEITO DE IA (LOADING) ---
  useEffect(() => {
    if (currentStep === 8) {
      let step = 0
      const interval = setInterval(() => {
        step++
        setProcessingStep(step)
        if (step >= 5) {
          clearInterval(interval)
          generateCV()
          setCurrentStep(9)
        }
      }, 800)
      return () => clearInterval(interval)
    }
  }, [currentStep])

  const handleNext = () => setCurrentStep(prev => prev + 1)
  const handleBack = () => setCurrentStep(prev => prev - 1)

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* HEADER FIXO */}
      <header className="bg-white border-b p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <Zap className="text-blue-600 fill-current" /> CV<span className="text-blue-600">IA</span>
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Progresso: {Math.round((currentStep / 10) * 100)}%
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-10">
        
        {/* STEP 1: OBJETIVO */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-center uppercase italic italic tracking-tight">Qual seu <span className="text-blue-600">objetivo</span> hoje?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'job', title: 'Novo Emprego', icon: Target },
                { id: 'change', title: 'Transição', icon: RefreshCw },
                { id: 'promo', title: 'Promoção', icon: TrendingUp },
                { id: 'first', title: '1º Emprego', icon: Briefcase }
              ].map(item => (
                <Card 
                  key={item.id} 
                  className="p-6 cursor-pointer hover:border-blue-600 border-2 transition-all group"
                  onClick={() => { setSelectedGoal(item.title); handleNext(); }}
                >
                  <item.icon className="mb-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2-3: PERGUNTAS DE DOR */}
        {(currentStep === 2 || currentStep === 3) && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-3xl font-black text-center uppercase tracking-tighter">
              {currentStep === 2 ? "Quantos currículos você enviou no último mês?" : "Quantas entrevistas você conseguiu?"}
            </h2>
            <div className="grid gap-3">
              {['Nenhum', 'Menos de 10', 'Mais de 20'].map(opt => (
                <Button key={opt} variant="outline" className="h-16 text-lg font-bold" onClick={handleNext}>
                  {opt} <ChevronRight className="ml-auto" size={18} />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: DADOS PESSOAIS */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-center italic">QUEM É O <span className="text-blue-600">PROFISSIONAL?</span></h2>
            <Card className="p-8 space-y-4 shadow-xl border-none rounded-[2rem]">
              <Input placeholder="Seu Nome Completo" className="h-14" value={personalData.name} onChange={e => setPersonalData({...personalData, name: e.target.value})} />
              <Input placeholder="E-mail principal" className="h-14" value={personalData.email} onChange={e => setPersonalData({...personalData, email: e.target.value})} />
              <Input placeholder="WhatsApp com DDD" className="h-14" value={personalData.phone} onChange={e => setPersonalData({...personalData, phone: e.target.value})} />
              <Button className="w-full h-14 bg-blue-600 text-lg font-black" onClick={handleNext} disabled={!personalData.name}>CONTINUAR</Button>
            </Card>
          </div>
        )}

        {/* STEP 5-7: DESCRIÇÃO DA VAGA */}
        {(currentStep === 5 || currentStep === 6 || currentStep === 7) && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-3xl font-black text-center uppercase italic">Cole a <span className="text-blue-600">Descrição</span> da vaga</h2>
            <Textarea 
              placeholder="Requisitos, responsabilidades..." 
              className="min-h-[200px] p-6 text-lg rounded-[2rem]"
              onChange={e => setJobDescription(e.target.value)}
            />
            <Button className="w-full h-16 bg-slate-900 text-xl font-black" onClick={() => setCurrentStep(8)}>ANALISAR COM IA</Button>
          </div>
        )}

        {/* STEP 8: LOADING */}
        {currentStep === 8 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <Loader2 size={60} className="text-blue-600 animate-spin" />
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                {processingStep === 1 && "Lendo requisitos..."}
                {processingStep === 2 && "Injetando palavras-chave..."}
                {processingStep === 3 && "Organizando Layout..."}
                {processingStep === 4 && "Finalizando..."}
              </h3>
              <p className="text-slate-400 font-bold text-xs tracking-widest uppercase">Processamento Neural em curso</p>
            </div>
          </div>
        )}

        {/* STEP 9: PÁGINA DE VENDAS */}
        {currentStep === 9 && (
          <div className="space-y-10 animate-in slide-in-from-bottom-8">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center gap-6 shadow-2xl border-b-4 border-blue-600">
              <div className="bg-green-500 p-4 rounded-full"><CheckCircle2 size={32} /></div>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-tight">Currículo <span className="text-blue-400 underline">Pronto</span> para download!</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="relative bg-white rounded-[2.5rem] p-6 h-[400px] overflow-hidden border">
                <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
                  <Lock size={32} className="mb-3 text-slate-800" />
                  <p className="font-black uppercase italic text-sm">Acesso Bloqueado</p>
                </div>
                <div className="opacity-10 grayscale blur-sm" dangerouslySetInnerHTML={{ __html: generatedCV || '' }} />
              </Card>
              <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Plano <span className="text-blue-600">Único</span></h3>
                  <p className="text-4xl font-black text-slate-900 mb-6">R$ 27,90</p>
                  <ul className="space-y-3 text-sm font-bold text-slate-600">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-600" /> PDF pronto para envio</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Otimização Real para ATS</li>
                  </ul>
                </div>
                <Button className="w-full h-20 bg-green-500 hover:bg-green-600 text-white rounded-2xl mt-6 shadow-lg transition-transform hover:scale-105 font-black text-xl" onClick={() => window.location.href = "SEU_LINK_DE_CHECKOUT_AQUI"}>
                  LIBERAR AGORA
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 10: OBRIGADO (PÓS PAGAMENTO) */}
        {currentStep === 10 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
             <div className="text-center">
                <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">ACESSO <span className="text-green-600">LIBERADO!</span></h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 p-8 bg-white rounded-[2rem] shadow-xl h-[500px] overflow-y-auto">
                   <div dangerouslySetInnerHTML={{ __html: generatedCV || '' }} />
                </Card>
                <div className="space-y-4">
                   <Button className="w-full h-16 bg-blue-600 font-black rounded-2xl flex gap-2" onClick={() => window.print()}>
                      <Download /> BAIXAR CV
                   </Button>
                   <Card className="p-4 bg-slate-900 text-white rounded-2xl text-xs font-bold leading-relaxed">
                      Dica: Use este modelo para vagas que pedem currículo em PDF.
                   </Card>
                </div>
             </div>
          </div>
        )}

        {/* BOTÃO VOLTAR */}
        {currentStep > 1 && currentStep < 9 && (
          <button onClick={handleBack} className="mt-8 flex items-center gap-2 text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} /> VOLTAR AO PASSO ANTERIOR
          </button>
        )}
      </main>
    </div>
  )
}
