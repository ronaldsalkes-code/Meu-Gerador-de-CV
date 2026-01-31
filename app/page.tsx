'use client'

import { useState, useEffect } from 'react'
import { SignedIn, useUser, UserButton } from "@clerk/nextjs"
import {
  ArrowLeft, CheckCircle2, Eye, Sparkles, Briefcase, Send, FileText, Lock, Plus,
  ChevronRight, Timer, GraduationCap, Wand2, Download, Globe, Rocket
} from 'lucide-react'

// ---------------- IA MOCK ----------------
const gerarSugestaoIA = (campo: string, cargo: string) => {
  const base: any = {
    resumo: `Profissional de ${cargo || 'sua área'} com foco em resultados, forte capacidade analítica e experiência em otimização de processos.`,
  }
  return base[campo]
}

// ---------------- COMPONENTE ----------------
export default function SuperGeradorCV() {
  const { user, isLoaded } = useUser()

  const [fluxo, setFluxo] = useState(12)
  const [loadingIA, setLoadingIA] = useState(false)

  const [dados, setDados] = useState({
    nome: '',
    cargo: '',
    resumo: ''
  })

  // --------- Persistência ----------
  useEffect(() => {
    const salvo = localStorage.getItem('cv_ultra_v1')
    if (salvo) setDados(JSON.parse(salvo))
  }, [])

  const update = (obj: any) => {
    const novo = { ...dados, ...obj }
    setDados(novo)
    localStorage.setItem('cv_ultra_v1', JSON.stringify(novo))
  }

  // --------- Navegação ----------
  const proximo = () => {
    setFluxo(prev => Math.min(prev + 1, 12))
  }

  const voltar = () => {
    setFluxo(prev => Math.max(prev - 1, 1))
  }

  const usarIA = () => {
    setLoadingIA(true)
    setTimeout(() => {
      update({ resumo: gerarSugestaoIA('resumo', dados.cargo) })
      setLoadingIA(false)
    }, 800)
  }

  if (!isLoaded) return null

  // --------- Render Etapas ----------
  const renderEtapa = () => {
    switch (fluxo) {

      case 12:
        return (
          <div className="space-y-8">
            <h2 className="text-4xl font-black">
              Bem-vindo, <span className="text-blue-600">{user?.firstName}</span>
            </h2>

            <button
              onClick={() => setFluxo(1)}
              className="w-full p-8 bg-blue-600 text-white rounded-3xl font-black flex justify-between items-center"
            >
              Criar Novo Currículo
              <Plus size={32} />
            </button>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black">Quem é você?</h2>

            <input
              className="w-full p-6 rounded-2xl bg-slate-50"
              placeholder="Nome completo"
              value={dados.nome}
              onChange={e => update({ nome: e.target.value })}
            />

            <input
              className="w-full p-6 rounded-2xl bg-slate-50"
              placeholder="Cargo desejado"
              value={dados.cargo}
              onChange={e => update({ cargo: e.target.value })}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-black">Resumo Profissional</h2>

            <button
              onClick={usarIA}
              disabled={loadingIA}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black"
            >
              {loadingIA ? <Timer className="animate-spin" /> : <Wand2 />}
              Gerar com IA
            </button>

            <textarea
              className="w-full h-64 p-6 rounded-2xl bg-slate-50"
              value={dados.resumo}
              onChange={e => update({ resumo: e.target.value })}
            />
          </div>
        )

      case 11:
        return (
          <div className="text-center space-y-6">
            <Lock size={64} className="mx-auto opacity-30" />
            <h2 className="text-4xl font-black">Quase lá</h2>

            <button
              onClick={() => window.location.href = 'https://lastlink.com/p/C462F9E2A/checkout-payment/'}
              className="w-full py-6 bg-blue-600 text-white rounded-3xl font-black"
            >
              Liberar PDF – R$ 5,99
            </button>
          </div>
        )

      default:
        return (
          <div className="text-center text-slate-400 font-bold">
            Etapa {fluxo} ainda não implementada
          </div>
        )
    }
  }

  // ---------------- RENDER FINAL ----------------
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      <header className="bg-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Rocket className="text-blue-600" />
          <strong>CURRICULO.PRO</strong>
        </div>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <main className="flex-1 p-10 max-w-xl mx-auto">
        {fluxo < 12 && fluxo > 1 && (
          <button
            onClick={voltar}
            className="flex items-center gap-2 text-xs mb-6 text-slate-400 font-bold"
          >
            <ArrowLeft size={14} /> Voltar
          </button>
        )}

        {renderEtapa()}
      </main>

      {fluxo < 11 && fluxo > 0 && (
        <footer className="p-6 bg-white border-t">
          <button
            onClick={proximo}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs"
          >
            Próxima Etapa <ChevronRight size={16} />
          </button>
        </footer>
      )}

    </div>
  )
}
