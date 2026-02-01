'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  Lock,
  Plus,
  ChevronRight,
  Timer,
  Wand2,
  Globe,
  Rocket,
  Send
} from 'lucide-react'

/* ===================== IA ===================== */

const gerarSugestaoIA = (campo: string, cargo: string) => {
  const c = cargo.toLowerCase()

  if (campo === 'resumo') {
    if (c.includes('venda')) {
      return 'Profissional da área de vendas, com foco em atendimento ao cliente, negociação, cumprimento de metas e relacionamento comercial.'
    }
    if (c.includes('admin')) {
      return 'Profissional da área administrativa, com experiência em rotinas de escritório, organização de documentos e apoio aos processos internos.'
    }
    return 'Profissional comprometido, organizado e com boa comunicação, buscando crescimento e estabilidade profissional.'
  }

  if (campo === 'exp') {
    return `• Atendimento ao cliente
• Organização de rotinas
• Apoio à equipe
• Cumprimento de metas`
  }

  if (campo === 'skills') {
    return 'Comunicação, Organização, Proatividade, Trabalho em Equipe'
  }

  return ''
}

/* ===================== COMPONENTE ===================== */

export default function GerarCV() {
  const { user, isLoaded } = useUser()

  const [fluxo, setFluxo] = useState(0)
  const [loadingIA, setLoadingIA] = useState(false)

  const [dados, setDados] = useState({
    nome: '',
    cargo: '',
    email: '',
    tel: '',
    resumo: '',
    exp: '',
    skills: ''
  })

  useEffect(() => {
    const salvo = localStorage.getItem('cv_ultra_v1')
    if (salvo) setDados(JSON.parse(salvo))
  }, [])

  const update = (obj: any) => {
    const novo = { ...dados, ...obj }
    setDados(novo)
    localStorage.setItem('cv_ultra_v1', JSON.stringify(novo))
  }

  const usarIA = (campo: string) => {
    setLoadingIA(true)
    setTimeout(() => {
      update({ [campo]: gerarSugestaoIA(campo, dados.cargo) })
      setLoadingIA(false)
    }, 600)
  }

  const voltar = () => {
    if (fluxo > 1) setFluxo(fluxo - 1)
  }

  if (!isLoaded) return null

  return (
    <div className="min-h-screen bg-[#F1F4F9] flex flex-col">

      {/* HEADER */}
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Rocket className="text-blue-600" />
          <h1 className="font-black italic">CURRICULO<span className="text-blue-600">.PRO</span></h1>
        </div>
        <UserButton />
      </header>

      <main className="flex-1 flex">

        {/* FORM */}
        <section className="flex-1 p-10 bg-white">
          {fluxo > 0 && fluxo < 10 && (
            <button onClick={voltar} className="flex gap-2 text-sm mb-6">
              <ArrowLeft size={16} /> Voltar
            </button>
          )}

          {/* DASHBOARD */}
          {fluxo === 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black">Bem-vindo, {user?.firstName}</h2>
              <button
                onClick={() => setFluxo(1)}
                className="p-6 bg-blue-600 text-white rounded-xl flex justify-between"
              >
                Criar Novo Currículo <Plus />
              </button>
            </div>
          )}

          {/* ETAPA 1 */}
          {fluxo === 1 && (
            <>
              <h2 className="text-xl font-black mb-4">Quem é você?</h2>
              <input placeholder="Nome completo" value={dados.nome} onChange={e => update({ nome: e.target.value })} />
              <input placeholder="Cargo desejado" value={dados.cargo} onChange={e => update({ cargo: e.target.value })} />
            </>
          )}

          {/* ETAPA 2 */}
          {fluxo === 2 && (
            <>
              <h2 className="text-xl font-black">Resumo profissional</h2>
              <textarea value={dados.resumo} onChange={e => update({ resumo: e.target.value })} />
              <button onClick={() => usarIA('resumo')}>
                {loadingIA ? <Timer className="animate-spin" /> : <Wand2 />} Gerar texto automático
              </button>
            </>
          )}

          {/* ETAPA 3 */}
          {fluxo === 3 && (
            <>
              <h2 className="text-xl font-black">Experiência</h2>
              <textarea value={dados.exp} onChange={e => update({ exp: e.target.value })} />
              <button onClick={() => usarIA('exp')}>Gerar experiência</button>
            </>
          )}

          {/* ETAPA 4 */}
          {fluxo === 4 && (
            <>
              <h2 className="text-xl font-black">Habilidades</h2>
              <textarea value={dados.skills} onChange={e => update({ skills: e.target.value })} />
              <button onClick={() => usarIA('skills')}>Gerar habilidades</button>
            </>
          )}

          {/* ETAPA 10 */}
          {fluxo === 10 && (
            <div className="text-center space-y-6">
              <Lock size={48} className="mx-auto text-blue-600" />
              <h2 className="text-2xl font-black">Currículo pronto</h2>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl">
                Gerar PDF <Send />
              </button>
            </div>
          )}

          {fluxo > 0 && fluxo < 10 && (
            <button onClick={() => setFluxo(f => f + 1)} className="mt-8">
              Próxima etapa <ChevronRight />
            </button>
          )}
        </section>

        {/* PREVIEW */}
        <section className="hidden xl:flex flex-1 bg-slate-100 items-center justify-center">
          <div className="bg-white w-[420px] h-[600px] p-8 shadow-xl">
            <h3 className="font-black">{dados.nome || 'SEU NOME'}</h3>
            <p className="text-blue-600">{dados.cargo || 'CARGO'}</p>
            <p className="text-xs mt-4">{dados.resumo}</p>
          </div>
        </section>

      </main>
    </div>
  )
}
