'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, UserButton } from "@clerk/nextjs"
import { 
  ArrowLeft, Sparkles, Briefcase, FileText, Plus, 
  ChevronRight, Download, Trash2, CheckCircle2,
  Phone, Mail, Linkedin, MapPin, Star, GraduationCap, Languages, 
  Award, AlertCircle, Loader2, Eye, EyeOff, Zap, Target,
  TrendingUp, Shield, Clock, Users
} from 'lucide-react'

// Tipos
interface DadosCV {
  nome: string
  cargo: string
  tel: string
  email: string
  cidade: string
  linkedin: string
  resumo: string
  exp: string
  estudos: string
  skills: string
  cursos: string
  idiomas: string
  cnh: string
  disponibilidade: string
  vagaTexto: string
}

interface Validacao {
  valido: boolean
  mensagem?: string
}

// Constantes
const ETAPAS_LABELS = [
  'Bem-vindo',
  'Dados Pessoais',
  'Contatos',
  'Descrição da Vaga',
  'Resumo Profissional',
  'Experiência',
  'Formação',
  'Habilidades',
  'Cursos & Certificações',
  'Idiomas',
  'Informações Adicionais'
]

const DADOS_INICIAIS: DadosCV = {
  nome: '',
  cargo: '',
  tel: '',
  email: '',
  cidade: '',
  linkedin: '',
  resumo: '',
  exp: '',
  estudos: '',
  skills: '',
  cursos: '',
  idiomas: '',
  cnh: 'Não Possuo',
  disponibilidade: '',
  vagaTexto: ''
}

