import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/next-server";

export async function POST(req: Request) {
  try {
    const { dados } = await req.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Você é um especialista em RH e recrutamento. Seu objetivo é MELHORAR o currículo abaixo sem apagar informações importantes.
      
      DADOS ATUAIS:
      Nome: ${dados.nome}
      Cargo: ${dados.cargo}
      Resumo: ${dados.resumo}
      Experiência: ${dados.exp}
      Skills: ${dados.skills}
      
      VAGA ALVO: ${dados.vagaTexto}
      
      INSTRUÇÕES CRUIAIS:
      1. NÃO apague as experiências, apenas as reescreva para ficarem mais profissionais.
      2. Mantenha os dados de contato originais.
      3. Use palavras-chave da VAGA ALVO no Resumo e nas Skills.
      4. O tom deve ser corporativo e persuasivo.
      
      Responda APENAS em formato JSON como no exemplo:
      {
        "resumo": "Novo resumo aqui...",
        "exp": "Novas experiências aqui...",
        "skills": "Novas skills aqui..."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Limpa o texto caso o Gemini mande blocos de código ```json
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(cleanedJson));

  } catch (error) {
    return NextResponse.json({ error: "Erro na IA" }, { status: 500 });
  }
}
