import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chave ausente" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const { dados } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Atue como RH. Melhore os textos: "${JSON.stringify(dados)}". Retorne um JSON com: {"resumo": "...", "exp": "...", "skills": "..."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json({ error: "Erro na IA" }, { status: 500 });
  }
}
