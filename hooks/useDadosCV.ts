// hooks/useDadosCV.ts

import { useState, useEffect, useCallback } from 'react'
import { DadosCV } from '@/types/cv'

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

const STORAGE_KEY = 'cv_premium_data'

export function useDadosCV() {
  const [dados, setDados] = useState<DadosCV>(DADOS_INICIAIS)
  const [salvando, setSalvando] = useState(false)
  const [carregado, setCarregado] = useState(false)

  // Carregar dados do localStorage
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      if (salvo) {
        const dadosParsed = JSON.parse(salvo)
        setDados(dadosParsed)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setCarregado(true)
    }
  }, [])

  // Salvar dados no localStorage (debounced)
  useEffect(() => {
    if (!carregado) return

    setSalvando(true)
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dados))
      } catch (error) {
        console.error('Erro ao salvar dados:', error)
      } finally {
        setSalvando(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [dados, carregado])

  const atualizarDados = useCallback((novos: Partial<DadosCV>) => {
    setDados(prev => ({ ...prev, ...novos }))
  }, [])

  const resetarDados = useCallback(() => {
    setDados(DADOS_INICIAIS)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const temDados = useCallback(() => {
    return dados.nome.trim() !== '' || dados.cargo.trim() !== ''
  }, [dados.nome, dados.cargo])

  return {
    dados,
    atualizarDados,
    resetarDados,
    salvando,
    carregado,
    temDados: temDados()
  }
}
