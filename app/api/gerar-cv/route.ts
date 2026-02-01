import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chave API ausente na Vercel" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { dados } = await req.json();
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Melhore o currículo para a vaga: "${dados.vagaTexto}". 
    Retorne apenas JSON: {"resumo": "...", "exp": "...", "skills": "..."}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json({ error: "Erro no processamento" }, { status: 500 });
  }
}
