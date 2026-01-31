'use client'

import { useState } from 'react'

export default function GerarCV() {
  const [etapa, setEtapa] = useState(1)

  const [dados, setDados] = useState({
    nome: '',
    cargo: '',
    email: '',
    telefone: '',
  })

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h1>Gerador de Currículo</h1>
      <p>Etapa {etapa} de 10</p>

      {etapa === 1 && (
        <>
          <h2>Quem é você?</h2>

          <input
            placeholder="Nome completo"
            value={dados.nome}
            onChange={(e) => setDados({ ...dados, nome: e.target.value })}
            style={{ display: 'block', width: '100%', padding: 10, marginBottom: 10 }}
          />

          <input
            placeholder="Cargo desejado"
            value={dados.cargo}
            onChange={(e) => setDados({ ...dados, cargo: e.target.value })}
            style={{ display: 'block', width: '100%', padding: 10, marginBottom: 10 }}
          />

          <input
            placeholder="Email"
            value={dados.email}
            onChange={(e) => setDados({ ...dados, email: e.target.value })}
            style={{ display: 'block', width: '100%', padding: 10, marginBottom: 10 }}
          />

          <input
            placeholder="Telefone"
            value={dados.telefone}
            onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
            style={{ display: 'block', width: '100%', padding: 10 }}
          />
        </>
      )}

      <div style={{ marginTop: 30 }}>
        <button
          onClick={() => setEtapa(etapa + 1)}
          style={{ padding: 12, fontWeight: 'bold' }}
        >
          Próxima etapa
        </button>
      </div>
    </div>
  )
}
