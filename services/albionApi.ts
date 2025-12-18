
import { AlbionPriceData, FlipOpportunity, City, GameServer } from '../types';

// Lista expandida para cobrir quase todos os itens de transporte comum e alta margem
const DEMO_ITEMS = [
  // Bolsas e Capas (T4 a T8 e seus encantamentos)
  "T4_BAG", "T5_BAG", "T6_BAG", "T7_BAG", "T8_BAG",
  "T4_BAG@1", "T4_BAG@2", "T4_BAG@3", "T5_BAG@1", "T5_BAG@2", "T5_BAG@3",
  "T6_BAG@1", "T6_BAG@2", "T6_BAG@3", "T7_BAG@1", "T7_BAG@2", "T7_BAG@3",
  "T8_BAG@1", "T8_BAG@2", "T8_BAG@3",
  "T4_CAPE", "T5_CAPE", "T6_CAPE", "T7_CAPE", "T8_CAPE",
  "T4_CAPE@1", "T4_CAPE@2", "T4_CAPE@3", "T5_CAPE@1", "T5_CAPE@2", "T5_CAPE@3",
  "T6_CAPE@1", "T6_CAPE@2", "T6_CAPE@3",
  
  // Capas de Facção e Especiais
  "T4_CAPEITEM_FW_MARTLOCK", "T4_CAPEITEM_FW_LYMHURST", "T4_CAPEITEM_FW_FORTSTERLING", 
  "T4_CAPEITEM_FW_THETFORD", "T4_CAPEITEM_FW_BRIDGEWATCH", "T4_CAPEITEM_FW_CAERLEON",
  "T6_CAPEITEM_FW_MARTLOCK", "T6_CAPEITEM_FW_LYMHURST", "T6_CAPEITEM_FW_FORTSTERLING",
  "T8_CAPEITEM_FW_MARTLOCK", "T8_CAPEITEM_FW_LYMHURST", "T8_CAPEITEM_FW_FORTSTERLING",

  // Armas Populares e seus encantamentos
  "T4_MAIN_SWORD", "T5_MAIN_SWORD", "T6_MAIN_SWORD", "T7_MAIN_SWORD", "T8_MAIN_SWORD",
  "T4_MAIN_SWORD@1", "T4_MAIN_SWORD@2", "T4_MAIN_SWORD@3",
  "T4_2H_BOW", "T5_2H_BOW", "T6_2H_BOW", "T7_2H_BOW", "T8_2H_BOW",
  "T4_2H_BOW@1", "T4_2H_BOW@2", "T4_2H_BOW@3",
  "T4_MAIN_AXE", "T5_MAIN_AXE", "T6_MAIN_AXE", "T7_MAIN_AXE", "T8_MAIN_AXE",
  "T4_2H_FIRESTAFF", "T6_2H_FIRESTAFF", "T8_2H_FIRESTAFF",
  "T4_2H_HOLYSTAFF", "T6_2H_HOLYSTAFF", "T8_2H_HOLYSTAFF",
  "T4_MAIN_SPEAR", "T6_MAIN_SPEAR", "T8_MAIN_SPEAR",

  // Armaduras (Sets Populares)
  "T4_HEAD_PLATE_SET3", "T5_HEAD_PLATE_SET3", "T6_HEAD_PLATE_SET3", "T7_HEAD_PLATE_SET3", "T8_HEAD_PLATE_SET3",
  "T4_ARMOR_LEATHER_SET1", "T5_ARMOR_LEATHER_SET1", "T6_ARMOR_LEATHER_SET1",
  "T4_SHOES_CLOTH_SET2", "T5_SHOES_CLOTH_SET2", "T6_SHOES_CLOTH_SET2",
  "T4_ARMOR_PLATE_SET2", "T6_ARMOR_PLATE_SET2", "T8_ARMOR_PLATE_SET2", // Soldier Armor
  "T4_HEAD_LEATHER_SET2", "T6_HEAD_LEATHER_SET2", "T8_HEAD_LEATHER_SET2", // Hunter Hood
  
  // Montarias (Essencial para transporte)
  "T3_MOUNT_HORSE", "T4_MOUNT_HORSE", "T5_MOUNT_HORSE", "T6_MOUNT_HORSE", "T7_MOUNT_HORSE", "T8_MOUNT_HORSE",
  "T3_MOUNT_OX", "T4_MOUNT_OX", "T5_MOUNT_OX", "T6_MOUNT_OX", "T7_MOUNT_OX", "T8_MOUNT_OX",
  "T4_MOUNT_GIANTSTAG", "T6_MOUNT_GIANTSTAG",
  "T5_MOUNT_SWIFTCLAW", "T8_MOUNT_DIREBOAR", "T8_MOUNT_MAMMOTH",
  
  // Consumíveis e Comidas
  "T4_POTION_HEAL", "T6_POTION_HEAL", "T4_POTION_COOLDOWN", "T6_POTION_COOLDOWN",
  "T7_MEAL_OMELETTE", "T7_MEAL_STEW", "T8_MEAL_STEW", "T8_MEAL_OMELETTE",
  "T7_MEAL_OMELETTE@1", "T7_MEAL_STEW@1",

  // Recursos Refinados
  "T4_PLANKS", "T5_PLANKS", "T6_PLANKS", "T7_PLANKS", "T8_PLANKS",
  "T4_METALBAR", "T5_METALBAR", "T6_METALBAR", "T7_METALBAR", "T8_METALBAR",
  "T4_LEATHER", "T5_LEATHER", "T6_LEATHER", "T7_LEATHER", "T8_LEATHER",
  "T4_CLOTH", "T5_CLOTH", "T6_CLOTH", "T7_CLOTH", "T8_CLOTH",
  "T4_STONEBLOCK", "T5_STONEBLOCK", "T6_STONEBLOCK", "T7_STONEBLOCK", "T8_STONEBLOCK"
];

