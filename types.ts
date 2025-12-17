export type GameServer = 'west' | 'east' | 'europe';

export interface AlbionPriceData {
  item_id: string;
  city: string;
  quality: number;
  sell_price_min: number;
  sell_price_min_date: string;
  buy_price_max: number;
  buy_price_max_date: string;
}

export interface FlipOpportunity {
  id: string;
  itemId: string;
  itemName: string;
  iconUrl: string; // Nova propriedade para a URL do ícone
  tier: string;
  quality: number;
  enchantment: number;
  buyCity: string;
  sellCity: string;
  buyPrice: number;
  sellPrice: number;
  marketAverage: number; // Nova propriedade: Média de preço global para comparação
  profit: number;
  profitMargin: number; // Percentage
  volume: number; // Mocked volume for this demo
  timestamp: string;
  lastUpdate: string; // Nova propriedade: Data da atualização do preço de venda
  discount: number; // Porcentagem de quão mais barato está em relação à média global
}

export enum City {
  Caerleon = "Caerleon",
  Bridgewatch = "Bridgewatch",
  FortSterling = "Fort Sterling",
  Lymhurst = "Lymhurst",
  Martlock = "Martlock",
  Thetford = "Thetford",
  BlackMarket = "Black Market"
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}