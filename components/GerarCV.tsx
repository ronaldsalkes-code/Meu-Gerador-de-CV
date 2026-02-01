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
    experiencia: '',
    formacao: '',
    cursos: '',
    habilidades: '',
    idiomas: '',
    adicionais: '',
  })

  const gerarResumo = () => {
    setDados({
      ...dados,
      resumo: `Profissional com experiência na área de ${dados.cargo || 'sua área'}, com foco em resultados, organização e aprendizado rápido. Possui boa comunicação, responsabilidade e facilidade para trabalhar em equipe.`
    })
  }

  const gerarExperiencia = () => {
    setDados({
      ...dados,
      experiencia: `• Atendimento ao cliente e suporte diário\n• Organização de rotinas e processos internos\n• Cumprimento de metas e prazos estabelecidos\n• Trabalho em equipe e apoio às atividades operacionais`
    })
  }

  const gerarHabilidades = () => {
    setDados({
      ...dados,
      habilidades: `Comunicação eficaz, Organização, Proatividade, Trabalho em equipe, Responsabilidade, Facilidade de aprendizado`
    })
  }

  const gerarIdiomas = () => {
    setDados({
      ...dados,
      idiomas: `Português – Nativo`
    })
  }

  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h1>Gerador de Currículo</h1>
      <p>Etapa {etapa} de 10</p>

      {/* ETAPA 1 */}
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

      {/* ETAPA 2 */}
      {etapa === 2 && (
        <>
          <h2>Resumo Profissional</h2>
          <textarea value={dados.resumo}
            onChange={e => setDados({ ...dados, resumo: e.target.value })} />
          <button onClick={gerarResumo}>Gerar texto automático</button>
        </>
      )}

      {/* ETAPA 3 */}
      {etapa === 3 && (
        <>
          <h2>Experiência Profissional</h2>
          <textarea value={dados.experiencia}
            onChange={e => setDados({ ...dados, experiencia: e.target.value })} />
          <button onClick={gerarExperiencia}>Gerar experiência automática</button>
        </>
      )}

      {/* ETAPA 4 */}
      {etapa === 4 && (
        <>
          <h2>Formação Acadêmica</h2>
          <textarea value={dados.formacao}
            onChange={e => setDados({ ...dados, formacao: e.target.value })}
            placeholder="Ex: Ensino Médio Completo – Escola X" />
        </>
      )}

      {/* ETAPA 5 */}
      {etapa === 5 && (
        <>
          <h2>Cursos e Certificações</h2>
          <textarea value={dados.cursos}
            onChange={e => setDados({ ...dados, cursos: e.target.value })}
            placeholder="Ex: Curso de Atendimento ao Cliente – 2023" />
        </>
      )}

      {/* ETAPA 6 */}
      {etapa === 6 && (
        <>
          <h2>Habilidades</h2>
          <textarea value={dados.habilidades}
            onChange={e => setDados({ ...dados, habilidades: e.target.value })} />
          <button onClick={gerarHabilidades}>Gerar habilidades automáticas</button>
        </>
      )}

      {/* ETAPA 7 */}
      {etapa === 7 && (
        <>
          <h2>Idiomas</h2>
          <textarea value={dados.idiomas}
            onChange={e => setDados({ ...dados, idiomas: e.target.value })} />
          <button onClick={gerarIdiomas}>Preencher automaticamente</button>
        </>
      )}

      {/* ETAPA 8 */}
      {etapa === 8 && (
        <>
          <h2>Informações Adicionais</h2>
          <textarea value={dados.adicionais}
            onChange={e => setDados({ ...dados, adicionais: e.target.value })}
            placeholder="CNH, disponibilidade, viagens, etc." />
        </>
      )}

      {/* ETAPA 9 */}
      {etapa === 9 && (
        <>
          <h2>Revisão Final</h2>
          <pre style={{ background: '#f5f5f5', padding: 20 }}>
            {JSON.stringify(dados, null, 2)}
          </pre>
        </>
      )}

      {/* ETAPA 10 */}
      {etapa === 10 && (
        <>
          <h2>Finalização</h2>
          <p>Seu currículo está pronto para gerar o PDF.</p>
          <button>Gerar PDF (em breve)</button>
        </>
      )}

      <div style={{ marginTop: 30 }}>
        {etapa > 1 && <button onClick={() => setEtapa(etapa - 1)}>Voltar</button>}
        {etapa < 10 && <button onClick={() => setEtapa(etapa + 1)}>Próxima etapa</button>}
      </div>
    </div>
  )
}