const SERVER_URLS: Record<GameServer, string> = {
  west: "https://west.albion-online-data.com",
  east: "https://east.albion-online-data.com",
  europe: "https://europe.albion-online-data.com"
};

const TAX_RATE = 0.065; // Mantido para o fallback do mock

const ITEM_TRANSLATIONS: Record<string, string> = {
  'BAG': 'Bolsa',
  'CAPE': 'Capa',
  'MAIN_SWORD': 'Espada Larga',
  '2H_BOW': 'Arco de Guerra',
  'MAIN_AXE': 'Machado de Batalha',
  '2H_FIRESTAFF': 'Cajado de Fogo Grande',
  '2H_HOLYSTAFF': 'Cajado Sagrado Grande',
  'MAIN_SPEAR': 'Lança',
  'HEAD_PLATE_SET3': 'Elmo do Guardião',
  'ARMOR_PLATE_SET2': 'Armadura de Soldado',
  'HEAD_LEATHER_SET2': 'Capuz de Caçador',
  'ARMOR_LEATHER_SET1': 'Casaco de Mercenário',
  'SHOES_CLOTH_SET2': 'Sandálias de Clérigo',
  'MOUNT_HORSE': 'Cavalo de Montar',
  'MOUNT_OX': 'Boi de Transporte',
  'MOUNT_GIANTSTAG': 'Veado Gigante',
  'MOUNT_SWIFTCLAW': 'Garra-ligeira',
  'MOUNT_DIREBOAR': 'Javali Vil',
  'MOUNT_MAMMOTH': 'Mamute de Transporte',
  'POTION_HEAL': 'Poção de Vida',
  'POTION_COOLDOWN': 'Poção de Recarga',
  'MEAL_OMELETTE': 'Omelete',
  'MEAL_STEW': 'Ensopado',
  'PLANKS': 'Tábuas',
  'METALBAR': 'Barras de Metal',
  'LEATHER': 'Couro',
  'CLOTH': 'Tecido',
  'STONEBLOCK': 'Blocos de Pedra',
  'CAPEITEM_FW_MARTLOCK': 'Capa de Martlock',
  'CAPEITEM_FW_LYMHURST': 'Capa de Lymhurst',
  'CAPEITEM_FW_FORTSTERLING': 'Capa de Fort Sterling',
  'CAPEITEM_FW_THETFORD': 'Capa de Thetford',
  'CAPEITEM_FW_BRIDGEWATCH': 'Capa de Bridgewatch',
  'CAPEITEM_FW_CAERLEON': 'Capa de Caerleon'
};

