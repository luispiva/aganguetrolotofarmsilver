import { GoogleGenAI } from "@google/genai";
import { FlipOpportunity } from "../types";

// Inicialização seguindo as diretrizes de segurança e performance
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTrade = async (flip: FlipOpportunity): Promise<string> => {
  try {
    // 1. Cálculo de Taxa e Custos
    const taxRate = 0.065; // 6.5% Premium
    const taxCost = Math.floor(flip.sellPrice * taxRate);
    
    // 2. Análise de Risco de Rota
    const isDangerousRoute = 
      flip.buyCity === 'Caerleon' || 
      flip.sellCity === 'Caerleon' || 
      flip.sellCity === 'Black Market';
    
    const riskProfile = isDangerousRoute 
      ? "ALTO RISCO (Envolve Zona Vermelha/Full Loot - Possível Gank)" 
      : "BAIXO RISCO (Viagem segura por Zonas Azuis/Amarelas)";

    // 3. Classificação de Liquidez
    let liquidityLabel = "BAIXA";
    if (flip.volume > 150) liquidityLabel = "MÉDIA";
    if (flip.volume > 400) liquidityLabel = "ALTA";

    const prompt = `
      Atue como um especialista em economia e trader veterano do Albion Online.
      Analise tecnicamente esta oportunidade de arbitragem com os seguintes dados processados:
      
      DADOS DO PRODUTO:
      - Item: ${flip.itemName} (Tier ${flip.tier}, Qualidade ${flip.quality})
      - Liquidez/Giro: ${liquidityLabel} (Volume base: ${flip.volume})
      
      DADOS DA ROTA:
      - Origem: ${flip.buyCity} -> Destino: ${flip.sellCity}
      - Perfil de Viagem: ${riskProfile}
      
      FINANCEIRO (Valores em Prata):
      - Preço Compra: ${flip.buyPrice}
      - Preço Venda: ${flip.sellPrice}
      - Custo de Imposto (6.5%): -${taxCost}
      - Lucro Líquido Real: ${flip.profit}
      - Retorno (ROI): ${flip.profitMargin}%
      
      TAREFA:
      Forneça uma análise estratégica concisa (máximo 80 palavras) em Português do Brasil.
      Avalie se o lucro líquido justifica o risco da rota e se a liquidez permite um retorno rápido do capital investido.
      Termine com um veredito: "Altamente Recomendado", "Cautela Necessária" ou "Não Recomendado".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise detalhada.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Análise de IA indisponível. Verifique se a API_KEY foi configurada na Vercel.";
  }
};

export const getMarketOverview = async (flips: FlipOpportunity[]): Promise<string> => {
  try {
    const topFlips = flips.slice(0, 5).map(f => `${f.itemName}: Compra ${f.buyCity} -> Venda ${f.sellCity} (${f.profitMargin}% margem)`).join('\n');

    const prompt = `
      Aqui estão as top 5 oportunidades de arbitragem no Albion Online agora:
      ${topFlips}
      
      Resuma a condição atual do mercado em 2 frases em Português. 
      Existem cidades específicas dominando a oferta ou demanda?
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Visão geral indisponível.";
  } catch (error) {
    return "Não foi possível gerar a visão geral do mercado.";
  }
};