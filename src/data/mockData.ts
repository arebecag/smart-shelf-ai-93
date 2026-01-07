import { ProductGroup } from '@/types/product';

export const mockProductGroups: ProductGroup[] = [
  {
    id: '80',
    name: '80-Cervejas',
    percentage: 29.9,
    products: [
      {
        id: '127400',
        name: 'cerv.brahma chopp 350ml la',
        imageUrl: 'https://sgp.condor.com.br/banco/produto/7891149010509/7891149010509_1_260720241139.png',
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
      }
    ]
  },
  {
    id: '81',
    name: '81-Refrigerantes',
    percentage: 35.4,
    products: [
      {
        id: '200001',
        name: 'coca-cola original 2l pet',
        imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&h=200&fit=crop',
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
      }
    ]
  },
  {
    id: '85',
    name: '85-Água Mineral',
    percentage: 11.0,
    products: []
  },
  {
    id: '88',
    name: '88-Energéticos',
    percentage: 10.3,
    products: []
  },
  {
    id: '93',
    name: '93-Suco Pronto',
    percentage: 7.3,
    products: []
  },
  {
    id: '89',
    name: '89-Suco Integral',
    percentage: 5.8,
    products: []
  }
];

export const regions = ['Selecione uma região', 'Curitiba', 'Litoral', 'Interior', 'SC'];
export const sections = ['Todas', 'Bebidas', 'Laticínios', 'Açougue', 'Padaria'];
export const campaigns = ['Todas', 'Inverno', 'Dia das Mães', 'Verão'];
export const strategies = ['Maior Quantidade', 'Maior Margem', 'Maior Venda', 'Menor Preço'];
