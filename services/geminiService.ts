import { GoogleGenAI } from "@google/genai";
import { FlipOpportunity } from "../types";

/**
 * Inicializa o cliente Gemini de forma segura.
 * O process.env.API_KEY é injetado pelo Vite conforme definido no vite.config.ts.
 */
const getAIClient = () => {
  try {
    const key = process.env.API_KEY;
    if (!key || key === "undefined" || key === "") {
      console.warn("Aviso: API_KEY não configurada nas variáveis de ambiente.");
      return null;
    }
    return new GoogleGenAI({ apiKey: key });
  } catch (e) {
    console.error("Erro ao inicializar GoogleGenAI:", e);
    return null;
  }
};

export const analyzeTrade = async (flip: FlipOpportunity): Promise<string> => {
  const genAI = getAIClient();
  if (!genAI) {
    return "A análise de IA requer uma API_KEY configurada na Vercel para funcionar.";
  }

  try {
    const isDangerous = flip.buyCity === 'Caerleon' || flip.sellCity === 'Caerleon' || flip.sellCity === 'Black Market';
    
    const prompt = `
      Atue como um analista veterano do Albion Online.
      Analise esta oportunidade:
      - Item: ${flip.itemName} (Tier ${flip.tier})
      - Rota: ${flip.buyCity} -> ${flip.sellCity}
      - Lucro Estimado: ${flip.profit.toLocaleString()} de prata
      - Margem (ROI): ${flip.profitMargin}%
      - Risco da Rota: ${isDangerous ? 'ALTO (Zona Vermelha)' : 'BAIXO (Zonas Seguras)'}
      
      Forneça uma análise de no máximo 50 palavras em Português do Brasil focando em liquidez e perigo. 
      Termine com um veredito curto: [RECOMENDADO], [CUIDADO] ou [ARRISCADO].
    `;

    const response = await genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível obter uma análise clara no momento.";
  } catch (error) {
    console.error("Erro na chamada do Gemini:", error);
    return "Ocorreu um erro ao consultar a inteligência artificial.";
  }
};

export const getMarketOverview = async (flips: FlipOpportunity[]): Promise<string> => {
  const genAI = getAIClient();
  if (!genAI || flips.length === 0) return "";

  try {
    const topItems = flips.slice(0, 3).map(f => f.itemName).join(', ');
    const prompt = `Resuma o mercado atual de Albion Online em uma frase curta baseado nestes itens lucrativos: ${topItems}.`;

    const response = await genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    return "";
  }
};