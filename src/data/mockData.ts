import { Product, ProductGroup } from '@/types/product';

export const mockProducts: Product[] = [
  {
    id: '127400',
    name: 'cerv.brahma chopp 350ml la',
    imageUrl: 'https://sgp.condor.com.br/banco/produto/7891991010974/7891991010974_1.png',
    price: 3.59,
    stock: 8,
    margin: 0.22,
    sales: 1400,
    rentability: 0.18,
    competitiveness: 0.70,
    growth: 0.10,
    isRepeated: false,
    hasAd: true,
    nielsen: {
      marketShare: 7,
      coreSegment: 'Médio',
      penetration: 10,
      regionalRanking: 6
    },
    prixsia: {
      minPrice: 2.59,
      avgPrice: 3.21,
      medianPrice: 3.35,
      maxPrice: 4.49,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 3.95 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 2.89 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 2.59 },
        { name: 'MAX ATACAD. PIONEIRO JD', location: 'MORUMBI', price: 2.89 }
      ]
    },
    shoppingBrasil: {
      link: 'https://www.shoppingbrasil.com.br/produto/127400',
      title: 'Cerveja Brahma Chopp Lata 350ml',
      adPrice: 3.69,
      startDate: '05/08/2025',
      detail: 'Oferta válida para todo o Brasil.'
    },
    globalSegments: [
      { competitor: 'Mercado BomPreço', lastCampaign: 'TV Aberta', campaignDate: 'Jun/25', reach: '330 mil', investment: 'R$ 8.000' },
      { competitor: 'Super Mais Barato', lastCampaign: 'Rádio', campaignDate: 'Maio/25', reach: '150 mil', investment: 'R$ 3.000' }
    ]
  },
  {
    id: '1875939',
    name: 'cerv.brahma duplo malte 350ml la',
    imageUrl: 'https://sgp.condor.com.br/banco/produto/7891991294942/7891991294942_030920241446_simplus.png',
    price: 3.99,
    stock: 12,
    margin: 0.25,
    sales: 1600,
    rentability: 0.21,
    competitiveness: 0.78,
    growth: 0.14,
    isRepeated: false,
    hasAd: true,
    nielsen: {
      marketShare: 8,
      coreSegment: 'Médio',
      penetration: 12,
      regionalRanking: 5
    },
    prixsia: {
      minPrice: 3.10,
      avgPrice: 3.44,
      medianPrice: 3.39,
      maxPrice: 4.49,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 3.95 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 3.25 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 3.10 },
        { name: 'MAX ATACAD. PIONEIRO JD', location: 'MORUMBI', price: 3.39 }
      ]
    },
    shoppingBrasil: {
      link: 'https://www.shoppingbrasil.com.br/produto/1875939',
      title: 'Cerveja Brahma Duplo Malte 350ml',
      adPrice: 4.09,
      startDate: '06/08/2025',
      detail: 'Oferta exclusiva para Paraná e SC.'
    },
    globalSegments: [
      { competitor: 'Mercado BomPreço', lastCampaign: 'TV Aberta', campaignDate: 'Jun/25', reach: '430 mil', investment: 'R$ 10.000' },
      { competitor: 'Super Mais Barato', lastCampaign: 'Rádio', campaignDate: 'Maio/25', reach: '200 mil', investment: 'R$ 4.000' }
    ]
  },
  {
    id: '1981356',
    name: 'cerv.spaten 350ml la',
    imageUrl: 'https://sgp.condor.com.br/banco/produto/7891991297424/7891991297424_1.png',
    price: 4.79,
    stock: 15,
    margin: 0.19,
    sales: 1200,
    rentability: 0.15,
    competitiveness: 0.60,
    growth: 0.08,
    isRepeated: true,
    hasAd: false,
    nielsen: {
      marketShare: 4,
      coreSegment: 'Médio',
      penetration: 7,
      regionalRanking: 8
    },
    prixsia: {
      minPrice: 3.99,
      avgPrice: 4.19,
      medianPrice: 4.25,
      maxPrice: 4.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 4.99 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 4.10 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 3.99 },
        { name: 'MAX ATACAD. PIONEIRO JD', location: 'MORUMBI', price: 4.25 }
      ]
    },
    shoppingBrasil: {
      link: 'https://www.shoppingbrasil.com.br/produto/1981356',
      title: 'Cerveja Spaten Munich 350ml',
      adPrice: 4.49,
      startDate: '07/08/2025',
      detail: 'Oferta válida para Paraná.'
    },
    globalSegments: [
      { competitor: 'Mercado BomPreço', lastCampaign: 'TV Aberta', campaignDate: 'Jun/25', reach: '260 mil', investment: 'R$ 6.000' },
      { competitor: 'Super Mais Barato', lastCampaign: 'Rádio', campaignDate: 'Maio/25', reach: '95 mil', investment: 'R$ 2.000' }
    ]
  },
  {
    id: '200001',
    name: 'coca-cola original 2l pet',
    imageUrl: 'https://sgp.condor.com.br/banco/produto/7894900011517/7894900011517_1.png',
    price: 9.99,
    stock: 25,
    margin: 0.28,
    sales: 2200,
    rentability: 0.24,
    competitiveness: 0.85,
    growth: 0.18,
    isRepeated: false,
    hasAd: true,
    nielsen: {
      marketShare: 32,
      coreSegment: 'Alto',
      penetration: 45,
      regionalRanking: 1
    },
    prixsia: {
      minPrice: 8.49,
      avgPrice: 9.25,
      medianPrice: 9.49,
      maxPrice: 11.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 9.89 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 8.99 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 8.49 }
      ]
    },
    shoppingBrasil: {
      link: 'https://www.shoppingbrasil.com.br/produto/200001',
      title: 'Coca-Cola Original 2L',
      adPrice: 9.49,
      startDate: '10/08/2025',
      detail: 'Promoção nacional.'
    },
    globalSegments: [
      { competitor: 'Mercado BomPreço', lastCampaign: 'TV Aberta', campaignDate: 'Jul/25', reach: '850 mil', investment: 'R$ 25.000' }
    ]
  },
  {
    id: '200002',
    name: 'guarana antarctica 2l pet',
    imageUrl: 'https://sgp.condor.com.br/banco/produto/7891991014023/7891991014023_1.png',
    price: 7.99,
    stock: 30,
    margin: 0.24,
    sales: 1800,
    rentability: 0.20,
    competitiveness: 0.82,
    growth: 0.12,
    isRepeated: false,
    hasAd: false,
    nielsen: {
      marketShare: 18,
      coreSegment: 'Alto',
      penetration: 35,
      regionalRanking: 2
    },
    prixsia: {
      minPrice: 6.99,
      avgPrice: 7.50,
      medianPrice: 7.49,
      maxPrice: 8.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 7.89 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 7.29 }
      ]
    },
    shoppingBrasil: {
      link: 'https://www.shoppingbrasil.com.br/produto/200002',
      title: 'Guaraná Antarctica 2L',
      adPrice: 7.49,
      startDate: '12/08/2025',
      detail: 'Oferta regional Sul.'
    },
    globalSegments: [
      { competitor: 'Super Mais Barato', lastCampaign: 'Digital', campaignDate: 'Jun/25', reach: '500 mil', investment: 'R$ 15.000' }
    ]
  },
  {
    id: '300001',
    name: 'leite integral piracanjuba 1l',
    imageUrl: 'https://sgp.condor.com.br/banco/produto/7896036095807/7896036095807_1.png',
    price: 5.49,
    stock: 50,
    margin: 0.18,
    sales: 3200,
    rentability: 0.15,
    competitiveness: 0.75,
    growth: 0.05,
    isRepeated: true,
    hasAd: true,
    nielsen: {
      marketShare: 22,
      coreSegment: 'Básico',
      penetration: 65,
      regionalRanking: 1
    },
    prixsia: {
      minPrice: 4.89,
      avgPrice: 5.20,
      medianPrice: 5.29,
      maxPrice: 5.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 5.49 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 4.99 }
      ]
    },
    shoppingBrasil: {
      link: 'https://www.shoppingbrasil.com.br/produto/300001',
      title: 'Leite Integral Piracanjuba 1L',
      adPrice: 4.99,
      startDate: '01/08/2025',
      detail: 'Leve 6 pague 5.'
    },
    globalSegments: [
      { competitor: 'Mercado BomPreço', lastCampaign: 'Jornal', campaignDate: 'Jul/25', reach: '120 mil', investment: 'R$ 3.000' }
    ]
  },
  {
    id: '400001',
    name: 'red bull energy drink 250ml',
    imageUrl: 'https://sgp.condor.com.br/banco/produto/90162976/90162976_1.png',
    price: 8.99,
    stock: 20,
    margin: 0.32,
    sales: 900,
    rentability: 0.28,
    competitiveness: 0.65,
    growth: 0.22,
    isRepeated: false,
    hasAd: true,
    nielsen: {
      marketShare: 45,
      coreSegment: 'Premium',
      penetration: 25,
      regionalRanking: 1
    },
    prixsia: {
      minPrice: 7.99,
      avgPrice: 8.50,
      medianPrice: 8.49,
      maxPrice: 9.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 8.99 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 8.29 }
      ]
    },
    shoppingBrasil: {
      link: 'https://www.shoppingbrasil.com.br/produto/400001',
      title: 'Red Bull Energy 250ml',
      adPrice: 7.99,
      startDate: '15/08/2025',
      detail: 'Pack com 4 unidades.'
    },
    globalSegments: [
      { competitor: 'Mercado BomPreço', lastCampaign: 'Digital', campaignDate: 'Jul/25', reach: '680 mil', investment: 'R$ 45.000' }
    ]
  }
];

