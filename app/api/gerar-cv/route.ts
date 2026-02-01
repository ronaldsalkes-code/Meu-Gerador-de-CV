import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Pega a chave da Vercel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { dados } = await req.json();
    
    // Configura o modelo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Instruções para a IA
    const prompt = `
      Você é um especialista em RH. Melhore os textos deste currículo para a vaga: "${dados.vagaTexto}".
      Mantenha os dados reais, apenas melhore a escrita para parecer mais profissional.
      
      Dados atuais:
      - Resumo: ${dados.resumo}
      - Experiência: ${dados.exp}
      - Skills: ${dados.skills}

      Retorne APENAS um JSON (sem markdown) no formato:
      {
        "resumo": "novo texto melhorado",
        "exp": "novo texto melhorado",
        "skills": "novas skills"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Limpeza de segurança (caso a IA mande ```json)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Erro API:", error);
    return NextResponse.json({ error: "Erro interno na IA" }, { status: 500 });
  }
}
