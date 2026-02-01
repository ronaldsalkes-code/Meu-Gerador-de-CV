'use client'

import { useState } from 'react'

export default function GerarCV() {
  const [etapa, setEtapa] = useState(1)

  const totalEtapas = 10
  const progresso = Math.round((etapa / totalEtapas) * 100)

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

  const btn = {
    padding: '12px 18px',
    borderRadius: 8,
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer'
  }

  const gerarResumo = () =>
    setDados({ ...dados, resumo: `Profissional da área de ${dados.cargo || 'sua área'}, com foco em resultados, organização e aprendizado rápido.` })

  const gerarExperiencia = () =>
    setDados({ ...dados, experiencia: `• Atendimento ao cliente\n• Organização de processos\n• Cumprimento de metas\n• Trabalho em equipe` })

  const gerarHabilidades = () =>
    setDados({ ...dados, habilidades: `Comunicação, Organização, Proatividade, Responsabilidade` })

  const gerarIdiomas = () =>
    setDados({ ...dados, idiomas: `Português – Nativo` })

  return (
    <div style={{ minHeight: '100vh', background: '#f1f4f9', padding: 40 }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        padding: 30,
        boxShadow: '0 10px 30px rgba(0,0,0,.08)'
      }}>

        <h1 style={{ marginBottom: 10 }}>Gerador de Currículo</h1>
        <small>Etapa {etapa} de {totalEtapas}</small>

        {/* PROGRESSO */}
        <div style={{ margin: '20px 0', background: '#eee', borderRadius: 20 }}>
          <div style={{
            width: `${progresso}%`,
            height: 10,
            background: '#2563eb',
            borderRadius: 20,
            transition: '0.3s'
          }} />
        </div>

        {/* CONTEÚDO */}
        {etapa === 1 && (
          <>
            <h2>Identificação</h2>
            <input placeholder="Nome completo" value={dados.nome}
              onChange={e => setDados({ ...dados, nome: e.target.value })} />
            <input placeholder="Cargo desejado" value={dados.cargo}
              onChange={e => setDados({ ...dados, cargo: e.target.value })} />
            <input placeholder="Email" value={dados.email}
              onChange={e => setDados({ ...dados, email: e.target.value })} />
            <input placeholder="Telefone" value={dados.telefone}
              onChange={e => setDados({ ...dados, telefone: e.target.value })} />
          </>
        )}

        {etapa === 2 && (
          <>
            <h2>Resumo Profissional</h2>
            <textarea value={dados.resumo}
              onChange={e => setDados({ ...dados, resumo: e.target.value })} />
            <button style={btn} onClick={gerarResumo}>Gerar texto automático</button>
          </>
        )}

        {etapa === 3 && (
          <>
            <h2>Experiência Profissional</h2>
            <textarea value={dados.experiencia}
              onChange={e => setDados({ ...dados, experiencia: e.target.value })} />
            <button style={btn} onClick={gerarExperiencia}>Gerar experiência automática</button>
          </>
        )}

        {etapa === 4 && <><h2>Formação</h2><textarea value={dados.formacao}
          onChange={e => setDados({ ...dados, formacao: e.target.value })} /></>}

        {etapa === 5 && <><h2>Cursos</h2><textarea value={dados.cursos}
          onChange={e => setDados({ ...dados, cursos: e.target.value })} /></>}

        {etapa === 6 && (
          <>
            <h2>Habilidades</h2>
            <textarea value={dados.habilidades}
              onChange={e => setDados({ ...dados, habilidades: e.target.value })} />
            <button style={btn} onClick={gerarHabilidades}>Gerar habilidades</button>
          </>
        )}

        {etapa === 7 && (
          <>
            <h2>Idiomas</h2>
            <textarea value={dados.idiomas}
              onChange={e => setDados({ ...dados, idiomas: e.target.value })} />
            <button style={btn} onClick={gerarIdiomas}>Preencher automático</button>
          </>
        )}

        {etapa === 8 && <><h2>Informações Adicionais</h2><textarea value={dados.adicionais}
          onChange={e => setDados({ ...dados, adicionais: e.target.value })} /></>}

        {etapa === 9 && (
          <>
            <h2>Revisão</h2>
            <pre style={{ background: '#f5f5f5', padding: 15, borderRadius: 8 }}>
              {JSON.stringify(dados, null, 2)}
            </pre>
          </>
        )}

        {etapa === 10 && (
          <>
            <h2>Finalização</h2>
            <p>Seu currículo está pronto.</p>
            <button style={{ ...btn, background: '#2563eb', color: '#fff' }}>
              Gerar PDF
            </button>
          </>
        )}

        {/* NAVEGAÇÃO */}
        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between' }}>
          <button disabled={etapa === 1} style={btn} onClick={() => setEtapa(etapa - 1)}>
            Voltar
          </button>
          <button disabled={etapa === 10} style={{ ...btn, background: '#111', color: '#fff' }}
            onClick={() => setEtapa(etapa + 1)}>
            Próxima
          </button>
        </div>

      </div>
    </div>
  )
}