export default function GeradorCV() {
  const { user, isLoaded } = useUser()
  const [fluxo, setFluxo] = useState(0)
  const [gerandoIA, setGerandoIA] = useState(false)
  const [dados, setDados] = useState<DadosCV>(DADOS_INICIAIS)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [mostrarPreview, setMostrarPreview] = useState(true)
  const [salvandoAutomaticamente, setSalvandoAutomaticamente] = useState(false)

  // Carregar dados salvos
  useEffect(() => {
    try {
      const salvo = localStorage.getItem('cv_premium_data')
      if (salvo) {
        const dadosParsed = JSON.parse(salvo)
        setDados(dadosParsed)
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error)
    }
  }, [])

  // Salvar automaticamente (debounced)
  useEffect(() => {
    if (fluxo >= 0 && fluxo <= 10) {
      setSalvandoAutomaticamente(true)
      const timer = setTimeout(() => {
        try {
          localStorage.setItem('cv_premium_data', JSON.stringify(dados))
          setSalvandoAutomaticamente(false)
        } catch (error) {
          console.error('Erro ao salvar dados:', error)
          setSalvandoAutomaticamente(false)
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [dados, fluxo])

  // Função de atualização de dados com callback
  const atualizarDados = useCallback((novos: Partial<DadosCV>) => {
    setDados(prev => ({ ...prev, ...novos }))
    const campo = Object.keys(novos)[0]
    if (campo && erros[campo]) {
      setErros(prev => {
        const newErros = { ...prev }
        delete newErros[campo]
        return newErros
      })
    }
  }, [erros])

  // Validações por etapa
  const validarEtapa = useCallback((etapa: number): Validacao => {
    const errosTemp: Record<string, string> = {}

    switch (etapa) {
      case 1:
        if (!dados.nome.trim()) errosTemp.nome = 'Nome é obrigatório'
        if (!dados.cargo.trim()) errosTemp.cargo = 'Cargo desejado é obrigatório'
        break
      case 2:
        if (!dados.email.trim()) {
          errosTemp.email = 'E-mail é obrigatório'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
          errosTemp.email = 'E-mail inválido'
        }
        if (!dados.tel.trim()) errosTemp.tel = 'Telefone é obrigatório'
        if (!dados.cidade.trim()) errosTemp.cidade = 'Cidade é obrigatória'
        break
      case 3:
        if (!dados.vagaTexto.trim()) {
          errosTemp.vagaTexto = 'Descrição da vaga é obrigatória para otimizar com IA'
        } else if (dados.vagaTexto.length < 100) {
          errosTemp.vagaTexto = 'Por favor, adicione mais detalhes sobre a vaga (mínimo 100 caracteres)'
        }
        break
      case 4:
        if (!dados.resumo.trim()) errosTemp.resumo = 'Resumo profissional é obrigatório'
        if (dados.resumo.length < 80) errosTemp.resumo = 'Resumo muito curto (mínimo 80 caracteres)'
        break
      case 5:
        if (!dados.exp.trim()) errosTemp.exp = 'Experiência profissional é obrigatória'
        break
      case 6:
        if (!dados.estudos.trim()) errosTemp.estudos = 'Formação acadêmica é obrigatória'
        break
      case 7:
        if (!dados.skills.trim()) errosTemp.skills = 'Habilidades são obrigatórias'
        break
    }

    setErros(errosTemp)
    return {
      valido: Object.keys(errosTemp).length === 0,
      mensagem: Object.values(errosTemp)[0]
    }
  }, [dados])

  // Avançar etapa com validação
  const avancarEtapa = useCallback(() => {
    if (fluxo === 0) {
      setFluxo(1)
      return
    }

    const validacao = validarEtapa(fluxo)
    if (!validacao.valido) {
      alert(validacao.mensagem || 'Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (fluxo === 10) {
      setFluxo(11)
    } else {
      setFluxo(prev => prev + 1)
    }
  }, [fluxo, validarEtapa])

  // Otimizar com IA - VERSÃO PROFISSIONAL COMPLETA
  const otimizarComIA = async () => {
    if (!dados.vagaTexto.trim()) {
      alert("Por favor, preencha a descrição da vaga no Passo 3 para a IA otimizar seu currículo!")
      return
    }

    setGerandoIA(true)
    try {
      const response = await fetch('/api/gerar-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dados }),
      })

      if (!response.ok) {
        throw new Error('Erro na resposta da API')
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      // Atualizar dados com versão otimizada
      setDados(prev => ({
        ...prev,
        resumo: result.resumo || prev.resumo,
        exp: result.exp || prev.exp,
        skills: result.skills || prev.skills
      }))

      alert('✨ Currículo otimizado com sucesso! As seções foram personalizadas para a vaga.')
      
    } catch (error) {
      console.error('Erro ao otimizar CV:', error)
      alert('Erro ao otimizar currículo. Tente novamente.')
    } finally {
      setGerandoIA(false)
    }
  }

  // Baixar PDF profissional
  const baixarPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (!printWindow) return

    const cvHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${dados.nome} - Currículo Profissional</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', 'Helvetica', sans-serif; 
            color: #1e293b; 
            line-height: 1.6;
            background: white;
          }
          .container { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 40px; 
          }
          .header { 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .header h1 { 
            font-size: 32px; 
            font-weight: bold; 
            color: #0f172a; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            margin-bottom: 8px;
          }
          .header .cargo { 
            font-size: 18px; 
            color: #2563eb; 
            font-weight: 600; 
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .contact-info { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 20px; 
            margin-top: 15px;
            font-size: 13px;
            color: #64748b;
          }
          .contact-info span { 
            display: flex; 
            align-items: center; 
            gap: 5px; 
          }
          .section { 
            margin-bottom: 25px; 
          }
          .section-title { 
            font-size: 14px; 
            font-weight: bold; 
            text-transform: uppercase; 
            letter-spacing: 3px; 
            background: #f1f5f9; 
            padding: 8px 12px; 
            margin-bottom: 12px;
            color: #0f172a;
          }
          .section-content { 
            font-size: 14px; 
            color: #334155; 
            white-space: pre-wrap; 
            line-height: 1.7;
          }
          .two-column { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
          }
          @media print {
            body { padding: 0; }
            .container { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${dados.nome || 'SEU NOME'}</h1>
            <div class="cargo">${dados.cargo || 'CARGO DESEJADO'}</div>
            <div class="contact-info">
              ${dados.tel ? `<span>📞 ${dados.tel}</span>` : ''}
              ${dados.email ? `<span>✉️ ${dados.email}</span>` : ''}
              ${dados.cidade ? `<span>📍 ${dados.cidade}</span>` : ''}
              ${dados.linkedin ? `<span>💼 LinkedIn</span>` : ''}
            </div>
          </div>

          ${dados.resumo ? `
            <div class="section">
              <div class="section-title">PERFIL PROFISSIONAL</div>
              <div class="section-content">${dados.resumo}</div>
            </div>
          ` : ''}

          ${dados.exp ? `
            <div class="section">
              <div class="section-title">EXPERIÊNCIA PROFISSIONAL</div>
              <div class="section-content">${dados.exp}</div>
            </div>
          ` : ''}

          ${dados.estudos ? `
            <div class="section">
              <div class="section-title">FORMAÇÃO ACADÊMICA</div>
              <div class="section-content">${dados.estudos}</div>
            </div>
          ` : ''}

          <div class="two-column">
            ${dados.skills ? `
              <div class="section">
                <div class="section-title">HABILIDADES</div>
                <div class="section-content">${dados.skills}</div>
              </div>
            ` : ''}

            ${dados.idiomas ? `
              <div class="section">
                <div class="section-title">IDIOMAS</div>
                <div class="section-content">${dados.idiomas}</div>
              </div>
            ` : ''}
          </div>

          ${dados.cursos ? `
            <div class="section">
              <div class="section-title">CURSOS & CERTIFICAÇÕES</div>
              <div class="section-content">${dados.cursos}</div>
            </div>
          ` : ''}

          ${dados.disponibilidade ? `
            <div class="section">
              <div class="section-title">INFORMAÇÕES ADICIONAIS</div>
              <div class="section-content">${dados.disponibilidade}</div>
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `

    printWindow.document.write(cvHTML)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  // Componente de Input
  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    type = 'text', 
    campo, 
    multiline = false,
    rows = 4,
    maxLength,
    dica
  }: any) => (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
        {label}
        {erros[campo] && (
          <span className="text-red-500 text-xs ml-2 normal-case">({erros[campo]})</span>
        )}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange({ [campo]: e.target.value })}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
            erros[campo] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange({ [campo]: e.target.value })}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            erros[campo] ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
          }`}
        />
      )}
      {dica && <p className="text-xs text-slate-500 italic">{dica}</p>}
      {maxLength && (
        <p className="text-xs text-slate-400 text-right">{value.length}/{maxLength} caracteres</p>
      )}
    </div>
  )

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">CV Pro Generator</h1>
              <p className="text-xs text-slate-500 font-semibold">Currículo otimizado por IA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {salvandoAutomaticamente && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Loader2 className="animate-spin" size={14} />
                <span className="hidden sm:inline">Salvando...</span>
              </div>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* PROGRESSO */}
      {fluxo >= 1 && fluxo <= 10 && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Etapa {fluxo} de 10
              </span>
              <span className="text-xs text-slate-400">• {ETAPAS_LABELS[fluxo]}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${(fluxo / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <main className="p-6 md:p-10 min-h-[600px]">
            {/* ETAPA 0 - BEM-VINDO */}
            {fluxo === 0 && (
              <div className="max-w-2xl mx-auto text-center space-y-8 py-12">
                <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl">
                  <Sparkles className="text-white" size={48} />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    Crie um Currículo Que <span className="text-blue-600">Gera Entrevistas</span>
                  </h2>
                  <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
                    Nossa IA analisa a vaga desejada e otimiza seu currículo para passar pelos sistemas de recrutamento (ATS) e impressionar recrutadores.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {[
                    { icon: Target, title: 'Otimizado para ATS', desc: 'Passa pelos sistemas automáticos de triagem' },
                    { icon: Sparkles, title: 'IA Especializada', desc: 'Claude AI otimiza cada seção do seu CV' },
                    { icon: TrendingUp, title: 'Mais Entrevistas', desc: 'Aumente suas chances em até 3x' }
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                      <item.icon className="text-blue-600 mb-3" size={28} />
                      <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setFluxo(1)}
                  className="mt-8 px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Começar Agora
                  <ChevronRight className="inline ml-2" size={24} />
                </button>

                <p className="text-xs text-slate-400 mt-4">
                  ✓ Sem cadastro de cartão • ✓ Dados seguros • ✓ Teste grátis
                </p>
              </div>
            )}

            {/* ETAPA 1 - DADOS PESSOAIS */}
            {fluxo === 1 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Dados Pessoais</h2>
                  <p className="text-slate-600">Informações básicas sobre você</p>
                </div>
                <InputField 
                  label="Nome Completo *"
                  value={dados.nome}
                  onChange={atualizarDados}
                  campo="nome"
                  placeholder="Ex: João Silva Santos"
                  maxLength={100}
                />
                <InputField 
                  label="Cargo Desejado *"
                  value={dados.cargo}
                  onChange={atualizarDados}
                  campo="cargo"
                  placeholder="Ex: Desenvolvedor Full Stack"
                  maxLength={100}
                  dica="Use o cargo exato que aparece na vaga desejada"
                />
              </div>
            )}

            {/* ETAPA 2 - CONTATOS */}
            {fluxo === 2 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Informações de Contato</h2>
                  <p className="text-slate-600">Como recrutadores podem te encontrar</p>
                </div>
                <InputField 
                  label="E-mail Profissional *"
                  value={dados.email}
                  onChange={atualizarDados}
                  campo="email"
                  type="email"
                  placeholder="seu.nome@email.com"
                  dica="Use um e-mail profissional (evite apelidos)"
                />
                <InputField 
                  label="Telefone/WhatsApp *"
                  value={dados.tel}
                  onChange={atualizarDados}
                  campo="tel"
                  placeholder="(11) 99999-9999"
                  maxLength={20}
                />
                <InputField 
                  label="Cidade/Estado *"
                  value={dados.cidade}
                  onChange={atualizarDados}
                  campo="cidade"
                  placeholder="Ex: São Paulo, SP"
                  maxLength={100}
                />
                <InputField 
                  label="LinkedIn (opcional)"
                  value={dados.linkedin}
                  onChange={atualizarDados}
                  campo="linkedin"
                  placeholder="linkedin.com/in/seu-perfil"
                  dica="Adicione seu LinkedIn atualizado"
                />
              </div>
            )}

            {/* ETAPA 3 - DESCRIÇÃO DA VAGA */}
            {fluxo === 3 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-amber-100 rounded-xl mb-4">
                    <Zap className="text-amber-600" size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Descreva a Vaga Desejada</h2>
                  <p className="text-slate-600 max-w-xl mx-auto">
                    Cole aqui a descrição completa da vaga. Quanto mais detalhes, melhor a IA otimizará seu currículo!
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <AlertCircle size={18} className="text-blue-600" />
                    Por que isso é importante?
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Nossa IA analisa as palavras-chave, requisitos e competências da vaga para <strong>personalizar automaticamente</strong> seu currículo. Isso aumenta drasticamente suas chances de passar pelos sistemas ATS e chamar atenção dos recrutadores.
                  </p>
                </div>

                <InputField 
                  label="Descrição Completa da Vaga *"
                  value={dados.vagaTexto}
                  onChange={atualizarDados}
                  campo="vagaTexto"
                  placeholder="Cole aqui a descrição da vaga: requisitos, responsabilidades, qualificações desejadas, tecnologias, etc..."
                  multiline
                  rows={12}
                  maxLength={3000}
                  dica="Inclua: título da vaga, requisitos técnicos, responsabilidades, qualificações, tecnologias e qualquer outro detalhe relevante"
                />
              </div>
            )}

            {/* ETAPA 4 - RESUMO PROFISSIONAL */}
            {fluxo === 4 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Resumo Profissional</h2>
                  <p className="text-slate-600">Apresente-se de forma objetiva e impactante</p>
                </div>
                
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong>💡 Dica:</strong> Foque em suas principais conquistas, anos de experiência e o que te destaca. A IA vai otimizar este texto para a vaga!
                  </p>
                </div>

                <InputField 
                  label="Seu Resumo Profissional *"
                  value={dados.resumo}
                  onChange={atualizarDados}
                  campo="resumo"
                  placeholder="Ex: Profissional com X anos de experiência em [área]. Especialista em [tecnologias/habilidades]. Histórico de [principais conquistas]. Busco oportunidade para [objetivo profissional]..."
                  multiline
                  rows={8}
                  maxLength={800}
                  dica="Escreva entre 80-800 caracteres. Seja específico sobre suas conquistas e diferenciais."
                />
              </div>
            )}

            {/* ETAPA 5 - EXPERIÊNCIA */}
            {fluxo === 5 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Experiência Profissional</h2>
                  <p className="text-slate-600">Liste suas experiências mais relevantes</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    <strong>📋 Formato sugerido para cada experiência:</strong>
                  </p>
                  <pre className="text-xs bg-white p-3 rounded border border-blue-200 overflow-x-auto">
{`Cargo - Nome da Empresa (Período)
• Responsabilidade/conquista com resultado quantificável
• Projeto importante com impacto mensurável
• Tecnologias/ferramentas utilizadas`}
                  </pre>
                </div>

                <InputField 
                  label="Suas Experiências Profissionais *"
                  value={dados.exp}
                  onChange={atualizarDados}
                  campo="exp"
                  placeholder={`Desenvolvedor Full Stack - Tech Company (Jan 2022 - Atual)\n• Desenvolvi sistema que aumentou produtividade em 40%\n• Liderei equipe de 5 desenvolvedores em projeto de migração\n• Tecnologias: React, Node.js, PostgreSQL\n\nDesenvolvedor Jr - Startup XYZ (Jun 2020 - Dez 2021)\n• Implementei features que reduziram bugs em 30%\n• Participei de code reviews e pair programming`}
                  multiline
                  rows={12}
                  maxLength={2000}
                  dica="Liste as 3-5 experiências mais relevantes para a vaga. Foque em resultados e conquistas."
                />
              </div>
            )}

            {/* ETAPA 6 - FORMAÇÃO */}
            {fluxo === 6 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Formação Acadêmica</h2>
                  <p className="text-slate-600">Sua educação formal</p>
                </div>

                <InputField 
                  label="Formação Acadêmica *"
                  value={dados.estudos}
                  onChange={atualizarDados}
                  campo="estudos"
                  placeholder={`Bacharelado em Ciência da Computação\nUniversidade Federal - Concluído em 2020\n\nTécnico em Informática\nETEC - Concluído em 2016`}
                  multiline
                  rows={6}
                  maxLength={1000}
                  dica="Inclua graduação, pós-graduação, cursos técnicos. Liste do mais recente para o mais antigo."
                />
              </div>
            )}

            {/* ETAPA 7 - HABILIDADES */}
            {fluxo === 7 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Habilidades Técnicas</h2>
                  <p className="text-slate-600">Tecnologias, ferramentas e competências</p>
                </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                  <p className="text-sm text-slate-700">
                    <strong>💡 Dica:</strong> Liste as habilidades que você domina e que são relevantes para a vaga. A IA vai reorganizar por relevância!
                  </p>
                </div>

                <InputField 
                  label="Suas Habilidades *"
                  value={dados.skills}
                  onChange={atualizarDados}
                  campo="skills"
                  placeholder={`JavaScript, TypeScript, React, Node.js, Python, SQL, MongoDB, Git, Docker, AWS, Metodologias Ágeis, Scrum`}
                  multiline
                  rows={6}
                  maxLength={800}
                  dica="Separe por vírgulas. Inclua linguagens, frameworks, ferramentas e soft skills."
                />
              </div>
            )}

            {/* ETAPA 8 - CURSOS */}
            {fluxo === 8 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Cursos & Certificações</h2>
                  <p className="text-slate-600">Cursos complementares e certificados relevantes</p>
                </div>

                <InputField 
                  label="Cursos e Certificações (opcional)"
                  value={dados.cursos}
                  onChange={atualizarDados}
                  campo="cursos"
                  placeholder={`AWS Certified Developer - Amazon (2023)\nReact Avançado - Udemy (2022)\nScrum Master - Scrum.org (2021)`}
                  multiline
                  rows={6}
                  maxLength={1000}
                  dica="Liste certificações oficiais e cursos relevantes para a área"
                />
              </div>
            )}

            {/* ETAPA 9 - IDIOMAS */}
            {fluxo === 9 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Idiomas</h2>
                  <p className="text-slate-600">Quais idiomas você fala?</p>
                </div>

                <InputField 
                  label="Idiomas (opcional)"
                  value={dados.idiomas}
                  onChange={atualizarDados}
                  campo="idiomas"
                  placeholder={`Português - Nativo\nInglês - Avançado (C1)\nEspanhol - Intermediário (B1)`}
                  multiline
                  rows={4}
                  maxLength={500}
                  dica="Indique o nível: Básico, Intermediário, Avançado ou Fluente"
                />
              </div>
            )}

            {/* ETAPA 10 - INFORMAÇÕES ADICIONAIS */}
            {fluxo === 10 && (
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Informações Adicionais</h2>
                  <p className="text-slate-600">Última etapa!</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                    CNH (Carteira de Motorista)
                  </label>
                  <select
                    value={dados.cnh}
                    onChange={(e) => atualizarDados({ cnh: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option>Não Possuo</option>
                    <option>Categoria A</option>
                    <option>Categoria B</option>
                    <option>Categoria AB</option>
                    <option>Categoria C</option>
                    <option>Categoria D</option>
                    <option>Categoria E</option>
                  </select>
                </div>

                <InputField 
                  label="Disponibilidade e Outras Informações (opcional)"
                  value={dados.disponibilidade}
                  onChange={atualizarDados}
                  campo="disponibilidade"
                  placeholder={`Disponibilidade: Imediata\nDisponível para home office e/ou presencial\nDisponível para viagens`}
                  multiline
                  rows={4}
                  maxLength={500}
                  dica="Informe sua disponibilidade de horário, viagens, mudança de cidade, etc."
                />
              </div>
            )}

            {/* ETAPA 11 - PREVIEW FINAL */}
            {fluxo === 11 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-block p-3 bg-green-100 rounded-xl mb-4">
                    <CheckCircle2 className="text-green-600" size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Seu Currículo Está Pronto!</h2>
                  <p className="text-slate-600">Revise e otimize com IA antes de baixar</p>
                </div>

                {/* Preview do CV */}
                {mostrarPreview && (
                  <div className="bg-white border-2 border-slate-200 rounded-xl p-8 md:p-12 shadow-lg">
                    {/* Cabeçalho CV */}
                    <div className="border-b-4 border-blue-600 pb-6 mb-8">
                      <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-2">
                        {dados.nome || 'SEU NOME'}
                      </h1>
                      <p className="text-xl text-blue-600 font-bold uppercase tracking-widest">
                        {dados.cargo || 'CARGO DESEJADO'}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                        {dados.tel && <span className="flex items-center gap-1"><Phone size={14}/>{dados.tel}</span>}
                        {dados.email && <span className="flex items-center gap-1"><Mail size={14}/>{dados.email}</span>}
                        {dados.cidade && <span className="flex items-center gap-1"><MapPin size={14}/>{dados.cidade}</span>}
                        {dados.linkedin && <span className="flex items-center gap-1"><Linkedin size={14}/>LinkedIn</span>}
                      </div>
                    </div>

                    {/* Conteúdo CV */}
                    <div className="space-y-8">
                      {dados.resumo && (
                        <section>
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-2 inline-block mb-3">
                            Perfil Profissional
                          </h3>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{dados.resumo}</p>
                        </section>
                      )}
                      
                      {dados.exp && (
                        <section>
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-2 inline-block mb-3 flex items-center gap-2">
                            <Briefcase size={12}/>Experiência Profissional
                          </h3>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{dados.exp}</p>
                        </section>
                      )}
                      
                      {dados.estudos && (
                        <section>
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-2 inline-block mb-3 flex items-center gap-2">
                            <GraduationCap size={12}/>Formação Acadêmica
                          </h3>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{dados.estudos}</p>
                        </section>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {dados.skills && (
                          <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-2 inline-block mb-3">
                              Habilidades
                            </h3>
                            <p className="text-slate-700 leading-relaxed text-sm">{dados.skills}</p>
                          </section>
                        )}
                        
                        {dados.idiomas && (
                          <section>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-2 inline-block mb-3 flex items-center gap-2">
                              <Languages size={12}/>Idiomas
                            </h3>
                            <p className="text-slate-700 leading-relaxed text-sm">{dados.idiomas}</p>
                          </section>
                        )}
                      </div>

                      {dados.cursos && (
                        <section>
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-2 inline-block mb-3 flex items-center gap-2">
                            <Award size={12}/>Cursos & Certificações
                          </h3>
                          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{dados.cursos}</p>
                        </section>
                      )}

                      {dados.disponibilidade && (
                        <section>
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-2 inline-block mb-3">
                            Informações Adicionais
                          </h3>
                          <p className="text-slate-700 leading-relaxed text-sm">{dados.disponibilidade}</p>
                        </section>
                      )}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <button 
                    onClick={otimizarComIA} 
                    disabled={gerandoIA || !dados.vagaTexto.trim()}
                    className="py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl font-black uppercase tracking-wide shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  >
                    {gerandoIA ? (
                      <>
                        <Loader2 className="animate-spin" size={24}/>
                        Otimizando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles size={24}/>
                        Otimizar com IA
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={baixarPDF}
                    className="py-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-wide flex items-center justify-center gap-3 transition-all shadow-xl hover:scale-105 active:scale-95"
                  >
                    <Download size={22}/>
                    Baixar PDF
                  </button>
                </div>

                {!dados.vagaTexto.trim() && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20}/>
                    <p className="text-sm text-amber-900">
                      <strong>Atenção:</strong> Você não preencheu a descrição da vaga na Etapa 3. 
                      <button 
                        onClick={() => setFluxo(3)} 
                        className="underline font-bold ml-1 hover:text-amber-700"
                      >
                        Clique aqui para adicionar
                      </button> e habilitar a otimização por IA.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* FOOTER - NAVEGAÇÃO */}
          {fluxo >= 1 && fluxo <= 10 && (
            <footer className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button 
                onClick={() => setFluxo(prev => Math.max(0, prev - 1))} 
                className="flex items-center gap-2 text-slate-500 font-bold uppercase text-xs tracking-wider hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={18}/>
                Anterior
              </button>
              <button 
                onClick={avancarEtapa}
                className="px-10 py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-black uppercase text-sm tracking-wider shadow-lg transition-all flex items-center gap-3 hover:scale-105 active:scale-95"
              >
                {fluxo === 10 ? "Ver Currículo Final" : "Próxima Etapa"} 
                <ChevronRight size={20}/>
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
