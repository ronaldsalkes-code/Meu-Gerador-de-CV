'use client'

import { useState } from 'react'

export default function GerarCV() {
  const [etapa, setEtapa] = useState(1)

  const [dados, setDados] = useState({
    nome: '',
    cargo: '',
    email: '',
    telefone: '',
    resumo: '',
  })

  const gerarResumoAutomatico = () => {
    const texto = `Profissional com experiência na área de ${dados.cargo || 'sua área'}, com foco em resultados, organização e aprendizado rápido. Possui boa comunicação, responsabilidade e facilidade para trabalhar em equipe.`
    setDados({ ...dados, resumo: texto })
  }

  return (
    <div style={{ padding: 40, maxWidth: 700 }}>
      <h1>Gerador de Currículo</h1>
      <p>Etapa {etapa} de 10</p>

      {/* ETAPA 1 */}
      {etapa === 1 && (
        <>
          <h2>Quem é você?</h2>

          <input
            placeholder="Nome completo"
            value={dados.nome}
            onChange={(e) => setDados({ ...dados, nome: e.target.value })}
            style={{ width: '100%', padding: 10, marginBottom: 10 }}
          />

          <input
            placeholder="Cargo desejado"
            value={dados.cargo}
            onChange={(e) => setDados({ ...dados, cargo: e.target.value })}
            style={{ width: '100%', padding: 10, marginBottom: 10 }}
          />

          <input
            placeholder="Email"
            value={dados.email}
            onChange={(e) => setDados({ ...dados, email: e.target.value })}
            style={{ width: '100%', padding: 10, marginBottom: 10 }}
          />

          <input
            placeholder="Telefone"
            value={dados.telefone}
            onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
            style={{ width: '100%', padding: 10 }}
          />
        </>
      )}

      {/* ETAPA 2 */}
      {etapa === 2 && (
        <>
          <h2>Resumo profissional</h2>

          <textarea
            placeholder="Escreva seu resumo ou use o texto automático"
            value={dados.resumo}
            onChange={(e) => setDados({ ...dados, resumo: e.target.value })}
            style={{ width: '100%', padding: 10, height: 120 }}
          />

          <button
            onClick={gerarResumoAutomatico}
            style={{ marginTop: 10, padding: 10, fontWeight: 'bold' }}
          >
            Gerar texto automático
          </button>
        </>
      )}

      <div style={{ marginTop: 30 }}>
        {etapa > 1 && (
          <button onClick={() => setEtapa(etapa - 1)} style={{ marginRight: 10 }}>
            Voltar
          </button>
        )}

        {etapa < 10 && (
          <button onClick={() => setEtapa(etapa + 1)}>
            Próxima etapa
          </button>
        )}
      </div>
    </div>
  )
}