export const mockProductGroups: ProductGroup[] = [
  {
    id: '80',
    name: '80-Cervejas',
    percentage: 29.9,
    products: mockProducts.filter(p => p.id.startsWith('1') && p.name.includes('cerv'))
  },
  {
    id: '81',
    name: '81-Refrigerantes',
    percentage: 35.4,
    products: mockProducts.filter(p => p.id.startsWith('200'))
  },
  {
    id: '82',
    name: '82-Laticínios',
    percentage: 15.2,
    products: mockProducts.filter(p => p.id.startsWith('300'))
  },
  {
    id: '88',
    name: '88-Energéticos',
    percentage: 10.3,
    products: mockProducts.filter(p => p.id.startsWith('400'))
  },
  {
    id: '85',
    name: '85-Água Mineral',
    percentage: 5.4,
    products: []
  },
  {
    id: '93',
    name: '93-Suco Pronto',
    percentage: 3.8,
    products: []
  }
];

export interface HistoryItem {
  id: string;
  name: string;
  date: string;
  products: Product[];
  avgScore: number;
  status: 'published' | 'draft';
  region: string;
  campaign: string;
  createdBy: string;
  totalValue: number;
  avgMargin: number;
}

export const mockHistory: HistoryItem[] = [
  {
    id: '1',
    name: 'Tabloide Inverno 2025',
    date: '2025-01-05',
    products: [mockProducts[0], mockProducts[1], mockProducts[3]],
    avgScore: 78,
    status: 'published',
    region: 'Curitiba',
    campaign: 'Inverno',
    createdBy: 'João Silva',
    totalValue: 45890.50,
    avgMargin: 0.23
  },
  {
    id: '2',
    name: 'Campanha Dia das Mães',
    date: '2025-05-10',
    products: [mockProducts[2], mockProducts[4], mockProducts[5], mockProducts[6]],
    avgScore: 82,
    status: 'draft',
    region: 'Litoral',
    campaign: 'Dia das Mães',
    createdBy: 'Maria Santos',
    totalValue: 62450.00,
    avgMargin: 0.25
  },
  {
    id: '3',
    name: 'Tabloide Verão 2024',
    date: '2024-12-15',
    products: [mockProducts[0], mockProducts[3], mockProducts[4]],
    avgScore: 71,
    status: 'published',
    region: 'Interior',
    campaign: 'Verão',
    createdBy: 'Pedro Costa',
    totalValue: 38200.00,
    avgMargin: 0.21
  },
  {
    id: '4',
    name: 'Black Friday 2024',
    date: '2024-11-28',
    products: mockProducts,
    avgScore: 85,
    status: 'published',
    region: 'Todas',
    campaign: 'Black Friday',
    createdBy: 'Ana Oliveira',
    totalValue: 156780.00,
    avgMargin: 0.28
  }
];

export const regions = ['Selecione uma região', 'Curitiba', 'Litoral', 'Interior', 'SC'];
export const sections = ['Todas', 'Bebidas', 'Laticínios', 'Açougue', 'Padaria'];
export const campaigns = ['Todas', 'Inverno', 'Dia das Mães', 'Verão', 'Black Friday'];
export const strategies = ['Maior Quantidade', 'Maior Margem', 'Maior Venda', 'Menor Preço'];