export const getEnchantment = (itemId: string): number => {
  const match = itemId.match(/@(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

export const getItemIconUrl = (itemId: string, quality: number = 1): string => {
  return `https://render.albiononline.com/v1/item/${itemId}?quality=${quality}`;
};

export const formatItemName = (itemId: string): string => {
  const tierMatch = itemId.match(/^T(\d+)_/);
  const tier = tierMatch ? `T${tierMatch[1]}` : '';
  const cleanId = itemId.replace(/@\d+$/, '');
  const itemCode = cleanId.replace(/^T\d+_/, '');
  const translatedName = ITEM_TRANSLATIONS[itemCode] || 
    itemCode.replace(/_/g, ' ').replace(/SET\d/, '').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  return `${translatedName} ${tier}`;
};

export const getItemTier = (itemId: string): string => {
  const match = itemId.match(/^T(\d)/);
  return match ? `T${match[1]}` : 'T?';
};

const generateMockData = (): FlipOpportunity[] => {
  const cities = Object.values(City);
  const opportunities: FlipOpportunity[] = [];
  for (let i = 0; i < 20; i++) {
    const item = DEMO_ITEMS[Math.floor(Math.random() * DEMO_ITEMS.length)];
    const buyCity = cities[Math.floor(Math.random() * cities.length)];
    let sellCity = cities[Math.floor(Math.random() * cities.length)];
    while (sellCity === buyCity) sellCity = cities[Math.floor(Math.random() * cities.length)];
    const quality = Math.floor(Math.random() * 5) + 1;
    const basePrice = Math.floor(Math.random() * 50000) + 1000;
    const spread = Math.random() * 0.4 + 0.1; 
    const buyPrice = basePrice;
    const sellPrice = Math.floor(basePrice * (1 + spread));
    const profit = sellPrice * (1 - TAX_RATE) - buyPrice;
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
      marketAverage: Math.floor(basePrice * 1.2),
      profit: Math.floor(profit),
      profitMargin: parseFloat(((profit / buyPrice) * 100).toFixed(2)),
      volume: 100,
      timestamp: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      discount: Math.floor(Math.random() * 25)
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
    const url = `${baseUrl}/api/v2/stats/prices/${itemsParam}?qualities=1,2,3,4,5`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data: AlbionPriceData[] = await response.json();
    const opportunities: FlipOpportunity[] = [];
    const itemsMap: Record<string, AlbionPriceData[]> = {};
    
    data.forEach(entry => {
      if (!itemsMap[entry.item_id]) itemsMap[entry.item_id] = [];
      itemsMap[entry.item_id].push(entry);
    });

    Object.keys(itemsMap).forEach(itemId => {
      const entries = itemsMap[itemId];
      const enchantment = getEnchantment(itemId);
      entries.forEach(buyEntry => {
        if (buyEntry.sell_price_min <= 0) return;
        const sameQualityEntries = entries.filter(e => e.quality === buyEntry.quality && e.sell_price_min > 0);
        const totalSellPrice = sameQualityEntries.reduce((sum, e) => sum + e.sell_price_min, 0);
        const avgPrice = sameQualityEntries.length > 0 ? totalSellPrice / sameQualityEntries.length : 0;
        const discount = avgPrice > 0 ? ((avgPrice - buyEntry.sell_price_min) / avgPrice) * 100 : 0;

        entries.forEach(sellEntry => {
          if (sellEntry.sell_price_min <= 0) return;
          if (buyEntry.city === sellEntry.city) return;
          if (buyEntry.quality !== sellEntry.quality) return;
          if (sellEntry.sell_price_min > buyEntry.sell_price_min * 15) return; // Anti-manipulação

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
            marketAverage: Math.floor(avgPrice),
            profit: 0, // Calculado no App.tsx
            profitMargin: 0, // Calculado no App.tsx
            volume: 100, 
            timestamp: new Date().toISOString(),
            lastUpdate: sellEntry.sell_price_min_date,
            discount: discount
          });
        });
      });
    });

    if (opportunities.length === 0) return { opportunities: generateMockData(), status: 'offline' };
    return { opportunities, status: 'online' };
  } catch (error) {
    return { opportunities: generateMockData(), status: 'offline' };
  }
};
