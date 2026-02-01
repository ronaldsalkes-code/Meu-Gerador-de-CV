'use client'

import { useState } from 'react'

const fieldStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  marginBottom: 14,
  fontSize: 15
}

const labelStyle = {
  fontWeight: 600,
  marginBottom: 6,
  display: 'block'
}

const buttonPrimary = {
  padding: '12px 20px',
  borderRadius: 10,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer'
}

const buttonSecondary = {
  padding: '12px 20px',
  borderRadius: 10,
  background: '#e5e7eb',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer'
}

export default function GerarCV() {
  const [etapa, setEtapa] = useState(1)

  const [dados, setDados] = useState({
    nome: '',
    cargo: '',
    email: '',
    telefone: '',
    resumo: '',
    experiencia: '',
    formacao: '',
    cursos: '',
    habilidades: '',
    idiomas: '',
    adicionais: '',
  })

  const total = 10
  const progresso = `${(etapa / total) * 100}%`

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: 40 }}>
      <div style={{
        maxWidth: 820,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 18,
        padding: 32,
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
      }}>

        <h1 style={{ fontSize: 26, fontWeight: 700 }}>Gerador de Currículo</h1>
        <p style={{ color: '#6b7280' }}>Etapa {etapa} de 10</p>

        {/* Barra */}
        <div style={{ background: '#e5e7eb', borderRadius: 999, margin: '20px 0' }}>
          <div style={{
            width: progresso,
            height: 10,
            background: '#2563eb',
            borderRadius: 999,
            transition: '0.3s'
          }} />
        </div>

        {etapa === 1 && (
          <>
            <label style={labelStyle}>Nome completo</label>
            <input style={fieldStyle} placeholder="Ex: João da Silva"
              value={dados.nome} onChange={e => setDados({ ...dados, nome: e.target.value })} />

            <label style={labelStyle}>Cargo desejado</label>
            <input style={fieldStyle} placeholder="Ex: Auxiliar Administrativo"
              value={dados.cargo} onChange={e => setDados({ ...dados, cargo: e.target.value })} />

            <label style={labelStyle}>Email</label>
            <input style={fieldStyle} placeholder="ex@email.com"
              value={dados.email} onChange={e => setDados({ ...dados, email: e.target.value })} />

            <label style={labelStyle}>Telefone</label>
            <input style={fieldStyle} placeholder="(11) 99999-9999"
              value={dados.telefone} onChange={e => setDados({ ...dados, telefone: e.target.value })} />
          </>
        )}

        {etapa === 2 && (
          <>
            <label style={labelStyle}>Resumo profissional</label>
            <textarea style={{ ...fieldStyle, minHeight: 120 }}
              value={dados.resumo}
              onChange={e => setDados({ ...dados, resumo: e.target.value })} />

            <button style={{ ...buttonSecondary, marginTop: 10 }}
              onClick={() =>
                setDados({ ...dados, resumo: `Profissional com foco em resultados, organização e aprendizado rápido.` })
              }>
              Gerar texto automático
            </button>
          </>
        )}

        {etapa === 10 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Finalização</h2>
            <p style={{ color: '#6b7280' }}>Seu currículo está pronto.</p>

            <button style={{ ...buttonPrimary, width: '100%', marginTop: 20 }}>
              Gerar PDF
            </button>
          </>
        )}

        {/* Navegação */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
          <button disabled={etapa === 1} style={buttonSecondary}
            onClick={() => setEtapa(etapa - 1)}>
            Voltar
          </button>

          <button disabled={etapa === 10} style={buttonPrimary}
            onClick={() => setEtapa(etapa + 1)}>
            Próxima etapa
          </button>
        </div>

      </div>
    </div>
  )
}
