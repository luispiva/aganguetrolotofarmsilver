import { GoogleGenAI } from "@google/genai";
import { FlipOpportunity } from "../types";

export const analyzeTrade = async (flip: FlipOpportunity): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    return "Erro: API_KEY não configurada no Vercel. Adicione-a nas Environment Variables.";
  }

  try {
    // Instanciação correta conforme regras do SDK
    const ai = new GoogleGenAI({ apiKey });
    const isDangerous = flip.buyCity === 'Caerleon' || flip.sellCity === 'Caerleon' || flip.sellCity === 'Black Market';
    
    const prompt = `
      Atue como um analista veterano do Albion Online.
      Analise esta oportunidade:
      - Item: ${flip.itemName} (Tier ${flip.tier})
      - Rota: ${flip.buyCity} -> ${flip.sellCity}
      - Lucro Estimado: ${flip.profit.toLocaleString()} de prata
      - Margem (ROI): ${flip.profitMargin}%
      - Risco da Rota: ${isDangerous ? 'ALTO (Zona Vermelha - Full Loot)' : 'BAIXO (Zonas Seguras)'}
      
      Forneça uma análise técnica curta (máximo 50 palavras) em Português do Brasil.
      Veredito final em uma palavra entre colchetes: [RECOMENDADO], [CUIDADO] ou [ARRISCADO].
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise técnica.";
  } catch (error: any) {
    console.error("Erro na chamada do Gemini:", error);
    return "Erro ao consultar a IA. Verifique os logs do Vercel.";
  }
};

export const getMarketOverview = async (flips: FlipOpportunity[]): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || flips.length === 0) return "";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const topItems = flips.slice(0, 3).map(f => f.itemName).join(', ');
    const prompt = `Resuma o mercado atual de Albion em uma frase impactante, citando estes itens: ${topItems}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    return "";
  }
};