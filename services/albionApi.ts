import { AlbionPriceData, FlipOpportunity, City, GameServer } from '../types';

// Lista expandida para cobrir mais categorias do jogo
const DEMO_ITEMS = [
  // Bolsas
  "T4_BAG", "T5_BAG", "T6_BAG", "T7_BAG", "T8_BAG",
  "T4_BAG@1", "T5_BAG@1", "T6_BAG@1", "T4_BAG@2", "T5_BAG@2", "T4_BAG@3",
  
  // Capas
  "T4_CAPE", "T5_CAPE", "T6_CAPE", "T7_CAPE", "T8_CAPE",

  // Armas Populares
  "T4_MAIN_SWORD", "T5_MAIN_SWORD", "T6_MAIN_SWORD",
  "T4_2H_BOW", "T5_2H_BOW", "T6_2H_BOW",
  "T4_STAFF", "T5_STAFF", "T6_STAFF",

  // Armaduras
  "T4_HEAD_PLATE_SET3", "T5_HEAD_PLATE_SET3", // Guardian Helm
  "T4_ARMOR_LEATHER_SET1", "T5_ARMOR_LEATHER_SET1", // Mercenary Jacket
  "T4_SHOES_CLOTH_SET2", "T5_SHOES_CLOTH_SET2", // Cleric Sandals
  
  // Montarias
  "T3_MOUNT_HORSE", "T4_MOUNT_HORSE", "T5_MOUNT_HORSE", "T6_MOUNT_HORSE", "T7_MOUNT_HORSE", "T8_MOUNT_HORSE",
  "T3_MOUNT_OX", "T4_MOUNT_OX", "T5_MOUNT_OX", "T6_MOUNT_OX",
  "T8_MOUNT_MAMMOTH",
  
  // Consumíveis (Pots & Food)
  "T4_POTION_HEAL", "T6_POTION_HEAL",
  "T4_POTION_ENERGY", "T6_POTION_ENERGY",
  "T7_MEAL_OMELETTE", "T7_MEAL_STEW", "T8_MEAL_STEW",

  // Recursos Refinados (Muitas vezes usados para transporte)
  "T4_PLANKS", "T5_PLANKS",
  "T4_METALBAR", "T5_METALBAR",
  "T4_LEATHER", "T5_LEATHER",
  "T4_CLOTH", "T5_CLOTH"
];

const SERVER_URLS: Record<GameServer, string> = {
  west: "https://west.albion-online-data.com",
  east: "https://east.albion-online-data.com",
  europe: "https://europe.albion-online-data.com"
};

const TAX_RATE = 0.065; // 6.5% Premium Tax

// Dicionário de tradução corrigido para PT-BR Oficial
const ITEM_TRANSLATIONS: Record<string, string> = {
  'BAG': 'Bolsa',
  'CAPE': 'Capa',
  'MAIN_SWORD': 'Espada Larga',
  '2H_BOW': 'Arco de Guerra',
  'STAFF': 'Cajado',
  'HEAD_PLATE_SET3': 'Elmo do Guardião',
  'ARMOR_LEATHER_SET1': 'Casaco de Mercenário',
  'SHOES_CLOTH_SET2': 'Sandálias de Clérigo',
  'MOUNT_HORSE': 'Cavalo de Montar',
  'MOUNT_OX': 'Boi de Transporte',
  'MOUNT_MAMMOTH': 'Mamute de Transporte',
  'POTION_HEAL': 'Poção de Vida',
  'POTION_ENERGY': 'Poção de Energia',
  'MEAL_OMELETTE': 'Omelete',
  'MEAL_STEW': 'Ensopado',
  'PLANKS': 'Tábuas',
  'METALBAR': 'Barras de Metal',
  'LEATHER': 'Couro',
  'CLOTH': 'Tecido'
};

