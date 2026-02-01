import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { dados } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Atue como RH. Otimize os textos abaixo para a vaga: "${dados.vagaTexto}". 
    Resumo atual: ${dados.resumo}. Exp atual: ${dados.exp}. Skills: ${dados.skills}.
    Retorne APENAS um JSON: {"resumo": "...", "exp": "...", "skills": "..."}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return NextResponse.json(JSON.parse(text));
  } catch (e) {
    return NextResponse.json({ error: "Erro na IA" }, { status: 500 });
  }
}
