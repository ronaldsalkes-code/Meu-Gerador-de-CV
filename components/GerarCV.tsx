'use client'

import { useState } from 'react'

export default function GerarCV() {
  const [nome, setNome] = useState('')

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Gerador de Currículo</h1>

      <label>Seu nome</label>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Ex: João Silva"
        style={{
          display: 'block',
          width: '100%',
          padding: 10,
          marginTop: 8
        }}
      />

      {nome && <p>Olá, {nome}. Seu currículo vai começar aqui.</p>}
    </div>
  )
}
