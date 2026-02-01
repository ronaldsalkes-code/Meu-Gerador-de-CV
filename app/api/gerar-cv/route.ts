import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { dados } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Falta a chave API na Vercel" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Melhore o currículo de ${dados.nome || 'usuário'}. 
    Vaga: ${dados.vagaTexto}. 
    Retorne apenas JSON: {"resumo": "...", "exp": "...", "skills": "..."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Erro IA:", error);
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 });
  }
}
