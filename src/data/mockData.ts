import { Product, ProductGroup } from '@/types/product';

export const mockProducts: Product[] = [
  // ── CERVEJAS ──────────────────────────────────────────────
  {
    id: '127400',
    name: 'cerv.brahma chopp 350ml la',
    imageUrl: '/products/brahma-chopp.png',
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
    imageUrl: '/products/brahma-duplo.png',
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
    imageUrl: '/products/spaten.png',
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
    imageUrl: '/products/coca-cola.png',
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
    imageUrl: '/products/guarana.png',
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
    imageUrl: '/products/leite.png',
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
    imageUrl: '/products/redbull.png',
    price: 8.99,
    stock: 20,
    margin: 0.32,
    sales: 900,
    rentability: 0.28,
    competitiveness: 0.65,
    growth: 0.22,
    isRepeated: false,
    hasAd: true,
    nielsen: { marketShare: 45, coreSegment: 'Premium', penetration: 25, regionalRanking: 1 },
    prixsia: {
      minPrice: 7.99, avgPrice: 8.50, medianPrice: 8.49, maxPrice: 9.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 8.99 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 8.29 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/400001', title: 'Red Bull Energy 250ml', adPrice: 7.99, startDate: '15/08/2025', detail: 'Pack com 4 unidades.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'Digital', campaignDate: 'Jul/25', reach: '680 mil', investment: 'R$ 45.000' }]
  },

  // ── CERVEJAS ADICIONAIS ───────────────────────────────────
  {
    id: '1100001',
    name: 'cerv.heineken 350ml la',
    imageUrl: '/products/cerveja-generica.png',
    price: 4.99,
    stock: 18,
    margin: 0.24,
    sales: 1750,
    rentability: 0.20,
    competitiveness: 0.72,
    growth: 0.16,
    isRepeated: false,
    hasAd: true,
    nielsen: { marketShare: 12, coreSegment: 'Premium', penetration: 18, regionalRanking: 3 },
    prixsia: {
      minPrice: 3.99, avgPrice: 4.50, medianPrice: 4.49, maxPrice: 5.49,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 4.89 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 4.19 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 3.99 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/1100001', title: 'Heineken 350ml Lata', adPrice: 4.79, startDate: '08/08/2025', detail: 'Promoção nacional.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'Digital', campaignDate: 'Jul/25', reach: '720 mil', investment: 'R$ 30.000' }]
  },
  {
    id: '1100002',
    name: 'cerv.corona extra 330ml garrafa',
    imageUrl: '/products/cerveja-generica.png',
    price: 5.49,
    stock: 10,
    margin: 0.26,
    sales: 980,
    rentability: 0.22,
    competitiveness: 0.68,
    growth: 0.19,
    isRepeated: false,
    hasAd: false,
    nielsen: { marketShare: 6, coreSegment: 'Premium', penetration: 10, regionalRanking: 7 },
    prixsia: {
      minPrice: 4.49, avgPrice: 5.10, medianPrice: 5.29, maxPrice: 5.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 5.49 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 4.89 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/1100002', title: 'Corona Extra 330ml', adPrice: 5.29, startDate: '10/08/2025', detail: 'Oferta Sul do Brasil.' },
    globalSegments: [{ competitor: 'Super Mais Barato', lastCampaign: 'Digital', campaignDate: 'Jun/25', reach: '280 mil', investment: 'R$ 12.000' }]
  },
  {
    id: '1100003',
    name: 'cerv.budweiser 350ml la',
    imageUrl: '/products/cerveja-generica.png',
    price: 3.89,
    stock: 22,
    margin: 0.21,
    sales: 1320,
    rentability: 0.17,
    competitiveness: 0.74,
    growth: 0.11,
    isRepeated: true,
    hasAd: false,
    nielsen: { marketShare: 9, coreSegment: 'Médio', penetration: 14, regionalRanking: 4 },
    prixsia: {
      minPrice: 2.99, avgPrice: 3.50, medianPrice: 3.59, maxPrice: 4.29,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 3.79 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 2.99 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/1100003', title: 'Budweiser 350ml Lata', adPrice: 3.69, startDate: '05/08/2025', detail: 'Promoção Paraná.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'TV Aberta', campaignDate: 'Jun/25', reach: '400 mil', investment: 'R$ 9.000' }]
  },
  {
    id: '1100004',
    name: 'cerv.amstel 350ml la',
    imageUrl: '/products/cerveja-generica.png',
    price: 3.69,
    stock: 16,
    margin: 0.20,
    sales: 1100,
    rentability: 0.16,
    competitiveness: 0.71,
    growth: 0.09,
    isRepeated: false,
    hasAd: true,
    nielsen: { marketShare: 5, coreSegment: 'Médio', penetration: 9, regionalRanking: 9 },
    prixsia: {
      minPrice: 2.89, avgPrice: 3.35, medianPrice: 3.39, maxPrice: 4.19,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 3.69 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 3.19 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/1100004', title: 'Amstel 350ml Lata', adPrice: 3.49, startDate: '06/08/2025', detail: 'Oferta regional.' },
    globalSegments: [{ competitor: 'Super Mais Barato', lastCampaign: 'Rádio', campaignDate: 'Maio/25', reach: '180 mil', investment: 'R$ 4.500' }]
  },
  {
    id: '1100005',
    name: 'cerv.skol 350ml la',
    imageUrl: '/products/cerveja-generica.png',
    price: 3.29,
    stock: 30,
    margin: 0.19,
    sales: 1650,
    rentability: 0.15,
    competitiveness: 0.76,
    growth: 0.08,
    isRepeated: true,
    hasAd: false,
    nielsen: { marketShare: 11, coreSegment: 'Básico', penetration: 20, regionalRanking: 2 },
    prixsia: {
      minPrice: 2.49, avgPrice: 3.10, medianPrice: 3.19, maxPrice: 3.79,
      competitors: [
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 2.49 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 2.89 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/1100005', title: 'Skol 350ml Lata', adPrice: 3.09, startDate: '01/08/2025', detail: 'Promoção nacional.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'TV Aberta', campaignDate: 'Jul/25', reach: '550 mil', investment: 'R$ 14.000' }]
  },
  {
    id: '1100006',
    name: 'cerv.original 600ml garrafa',
    imageUrl: '/products/cerveja-generica.png',
    price: 6.49,
    stock: 14,
    margin: 0.23,
    sales: 820,
    rentability: 0.19,
    competitiveness: 0.63,
    growth: 0.13,
    isRepeated: false,
    hasAd: true,
    nielsen: { marketShare: 7, coreSegment: 'Médio', penetration: 13, regionalRanking: 6 },
    prixsia: {
      minPrice: 5.49, avgPrice: 6.10, medianPrice: 6.19, maxPrice: 6.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 6.49 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 5.79 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/1100006', title: 'Cerveja Original 600ml', adPrice: 5.99, startDate: '12/08/2025', detail: 'Oferta válida PR.' },
    globalSegments: [{ competitor: 'Super Mais Barato', lastCampaign: 'Digital', campaignDate: 'Jun/25', reach: '210 mil', investment: 'R$ 7.000' }]
  },

  // ── REFRIGERANTES ADICIONAIS ──────────────────────────────
  {
    id: '200003',
    name: 'pepsi black 2l pet',
    imageUrl: '/products/coca-cola-2l.jpg',
    price: 8.49,
    stock: 20,
    margin: 0.22,
    sales: 1100,
    rentability: 0.18,
    competitiveness: 0.79,
    growth: 0.10,
    isRepeated: false,
    hasAd: false,
    nielsen: { marketShare: 8, coreSegment: 'Alto', penetration: 15, regionalRanking: 4 },
    prixsia: {
      minPrice: 7.49, avgPrice: 8.10, medianPrice: 8.19, maxPrice: 9.49,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 8.49 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 7.79 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/200003', title: 'Pepsi Black 2L', adPrice: 7.99, startDate: '11/08/2025', detail: 'Sem açúcar.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'Digital', campaignDate: 'Jun/25', reach: '320 mil', investment: 'R$ 11.000' }]
  },
  {
    id: '200004',
    name: 'fanta laranja 2l pet',
    imageUrl: '/products/guarana.png',
    price: 7.49,
    stock: 25,
    margin: 0.21,
    sales: 950,
    rentability: 0.17,
    competitiveness: 0.77,
    growth: 0.09,
    isRepeated: false,
    hasAd: true,
    nielsen: { marketShare: 6, coreSegment: 'Alto', penetration: 12, regionalRanking: 5 },
    prixsia: {
      minPrice: 6.49, avgPrice: 7.10, medianPrice: 7.19, maxPrice: 8.49,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 7.39 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 6.49 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/200004', title: 'Fanta Laranja 2L', adPrice: 6.99, startDate: '09/08/2025', detail: 'Promoção nacional.' },
    globalSegments: [{ competitor: 'Super Mais Barato', lastCampaign: 'TV Aberta', campaignDate: 'Jun/25', reach: '410 mil', investment: 'R$ 13.000' }]
  },
  {
    id: '200005',
    name: 'schweppes citrus 2l pet',
    imageUrl: '/products/guarana.png',
    price: 6.99,
    stock: 18,
    margin: 0.20,
    sales: 680,
    rentability: 0.16,
    competitiveness: 0.70,
    growth: 0.07,
    isRepeated: true,
    hasAd: false,
    nielsen: { marketShare: 4, coreSegment: 'Médio', penetration: 8, regionalRanking: 8 },
    prixsia: {
      minPrice: 5.99, avgPrice: 6.60, medianPrice: 6.79, maxPrice: 7.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 6.99 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 6.29 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/200005', title: 'Schweppes Citrus 2L', adPrice: 6.49, startDate: '07/08/2025', detail: 'Oferta PR e SC.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'Jornal', campaignDate: 'Maio/25', reach: '130 mil', investment: 'R$ 3.500' }]
  },
  {
    id: '200006',
    name: 'sprite limao 2l pet',
    imageUrl: '/products/guarana.png',
    price: 7.29,
    stock: 22,
    margin: 0.21,
    sales: 870,
    rentability: 0.17,
    competitiveness: 0.75,
    growth: 0.10,
    isRepeated: false,
    hasAd: false,
    nielsen: { marketShare: 5, coreSegment: 'Alto', penetration: 10, regionalRanking: 6 },
    prixsia: {
      minPrice: 6.29, avgPrice: 6.90, medianPrice: 6.99, maxPrice: 7.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 7.19 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 6.29 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/200006', title: 'Sprite Limão 2L', adPrice: 6.89, startDate: '08/08/2025', detail: 'Promoção nacional.' },
    globalSegments: [{ competitor: 'Super Mais Barato', lastCampaign: 'Digital', campaignDate: 'Jun/25', reach: '280 mil', investment: 'R$ 8.000' }]
  },

  // ── LATICÍNIOS ADICIONAIS ─────────────────────────────────
  {
    id: '300002',
    name: 'leite semidesnatado italac 1l',
    imageUrl: '/products/leite.png',
    price: 5.29,
    stock: 40,
    margin: 0.17,
    sales: 2800,
    rentability: 0.14,
    competitiveness: 0.73,
    growth: 0.04,
    isRepeated: false,
    hasAd: false,
    nielsen: { marketShare: 15, coreSegment: 'Básico', penetration: 55, regionalRanking: 2 },
    prixsia: {
      minPrice: 4.69, avgPrice: 5.00, medianPrice: 5.09, maxPrice: 5.79,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 5.29 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 4.79 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/300002', title: 'Leite Semidesnatado Italac 1L', adPrice: 4.89, startDate: '01/08/2025', detail: 'Leve 6 pague 5.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'Jornal', campaignDate: 'Jul/25', reach: '100 mil', investment: 'R$ 2.500' }]
  },
  {
    id: '300003',
    name: 'iogurte grego nestle 100g',
    imageUrl: '/products/leite.png',
    price: 3.49,
    stock: 35,
    margin: 0.28,
    sales: 1500,
    rentability: 0.23,
    competitiveness: 0.69,
    growth: 0.15,
    isRepeated: false,
    hasAd: true,
    nielsen: { marketShare: 10, coreSegment: 'Médio', penetration: 28, regionalRanking: 3 },
    prixsia: {
      minPrice: 2.99, avgPrice: 3.25, medianPrice: 3.29, maxPrice: 3.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 3.49 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 2.99 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/300003', title: 'Iogurte Grego Nestlé 100g', adPrice: 3.19, startDate: '05/08/2025', detail: 'Vários sabores.' },
    globalSegments: [{ competitor: 'Super Mais Barato', lastCampaign: 'Digital', campaignDate: 'Jun/25', reach: '220 mil', investment: 'R$ 6.000' }]
  },
  {
    id: '300004',
    name: 'queijo muçarela tirolez kg',
    imageUrl: '/products/leite.png',
    price: 39.90,
    stock: 12,
    margin: 0.30,
    sales: 480,
    rentability: 0.26,
    competitiveness: 0.65,
    growth: 0.08,
    isRepeated: false,
    hasAd: false,
    nielsen: { marketShare: 8, coreSegment: 'Alto', penetration: 18, regionalRanking: 4 },
    prixsia: {
      minPrice: 34.90, avgPrice: 37.50, medianPrice: 38.00, maxPrice: 42.90,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 39.90 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 35.90 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/300004', title: 'Queijo Muçarela Tirolez', adPrice: 36.90, startDate: '10/08/2025', detail: 'Preço por KG.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'Jornal', campaignDate: 'Jul/25', reach: '90 mil', investment: 'R$ 2.000' }]
  },
  {
    id: '300005',
    name: 'manteiga aviação com sal 200g',
    imageUrl: '/products/leite.png',
    price: 8.99,
    stock: 28,
    margin: 0.25,
    sales: 1200,
    rentability: 0.21,
    competitiveness: 0.72,
    growth: 0.06,
    isRepeated: true,
    hasAd: true,
    nielsen: { marketShare: 18, coreSegment: 'Básico', penetration: 42, regionalRanking: 1 },
    prixsia: {
      minPrice: 7.99, avgPrice: 8.50, medianPrice: 8.49, maxPrice: 9.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 8.99 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 7.99 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/300005', title: 'Manteiga Aviação 200g', adPrice: 8.49, startDate: '03/08/2025', detail: 'Oferta Sul.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'TV Aberta', campaignDate: 'Jun/25', reach: '170 mil', investment: 'R$ 5.000' }]
  },

  // ── ENERGÉTICOS ADICIONAIS ────────────────────────────────
  {
    id: '400002',
    name: 'monster energy 473ml la',
    imageUrl: '/products/redbull.png',
    price: 9.49,
    stock: 15,
    margin: 0.30,
    sales: 750,
    rentability: 0.26,
    competitiveness: 0.62,
    growth: 0.20,
    isRepeated: false,
    hasAd: true,
    nielsen: { marketShare: 22, coreSegment: 'Premium', penetration: 18, regionalRanking: 2 },
    prixsia: {
      minPrice: 8.49, avgPrice: 9.10, medianPrice: 9.19, maxPrice: 10.99,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 9.49 },
        { name: 'MAX ATAC-JD', location: 'CARVALHO JARDIM', price: 8.69 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/400002', title: 'Monster Energy 473ml', adPrice: 8.99, startDate: '14/08/2025', detail: 'Vários sabores.' },
    globalSegments: [{ competitor: 'Super Mais Barato', lastCampaign: 'Digital', campaignDate: 'Jun/25', reach: '520 mil', investment: 'R$ 35.000' }]
  },
  {
    id: '400003',
    name: 'TNT energy drink 269ml la',
    imageUrl: '/products/redbull.png',
    price: 4.99,
    stock: 25,
    margin: 0.28,
    sales: 1100,
    rentability: 0.24,
    competitiveness: 0.75,
    growth: 0.18,
    isRepeated: false,
    hasAd: false,
    nielsen: { marketShare: 12, coreSegment: 'Médio', penetration: 22, regionalRanking: 3 },
    prixsia: {
      minPrice: 3.99, avgPrice: 4.50, medianPrice: 4.59, maxPrice: 5.49,
      competitors: [
        { name: 'GIASSI - CENTRO', location: 'JS CENTRO', price: 4.99 },
        { name: 'ATACADAO-LONDRINA JD', location: 'SHANGRILA', price: 3.99 }
      ]
    },
    shoppingBrasil: { link: 'https://www.shoppingbrasil.com.br/produto/400003', title: 'TNT Energy 269ml', adPrice: 4.49, startDate: '13/08/2025', detail: 'Promoção regional.' },
    globalSegments: [{ competitor: 'Mercado BomPreço', lastCampaign: 'Digital', campaignDate: 'Jun/25', reach: '380 mil', investment: 'R$ 18.000' }]
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
