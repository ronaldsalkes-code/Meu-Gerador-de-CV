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

    // Verificar se tem API key configurada
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY não configurada!')
      return NextResponse.json(
        { error: 'Serviço de IA temporariamente indisponível. Configure a ANTHROPIC_API_KEY.' },
        { status: 503 }
      )
    }

    // Chamar API do Claude (Anthropic)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: `Você é um especialista em recrutamento e otimização de currículos. Sua missão é otimizar o currículo abaixo para a vaga específica fornecida.

DESCRIÇÃO DA VAGA:
${dados.vagaTexto}

DADOS DO CANDIDATO:
Nome: ${dados.nome}
Cargo Desejado: ${dados.cargo}

RESUMO PROFISSIONAL ATUAL:
${dados.resumo}

EXPERIÊNCIA PROFISSIONAL ATUAL:
${dados.exp}

HABILIDADES ATUAIS:
${dados.skills}

INSTRUÇÕES:
1. Analise cuidadosamente a descrição da vaga e identifique as palavras-chave mais importantes
2. Otimize cada seção para maximizar compatibilidade com sistemas ATS (Applicant Tracking Systems)
3. Mantenha a veracidade - NÃO invente informações, apenas reformule e reorganize
4. Use verbos de ação fortes e quantifique resultados quando possível
5. Priorize as experiências e habilidades mais relevantes para esta vaga específica
6. Garanta que as palavras-chave da vaga apareçam naturalmente no currículo

FORMATO DE RESPOSTA:
Retorne APENAS um objeto JSON válido (sem markdown, sem explicações) no seguinte formato:

{
  "resumo": "Resumo profissional otimizado (150-200 palavras) que destaca experiência relevante e usa palavras-chave da vaga",
  "exp": "Experiências profissionais reorganizadas e reformuladas, priorizando as mais relevantes para a vaga. Use bullets (•) para cada responsabilidade/conquista",
  "skills": "Habilidades reorganizadas por ordem de relevância para a vaga, separadas por vírgulas"
}

IMPORTANTE: 
- Mantenha o tom profissional mas impactante
- Use números e métricas quando disponíveis nas informações fornecidas
- Não invente experiências ou habilidades que não estão nos dados originais
- Foque em destacar o que já existe de forma mais estratégica`
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Erro na API do Claude:', errorData)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API Key inválida. Verifique sua configuração.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: `Erro ao processar solicitação: ${response.status}` },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    if (!result.content || result.content.length === 0) {
      throw new Error('Resposta vazia da API')
    }

    // Extrair texto da resposta
    const textoResposta = result.content[0].text
    
    // Parse do JSON retornado pelo Claude
    let otimizado
    try {
      // Tentar fazer parse direto
      otimizado = JSON.parse(textoResposta)
    } catch (parseError) {
      // Se falhar, tentar extrair JSON de dentro do texto
      const jsonMatch = textoResposta.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        otimizado = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Formato de resposta inválido da IA')
      }
    }

    // Validar que tem os campos necessários
    if (!otimizado.resumo || !otimizado.exp || !otimizado.skills) {
      throw new Error('Resposta da IA está incompleta')
    }

    return NextResponse.json(otimizado)

  } catch (error: any) {
    console.error('Erro ao gerar CV:', error)
    
    // Retornar mensagem de erro mais específica
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao processar solicitação',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    )
  }
}

// Configuração para Edge Runtime (melhor performance)
export const runtime = 'edge'
