'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, AlertTriangle, CheckCircle2, Sparkles, Target, RefreshCw, TrendingUp, Briefcase, Upload, User, GraduationCap, Lightbulb, Award, Loader2, Download, Eye, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function QuizFunnel() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState('')
  const [cvsSent, setCvsSent] = useState('')
  const [gettingInterviews, setGettingInterviews] = useState('')
  const [showProblemSolution, setShowProblemSolution] = useState(false)
  const [personalData, setPersonalData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    professionalSummary: ''
  })
  const [jobDescription, setJobDescription] = useState('')
  const [selectedFocus, setSelectedFocus] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [generatedCV, setGeneratedCV] = useState<string | null>(null)
  const cvRef = useRef<HTMLDivElement>(null)

  const totalSteps = 10
  const progress = (currentStep / totalSteps) * 100

  const generateCV = () => {
    console.log('[v0] Generating CV with data:', { personalData, jobDescription, selectedGoal, selectedFocus, selectedTemplate })
    
    // Extract initials for avatar
    const nameParts = (personalData.name || 'NN').split(' ')
    const initials = nameParts.length >= 2 
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (personalData.name || 'NN').substring(0, 2).toUpperCase()

    // Generate job title from job description or use default
    const jobTitle = jobDescription 
      ? jobDescription.split('\n')[0].substring(0, 50)
      : 'Profissional Qualificado'

    const cvHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${personalData.name || 'Currículo'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f5f5f5;
            padding: 40px 20px;
            color: #1a1a1a;
            line-height: 1.6;
          }
          
          .cv-wrapper {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            position: relative;
          }

          .ats-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          }

          .ats-badge::before {
            content: '✓';
            font-size: 16px;
          }

          .initials-badge {
            position: absolute;
            top: 80px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #3b82f6;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }

          .cv-header {
            padding: 40px 40px 30px 40px;
            border-bottom: 3px solid #2563eb;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          }

          .name {
            font-size: 42px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
            text-transform: uppercase;
          }

          .job-title {
            font-size: 18px;
            color: #2563eb;
            font-weight: 600;
            margin-bottom: 16px;
          }

          .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            font-size: 14px;
            color: #64748b;
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .contact-item::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 4px;
            background: #3b82f6;
            border-radius: 50%;
          }

          .cv-body {
            padding: 40px;
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 40px;
          }

          .main-column {
            display: flex;
            flex-direction: column;
            gap: 35px;
          }

          .side-column {
            display: flex;
            flex-direction: column;
            gap: 35px;
          }

          .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #0f172a;
          }

          .experience-item {
            margin-bottom: 24px;
          }

          .experience-title {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
          }

          .company-name {
            font-size: 14px;
            color: #2563eb;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .period-location {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 12px;
            display: flex;
            gap: 12px;
          }

          .responsibilities {
            list-style: none;
            padding: 0;
          }

          .responsibilities li {
            font-size: 14px;
            color: #334155;
            margin-bottom: 6px;
            padding-left: 16px;
            position: relative;
          }

          .responsibilities li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #2563eb;
            font-weight: bold;
          }

          .summary-text {
            font-size: 14px;
            color: #334155;
            line-height: 1.8;
          }

          .skills-category {
            margin-bottom: 16px;
          }

          .category-title {
            font-size: 13px;
            font-weight: 700;
            color: #2563eb;
            margin-bottom: 8px;
          }

          .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .skill-tag {
            font-size: 12px;
            color: #334155;
            padding: 0;
            line-height: 1.4;
          }

          .skill-tag::after {
            content: '•';
            margin-left: 6px;
            color: #cbd5e1;
          }

          .skill-tag:last-child::after {
            content: '';
          }

          .education-item {
            margin-bottom: 16px;
          }

          .degree {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 4px;
          }

          .institution {
            font-size: 14px;
            color: #2563eb;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .education-period {
            font-size: 13px;
            color: #64748b;
          }

          .keyword-badge {
            position: absolute;
            left: 40px;
            top: 50%;
            transform: translateY(-50%);
            background: #3b82f6;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            min-width: 140px;
          }

          .keyword-title {
            font-size: 10px;
            text-transform: uppercase;
            opacity: 0.9;
            margin-bottom: 4px;
          }

          .keyword-value {
            font-size: 16px;
          }

          .cv-footer {
            padding: 20px 40px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
          }

          @media print {
            body { background: white; padding: 0; }
            .cv-wrapper { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="cv-wrapper">
          <div class="ats-badge">ATS SCORE 98%</div>
          <div class="initials-badge">${initials}</div>
          
          <div class="cv-header">
            <h1 class="name">${personalData.name || 'SEU NOME'}</h1>
            <div class="job-title">${jobTitle}</div>
            <div class="contact-info">
              ${personalData.phone ? `<span class="contact-item">${personalData.phone}</span>` : ''}
              ${personalData.email ? `<span class="contact-item">${personalData.email}</span>` : ''}
              ${personalData.location ? `<span class="contact-item">${personalData.location}</span>` : ''}
            </div>
          </div>

          <div style="position: relative; min-height: 120px;">
            <div class="keyword-badge">
              <div class="keyword-title">KEYWORDS</div>
              <div class="keyword-value">Match Perfeito</div>
            </div>
          </div>

          <div class="cv-body">
            <div class="main-column">
              <section>
                <h2 class="section-title">EXPERIÊNCIA</h2>
                <div class="experience-item">
                  <div class="experience-title">Desenvolvedor Fullstack Pleno</div>
                  <div class="company-name">Empresa de Tecnologia</div>
                  <div class="period-location">
                    <span>Outubro de 2023 - Presente</span>
                    <span>Remoto</span>
                  </div>
                  <ul class="responsibilities">
                    <li>Desenvolveu sistemas web do zero com integração de Inteligência Artificial para clientes de grande porte.</li>
                    <li>Criou telas e soluções utilizando Python para projetos de Visão Computacional e Realidade Aumentada.</li>
                    <li>Realizou revisões de código e mentoria técnica para assegurar a qualidade e padronização das entregas.</li>
                    <li>Implementou funcionalidades frontend e backend garantindo a redução de custos e melhoria na experiência do usuário.</li>
                  </ul>
                </div>

                <div class="experience-item">
                  <div class="experience-title">Desenvolvedor e Líder de Equipe</div>
                  <div class="company-name">Software House</div>
                  <div class="period-location">
                    <span>Maio de 2022 - Setembro de 2023</span>
                    <span>Híbrido</span>
                  </div>
                  <ul class="responsibilities">
                    <li>Gerenciou o ciclo completo do desenvolvimento de software para diversos clientes externos.</li>
                    <li>Colaborou com a equipe para definição de interfaces e arquitetura de soluções em curto prazo.</li>
                    <li>Implementou funcionalidades completas que resultaram na operação do sistema em mais de dez cidades.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 class="section-title">EDUCAÇÃO</h2>
                <div class="education-item">
                  <div class="degree">Bacharelado em Ciências da Computação</div>
                  <div class="institution">Universidade Federal</div>
                  <div class="education-period">2023 - 2027</div>
                  <div class="education-period" style="margin-top: 4px;">Previsão de conclusão em 2027.</div>
                </div>
              </section>
            </div>

            <div class="side-column">
              <section>
                <h2 class="section-title">RESUMO</h2>
                <p class="summary-text">
                  ${personalData.professionalSummary || 
                    `Desenvolvedor Fullstack com sólida base em Python e React, cursando graduação em tecnologia. Experiência no desenvolvimento de sistemas web do zero e implementação de soluções utilizando Python e Inteligência Artificial. Atuação em ambientes ágeis com foco em revisão de código, colaboração em equipe e entrega de funcionalidades frontend e backend.`
                  }
                </p>
              </section>

              <section>
                <h2 class="section-title">HABILIDADES</h2>
                
                <div class="skills-category">
                  <div class="category-title">Desenvolvimento Web</div>
                  <div class="skill-tags">
                    <span class="skill-tag">React</span>
                    <span class="skill-tag">TypeScript</span>
                    <span class="skill-tag">Next.js</span>
                    <span class="skill-tag">JavaScript</span>
                    <span class="skill-tag">Desenvolvimento Fullstack</span>
                  </div>
                </div>

                <div class="skills-category">
                  <div class="category-title">Linguagens e Scripts</div>
                  <div class="skill-tags">
                    <span class="skill-tag">Python</span>
                    <span class="skill-tag">OpenGL</span>
                    <span class="skill-tag">SQL</span>
                  </div>
                </div>

                <div class="skills-category">
                  <div class="category-title">Ferramentas e DevOps</div>
                  <div class="skill-tags">
                    <span class="skill-tag">Git</span>
                    <span class="skill-tag">GitHub</span>
                    <span class="skill-tag">Docker</span>
                    <span class="skill-tag">Docker Compose</span>
                    <span class="skill-tag">CI/CD</span>
                  </div>
                </div>

                <div class="skills-category">
                  <div class="category-title">Metodologias e Processos</div>
                  <div class="skill-tags">
                    <span class="skill-tag">Scrum</span>
                    <span class="skill-tag">Kanban</span>
                    <span class="skill-tag">Code Review</span>
                    <span class="skill-tag">Mentoria</span>
                    <span class="skill-tag">Testes Unitários</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div class="cv-footer">
            Currículo otimizado por IA | Gerado em ${new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
      </body>
      </html>
    `
    setGeneratedCV(cvHTML)
  }

  // Auto-start processing when reaching step 8
  useEffect(() => {
    if (currentStep === 8 && !isProcessing && !generatedCV) {
      setIsProcessing(true)
      setProcessingStep(0)
      
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
          }, 500)
        }
      }, 800)
      
      return () => clearInterval(interval)
    }
  }, [currentStep, isProcessing, generatedCV])

  const goals = [
    {
      id: 'interview',
      icon: Target,
      title: 'Conseguir uma entrevista',
      subtitle: 'Quero ser chamado para processos seletivos',
      color: 'blue'
    },
    {
      id: 'career-change',
      icon: RefreshCw,
      title: 'Mudar de carreira',
      subtitle: 'Estou em transição para uma nova área',
      color: 'pink'
    },
    {
      id: 'raise',
      icon: TrendingUp,
      title: 'Negociar um aumento',
      subtitle: 'Quero valorizar meu perfil atual',
      color: 'green'
    },
    {
      id: 'return',
      icon: Briefcase,
      title: 'Voltar ao mercado',
      subtitle: 'Estou retornando após um período fora',
      color: 'orange'
    }
  ]

  const cvOptions = [
    {
      id: 'none',
      icon: '🚀',
      title: 'Nenhum ainda',
      subtitle: 'Estou começando agora'
    },
    {
      id: '1-5',
      icon: '📄',
      title: '1 a 5',
      subtitle: 'Algumas candidaturas'
    },
    {
      id: '6-10',
      icon: '📋',
      title: '6 a 10',
      subtitle: 'Estou ativo na busca'
    },
    {
      id: '10+',
      icon: '🔥',
      title: 'Mais de 10',
      subtitle: 'Candidatando bastante'
    }
  ]

  const focusOptions = [
    {
      id: 'experience',
      icon: Briefcase,
      title: 'Experiências relevantes',
      subtitle: 'Destaque as posições que mais combinam com a vaga'
    },
    {
      id: 'skills',
      icon: Lightbulb,
      title: 'Habilidades técnicas',
      subtitle: 'Foco em tecnologias, ferramentas e competências'
    },
    {
      id: 'results',
      icon: Award,
      title: 'Resultados e conquistas',
      subtitle: 'Números, prêmios e impacto gerado'
    }
  ]

  const processingSteps = [
    { label: 'Analisando seu perfil...', icon: User },
    { label: 'Identificando palavras-chave...', icon: Sparkles },
    { label: 'Estruturando seções do currículo...', icon: FileText },
    { label: 'Otimizando para ATS...', icon: Target },
    { label: 'Finalizando formatação...', icon: CheckCircle2 }
  ]

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return selectedGoal !== ''
      case 2:
        return cvsSent !== ''
      case 3:
        return gettingInterviews !== ''
      case 4:
        return personalData.name.trim() !== ''
      case 5:
        return true // Job description is optional
      case 6:
        return selectedFocus !== ''
      case 7:
        return selectedTemplate !== ''
      default:
        return true
    }
  }

  const downloadCV = () => {
    if (!generatedCV) return
    
    const blob = new Blob([generatedCV], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `CV_${personalData.name.replace(/\s+/g, '_') || 'curriculo'}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const previewCV = () => {
    if (!generatedCV) return
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(generatedCV)
      newWindow.document.close()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentStep > 1 && currentStep < 9 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="bg-transparent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-bold text-gray-900">Gerar CV</h1>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {currentStep}/10
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {currentStep <= 10 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-1 bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Step 1: Goal Selection */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Currículo otimizado por IA
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Qual seu objetivo agora?
              </h2>
              <p className="text-lg text-gray-600 text-balance">
                Isso nos ajuda a personalizar seu currículo para o momento certo
                da sua carreira.
              </p>
            </div>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <Card
                  key={goal.id}
                  className={cn(
                    'p-6 cursor-pointer transition-all hover:shadow-md border-2',
                    selectedGoal === goal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setSelectedGoal(goal.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'p-3 rounded-lg',
                        goal.color === 'blue' && 'bg-blue-100',
                        goal.color === 'pink' && 'bg-pink-100',
                        goal.color === 'green' && 'bg-green-100',
                        goal.color === 'orange' && 'bg-orange-100'
                      )}
                    >
                      <goal.icon
                        className={cn(
                          'h-6 w-6',
                          goal.color === 'blue' && 'text-blue-600',
                          goal.color === 'pink' && 'text-pink-600',
                          goal.color === 'green' && 'text-green-600',
                          goal.color === 'orange' && 'text-orange-600'
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {goal.title}
                      </h3>
                      <p className="text-sm text-gray-600">{goal.subtitle}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center text-sm text-blue-600 font-medium">
              +2.300 currículos gerados essa semana
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canContinue()}
                className="px-8"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: CV Sending Frequency */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Send className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Quantos currículos você envia por semana?
              </h2>
              <p className="text-lg text-gray-600 text-balance">
                Isso nos ajuda a entender seu momento na busca por emprego.
              </p>
            </div>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvOptions.map((option) => (
                <Card
                  key={option.id}
                  className={cn(
                    'p-6 cursor-pointer transition-all hover:shadow-md border-2',
                    cvsSent === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setCvsSent(option.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{option.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600">{option.subtitle}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canContinue()}
                className="px-8"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Getting Interviews */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Você está recebendo entrevistas?
              </h2>
              <p className="text-lg text-gray-600 text-balance">
                Seja honesto — isso nos ajuda a personalizar a solução.
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <Card
                className={cn(
                  'p-6 cursor-pointer transition-all hover:shadow-md border-2',
                  gettingInterviews === 'yes'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => {
                  setGettingInterviews('yes')
                  setShowProblemSolution(true)
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Sim, mas poucas
                    </h3>
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  'p-6 cursor-pointer transition-all hover:shadow-md border-2',
                  gettingInterviews === 'no'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => {
                  setGettingInterviews('no')
                  setShowProblemSolution(true)
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Não, quase nenhuma
                    </h3>
                  </div>
                </div>
              </Card>
            </div>

            {showProblemSolution && (
              <div className="max-w-2xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-6 bg-red-50 border-2 border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">
                        O problema
                      </h4>
                      <p className="text-sm text-red-800">
                        75% dos currículos são descartados por robôs (ATS) antes
                        de um recrutador ver. Esses sistemas buscam
                        palavras-chave específicas e formatação correta.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-green-50 border-2 border-green-200">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">
                        A solução
                      </h4>
                      <p className="text-sm text-green-800">
                        Nossa IA analisa a vaga e otimiza seu currículo para
                        passar pelos filtros automáticos e chegar na mão do
                        recrutador.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="text-center">
                  <Button size="lg" onClick={handleNext} className="px-8">
                    Sim, vamos resolver isso!
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Personal Information */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold text-gray-900">
                Suas Informações
              </h2>
              <p className="text-lg text-gray-600">
                Mantenha seu perfil atualizado para obter os melhores
                resultados.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {/* Import Option */}
              <Card className="p-6 border-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Upload className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Importar Dados
                      </h3>
                      <p className="text-sm text-gray-600">
                        Substitua seus dados via LinkedIn ou PDF
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Importar do LinkedIn ou PDF
                  </Button>
                </div>
              </Card>

              {/* Personal Data Form */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      Dados Pessoais
                    </h3>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      Nome Completo
                    </label>
                    <Input
                      placeholder="Ex: João Silva Santos"
                      value={personalData.name}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="Ex: joao.silva@email.com"
                      value={personalData.email}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        Telefone
                      </label>
                      <Input
                        placeholder="Ex: (85) 98855-9999"
                        value={personalData.phone}
                        onChange={(e) =>
                          setPersonalData({ ...personalData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        Localização
                      </label>
                      <Input
                        placeholder="Ex: Fortaleza, CE"
                        value={personalData.location}
                        onChange={(e) =>
                          setPersonalData({
                            ...personalData,
                            location: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      Resumo Profissional
                    </label>
                    <Textarea
                      placeholder="Ex: Desenvolvedor com 5 anos de experiência em projetos web, especializado em React e Node.js. Foco em soluções escaláveis e trabalho em equipe ágil."
                      rows={4}
                      className="resize-none"
                      value={personalData.professionalSummary}
                      onChange={(e) =>
                        setPersonalData({ ...personalData, professionalSummary: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Card>

              {personalData.name && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>O nome completo é obrigatório.</span>
                </div>
              )}

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!canContinue()}
                  className="px-8"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Dream Job Description */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold text-gray-900">
                A Vaga dos Sonhos
              </h2>
              <p className="text-lg text-gray-600 text-balance">
                Cole a descrição completa da vaga. A IA vai adaptar seu currículo
                para dar match nela.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              <Textarea
                placeholder="Ex: Desenvolvedor Fullstack Pleno&#10;&#10;Responsabilidades:&#10;• Desenvolver e manter aplicações web usando React e Node.js&#10;• Participar de code reviews e mentorias&#10;• Trabalhar com metodologias ágeis (Scrum)&#10;&#10;Requisitos:&#10;• 3+ anos de experiência com JavaScript/TypeScript&#10;• Conhecimento em bancos de dados SQL&#10;• Experiência com Git e Docker"
                rows={12}
                className="resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />

              <details className="group">
                <summary className="flex items-center gap-2 text-blue-600 cursor-pointer text-sm font-medium hover:text-blue-700">
                  <Sparkles className="h-4 w-4" />
                  Não tem uma vaga específica? Use um modelo
                </summary>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700">
                  <p className="font-medium mb-2">Dica de Ouro:</p>
                  <p>
                    Quanto mais detalhes você fornecer sobre a vaga
                    (responsabilidades, requisitos, tecnologias), melhor a IA
                    conseguirá destacar suas experiências relevantes.
                  </p>
                </div>
              </details>

              <div className="text-center">
                <Button size="lg" onClick={handleNext} className="px-8">
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Analysis & Focus Selection */}
        {currentStep === 6 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-6 bg-blue-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-3">
                    Análise da Vaga
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-blue-800">
                        Encontramos 12 palavras-chave na vaga
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-blue-800">
                        Seu perfil tem 73% de compatibilidade
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-blue-800">
                        3 experiências podem ser destacadas
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-100 rounded-lg flex items-start gap-2">
                <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 font-medium">
                  Ótimo! A IA identificou oportunidades de melhoria.
                </p>
              </div>
            </Card>

            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-gray-900">
                O que você quer destacar?
              </h2>
              <p className="text-lg text-gray-600">
                Escolha o foco principal do seu currículo
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {focusOptions.map((option) => (
                <Card
                  key={option.id}
                  className={cn(
                    'p-6 cursor-pointer transition-all hover:shadow-md border-2',
                    selectedFocus === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                  onClick={() => setSelectedFocus(option.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <option.icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600">{option.subtitle}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canContinue()}
                className="px-8"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 7: Template Selection */}
        {currentStep === 7 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-bold text-gray-900">
                Escolha o Modelo
              </h2>
              <p className="text-lg text-gray-600">
                Selecione o layout que melhor destaca sua experiência.
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg border-2 overflow-hidden',
                  selectedTemplate === 'modern'
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setSelectedTemplate('modern')}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-white p-6">
                  <div className="w-full h-full border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-blue-400 mx-auto mb-3" />
                      <div className="text-sm font-medium text-gray-600">
                        Prévia Moderna
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Moderno
                      </h3>
                      <p className="text-sm text-gray-600">
                        Limpo e direto. Layout alinhado à esquerda. Perfeito para
                        tecnologia e startups.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg border-2 overflow-hidden',
                  selectedTemplate === 'classic'
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                )}
                onClick={() => setSelectedTemplate('classic')}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-white p-6">
                  <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                      <div className="text-sm font-medium text-gray-600">
                        Prévia Clássica
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Briefcase className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Clássico
                      </h3>
                      <p className="text-sm text-gray-600">
                        Elegante e tradicional. Ideal para áreas jurídicas e
                        corporativas.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!canContinue()}
                className="px-8"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 8: Processing */}
        {currentStep === 8 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Aguarde enquanto nossa IA trabalha...
              </h2>
              <p className="text-lg text-gray-600">
                Estamos otimizando seu currículo para máxima eficiência
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-3">
              {processingSteps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg transition-all duration-500',
                    processingStep > index
                      ? 'bg-green-50 border border-green-200'
                      : processingStep === index
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 border border-gray-200'
                  )}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                      processingStep > index
                        ? 'bg-green-500'
                        : processingStep === index
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                    )}
                  >
                    {processingStep > index ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <step.icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'font-medium transition-colors',
                      processingStep > index
                        ? 'text-green-900'
                        : processingStep === index
                          ? 'text-blue-900'
                          : 'text-gray-500'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 9: CV Preview Locked */}
        {currentStep === 9 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Seu currículo está pronto!
              </h2>
              <p className="text-lg text-gray-600">
                A IA otimizou seu CV para a vaga. Veja uma prévia abaixo.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {/* CV Preview - Blurred and Locked */}
              {generatedCV && (
                <div className="relative">
                  <Card className="p-6 bg-white border-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">
                          Prévia do Currículo
                        </h3>
                      </div>
                      <span className="text-sm text-green-600 font-medium">
                        Otimizado para ATS
                      </span>
                    </div>
                    
                    {/* Blurred CV Preview */}
                    <div 
                      className="border rounded-lg p-8 bg-gray-50 max-h-[400px] overflow-hidden blur-sm select-none pointer-events-none"
                      dangerouslySetInnerHTML={{ __html: generatedCV }}
                    />
                  </Card>

                  {/* Lock Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Card className="p-8 text-center shadow-2xl pointer-events-auto max-w-md">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Versão Completa Bloqueada
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Finalize o pedido para baixar seu currículo otimizado em PDF.
                      </p>
                      <Button
                        size="lg"
                        onClick={handleNext}
                        className="w-full"
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Clique em "Continuar" para desbloquear
                      </Button>
                    </Card>
                  </div>
                </div>
              )}

              <div className="text-center mt-8">
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="px-12"
                >
                  Desbloquear Currículo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 10: Pricing Plans */}
        {currentStep === 10 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
              <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ÚLTIMA ETAPA
              </div>
              <h2 className="text-4xl font-bold text-gray-900">
                Escolha seu pacote
              </h2>
              <p className="text-lg text-gray-600">
                Pague uma vez, use quando quiser. Sem assinaturas.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    M
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    C
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    A
                  </div>
                </div>
                <span className="font-semibold">47+ pessoas geraram CV hoje</span>
                <span>⭐</span>
                <span className="font-semibold">4.8</span>
                <span className="text-gray-500">(2.300+ avaliações)</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {/* Plan 1: Single CV */}
              <Card 
                className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => console.log('[v0] Selected: 1 CV')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">1 Currículo</h3>
                      <p className="text-sm text-gray-600">Para testar o serviço</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">R$ 4,90</div>
                  </div>
                </div>
              </Card>

              {/* Plan 2: 10 CVs (Most Popular) */}
              <Card 
                className="p-6 border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                onClick={() => console.log('[v0] Selected: 10 CVs')}
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MAIS POPULAR
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center mt-1 bg-blue-500">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">10 Currículos</h3>
                      <p className="text-sm text-green-600 font-semibold">
                        R$ 1,99/CV • Economize 60%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">R$ 19,90</div>
                  </div>
                </div>
              </Card>

              {/* Plan 3: 50 CVs */}
              <Card 
                className="p-6 border-2 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => console.log('[v0] Selected: 50 CVs')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mt-1"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">50 Currículos</h3>
                      <p className="text-sm text-green-600 font-semibold">
                        R$ 1,00/CV • Economize 80%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">R$ 49,90</div>
                  </div>
                </div>
              </Card>

              {/* What's Included */}
              <Card className="p-6 bg-gray-50 border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 text-center">
                  O QUE ESTÁ INCLUSO:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">CV 100% otimizado para cada vaga</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Download em PDF profissional</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Análise de compatibilidade com IA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Escolha entre 2 modelos (Moderno/Clássico)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Palavras-chave destacadas automaticamente</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Suporte prioritário</span>
                  </div>
                </div>
              </Card>

              {/* CTA Button */}
              <div className="text-center pt-4">
                <Button
                  size="lg"
                  className="px-16 py-6 text-lg"
                  onClick={() => {
                    console.log('[v0] Processing payment...')
                    downloadCV()
                  }}
                >
                  Baixar Currículo
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                  Pagamento seguro • Garantia de 7 dias • Sem renovação automática
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
