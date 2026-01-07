export interface Competitor {
  name: string;
  location: string;
  price: number;
}

export interface NielsenData {
  marketShare: number;
  coreSegment: string;
  penetration: number;
  regionalRanking: number;
}

export interface PrixsiaData {
  minPrice: number;
  avgPrice: number;
  medianPrice: number;
  maxPrice: number;
  competitors: Competitor[];
}

export interface ShoppingBrasilData {
  link: string;
  title: string;
  adPrice: number;
  startDate: string;
  detail: string;
}

export interface GlobalSegmentData {
  competitor: string;
  lastCampaign: string;
  campaignDate: string;
  reach: string;
  investment: string;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
  margin: number;
  sales: number;
  rentability: number;
  competitiveness: number;
  growth: number;
  isRepeated: boolean;
  hasAd: boolean;
  nielsen: NielsenData;
  prixsia: PrixsiaData;
  shoppingBrasil: ShoppingBrasilData;
  globalSegments: GlobalSegmentData[];
}

export interface ProductGroup {
  id: string;
  name: string;
  percentage: number;
  products: Product[];
}

export interface FilterState {
  searchQuery: string;
  region: string;
  section: string;
  campaign: string;
  strategy: string;
  weightQty: number;
  weightMargin: number;
  weightSales: number;
  weightCompetitiveness: number;
  weightGrowth: number;
  productCount: number;
  allowRepetition: string;
  startDate: string;
  endDate: string;
}

export interface ScoreResult {
  score: number;
  shortReason: string;
  detailedReasons: string[];
}
