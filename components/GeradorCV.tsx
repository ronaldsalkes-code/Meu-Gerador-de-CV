'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, UserButton } from "@clerk/nextjs"
import { 
  ArrowLeft, Sparkles, Briefcase, FileText, Lock, Plus, 
  ChevronRight, Download, Trash2, LayoutDashboard, CheckCircle2,
  Phone, Mail, Linkedin, MapPin, Star, GraduationCap, Languages, 
  Award, AlertCircle, Loader2, Eye, EyeOff
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
  'Resumo',
  'Experiência',
  'Formação',
  'Habilidades',
  'Cursos',
  'Idiomas',
  'Disponibilidade'
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
  const [fluxo, setFluxo] = useState(12)
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
    // Limpar erro do campo atualizado
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
        if (!dados.cargo.trim()) errosTemp.cargo = 'Cargo é obrigatório'
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
      case 4:
        if (!dados.resumo.trim()) errosTemp.resumo = 'Resumo é obrigatório'
        if (dados.resumo.length < 50) errosTemp.resumo = 'Resumo muito curto (mínimo 50 caracteres)'
        break
      case 5:
        if (!dados.exp.trim()) errosTemp.exp = 'Experiência é obrigatória'
        break
      case 6:
        if (!dados.estudos.trim()) errosTemp.estudos = 'Formação é obrigatória'
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

  // Otimizar com IA
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
      
      atualizarDados({ 
        resumo: result.resumo || dados.resumo, 
        exp: result.exp || dados.exp, 
        skills: result.skills || dados.skills 
      })

      alert("✨ IA finalizou a otimização! Seu currículo foi personalizado para a vaga.")
    } catch (error) {
      console.error('Erro ao otimizar com IA:', error)
      alert("❌ Erro ao conectar com a IA. Tente novamente em alguns instantes.")
    } finally {
      setGerandoIA(false)
    }
  }

  // Baixar PDF
  const baixarPDF = () => {
    // Implementar integração com biblioteca de PDF
    alert("Funcionalidade de download PDF em desenvolvimento. Você será redirecionado ao pagamento.")
    setFluxo(13)
  }

  // Resetar currículo
  const resetarCurriculo = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      setDados(DADOS_INICIAIS)
      localStorage.removeItem('cv_premium_data')
      setFluxo(12)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* HEADER */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl text-white shadow-lg">
            <Briefcase size={22} />
          </div>
          <span className="font-black text-lg md:text-xl tracking-tighter uppercase italic">
            CV MASTER <span className="text-blue-600">PRO</span>
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          {salvandoAutomaticamente && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <Loader2 size={14} className="animate-spin" />
              <span>Salvando...</span>
            </div>
          )}
          <button 
            onClick={() => setFluxo(12)} 
            className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors"
          >
            <LayoutDashboard size={16}/> 
            <span className="hidden md:inline">Painel</span>
          </button>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center p-4 md:p-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl md:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[600px] md:min-h-[750px] relative">
          
          {/* PROGRESS BAR */}
          {fluxo >= 0 && fluxo <= 10 && (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 z-10">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-700 ease-out" 
                style={{width: `${((fluxo) / 10) * 100}%`}}
              />
            </div>
          )}

          <main className="flex-1 p-6 md:p-16 overflow-y-auto">
            
            {/* DASHBOARD */}
            {fluxo === 12 && (
              <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-700">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
                    Olá, {user?.firstName || 'Profissional'}! 👋
                  </h2>
                  <p className="text-slate-400 text-base md:text-lg font-medium italic">
                    Seu próximo salto profissional começa aqui.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <button 
                    onClick={() => setFluxo(0)} 
                    className="group bg-slate-900 hover:bg-blue-600 p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] text-left transition-all duration-500 shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1"
                  >
                    <Plus size={36} className="text-blue-400 mb-4 md:mb-6 group-hover:text-white transition-all group-hover:rotate-90" />
                    <div className="font-bold text-white text-xl md:text-2xl uppercase">Novo Currículo</div>
                    <p className="text-slate-400 group-hover:text-blue-100 text-sm mt-3 font-medium">
                      Criação guiada por IA para alta performance.
                    </p>
                  </button>
                  
                  <button 
                    onClick={() => setFluxo(11)} 
                    className="group bg-white border-2 border-slate-100 hover:border-blue-600 p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] text-left transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
                  >
                    <FileText size={36} className="text-slate-300 mb-4 md:mb-6 group-hover:text-blue-600 transition-all" />
                    <div className="font-bold text-slate-800 text-xl md:text-2xl uppercase">Ver Rascunho</div>
                    <p className="text-slate-400 text-sm mt-3 font-medium">
                      Continue editando de onde parou.
                    </p>
                  </button>
                </div>

                {dados.nome && (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
                    <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">Currículo Salvo</h3>
                      <p className="text-blue-700 text-sm">
                        Você tem um rascunho salvo para <strong>{dados.cargo || 'uma vaga'}</strong>.
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={resetarCurriculo}
                  className="text-slate-400 hover:text-red-500 font-medium text-sm flex items-center gap-2 mx-auto transition-colors"
                >
                  <Trash2 size={16} />
                  Limpar todos os dados
                </button>
              </div>
            )}

            {/* FORMULÁRIO (ETAPAS 0-10) */}
            {fluxo >= 0 && fluxo <= 10 && (
              <div className="max-w-2xl mx-auto space-y-8 md:space-y-10 animate-in slide-in-from-right-8 duration-500">
                
                <header className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Etapa {fluxo + 1} de 11 • {ETAPAS_LABELS[fluxo]}
                  </span>
                  {fluxo > 0 && (
                    <button
                      onClick={() => setFluxo(12)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-wider"
                    >
                      Sair
                    </button>
                  )}
                </header>

                {/* Etapa 0 - Boas-vindas */}
                {fluxo === 0 && (
                  <div className="text-center py-12 space-y-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="text-blue-600" size={40} />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                        Vamos criar algo épico? 🚀
                      </h2>
                      <p className="text-slate-500 text-base md:text-lg max-w-md mx-auto">
                        Em poucos minutos, você terá um currículo profissional otimizado por IA.
                      </p>
                    </div>
                    <button 
                      onClick={() => setFluxo(1)} 
                      className="px-12 md:px-16 py-5 md:py-6 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
                    >
                      Iniciar Agora
                    </button>
                  </div>
                )}
                
                {/* Etapa 1 - Dados Pessoais */}
                {fluxo === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Informações Pessoais</h3>
                      <p className="text-slate-500 text-sm">Como você gostaria de ser apresentado?</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <input 
                          className={`w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 font-bold text-lg border-2 transition-all ${
                            erros.nome ? 'border-red-300 bg-red-50' : 'border-transparent'
                          }`}
                          placeholder="Nome Completo *" 
                          value={dados.nome} 
                          onChange={e => atualizarDados({nome: e.target.value})}
                        />
                        {erros.nome && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {erros.nome}
                          </p>
                        )}
                      </div>
                      <div>
                        <input 
                          className={`w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 font-bold text-lg border-2 transition-all ${
                            erros.cargo ? 'border-red-300 bg-red-50' : 'border-transparent'
                          }`}
                          placeholder="Cargo Desejado *" 
                          value={dados.cargo} 
                          onChange={e => atualizarDados({cargo: e.target.value})}
                        />
                        {erros.cargo && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {erros.cargo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Etapa 2 - Contatos */}
                {fluxo === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Canais de Contato</h3>
                      <p className="text-slate-500 text-sm">Como os recrutadores podem te encontrar?</p>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input 
                            className={`w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none font-bold border-2 transition-all focus:ring-4 ring-blue-500/10 ${
                              erros.email ? 'border-red-300 bg-red-50' : 'border-transparent'
                            }`}
                            type="email"
                            placeholder="E-mail *" 
                            value={dados.email} 
                            onChange={e => atualizarDados({email: e.target.value})}
                          />
                          {erros.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {erros.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <input 
                            className={`w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none font-bold border-2 transition-all focus:ring-4 ring-blue-500/10 ${
                              erros.tel ? 'border-red-300 bg-red-50' : 'border-transparent'
                            }`}
                            placeholder="WhatsApp *" 
                            value={dados.tel} 
                            onChange={e => atualizarDados({tel: e.target.value})}
                          />
                          {erros.tel && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {erros.tel}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <input 
                          className={`w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none font-bold border-2 transition-all focus:ring-4 ring-blue-500/10 ${
                            erros.cidade ? 'border-red-300 bg-red-50' : 'border-transparent'
                          }`}
                          placeholder="Cidade/Estado *" 
                          value={dados.cidade} 
                          onChange={e => atualizarDados({cidade: e.target.value})}
                        />
                        {erros.cidade && (
                          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                            <AlertCircle size={14} />
                            {erros.cidade}
                          </p>
                        )}
                      </div>
                      <input 
                        className="w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-transparent focus:ring-4 ring-blue-500/10"
                        placeholder="Link do LinkedIn (opcional)" 
                        value={dados.linkedin} 
                        onChange={e => atualizarDados({linkedin: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                {/* Etapa 3 - Descrição da Vaga */}
                {fluxo === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black text-blue-600 italic flex items-center gap-3">
                        <Sparkles size={32} />
                        O Alvo da IA
                      </h3>
                      <p className="text-slate-500 font-medium">
                        Cole aqui os requisitos da vaga para a IA personalizar seu currículo de forma cirúrgica.
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                      <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                      <p className="text-blue-900 text-sm">
                        <strong>Dica:</strong> Quanto mais detalhes da vaga você fornecer, melhor será a otimização!
                      </p>
                    </div>
                    <textarea 
                      className="w-full h-64 md:h-80 p-6 md:p-8 bg-slate-50 rounded-3xl outline-none font-medium border-2 border-transparent focus:ring-4 ring-blue-500/10 text-slate-700 resize-none" 
                      placeholder="Cole aqui a descrição completa da vaga (requisitos, responsabilidades, competências desejadas...)&#10;&#10;Exemplo:&#10;Buscamos profissional com experiência em vendas B2B, domínio de CRM, capacidade analítica e foco em resultados..."
                      value={dados.vagaTexto} 
                      onChange={e => atualizarDados({vagaTexto: e.target.value})}
                    />
                    <p className="text-xs text-slate-400 text-center">
                      {dados.vagaTexto.length} caracteres • {dados.vagaTexto ? 'Ótimo!' : 'Aguardando descrição'}
                    </p>
                  </div>
                )}

                {/* Etapa 4 - Resumo */}
                {fluxo === 4 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Resumo Profissional</h3>
                      <p className="text-slate-500 text-sm">
                        Conte sua história profissional em 3-5 linhas. Foque em resultados e diferenciais.
                      </p>
                    </div>
                    <div>
                      <textarea 
                        className={`w-full h-64 p-6 md:p-8 bg-slate-50 rounded-3xl outline-none font-medium border-2 resize-none transition-all focus:ring-4 ring-blue-500/10 ${
                          erros.resumo ? 'border-red-300 bg-red-50' : 'border-transparent'
                        }`}
                        placeholder="Exemplo:&#10;&#10;Profissional com 5+ anos em gestão comercial, especializado em expansão de mercado B2B. Histórico comprovado de aumento de 40% em receita através de estratégias consultivas. Expertise em negociação, liderança de equipes e análise de KPIs..."
                        value={dados.resumo} 
                        onChange={e => atualizarDados({resumo: e.target.value})}
                      />
                      {erros.resumo && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {erros.resumo}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">
                        {dados.resumo.length}/500 caracteres • Mínimo recomendado: 50
                      </p>
                    </div>
                  </div>
                )}

                {/* Etapa 5 - Experiência */}
                {fluxo === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Experiência Profissional</h3>
                      <p className="text-slate-500 text-sm">
                        Liste suas experiências mais relevantes, começando pela mais recente.
                      </p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                      <p className="text-amber-900 text-sm">
                        <strong>Estrutura sugerida:</strong><br/>
                        Empresa | Cargo | Período<br/>
                        • Principais responsabilidades e conquistas (use números quando possível)
                      </p>
                    </div>
                    <div>
                      <textarea 
                        className={`w-full h-64 md:h-80 p-6 md:p-8 bg-slate-50 rounded-3xl outline-none font-medium border-2 resize-none transition-all focus:ring-4 ring-blue-500/10 ${
                          erros.exp ? 'border-red-300 bg-red-50' : 'border-transparent'
                        }`}
                        placeholder="Exemplo:&#10;&#10;Tech Solutions | Gerente Comercial | 2020 - Presente&#10;• Liderança de equipe de 12 vendedores&#10;• Aumento de 35% no faturamento anual&#10;• Implementação de metodologia SPIN Selling&#10;&#10;StartUp XYZ | Executivo de Vendas | 2018 - 2020&#10;• Prospecção ativa B2B no segmento SaaS&#10;• Conversão de 25% em vendas complexas"
                        value={dados.exp} 
                        onChange={e => atualizarDados({exp: e.target.value})}
                      />
                      {erros.exp && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {erros.exp}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Etapa 6 - Formação */}
                {fluxo === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Formação Acadêmica</h3>
                      <p className="text-slate-500 text-sm">
                        Suas qualificações educacionais.
                      </p>
                    </div>
                    <div>
                      <textarea 
                        className={`w-full h-64 p-6 md:p-8 bg-slate-50 rounded-3xl outline-none font-medium border-2 resize-none transition-all focus:ring-4 ring-blue-500/10 ${
                          erros.estudos ? 'border-red-300 bg-red-50' : 'border-transparent'
                        }`}
                        placeholder="Exemplo:&#10;&#10;MBA em Gestão Estratégica de Negócios&#10;Fundação Getúlio Vargas (FGV) | 2021 - 2023&#10;&#10;Bacharelado em Administração de Empresas&#10;Universidade Federal de São Paulo | 2014 - 2018"
                        value={dados.estudos} 
                        onChange={e => atualizarDados({estudos: e.target.value})}
                      />
                      {erros.estudos && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {erros.estudos}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Etapa 7 - Habilidades */}
                {fluxo === 7 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Habilidades & Competências</h3>
                      <p className="text-slate-500 text-sm">
                        Hard skills e soft skills que te destacam.
                      </p>
                    </div>
                    <div>
                      <input 
                        className={`w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none font-bold text-lg border-2 transition-all focus:ring-4 ring-blue-500/10 ${
                          erros.skills ? 'border-red-300 bg-red-50' : 'border-transparent'
                        }`}
                        placeholder="Ex: Excel Avançado, Power BI, Gestão de Projetos, Liderança, Comunicação, Negociação..." 
                        value={dados.skills} 
                        onChange={e => atualizarDados({skills: e.target.value})}
                      />
                      {erros.skills && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {erros.skills}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-2">
                        💡 Separe por vírgulas • Liste de 5 a 10 habilidades principais
                      </p>
                    </div>
                  </div>
                )}

                {/* Etapa 8 - Cursos */}
                {fluxo === 8 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Cursos e Certificações</h3>
                      <p className="text-slate-500 text-sm">
                        Certificados e especializações relevantes (opcional).
                      </p>
                    </div>
                    <textarea 
                      className="w-full h-48 md:h-56 p-6 md:p-8 bg-slate-50 rounded-3xl outline-none font-medium border-2 border-transparent resize-none focus:ring-4 ring-blue-500/10" 
                      placeholder="Exemplo:&#10;&#10;• Certificação em Metodologias Ágeis - Scrum Master (2023)&#10;• Google Analytics Individual Qualification (2022)&#10;• Curso de Vendas Consultivas - Fundação Vanzolini (2021)"
                      value={dados.cursos} 
                      onChange={e => atualizarDados({cursos: e.target.value})}
                    />
                  </div>
                )}

                {/* Etapa 9 - Idiomas */}
                {fluxo === 9 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Idiomas</h3>
                      <p className="text-slate-500 text-sm">
                        Quais idiomas você domina?
                      </p>
                    </div>
                    <input 
                      className="w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:ring-4 ring-blue-500/10" 
                      placeholder="Ex: Português (nativo), Inglês (fluente), Espanhol (intermediário)..." 
                      value={dados.idiomas} 
                      onChange={e => atualizarDados({idiomas: e.target.value})}
                    />
                  </div>
                )}

                {/* Etapa 10 - Disponibilidade */}
                {fluxo === 10 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl md:text-3xl font-black">Informações Adicionais</h3>
                      <p className="text-slate-500 text-sm">
                        CNH, disponibilidade para viagens, etc.
                      </p>
                    </div>
                    <input 
                      className="w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none font-bold text-lg border-2 border-transparent focus:ring-4 ring-blue-500/10" 
                      placeholder="Ex: CNH categoria B, disponibilidade para viagens, home office..." 
                      value={dados.disponibilidade} 
                      onChange={e => atualizarDados({disponibilidade: e.target.value})}
                    />
                  </div>
                )}
              </div>
            )}

            {/* PREVIEW FINAL (ETAPA 11) */}
            {fluxo === 11 && (
              <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 md:pb-32">
                
                {/* Controles de Preview */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setMostrarPreview(!mostrarPreview)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    {mostrarPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                    {mostrarPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
                  </button>
                  <button
                    onClick={() => setFluxo(1)}
                    className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    ← Editar Dados
                  </button>
                </div>

                {/* PAPEL DO CV */}
                {mostrarPreview && (
                  <div className="bg-white border border-slate-200 shadow-2xl rounded-sm p-8 md:p-16 min-h-[800px] md:min-h-[1000px] relative transition-all">
                    <div className="absolute top-0 left-0 w-full h-3 md:h-4 bg-slate-900"></div>
                    
                    {/* HEADER CV */}
                    <div className="border-b-2 border-slate-900 pb-6 md:pb-8 mb-8 md:mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4">
                      <div>
                        <h2 className="text-3xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                          {dados.nome || 'SEU NOME'}
                        </h2>
                        <p className="text-lg md:text-2xl text-blue-600 font-bold uppercase tracking-widest mt-2">
                          {dados.cargo || 'CARGO'}
                        </p>
                      </div>
                      <div className="text-left md:text-right text-xs md:text-sm font-bold text-slate-500 space-y-1 uppercase">
                        {dados.tel && <p className="flex md:justify-end items-center gap-2"><Phone size={14}/>{dados.tel}</p>}
                        {dados.email && <p className="flex md:justify-end items-center gap-2"><Mail size={14}/>{dados.email}</p>}
                        {dados.cidade && <p className="flex md:justify-end items-center gap-2"><MapPin size={14}/>{dados.cidade}</p>}
                        {dados.linkedin && <p className="flex md:justify-end items-center gap-2"><Linkedin size={14}/>LinkedIn</p>}
                      </div>
                    </div>

                    {/* CONTEÚDO CV */}
                    <div className="space-y-8">
                      {dados.resumo && (
                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4 flex items-center gap-2">
                            <Star size={12}/>Perfil Profissional
                          </h4>
                          <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-sm md:text-base">
                            {dados.resumo}
                          </p>
                        </section>
                      )}
                      
                      {dados.exp && (
                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4 flex items-center gap-2">
                            <Briefcase size={12}/>Experiência
                          </h4>
                          <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-sm md:text-base">
                            {dados.exp}
                          </p>
                        </section>
                      )}
                      
                      {dados.estudos && (
                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4 flex items-center gap-2">
                            <GraduationCap size={12}/>Formação
                          </h4>
                          <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-sm md:text-base">
                            {dados.estudos}
                          </p>
                        </section>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {dados.skills && (
                          <section>
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4">
                              Habilidades
                            </h4>
                            <p className="text-slate-700 leading-relaxed font-medium text-sm md:text-base">
                              {dados.skills}
                            </p>
                          </section>
                        )}
                        
                        {dados.idiomas && (
                          <section>
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4 flex items-center gap-2">
                              <Languages size={12}/>Idiomas
                            </h4>
                            <p className="text-slate-700 leading-relaxed font-medium text-sm md:text-base">
                              {dados.idiomas}
                            </p>
                          </section>
                        )}
                      </div>

                      {dados.cursos && (
                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4 flex items-center gap-2">
                            <Award size={12}/>Certificações
                          </h4>
                          <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap text-sm md:text-base">
                            {dados.cursos}
                          </p>
                        </section>
                      )}

                      {dados.disponibilidade && (
                        <section>
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 inline-block mb-4">
                            Informações Adicionais
                          </h4>
                          <p className="text-slate-700 leading-relaxed font-medium text-sm md:text-base">
                            {dados.disponibilidade}
                          </p>
                        </section>
                      )}
                    </div>
                  </div>
                )}

                {/* BOTÕES DE AÇÃO */}
                <div className="flex flex-col gap-4 md:gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={otimizarComIA} 
                      disabled={gerandoIA || !dados.vagaTexto.trim()}
                      className="py-5 md:py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 active:scale-95 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 md:gap-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {gerandoIA ? (
                        <>
                          <Loader2 className="animate-spin" size={24}/>
                          Otimizando...
                        </>
                      ) : (
                        <>
                          <Sparkles size={24}/>
                          Turbinar com IA
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={baixarPDF}
                      className="py-5 md:py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 md:gap-4 hover:bg-black transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                      <Download size={22}/>
                      Baixar PDF
                    </button>
                  </div>

                  {!dados.vagaTexto.trim() && (
                    <p className="text-center text-sm text-amber-600 flex items-center justify-center gap-2">
                      <AlertCircle size={16}/>
                      Preencha a descrição da vaga (Etapa 3) para habilitar a otimização por IA
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* PAGAMENTO (ETAPA 13) */}
            {fluxo === 13 && (
              <div className="text-center py-12 md:py-20 animate-in zoom-in duration-500 space-y-8 md:space-y-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Lock size={44}/>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
                    Premium Ativado
                  </h2>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                    Pague uma vez e tenha o currículo perfeito
                  </p>
                </div>
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl md:rounded-[3rem] max-w-sm mx-auto border border-slate-100">
                  <div className="text-4xl md:text-5xl font-black text-slate-900">R$ 5,99</div>
                  <p className="text-slate-500 text-sm mt-2">Pagamento único • Sem mensalidades</p>
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'} 
                    className="px-12 md:px-16 py-6 md:py-7 bg-blue-600 text-white rounded-3xl md:rounded-[2.5rem] font-black text-lg md:text-xl uppercase shadow-2xl hover:scale-110 active:scale-95 transition-all"
                  >
                    Pagar via PIX
                  </button>
                  <button 
                    onClick={() => setFluxo(11)} 
                    className="block w-full text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
                  >
                    ← Revisar mais uma vez
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* FOOTER FIXO - NAVEGAÇÃO */}
          {fluxo >= 1 && fluxo <= 10 && (
            <footer className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center sticky bottom-0 z-10">
              <button 
                onClick={() => setFluxo(prev => Math.max(0, prev - 1))} 
                className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors"
              >
                <ArrowLeft size={16}/>
                Anterior
              </button>
              <button 
                onClick={avancarEtapa}
                className="px-8 md:px-12 py-4 md:py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95"
              >
                {fluxo === 10 ? "Ver Preview Final" : "Próximo"} 
                <ChevronRight size={18}/>
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