export const getEnchantment = (itemId: string): number => {
  const match = itemId.match(/@(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

export const getItemIconUrl = (itemId: string, quality: number = 1): string => {
  return `https://render.albiononline.com/v1/item/${itemId}?quality=${quality}`;
};

export const formatItemName = (itemId: string): string => {
  // Extrai o Tier (ex: T4)
  const tierMatch = itemId.match(/^T(\d+)_/);
  const tier = tierMatch ? `T${tierMatch[1]}` : '';
  
  // Remove o sufixo de encantamento para o nome limpo
  const cleanId = itemId.replace(/@\d+$/, '');

  // Extrai o código do item (ex: MAIN_SWORD)
  const itemCode = cleanId.replace(/^T\d+_/, '');
  
  // Busca tradução ou formata
  const translatedName = ITEM_TRANSLATIONS[itemCode] || 
    itemCode.replace(/_/g, ' ').replace(/SET\d/, '').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

  return `${translatedName} ${tier}`;
};

export const getItemTier = (itemId: string): string => {
  const match = itemId.match(/^T(\d)/);
  return match ? `T${match[1]}` : 'T?';
};

// Generate Mock Data if API fails
const generateMockData = (): FlipOpportunity[] => {
  const cities = Object.values(City);
  const opportunities: FlipOpportunity[] = [];

  for (let i = 0; i < 20; i++) {
    const item = DEMO_ITEMS[Math.floor(Math.random() * DEMO_ITEMS.length)];
    const buyCity = cities[Math.floor(Math.random() * cities.length)];
    let sellCity = cities[Math.floor(Math.random() * cities.length)];
    while (sellCity === buyCity) {
      sellCity = cities[Math.floor(Math.random() * cities.length)];
    }

    const quality = Math.floor(Math.random() * 5) + 1; // 1 to 5
    const basePrice = Math.floor(Math.random() * 50000) + 1000;
    const spread = Math.random() * 0.4 + 0.1; 
    const buyPrice = basePrice;
    const sellPrice = Math.floor(basePrice * (1 + spread));
    const profit = sellPrice * (1 - TAX_RATE) - buyPrice;
    const marketAverage = basePrice * 1.2; // Simula média

    opportunities.push({
      id: `${item}-${i}-${Date.now()}`,
      itemId: item,
      itemName: formatItemName(item),
      iconUrl: getItemIconUrl(item, quality),
      tier: getItemTier(item),
      quality: quality,
      enchantment: getEnchantment(item),
      buyCity,
      sellCity,
      buyPrice,
      sellPrice,
      marketAverage: Math.floor(marketAverage),
      profit: Math.floor(profit),
      profitMargin: parseFloat(((profit / buyPrice) * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 500) + 50,
      timestamp: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      discount: Math.floor(Math.random() * 25) // Mock discount
    });
  }
  
  return opportunities.sort((a, b) => b.profit - a.profit);
};

export interface MarketResponse {
  opportunities: FlipOpportunity[];
  status: 'online' | 'offline';
}

export const fetchMarketData = async (server: GameServer): Promise<MarketResponse> => {
  try {
    const itemsParam = DEMO_ITEMS.join(',');
    const baseUrl = SERVER_URLS[server];
    
    // Busca qualidades 1 a 5
    const url = `${baseUrl}/api/v2/stats/prices/${itemsParam}?qualities=1,2,3,4,5`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: AlbionPriceData[] = await response.json();

    const opportunities: FlipOpportunity[] = [];
    const itemsMap: Record<string, AlbionPriceData[]> = {};
    
    data.forEach(entry => {
      // itemsMap agrupa por Item ID EXATO (incluindo @1, @2 etc)
      if (!itemsMap[entry.item_id]) itemsMap[entry.item_id] = [];
      itemsMap[entry.item_id].push(entry);
    });

    Object.keys(itemsMap).forEach(itemId => {
      const entries = itemsMap[itemId];
      const enchantment = getEnchantment(itemId);
      
      entries.forEach(buyEntry => {
        if (buyEntry.sell_price_min <= 0) return;

        const buyDate = new Date(buyEntry.sell_price_min_date + 'Z'); 
        const hoursSinceUpdateBuy = (Date.now() - buyDate.getTime()) / (1000 * 60 * 60);
        
        // Filtro mais relaxado para aumentar resultados, mas indicaremos a data na UI
        if (hoursSinceUpdateBuy > 48) return;

        // Calcular média de preço deste item nesta qualidade em TODAS as cidades disponíveis
        const sameQualityEntries = entries.filter(e => e.quality === buyEntry.quality && e.sell_price_min > 0);
        const totalSellPrice = sameQualityEntries.reduce((sum, e) => sum + e.sell_price_min, 0);
        const avgPrice = sameQualityEntries.length > 0 ? totalSellPrice / sameQualityEntries.length : 0;
        
        // Calcular desconto em relação à média (se positivo, está mais barato que a média)
        const discount = avgPrice > 0 
          ? ((avgPrice - buyEntry.sell_price_min) / avgPrice) * 100 
          : 0;

        entries.forEach(sellEntry => {
          if (sellEntry.sell_price_min <= 0) return;
          if (buyEntry.city === sellEntry.city) return;
          if (buyEntry.quality !== sellEntry.quality) return;

          const sellDate = new Date(sellEntry.sell_price_min_date + 'Z');
          const hoursSinceUpdateSell = (Date.now() - sellDate.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceUpdateSell > 48) return;

          const potentialRevenue = sellEntry.sell_price_min * (1 - TAX_RATE);
          const potentialProfit = potentialRevenue - buyEntry.sell_price_min;
          const profitMargin = (potentialProfit / buyEntry.sell_price_min) * 100;

          // Filtro de Outliers extremo
          if (sellEntry.sell_price_min > buyEntry.sell_price_min * 10) return;

          if (potentialProfit > 0) {
            opportunities.push({
              id: `${itemId}-${buyEntry.city}-${sellEntry.city}-${buyEntry.quality}-${server}`,
              itemId: itemId,
              itemName: formatItemName(itemId),
              iconUrl: getItemIconUrl(itemId, buyEntry.quality),
              tier: getItemTier(itemId),
              quality: buyEntry.quality,
              enchantment: enchantment,
              buyCity: buyEntry.city,
              sellCity: sellEntry.city,
              buyPrice: buyEntry.sell_price_min,
              sellPrice: sellEntry.sell_price_min,
              marketAverage: Math.floor(avgPrice), // Adiciona a média calculada
              profit: Math.floor(potentialProfit),
              profitMargin: parseFloat(profitMargin.toFixed(2)),
              volume: 100, 
              timestamp: new Date().toISOString(),
              lastUpdate: sellEntry.sell_price_min_date, // Usa a data da venda pois é o destino
              discount: discount
            });
          }
        });
      });
    });

    if (opportunities.length === 0 && data.length === 0) {
       console.warn("API vazia ou filtrada, usando mock");
       return { opportunities: generateMockData(), status: 'offline' };
    }

    return { 
      opportunities: opportunities.sort((a, b) => b.profit - a.profit), 
      status: 'online' 
    };

  } catch (error) {
    console.error("Falha na API, usando dados simulados:", error);
    return { opportunities: generateMockData(), status: 'offline' };
  }
};