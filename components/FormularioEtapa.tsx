// components/FormularioEtapa.tsx

import { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface FormularioEtapaProps {
  titulo: string
  descricao?: string
  children: ReactNode
  etapa: number
  totalEtapas: number
}

export function FormularioEtapa({ 
  titulo, 
  descricao, 
  children, 
  etapa, 
  totalEtapas 
}: FormularioEtapaProps) {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            Etapa {etapa} de {totalEtapas}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {Math.round((etapa / totalEtapas) * 100)}% completo
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-slate-900">
          {titulo}
        </h3>
        {descricao && (
          <p className="text-slate-500 text-sm font-medium">
            {descricao}
          </p>
        )}
      </header>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

interface CampoTextoProps {
  valor: string
  onChange: (valor: string) => void
  placeholder: string
  erro?: string
  tipo?: 'text' | 'email' | 'tel'
  obrigatorio?: boolean
}

export function CampoTexto({ 
  valor, 
  onChange, 
  placeholder, 
  erro, 
  tipo = 'text',
  obrigatorio = false 
}: CampoTextoProps) {
  return (
    <div>
      <input
        type={tipo}
        className={`w-full p-5 md:p-6 bg-slate-50 rounded-2xl outline-none font-bold text-lg border-2 transition-all focus:ring-4 ring-blue-500/10 ${
          erro ? 'border-red-300 bg-red-50' : 'border-transparent'
        }`}
        placeholder={`${placeholder}${obrigatorio ? ' *' : ''}`}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
      />
      {erro && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <AlertCircle size={14} />
          {erro}
        </p>
      )}
    </div>
  )
}

interface CampoTextoAreaProps {
  valor: string
  onChange: (valor: string) => void
  placeholder: string
  erro?: string
  altura?: 'pequena' | 'media' | 'grande'
  limite?: number
}

export function CampoTextoArea({ 
  valor, 
  onChange, 
  placeholder, 
  erro,
  altura = 'media',
  limite
}: CampoTextoAreaProps) {
  const alturas = {
    pequena: 'h-32',
    media: 'h-48 md:h-64',
    grande: 'h-64 md:h-80'
  }

  return (
    <div>
      <textarea
        className={`w-full ${alturas[altura]} p-6 md:p-8 bg-slate-50 rounded-3xl outline-none font-medium border-2 resize-none transition-all focus:ring-4 ring-blue-500/10 ${
          erro ? 'border-red-300 bg-red-50' : 'border-transparent'
        }`}
        placeholder={placeholder}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        maxLength={limite}
      />
      {erro && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <AlertCircle size={14} />
          {erro}
        </p>
      )}
      {limite && (
        <p className="text-xs text-slate-400 mt-2 text-right">
          {valor.length}/{limite} caracteres
        </p>
      )}
    </div>
  )
}

interface DicaProps {
  children: ReactNode
  tipo?: 'info' | 'alerta' | 'sucesso'
}

export function Dica({ children, tipo = 'info' }: DicaProps) {
  const estilos = {
    info: 'bg-blue-50 border-blue-100 text-blue-900',
    alerta: 'bg-amber-50 border-amber-100 text-amber-900',
    sucesso: 'bg-green-50 border-green-100 text-green-900'
  }

  return (
    <div className={`${estilos[tipo]} border rounded-2xl p-4 flex items-start gap-3`}>
      <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
      <div className="text-sm">
        {children}
      </div>
    </div>
  )
}
