// app/api/gerar-cv/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { dados } = await request.json()

    if (!dados) {
      return NextResponse.json(
        { error: 'Dados não fornecidos' },
        { status: 400 }
      )
    }

    // Aqui você integraria com a API do Claude ou outro LLM
    // Exemplo com fetch para Anthropic Claude API:
    
    /*
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Você é um especialista em recrutamento e seleção. Otimize o currículo abaixo para a seguinte vaga:

VAGA:
${dados.vagaTexto}

CURRÍCULO ATUAL:
Nome: ${dados.nome}
Cargo: ${dados.cargo}
Resumo: ${dados.resumo}
Experiência: ${dados.exp}
Habilidades: ${dados.skills}

Por favor, retorne um JSON com:
- resumo: versão otimizada do resumo profissional (máximo 150 palavras)
- exp: experiência profissional reformulada para destacar conquistas relevantes à vaga
- skills: habilidades reorganizadas por relevância para a vaga

Foque em:
1. Usar palavras-chave da descrição da vaga
2. Quantificar resultados sempre que possível
3. Destacar competências mais relevantes
4. Usar verbos de ação fortes
5. Manter tom profissional e objetivo

Retorne APENAS o JSON, sem explicações adicionais.`
        }]
      })
    })

    const result = await response.json()
    const conteudo = result.content[0].text
    
    // Parse do JSON retornado pelo Claude
    const otimizado = JSON.parse(conteudo)
    */

    // Simulação de resposta (remover quando integrar com API real)
    const otimizado = {
      resumo: `${dados.resumo}\n\n[Otimizado pela IA com base na vaga: ${dados.vagaTexto.substring(0, 100)}...]`,
      exp: dados.exp + '\n\n[Experiências reorganizadas e destacadas pela IA]',
      skills: dados.skills + ', [Habilidades priorizadas pela IA]'
    }

    return NextResponse.json(otimizado)

  } catch (error) {
    console.error('Erro ao gerar CV:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

// Configuração para Edge Runtime (opcional, para melhor performance)
export const runtime = 'edge'
