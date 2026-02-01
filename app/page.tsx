'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, Send, CheckCircle2, Sparkles, Target, 
  RefreshCw, TrendingUp, FileText, Lock, Rocket, 
  Loader2, Download, ShieldCheck, Zap, Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// --- CONFIGURAÇÕES DO SEU CHECKOUT ---
const CHECKOUT_URL = "SEU_LINK_AQUI" // Insira seu link da Kiwify/Hotmart aqui

export default function GeradorCVProfissional() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('Iniciando IA...')
  
  // Estados de Dados Completos
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    goal: '',
    jobDescription: '',
    experience: '',
    focus: ''
  })

  // Simulação de Processamento de Alta Fidelidade
  useEffect(() => {
    if (currentStep === 5) {
      const messages = [
        'Analisando requisitos da vaga...',
        'Extraindo palavras-chave estratégicas...',
        'Cruzando suas experiências com o perfil...',
        'Otimizando para algoritmos ATS...',
        'Gerando resumo profissional de alto impacto...',
        'Formatando layout padrão internacional...',
        'Finalizando versão final...'
      ]
      
      let i = 0
      const interval = setInterval(() => {
        if (i < messages.length) {
          setStatusText(messages[i])
          setProgress((prev) => prev + (100 / messages.length))
          i++
        } else {
          clearInterval(interval)
          setTimeout(() => setCurrentStep(6), 800)
        }
      }, 1200)
      
      return () => clearInterval(interval)
    }
  }, [currentStep])

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => setCurrentStep(prev => prev + 1)
  const handleBack = () => setCurrentStep(prev => prev - 1)

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans selection:bg-blue-100 selection:text-blue-700">
      
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-xl rotate-[-5deg] group-hover:rotate-0 transition-all">
              <FileText className="text-white h-5 w-5" />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic text-slate-900">
              CURRÍCULO<span className="text-blue-600">PRO</span>
            </span>
          </div>
          
          {currentStep < 5 && (
            <div className="hidden md:flex items-center gap-3 bg-slate-100 p-1 rounded-full px-4">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={cn("h-2 w-8 rounded-full transition-all duration-500", currentStep >= s ? "bg-blue-600" : "bg-slate-300")} />
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase">Etapa {currentStep}/4</span>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        
        {/* STEP 1: OBJETIVO ESTRATÉGICO */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="py-1 px-4 border-blue-200 text-blue-600 bg-blue-50 font-bold uppercase tracking-wider">IA Profissional</Badge>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">QUAL SEU <span className="text-blue-600 italic">OBJETIVO?</span></h1>
              <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">A inteligência artificial vai moldar cada frase do seu currículo baseada na sua meta atual.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'job', title: 'Novo Emprego', icon: Target, desc: 'Foco total em passar em filtros de recrutamento (ATS).' },
                { id: 'change', title: 'Transição de Carreira', icon: RefreshCw, desc: 'Destaque habilidades transferíveis para novas áreas.' },
                { id: 'promo', title: 'Promoção Interna', icon: TrendingUp, desc: 'Foco em resultados, métricas e liderança de projetos.' },
                { id: 'first', title: 'Primeiro Job / Estágio', icon: Rocket, desc: 'Destaque potencial acadêmico e projetos pessoais.' }
              ].map(item => (
                <Card 
                  key={item.id}
                  onClick={() => { updateField('goal', item.id); handleNext(); }}
                  className={cn(
                    "relative overflow-hidden cursor-pointer border-2 transition-all hover:shadow-xl hover:-translate-y-1",
                    formData.goal === item.id ? "border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100" : "border-white"
                  )}
                >
                  <CardContent className="p-8">
                    <item.icon className={cn("mb-4 h-10 w-10 transition-colors", formData.goal === item.id ? "text-blue-600" : "text-slate-400")} />
                    <h3 className="font-black text-xl text-slate-900 uppercase italic tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 font-semibold text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: DADOS PESSOAIS */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">DADOS DE <span className="text-blue-600">CONTATO</span></h2>
              <p className="text-slate-500 font-bold">Como os recrutadores devem te encontrar?</p>
            </div>
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 space-y-5 bg-white">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-2">Nome Completo</label>
                  <Input value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="Ex: João Silva" className="h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white text-lg font-bold" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-2">WhatsApp</label>
                    <Input value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(00) 00000-0000" className="h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white text-lg font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-2">E-mail Profissional</label>
                    <Input value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="seu@email.com" className="h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white text-lg font-bold" />
                  </div>
                </div>
                <Button onClick={handleNext} disabled={!formData.name || !formData.email} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xl font-black uppercase shadow-lg shadow-blue-200 transition-all mt-4">
                  PRÓXIMO PASSO
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3: CONTEXTO DA VAGA (AQUI É ONDE A IA BRILHA) */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">A <span className="text-blue-600">VAGA</span> DESEJADA</h2>
              <p className="text-slate-500 font-bold">Cole a descrição ou fale sobre o cargo. A IA vai "espelhar" suas habilidades.</p>
            </div>
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
               <Card className="relative border-none rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <CardContent className="p-0">
                    <Textarea 
                      value={formData.jobDescription} 
                      onChange={e => updateField('jobDescription', e.target.value)}
                      placeholder="Ex: Vaga para Gerente de Projetos com foco em metodologias ágeis..." 
                      className="min-h-[300px] border-none p-10 text-xl font-medium focus-visible:ring-0 resize-none placeholder:text-slate-300" 
                    />
                    <div className="p-6 bg-slate-50 border-t flex justify-end">
                      <Button onClick={handleNext} className="h-14 px-10 rounded-xl bg-slate-900 hover:bg-black text-lg font-black uppercase italic">Analisar Vaga</Button>
                    </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        )}

        {/* STEP 4: FOCO DE DESTAQUE */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic text-center">ONDE DEVEMOS <span className="text-blue-600">FOCAR?</span></h2>
            <div className="space-y-3">
              {[
                { id: 'exp', label: 'Minhas Experiências Profissionais', sub: 'Ideal para quem já tem bagagem na área.' },
                { id: 'skill', label: 'Minhas Habilidades Técnicas', sub: 'Ideal para áreas de tecnologia e especializadas.' },
                { id: 'res', label: 'Meus Resultados e Conquistas', sub: 'Ideal para cargos de liderança e vendas.' }
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => { updateField('focus', opt.id); handleNext(); }}
                  className="bg-white border-2 border-slate-100 p-6 rounded-2xl cursor-pointer hover:border-blue-600 transition-all flex items-center justify-between group shadow-sm"
                >
                  <div>
                    <h4 className="font-black uppercase italic text-slate-800">{opt.label}</h4>
                    <p className="text-sm font-semibold text-slate-400">{opt.sub}</p>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-slate-200 group-hover:border-blue-600 group-hover:bg-blue-600 transition-all shadow-inner" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: PROCESSAMENTO IA */}
        {currentStep === 5 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-10 animate-in fade-in duration-1000">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative h-full w-full rounded-full border-4 border-slate-100 flex items-center justify-center overflow-hidden bg-white shadow-2xl">
                <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              </div>
            </div>
            
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase italic text-slate-900 tracking-tight">{statusText}</h2>
                <Progress value={progress} className="h-3 bg-slate-100" />
              </div>
              <div className="flex justify-center gap-4">
                <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"><ShieldCheck size={12}/> Verificado pela IA</span>
                <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Zap size={12}/> Otimização ATS 2.0</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: RESULTADO FINAL + CHECKOUT INTEGRADO */}
        {currentStep === 6 && (
          <div className="space-y-10 animate-in slide-in-from-bottom-12 duration-700">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Star size={120} /></div>
               <div className="bg-blue-600 p-6 rounded-full shadow-xl shadow-blue-500/20 shrink-0">
                  <CheckCircle2 size={48} />
               </div>
               <div className="text-center md:text-left z-10">
                  <h2 className="text-4xl font-black uppercase italic leading-none tracking-tighter">Currículo <span className="text-blue-500">Pronto!</span></h2>
                  <p className="text-slate-400 font-bold mt-2">Sua pontuação de otimização está em <span className="text-blue-500 text-2xl font-black">98%</span>. O arquivo está pronto para download.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Preview com Blur (Cria Curiosidade) */}
              <div className="lg:col-span-7 relative group">
                <div className="absolute -inset-1 bg-blue-600 rounded-[2rem] blur opacity-20" />
                <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl pointer-events-none select-none">
                  <div className="space-y-8 blur-[5px]">
                    <div className="space-y-2">
                      <div className="h-8 bg-slate-200 w-1/2 rounded-lg" />
                      <div className="h-4 bg-slate-100 w-1/3 rounded-lg" />
                    </div>
                    <div className="h-32 bg-slate-50 w-full rounded-2xl" />
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 w-full rounded-lg" />
                      <div className="h-4 bg-slate-100 w-5/6 rounded-lg" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-[2.5rem]">
                    <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-4 scale-110">
                       <div className="bg-slate-900 text-white p-3 rounded-2xl"><Lock size={32} /></div>
                       <p className="font-black uppercase italic text-slate-900 text-sm tracking-tighter">Acesso Bloqueado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card de Checkout */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-8">
                  <CardContent className="p-0 space-y-6">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">Liberar Versão <span className="text-blue-600">Premium</span></h3>
                      <p className="text-slate-500 font-bold text-sm">O que você vai receber agora:</p>
                    </div>

                    <ul className="space-y-3">
                      {[
                        'Arquivo em PDF e Word editável',
                        'Otimização de Keywords para ATS',
                        '3 Modelos de Design Exclusivos',
                        'Bônus: Guia de Entrevistas 2024'
                      ].map(i => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <CheckCircle2 size={18} className="text-blue-600 shrink-0" /> {i}
                        </li>
                      ))}
                    </ul>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">De R$ 97,00 por</p>
                        <p className="text-3xl font-black text-slate-900 leading-none mt-1">R$ 27,90</p>
                      </div>
                      <Badge className="bg-blue-600 text-[10px] font-black uppercase">OFERTA ÚNICA</Badge>
                    </div>

                    <a href={CHECKOUT_URL} className="block">
                      <Button className="w-full h-20 rounded-2xl bg-green-500 hover:bg-green-600 shadow-xl shadow-green-100 text-xl font-black uppercase italic tracking-tight flex flex-col leading-tight transition-all active:scale-95">
                        <span>BAIXAR CURRÍCULO AGORA</span>
                        <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Acesso Imediato</span>
                      </Button>
                    </a>

                    <div className="flex items-center justify-center gap-4 text-slate-400 opacity-60">
                       <ShieldCheck size={16} />
                       <span className="text-[9px] font-black uppercase tracking-[0.2em]">Pagamento Seguro & Criptografado</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Testemunho Rápido */}
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
                  <div className="h-10 w-10 bg-blue-200 rounded-full shrink-0" />
                  <p className="text-xs font-bold text-blue-900 italic">"Consegui 3 entrevistas na mesma semana após atualizar meu CV com essa IA. Valeu cada centavo!" — Ricardo M.</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Botão de Voltar Flutuante */}
      {currentStep > 1 && currentStep < 5 && (
        <button onClick={handleBack} className="fixed bottom-8 left-8 bg-white border border-slate-200 p-4 rounded-full shadow-2xl text-slate-400 hover:text-blue-600 transition-all hover:scale-110 active:scale-90">
          <ArrowLeft size={24} />
        </button>
      )}
    </div>
  )
}
