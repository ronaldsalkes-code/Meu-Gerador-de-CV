import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server"; // Corrigido aqui

export async function POST(req: Request) {
  try {
    const { dados } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Chave API não configurada na Vercel" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um especialista em RH. Melhore o currículo abaixo para a vaga informada.
      
      DADOS DO USUÁRIO:
      Nome: ${dados.nome}
      Cargo Atual/Pretendido: ${dados.cargo}
      Resumo Atual: ${dados.resumo}
      Experiência: ${dados.exp}
      Skills: ${dados.skills}
      
      VAGA ALVO: ${dados.vagaTexto}
      
      REGRAS:
      1. NÃO apague as experiências, apenas torne-as mais profissionais e impactantes.
      2. Use palavras-chave da vaga alvo.
      3. Se o resumo estiver vazio, crie um excelente com base nas experiências.
      4. Mantenha os dados pessoais intactos.
      
      Responda estritamente em JSON:
      {
        "resumo": "texto",
        "exp": "texto",
        "skills": "texto"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Limpeza de segurança para garantir que o JSON seja lido corretamente
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanedJson));

  } catch (error) {
    console.error("Erro na rota da IA:", error);
    return NextResponse.json({ error: "Falha ao processar IA" }, { status: 500 });
  }
}
