
import { GoogleGenAI } from "@google/genai";
import { FlipOpportunity } from "../types";

/**
 * Analisa uma oportunidade de flip usando o modelo Gemini 3 Flash.
 * Segue rigorosamente as diretrizes do SDK para instanciamento direto e acesso a propriedades.
 */
export const analyzeTrade = async (flip: FlipOpportunity): Promise<string> => {
  try {
    // Instanciação correta com o process.env.API_KEY direto conforme diretrizes do desenvolvedor
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    // Acesso direto à propriedade .text conforme as regras (não é um método)
    return response.text || "Não foi possível gerar a análise técnica.";
  } catch (error: any) {
    console.error("Erro na chamada do Gemini:", error);
    return "Erro ao consultar a IA para análise técnica.";
  }
};

/**
 * Gera um resumo do mercado atual usando IA.
 */
export const getMarketOverview = async (flips: FlipOpportunity[]): Promise<string> => {
  if (flips.length === 0) return "";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const topItems = flips.slice(0, 3).map(f => f.itemName).join(', ');
    const prompt = `Resuma o mercado atual de Albion em uma frase impactante e curta (máximo 15 palavras), citando estes itens como tendências: ${topItems}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Erro ao gerar resumo do mercado:", error);
    return "";
  }
};
