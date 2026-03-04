import { Product, ProductGroup } from '@/types/product';

// ── HELPERS ───────────────────────────────────────────────
const mkComp = (n: string, loc: string, price: number) => ({ name: n, location: loc, price });
const mkNielsen = (ms: number, seg: string, pen: number, rank: number) => ({ marketShare: ms, coreSegment: seg, penetration: pen, regionalRanking: rank });
const mkPrixsia = (min: number, avg: number, med: number, max: number, comps: {name:string;location:string;price:number}[]) => ({ minPrice: min, avgPrice: avg, medianPrice: med, maxPrice: max, competitors: comps });
const mkShop = (id: string, title: string, adPrice: number, date: string) => ({ link: `https://www.shoppingbrasil.com.br/produto/${id}`, title, adPrice, startDate: date, detail: 'Oferta válida para o Sul do Brasil.' });
const mkSeg = (comp: string, camp: string, date: string, reach: string, invest: string) => [{ competitor: comp, lastCampaign: camp, campaignDate: date, reach, investment: invest }];

export const mockProducts: Product[] = [
  // ── CERVEJAS ──────────────────────────────────────────────
  {
    id: '127400', name: 'cerv.brahma chopp 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 3.59, stock: 8, margin: 0.22, sales: 1400, rentability: 0.18, competitiveness: 0.70, growth: 0.10, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(7,'Médio',10,6),
    prixsia: mkPrixsia(2.59,3.21,3.35,4.49,[mkComp('GIASSI - CENTRO','JS CENTRO',3.95),mkComp('MAX ATAC-JD','JARDIM',2.89),mkComp('ATACADAO','SHANGRILA',2.59)]),
    shoppingBrasil: mkShop('127400','Cerveja Brahma Chopp Lata 350ml',3.69,'05/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','330 mil','R$ 8.000')
  },
  {
    id: '1875939', name: 'cerv.brahma duplo malte 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 3.99, stock: 12, margin: 0.25, sales: 1600, rentability: 0.21, competitiveness: 0.78, growth: 0.14, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(8,'Médio',12,5),
    prixsia: mkPrixsia(3.10,3.44,3.39,4.49,[mkComp('GIASSI - CENTRO','JS CENTRO',3.95),mkComp('MAX ATAC-JD','JARDIM',3.25)]),
    shoppingBrasil: mkShop('1875939','Cerveja Brahma Duplo Malte 350ml',4.09,'06/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','430 mil','R$ 10.000')
  },
  {
    id: '1981356', name: 'cerv.spaten 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 4.79, stock: 15, margin: 0.19, sales: 1200, rentability: 0.15, competitiveness: 0.60, growth: 0.08, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(4,'Médio',7,8),
    prixsia: mkPrixsia(3.99,4.19,4.25,4.99,[mkComp('GIASSI - CENTRO','JS CENTRO',4.99),mkComp('ATACADAO','SHANGRILA',3.99)]),
    shoppingBrasil: mkShop('1981356','Cerveja Spaten Munich 350ml',4.49,'07/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','260 mil','R$ 6.000')
  },
  {
    id: '1100001', name: 'cerv.heineken 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 4.99, stock: 18, margin: 0.24, sales: 1750, rentability: 0.20, competitiveness: 0.72, growth: 0.16, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(12,'Premium',18,3),
    prixsia: mkPrixsia(3.99,4.50,4.49,5.49,[mkComp('GIASSI - CENTRO','JS CENTRO',4.89),mkComp('MAX ATAC-JD','JARDIM',4.19)]),
    shoppingBrasil: mkShop('1100001','Heineken 350ml Lata',4.79,'08/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','720 mil','R$ 30.000')
  },
  {
    id: '1100002', name: 'cerv.corona extra 330ml garrafa', imageUrl: '/products/cat-cervejas.png',
    price: 5.49, stock: 10, margin: 0.26, sales: 980, rentability: 0.22, competitiveness: 0.68, growth: 0.19, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(6,'Premium',10,7),
    prixsia: mkPrixsia(4.49,5.10,5.29,5.99,[mkComp('GIASSI - CENTRO','JS CENTRO',5.49),mkComp('MAX ATAC-JD','JARDIM',4.89)]),
    shoppingBrasil: mkShop('1100002','Corona Extra 330ml',5.29,'10/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','280 mil','R$ 12.000')
  },
  {
    id: '1100003', name: 'cerv.budweiser 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 3.89, stock: 22, margin: 0.21, sales: 1320, rentability: 0.17, competitiveness: 0.74, growth: 0.11, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(9,'Médio',14,4),
    prixsia: mkPrixsia(2.99,3.50,3.59,4.29,[mkComp('GIASSI - CENTRO','JS CENTRO',3.79),mkComp('ATACADAO','SHANGRILA',2.99)]),
    shoppingBrasil: mkShop('1100003','Budweiser 350ml Lata',3.69,'05/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','400 mil','R$ 9.000')
  },
  {
    id: '1100004', name: 'cerv.amstel 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 3.69, stock: 16, margin: 0.20, sales: 1100, rentability: 0.16, competitiveness: 0.71, growth: 0.09, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(5,'Médio',9,9),
    prixsia: mkPrixsia(2.89,3.35,3.39,4.19,[mkComp('GIASSI - CENTRO','JS CENTRO',3.69),mkComp('MAX ATAC-JD','JARDIM',3.19)]),
    shoppingBrasil: mkShop('1100004','Amstel 350ml Lata',3.49,'06/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Rádio','Maio/25','180 mil','R$ 4.500')
  },
  {
    id: '1100005', name: 'cerv.skol 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 3.29, stock: 30, margin: 0.19, sales: 1650, rentability: 0.15, competitiveness: 0.76, growth: 0.08, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(11,'Básico',20,2),
    prixsia: mkPrixsia(2.49,3.10,3.19,3.79,[mkComp('ATACADAO','SHANGRILA',2.49),mkComp('MAX ATAC-JD','JARDIM',2.89)]),
    shoppingBrasil: mkShop('1100005','Skol 350ml Lata',3.09,'01/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jul/25','550 mil','R$ 14.000')
  },
  {
    id: '1100006', name: 'cerv.original 600ml garrafa', imageUrl: '/products/cat-cervejas.png',
    price: 6.49, stock: 14, margin: 0.23, sales: 820, rentability: 0.19, competitiveness: 0.63, growth: 0.13, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(7,'Médio',13,6),
    prixsia: mkPrixsia(5.49,6.10,6.19,6.99,[mkComp('GIASSI - CENTRO','JS CENTRO',6.49),mkComp('MAX ATAC-JD','JARDIM',5.79)]),
    shoppingBrasil: mkShop('1100006','Cerveja Original 600ml',5.99,'12/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','210 mil','R$ 7.000')
  },
  {
    id: '1100007', name: 'cerv.itaipava 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 2.99, stock: 35, margin: 0.18, sales: 1900, rentability: 0.14, competitiveness: 0.80, growth: 0.07, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(10,'Básico',22,2),
    prixsia: mkPrixsia(2.29,2.80,2.89,3.49,[mkComp('ATACADAO','SHANGRILA',2.29),mkComp('MAX ATAC-JD','JARDIM',2.69)]),
    shoppingBrasil: mkShop('1100007','Itaipava 350ml Lata',2.79,'02/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jul/25','480 mil','R$ 11.000')
  },
  {
    id: '1100008', name: 'cerv.devassa ruiva 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 4.49, stock: 11, margin: 0.22, sales: 750, rentability: 0.18, competitiveness: 0.65, growth: 0.12, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(3,'Premium',7,11),
    prixsia: mkPrixsia(3.59,4.10,4.19,4.99,[mkComp('GIASSI - CENTRO','JS CENTRO',4.49),mkComp('MAX ATAC-JD','JARDIM',3.89)]),
    shoppingBrasil: mkShop('1100008','Devassa Ruiva 350ml',4.19,'09/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','140 mil','R$ 5.000')
  },
  {
    id: '1100009', name: 'cerv.stella artois 350ml la', imageUrl: '/products/cat-cervejas.png',
    price: 4.29, stock: 20, margin: 0.23, sales: 1050, rentability: 0.19, competitiveness: 0.69, growth: 0.13, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(8,'Premium',14,5),
    prixsia: mkPrixsia(3.49,4.00,4.09,4.89,[mkComp('GIASSI - CENTRO','JS CENTRO',4.29),mkComp('MAX ATAC-JD','JARDIM',3.79)]),
    shoppingBrasil: mkShop('1100009','Stella Artois 350ml Lata',3.99,'11/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','390 mil','R$ 14.000')
  },
  {
    id: '1100010', name: 'cerv.eisenbahn pale ale 355ml garrafa', imageUrl: '/products/cat-cervejas.png',
    price: 7.99, stock: 8, margin: 0.28, sales: 380, rentability: 0.24, competitiveness: 0.55, growth: 0.21, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(2,'Premium',4,14),
    prixsia: mkPrixsia(6.49,7.50,7.59,8.99,[mkComp('GIASSI - CENTRO','JS CENTRO',7.99),mkComp('MAX ATAC-JD','JARDIM',7.29)]),
    shoppingBrasil: mkShop('1100010','Eisenbahn Pale Ale 355ml',7.49,'14/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Maio/25','80 mil','R$ 3.500')
  },
  {
    id: '1100011', name: 'cerv.colorado appia 600ml garrafa', imageUrl: '/products/cat-cervejas.png',
    price: 11.99, stock: 6, margin: 0.30, sales: 290, rentability: 0.26, competitiveness: 0.52, growth: 0.24, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(1,'Premium',3,16),
    prixsia: mkPrixsia(9.99,11.20,11.49,13.49,[mkComp('GIASSI - CENTRO','JS CENTRO',11.99),mkComp('MAX ATAC-JD','JARDIM',10.99)]),
    shoppingBrasil: mkShop('1100011','Colorado Appia 600ml',10.99,'16/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','55 mil','R$ 2.000')
  },
  {
    id: '1100012', name: 'cerv.bohemia 600ml garrafa', imageUrl: '/products/cat-cervejas.png',
    price: 7.49, stock: 12, margin: 0.21, sales: 560, rentability: 0.17, competitiveness: 0.61, growth: 0.10, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(4,'Médio',8,10),
    prixsia: mkPrixsia(5.99,7.00,7.09,7.99,[mkComp('GIASSI - CENTRO','JS CENTRO',7.49),mkComp('ATACADAO','SHANGRILA',6.49)]),
    shoppingBrasil: mkShop('1100012','Bohemia 600ml',6.99,'07/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','160 mil','R$ 4.500')
  },

  // ── REFRIGERANTES ─────────────────────────────────────────
  {
    id: '200001', name: 'coca-cola original 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 9.99, stock: 25, margin: 0.28, sales: 2200, rentability: 0.24, competitiveness: 0.85, growth: 0.18, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(32,'Alto',45,1),
    prixsia: mkPrixsia(8.49,9.25,9.49,11.99,[mkComp('GIASSI - CENTRO','JS CENTRO',9.89),mkComp('MAX ATAC-JD','JARDIM',8.99),mkComp('ATACADAO','SHANGRILA',8.49)]),
    shoppingBrasil: mkShop('200001','Coca-Cola Original 2L',9.49,'10/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jul/25','850 mil','R$ 25.000')
  },
  {
    id: '200002', name: 'guarana antarctica 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 7.99, stock: 30, margin: 0.24, sales: 1800, rentability: 0.20, competitiveness: 0.82, growth: 0.12, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(18,'Alto',35,2),
    prixsia: mkPrixsia(6.99,7.50,7.49,8.99,[mkComp('GIASSI - CENTRO','JS CENTRO',7.89),mkComp('MAX ATAC-JD','JARDIM',7.29)]),
    shoppingBrasil: mkShop('200002','Guaraná Antarctica 2L',7.49,'12/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','500 mil','R$ 15.000')
  },
  {
    id: '200003', name: 'pepsi black 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 8.49, stock: 20, margin: 0.22, sales: 1100, rentability: 0.18, competitiveness: 0.79, growth: 0.10, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(8,'Alto',15,4),
    prixsia: mkPrixsia(7.49,8.10,8.19,9.49,[mkComp('GIASSI - CENTRO','JS CENTRO',8.49),mkComp('MAX ATAC-JD','JARDIM',7.79)]),
    shoppingBrasil: mkShop('200003','Pepsi Black 2L',7.99,'11/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jun/25','320 mil','R$ 11.000')
  },
  {
    id: '200004', name: 'fanta laranja 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 7.49, stock: 25, margin: 0.21, sales: 950, rentability: 0.17, competitiveness: 0.77, growth: 0.09, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(6,'Alto',12,5),
    prixsia: mkPrixsia(6.49,7.10,7.19,8.49,[mkComp('GIASSI - CENTRO','JS CENTRO',7.39),mkComp('ATACADAO','SHANGRILA',6.49)]),
    shoppingBrasil: mkShop('200004','Fanta Laranja 2L',6.99,'09/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','TV Aberta','Jun/25','410 mil','R$ 13.000')
  },
  {
    id: '200005', name: 'schweppes citrus 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 6.99, stock: 18, margin: 0.20, sales: 680, rentability: 0.16, competitiveness: 0.70, growth: 0.07, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(4,'Médio',8,8),
    prixsia: mkPrixsia(5.99,6.60,6.79,7.99,[mkComp('GIASSI - CENTRO','JS CENTRO',6.99),mkComp('MAX ATAC-JD','JARDIM',6.29)]),
    shoppingBrasil: mkShop('200005','Schweppes Citrus 2L',6.49,'07/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Maio/25','130 mil','R$ 3.500')
  },
  {
    id: '200006', name: 'sprite limao 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 7.29, stock: 22, margin: 0.21, sales: 870, rentability: 0.17, competitiveness: 0.75, growth: 0.10, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(5,'Alto',10,6),
    prixsia: mkPrixsia(6.29,6.90,6.99,7.99,[mkComp('GIASSI - CENTRO','JS CENTRO',7.19),mkComp('ATACADAO','SHANGRILA',6.29)]),
    shoppingBrasil: mkShop('200006','Sprite Limão 2L',6.89,'08/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','280 mil','R$ 8.000')
  },
  {
    id: '200007', name: 'coca-cola zero 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 9.49, stock: 28, margin: 0.26, sales: 1400, rentability: 0.22, competitiveness: 0.83, growth: 0.15, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(14,'Alto',28,3),
    prixsia: mkPrixsia(7.99,8.80,8.99,10.49,[mkComp('GIASSI - CENTRO','JS CENTRO',9.29),mkComp('MAX ATAC-JD','JARDIM',8.49)]),
    shoppingBrasil: mkShop('200007','Coca-Cola Zero 2L',8.99,'13/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jul/25','620 mil','R$ 18.000')
  },
  {
    id: '200008', name: 'kuat limao 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 6.49, stock: 20, margin: 0.19, sales: 720, rentability: 0.15, competitiveness: 0.72, growth: 0.08, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(5,'Médio',11,7),
    prixsia: mkPrixsia(5.49,6.10,6.19,7.29,[mkComp('GIASSI - CENTRO','JS CENTRO',6.49),mkComp('ATACADAO','SHANGRILA',5.79)]),
    shoppingBrasil: mkShop('200008','Kuat Limão 2L',5.99,'04/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Maio/25','200 mil','R$ 6.000')
  },
  {
    id: '200009', name: 'coca-cola 600ml garrafa pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 4.49, stock: 40, margin: 0.25, sales: 2400, rentability: 0.21, competitiveness: 0.88, growth: 0.16, isRepeated: true, hasAd: true,
    nielsen: mkNielsen(28,'Alto',50,1),
    prixsia: mkPrixsia(3.79,4.20,4.29,5.29,[mkComp('GIASSI - CENTRO','JS CENTRO',4.49),mkComp('MAX ATAC-JD','JARDIM',3.99)]),
    shoppingBrasil: mkShop('200009','Coca-Cola 600ml PET',4.19,'02/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jul/25','750 mil','R$ 22.000')
  },
  {
    id: '200010', name: 'guarana antarctica lata 350ml', imageUrl: '/products/cat-refrigerantes.png',
    price: 3.49, stock: 35, margin: 0.20, sales: 1650, rentability: 0.16, competitiveness: 0.80, growth: 0.11, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(15,'Alto',30,3),
    prixsia: mkPrixsia(2.79,3.20,3.29,3.99,[mkComp('GIASSI - CENTRO','JS CENTRO',3.49),mkComp('ATACADAO','SHANGRILA',2.99)]),
    shoppingBrasil: mkShop('200010','Guaraná Antarctica Lata 350ml',3.19,'05/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','420 mil','R$ 12.000')
  },
  {
    id: '200011', name: 'pepsi cola 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 7.49, stock: 22, margin: 0.20, sales: 980, rentability: 0.16, competitiveness: 0.76, growth: 0.09, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(7,'Alto',13,5),
    prixsia: mkPrixsia(6.29,7.00,7.09,8.29,[mkComp('GIASSI - CENTRO','JS CENTRO',7.49),mkComp('MAX ATAC-JD','JARDIM',6.79)]),
    shoppingBrasil: mkShop('200011','Pepsi Cola 2L',6.99,'06/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','380 mil','R$ 10.000')
  },
  {
    id: '200012', name: 'fanta uva 2l pet', imageUrl: '/products/cat-refrigerantes.png',
    price: 7.29, stock: 18, margin: 0.21, sales: 720, rentability: 0.17, competitiveness: 0.74, growth: 0.10, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(4,'Médio',10,7),
    prixsia: mkPrixsia(6.19,6.90,6.99,7.99,[mkComp('GIASSI - CENTRO','JS CENTRO',7.29),mkComp('ATACADAO','SHANGRILA',6.29)]),
    shoppingBrasil: mkShop('200012','Fanta Uva 2L',6.79,'09/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Maio/25','220 mil','R$ 7.000')
  },

  // ── LATICÍNIOS ────────────────────────────────────────────
  {
    id: '300001', name: 'leite integral piracanjuba 1l', imageUrl: '/products/cat-laticinios.png',
    price: 5.49, stock: 50, margin: 0.18, sales: 3200, rentability: 0.15, competitiveness: 0.75, growth: 0.05, isRepeated: true, hasAd: true,
    nielsen: mkNielsen(22,'Básico',65,1),
    prixsia: mkPrixsia(4.89,5.20,5.29,5.99,[mkComp('GIASSI - CENTRO','JS CENTRO',5.49),mkComp('MAX ATAC-JD','JARDIM',4.99)]),
    shoppingBrasil: mkShop('300001','Leite Integral Piracanjuba 1L',4.99,'01/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jul/25','120 mil','R$ 3.000')
  },
  {
    id: '300002', name: 'leite semidesnatado italac 1l', imageUrl: '/products/cat-laticinios.png',
    price: 5.29, stock: 40, margin: 0.17, sales: 2800, rentability: 0.14, competitiveness: 0.73, growth: 0.04, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(15,'Básico',55,2),
    prixsia: mkPrixsia(4.69,5.00,5.09,5.79,[mkComp('GIASSI - CENTRO','JS CENTRO',5.29),mkComp('MAX ATAC-JD','JARDIM',4.79)]),
    shoppingBrasil: mkShop('300002','Leite Semidesnatado Italac 1L',4.89,'01/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jul/25','100 mil','R$ 2.500')
  },
  {
    id: '300003', name: 'iogurte grego nestle 100g', imageUrl: '/products/cat-laticinios.png',
    price: 3.49, stock: 35, margin: 0.28, sales: 1500, rentability: 0.23, competitiveness: 0.69, growth: 0.15, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(10,'Médio',28,3),
    prixsia: mkPrixsia(2.99,3.25,3.29,3.99,[mkComp('GIASSI - CENTRO','JS CENTRO',3.49),mkComp('ATACADAO','SHANGRILA',2.99)]),
    shoppingBrasil: mkShop('300003','Iogurte Grego Nestlé 100g',3.19,'05/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','220 mil','R$ 6.000')
  },
  {
    id: '300004', name: 'queijo muçarela tirolez kg', imageUrl: '/products/cat-laticinios.png',
    price: 39.90, stock: 12, margin: 0.30, sales: 480, rentability: 0.26, competitiveness: 0.65, growth: 0.08, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(8,'Alto',18,4),
    prixsia: mkPrixsia(34.90,37.50,38.00,42.90,[mkComp('GIASSI - CENTRO','JS CENTRO',39.90),mkComp('MAX ATAC-JD','JARDIM',35.90)]),
    shoppingBrasil: mkShop('300004','Queijo Muçarela Tirolez KG',36.90,'10/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jul/25','90 mil','R$ 2.000')
  },
  {
    id: '300005', name: 'manteiga aviacao com sal 200g', imageUrl: '/products/cat-laticinios.png',
    price: 8.99, stock: 28, margin: 0.25, sales: 1200, rentability: 0.21, competitiveness: 0.72, growth: 0.06, isRepeated: true, hasAd: true,
    nielsen: mkNielsen(18,'Básico',42,1),
    prixsia: mkPrixsia(7.99,8.50,8.49,9.99,[mkComp('GIASSI - CENTRO','JS CENTRO',8.99),mkComp('ATACADAO','SHANGRILA',7.99)]),
    shoppingBrasil: mkShop('300005','Manteiga Aviação 200g',8.49,'03/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','170 mil','R$ 5.000')
  },
  {
    id: '300006', name: 'cream cheese philadelphia 150g', imageUrl: '/products/cat-laticinios.png',
    price: 9.49, stock: 20, margin: 0.32, sales: 880, rentability: 0.28, competitiveness: 0.68, growth: 0.18, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(12,'Premium',22,3),
    prixsia: mkPrixsia(7.99,8.90,8.99,10.49,[mkComp('GIASSI - CENTRO','JS CENTRO',9.49),mkComp('MAX ATAC-JD','JARDIM',8.49)]),
    shoppingBrasil: mkShop('300006','Cream Cheese Philadelphia 150g',8.99,'07/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','180 mil','R$ 7.000')
  },
  {
    id: '300007', name: 'requeijao catupiry 200g', imageUrl: '/products/cat-laticinios.png',
    price: 7.49, stock: 32, margin: 0.27, sales: 1350, rentability: 0.23, competitiveness: 0.74, growth: 0.09, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(20,'Médio',38,2),
    prixsia: mkPrixsia(6.49,7.10,7.19,8.29,[mkComp('GIASSI - CENTRO','JS CENTRO',7.49),mkComp('ATACADAO','SHANGRILA',6.69)]),
    shoppingBrasil: mkShop('300007','Requeijão Catupiry 200g',6.99,'06/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jul/25','150 mil','R$ 4.000')
  },
  {
    id: '300008', name: 'leite condensado moca 395g', imageUrl: '/products/cat-laticinios.png',
    price: 6.49, stock: 45, margin: 0.26, sales: 1800, rentability: 0.22, competitiveness: 0.79, growth: 0.07, isRepeated: true, hasAd: true,
    nielsen: mkNielsen(30,'Básico',58,1),
    prixsia: mkPrixsia(5.49,6.10,6.19,6.99,[mkComp('GIASSI - CENTRO','JS CENTRO',6.49),mkComp('MAX ATAC-JD','JARDIM',5.89)]),
    shoppingBrasil: mkShop('300008','Leite Condensado Moça 395g',5.99,'04/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','380 mil','R$ 10.000')
  },
  {
    id: '300009', name: 'creme de leite nestle 200g', imageUrl: '/products/cat-laticinios.png',
    price: 3.99, stock: 55, margin: 0.22, sales: 2100, rentability: 0.18, competitiveness: 0.77, growth: 0.05, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(25,'Básico',55,1),
    prixsia: mkPrixsia(3.29,3.70,3.79,4.49,[mkComp('GIASSI - CENTRO','JS CENTRO',3.99),mkComp('ATACADAO','SHANGRILA',3.49)]),
    shoppingBrasil: mkShop('300009','Creme de Leite Nestlé 200g',3.59,'03/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','TV Aberta','Jul/25','290 mil','R$ 8.000')
  },
  {
    id: '300010', name: 'queijo prato reino 300g fatiado', imageUrl: '/products/cat-laticinios.png',
    price: 14.99, stock: 25, margin: 0.28, sales: 680, rentability: 0.24, competitiveness: 0.67, growth: 0.10, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(12,'Médio',24,3),
    prixsia: mkPrixsia(12.49,13.80,13.99,16.49,[mkComp('GIASSI - CENTRO','JS CENTRO',14.99),mkComp('MAX ATAC-JD','JARDIM',13.49)]),
    shoppingBrasil: mkShop('300010','Queijo Prato 300g Fatiado',13.99,'10/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jun/25','80 mil','R$ 2.200')
  },
  {
    id: '300011', name: 'iogurte activia morango 160g', imageUrl: '/products/cat-laticinios.png',
    price: 4.49, stock: 30, margin: 0.29, sales: 1100, rentability: 0.25, competitiveness: 0.70, growth: 0.14, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(16,'Médio',32,2),
    prixsia: mkPrixsia(3.79,4.20,4.29,4.99,[mkComp('GIASSI - CENTRO','JS CENTRO',4.49),mkComp('ATACADAO','SHANGRILA',3.89)]),
    shoppingBrasil: mkShop('300011','Iogurte Activia Morango 160g',4.09,'07/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','250 mil','R$ 7.500')
  },
  {
    id: '300012', name: 'leite zero lactose lv 1l', imageUrl: '/products/cat-laticinios.png',
    price: 6.99, stock: 28, margin: 0.20, sales: 960, rentability: 0.16, competitiveness: 0.68, growth: 0.22, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(8,'Médio',18,5),
    prixsia: mkPrixsia(5.99,6.50,6.59,7.99,[mkComp('GIASSI - CENTRO','JS CENTRO',6.99),mkComp('MAX ATAC-JD','JARDIM',6.29)]),
    shoppingBrasil: mkShop('300012','Leite Zero Lactose LV 1L',6.49,'08/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','160 mil','R$ 5.000')
  },

  // ── ENERGÉTICOS ───────────────────────────────────────────
  {
    id: '400001', name: 'red bull energy drink 250ml', imageUrl: '/products/cat-energeticos.png',
    price: 8.99, stock: 20, margin: 0.32, sales: 900, rentability: 0.28, competitiveness: 0.65, growth: 0.22, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(45,'Premium',25,1),
    prixsia: mkPrixsia(7.99,8.50,8.49,9.99,[mkComp('GIASSI - CENTRO','JS CENTRO',8.99),mkComp('MAX ATAC-JD','JARDIM',8.29)]),
    shoppingBrasil: mkShop('400001','Red Bull Energy 250ml',7.99,'15/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','680 mil','R$ 45.000')
  },
  {
    id: '400002', name: 'monster energy 473ml la', imageUrl: '/products/cat-energeticos.png',
    price: 9.49, stock: 15, margin: 0.30, sales: 750, rentability: 0.26, competitiveness: 0.62, growth: 0.20, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(22,'Premium',18,2),
    prixsia: mkPrixsia(8.49,9.10,9.19,10.99,[mkComp('GIASSI - CENTRO','JS CENTRO',9.49),mkComp('MAX ATAC-JD','JARDIM',8.69)]),
    shoppingBrasil: mkShop('400002','Monster Energy 473ml',8.99,'14/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','520 mil','R$ 35.000')
  },
  {
    id: '400003', name: 'TNT energy drink 269ml la', imageUrl: '/products/cat-energeticos.png',
    price: 4.99, stock: 25, margin: 0.28, sales: 1100, rentability: 0.24, competitiveness: 0.75, growth: 0.18, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(12,'Médio',22,3),
    prixsia: mkPrixsia(3.99,4.50,4.59,5.49,[mkComp('GIASSI - CENTRO','JS CENTRO',4.99),mkComp('ATACADAO','SHANGRILA',3.99)]),
    shoppingBrasil: mkShop('400003','TNT Energy 269ml',4.49,'13/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jun/25','380 mil','R$ 18.000')
  },
  {
    id: '400004', name: 'burn energy drink 269ml la', imageUrl: '/products/cat-energeticos.png',
    price: 5.49, stock: 18, margin: 0.26, sales: 640, rentability: 0.22, competitiveness: 0.68, growth: 0.15, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(8,'Médio',14,4),
    prixsia: mkPrixsia(4.49,5.10,5.19,5.99,[mkComp('GIASSI - CENTRO','JS CENTRO',5.49),mkComp('MAX ATAC-JD','JARDIM',4.89)]),
    shoppingBrasil: mkShop('400004','Burn Energy 269ml',4.99,'11/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Maio/25','150 mil','R$ 6.000')
  },
  {
    id: '400005', name: 'red bull sugarfree 250ml', imageUrl: '/products/cat-energeticos.png',
    price: 8.99, stock: 16, margin: 0.31, sales: 620, rentability: 0.27, competitiveness: 0.63, growth: 0.19, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(10,'Premium',16,5),
    prixsia: mkPrixsia(7.49,8.40,8.49,9.79,[mkComp('GIASSI - CENTRO','JS CENTRO',8.99),mkComp('MAX ATAC-JD','JARDIM',8.19)]),
    shoppingBrasil: mkShop('400005','Red Bull SugarFree 250ml',7.99,'16/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','280 mil','R$ 18.000')
  },
  {
    id: '400006', name: 'monster ultra zero 473ml la', imageUrl: '/products/cat-energeticos.png',
    price: 9.49, stock: 12, margin: 0.29, sales: 480, rentability: 0.25, competitiveness: 0.60, growth: 0.21, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(8,'Premium',12,6),
    prixsia: mkPrixsia(8.19,8.90,8.99,10.49,[mkComp('GIASSI - CENTRO','JS CENTRO',9.49),mkComp('MAX ATAC-JD','JARDIM',8.69)]),
    shoppingBrasil: mkShop('400006','Monster Ultra Zero 473ml',8.79,'15/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','310 mil','R$ 20.000')
  },
];

// ── AÇOUGUE ──────────────────────────────────────────────
export const açougueProducts: Product[] = [
  {
    id: '500001', name: 'frango inteiro congelado kg', imageUrl: '/products/cat-acougue.png',
    price: 12.90, stock: 40, margin: 0.20, sales: 2800, rentability: 0.17, competitiveness: 0.78, growth: 0.08, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(18,'Básico',52,1),
    prixsia: mkPrixsia(10.90,12.20,12.49,14.99,[mkComp('GIASSI - CENTRO','JS CENTRO',12.90),mkComp('MAX ATAC-JD','JARDIM',11.49)]),
    shoppingBrasil: mkShop('500001','Frango Inteiro Congelado KG',11.90,'01/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jul/25','200 mil','R$ 6.000')
  },
  {
    id: '500002', name: 'alcatra bovina kg', imageUrl: '/products/cat-acougue.png',
    price: 49.90, stock: 15, margin: 0.22, sales: 680, rentability: 0.19, competitiveness: 0.65, growth: 0.05, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(12,'Alto',28,2),
    prixsia: mkPrixsia(42.90,47.50,48.00,54.90,[mkComp('GIASSI - CENTRO','JS CENTRO',49.90),mkComp('ATACADAO','SHANGRILA',43.90)]),
    shoppingBrasil: mkShop('500002','Alcatra Bovina KG',45.90,'05/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','150 mil','R$ 4.500')
  },
  {
    id: '500003', name: 'linguiça toscana perdigao kg', imageUrl: '/products/cat-acougue.png',
    price: 18.90, stock: 25, margin: 0.24, sales: 1100, rentability: 0.20, competitiveness: 0.70, growth: 0.10, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(15,'Básico',38,3),
    prixsia: mkPrixsia(15.90,17.50,17.90,20.90,[mkComp('GIASSI - CENTRO','JS CENTRO',18.90),mkComp('MAX ATAC-JD','JARDIM',16.49)]),
    shoppingBrasil: mkShop('500003','Linguiça Toscana Perdigão KG',16.90,'08/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','190 mil','R$ 5.000')
  },
  {
    id: '500004', name: 'coxao mole bovino kg', imageUrl: '/products/cat-acougue.png',
    price: 39.90, stock: 18, margin: 0.21, sales: 520, rentability: 0.17, competitiveness: 0.62, growth: 0.06, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(10,'Alto',22,4),
    prixsia: mkPrixsia(34.90,37.80,38.50,43.90,[mkComp('GIASSI - CENTRO','JS CENTRO',39.90),mkComp('MAX ATAC-JD','JARDIM',35.49)]),
    shoppingBrasil: mkShop('500004','Coxão Mole Bovino KG',36.90,'03/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jul/25','110 mil','R$ 3.000')
  },
  {
    id: '500005', name: 'coxa sobrecoxa frango kg', imageUrl: '/products/cat-acougue.png',
    price: 9.90, stock: 35, margin: 0.19, sales: 2200, rentability: 0.15, competitiveness: 0.80, growth: 0.07, isRepeated: true, hasAd: true,
    nielsen: mkNielsen(20,'Básico',48,2),
    prixsia: mkPrixsia(8.49,9.30,9.49,11.49,[mkComp('GIASSI - CENTRO','JS CENTRO',9.90),mkComp('ATACADAO','SHANGRILA',8.79)]),
    shoppingBrasil: mkShop('500005','Coxa/Sobrecoxa Frango KG',9.49,'06/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','TV Aberta','Jun/25','240 mil','R$ 7.000')
  },
  {
    id: '500006', name: 'paleta suina kg', imageUrl: '/products/cat-acougue.png',
    price: 16.90, stock: 20, margin: 0.23, sales: 680, rentability: 0.19, competitiveness: 0.68, growth: 0.09, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(8,'Médio',18,5),
    prixsia: mkPrixsia(13.90,15.80,15.99,18.90,[mkComp('GIASSI - CENTRO','JS CENTRO',16.90),mkComp('MAX ATAC-JD','JARDIM',14.99)]),
    shoppingBrasil: mkShop('500006','Paleta Suína KG',15.90,'10/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Maio/25','95 mil','R$ 2.800')
  },
  {
    id: '500007', name: 'costela bovina kg', imageUrl: '/products/cat-acougue.png',
    price: 44.90, stock: 10, margin: 0.23, sales: 420, rentability: 0.19, competitiveness: 0.60, growth: 0.07, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(9,'Alto',20,3),
    prixsia: mkPrixsia(38.90,42.80,43.00,49.90,[mkComp('GIASSI - CENTRO','JS CENTRO',44.90),mkComp('MAX ATAC-JD','JARDIM',40.49)]),
    shoppingBrasil: mkShop('500007','Costela Bovina KG',40.90,'12/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','TV Aberta','Jun/25','90 mil','R$ 2.500')
  },
  {
    id: '500008', name: 'peito de frango sem osso kg', imageUrl: '/products/cat-acougue.png',
    price: 19.90, stock: 28, margin: 0.21, sales: 1500, rentability: 0.17, competitiveness: 0.72, growth: 0.09, isRepeated: true, hasAd: true,
    nielsen: mkNielsen(14,'Alto',34,2),
    prixsia: mkPrixsia(16.90,18.80,19.00,22.49,[mkComp('GIASSI - CENTRO','JS CENTRO',19.90),mkComp('ATACADAO','SHANGRILA',17.49)]),
    shoppingBrasil: mkShop('500008','Peito de Frango s/ Osso KG',18.90,'07/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jul/25','180 mil','R$ 5.000')
  },
  {
    id: '500009', name: 'salsicha viena sadia 500g', imageUrl: '/products/cat-acougue.png',
    price: 9.99, stock: 32, margin: 0.26, sales: 980, rentability: 0.22, competitiveness: 0.73, growth: 0.11, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(16,'Básico',36,2),
    prixsia: mkPrixsia(8.49,9.40,9.49,11.49,[mkComp('GIASSI - CENTRO','JS CENTRO',9.99),mkComp('MAX ATAC-JD','JARDIM',8.89)]),
    shoppingBrasil: mkShop('500009','Salsicha Viena Sadia 500g',9.19,'08/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','210 mil','R$ 6.000')
  },
  {
    id: '500010', name: 'hamburguer bovino seara 672g', imageUrl: '/products/cat-acougue.png',
    price: 14.99, stock: 22, margin: 0.24, sales: 780, rentability: 0.20, competitiveness: 0.69, growth: 0.13, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(12,'Médio',26,3),
    prixsia: mkPrixsia(12.49,13.90,13.99,16.49,[mkComp('GIASSI - CENTRO','JS CENTRO',14.99),mkComp('ATACADAO','SHANGRILA',13.19)]),
    shoppingBrasil: mkShop('500010','Hambúrguer Bovino Seara 672g',13.99,'11/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','140 mil','R$ 4.500')
  },
  {
    id: '500011', name: 'picanha bovina kg', imageUrl: '/products/cat-acougue.png',
    price: 89.90, stock: 8, margin: 0.25, sales: 280, rentability: 0.21, competitiveness: 0.55, growth: 0.06, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(6,'Alto',12,5),
    prixsia: mkPrixsia(79.90,85.00,85.00,99.90,[mkComp('GIASSI - CENTRO','JS CENTRO',89.90),mkComp('MAX ATAC-JD','JARDIM',82.90)]),
    shoppingBrasil: mkShop('500011','Picanha Bovina KG',83.90,'13/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Jornal','Jun/25','60 mil','R$ 2.000')
  },
  {
    id: '500012', name: 'frango assado temperado kg', imageUrl: '/products/cat-acougue.png',
    price: 22.90, stock: 18, margin: 0.32, sales: 640, rentability: 0.28, competitiveness: 0.65, growth: 0.14, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(10,'Médio',22,4),
    prixsia: mkPrixsia(19.90,21.80,21.90,24.90,[mkComp('GIASSI - CENTRO','JS CENTRO',22.90),mkComp('MAX ATAC-JD','JARDIM',20.90)]),
    shoppingBrasil: mkShop('500012','Frango Assado Temperado KG',21.90,'14/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','120 mil','R$ 3.500')
  },
];

// ── PADARIA ───────────────────────────────────────────────
export const padariaProducts: Product[] = [
  {
    id: '600001', name: 'pao frances kg', imageUrl: '/products/cat-padaria.png',
    price: 14.90, stock: 60, margin: 0.38, sales: 3500, rentability: 0.34, competitiveness: 0.80, growth: 0.03, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(25,'Básico',70,1),
    prixsia: mkPrixsia(12.90,14.20,14.49,16.90,[mkComp('GIASSI - CENTRO','JS CENTRO',14.90),mkComp('MAX ATAC-JD','JARDIM',13.49)]),
    shoppingBrasil: mkShop('600001','Pão Francês KG',13.90,'01/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Jornal','Jul/25','110 mil','R$ 2.000')
  },
  {
    id: '600002', name: 'bolo formigueiro bauducco 500g', imageUrl: '/products/cat-padaria.png',
    price: 12.49, stock: 30, margin: 0.30, sales: 1200, rentability: 0.26, competitiveness: 0.72, growth: 0.08, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(14,'Médio',35,2),
    prixsia: mkPrixsia(10.49,11.80,11.99,13.99,[mkComp('GIASSI - CENTRO','JS CENTRO',12.49),mkComp('ATACADAO','SHANGRILA',10.99)]),
    shoppingBrasil: mkShop('600002','Bolo Formigueiro Bauducco 500g',11.49,'05/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','250 mil','R$ 8.000')
  },
  {
    id: '600003', name: 'biscoito maizena estrela 400g', imageUrl: '/products/cat-padaria.png',
    price: 4.99, stock: 45, margin: 0.28, sales: 1800, rentability: 0.24, competitiveness: 0.76, growth: 0.05, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(16,'Básico',48,2),
    prixsia: mkPrixsia(3.99,4.60,4.79,5.49,[mkComp('GIASSI - CENTRO','JS CENTRO',4.99),mkComp('MAX ATAC-JD','JARDIM',4.29)]),
    shoppingBrasil: mkShop('600003','Biscoito Maizena Estrela 400g',4.49,'03/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','300 mil','R$ 7.000')
  },
  {
    id: '600004', name: 'pao de forma wickbold integral 500g', imageUrl: '/products/cat-padaria.png',
    price: 8.99, stock: 38, margin: 0.26, sales: 2100, rentability: 0.22, competitiveness: 0.74, growth: 0.10, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(18,'Médio',42,2),
    prixsia: mkPrixsia(7.49,8.30,8.49,9.99,[mkComp('GIASSI - CENTRO','JS CENTRO',8.99),mkComp('ATACADAO','SHANGRILA',7.79)]),
    shoppingBrasil: mkShop('600004','Pão de Forma Wickbold Integral 500g',8.49,'08/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','280 mil','R$ 9.000')
  },
  {
    id: '600005', name: 'croissant amanteigado 300g', imageUrl: '/products/cat-padaria.png',
    price: 11.99, stock: 22, margin: 0.35, sales: 760, rentability: 0.31, competitiveness: 0.66, growth: 0.12, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(8,'Premium',16,4),
    prixsia: mkPrixsia(9.99,11.20,11.49,13.49,[mkComp('GIASSI - CENTRO','JS CENTRO',11.99),mkComp('MAX ATAC-JD','JARDIM',10.49)]),
    shoppingBrasil: mkShop('600005','Croissant Amanteigado 300g',10.99,'12/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Maio/25','120 mil','R$ 4.000')
  },
  {
    id: '600006', name: 'biscoito recheado oreo 90g', imageUrl: '/products/cat-padaria.png',
    price: 3.99, stock: 50, margin: 0.32, sales: 2200, rentability: 0.28, competitiveness: 0.78, growth: 0.16, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(20,'Médio',45,2),
    prixsia: mkPrixsia(3.29,3.70,3.79,4.49,[mkComp('GIASSI - CENTRO','JS CENTRO',3.99),mkComp('ATACADAO','SHANGRILA',3.39)]),
    shoppingBrasil: mkShop('600006','Biscoito Recheado Oreo 90g',3.69,'06/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','420 mil','R$ 12.000')
  },
  {
    id: '600007', name: 'bolacha cream cracker mabel 400g', imageUrl: '/products/cat-padaria.png',
    price: 5.49, stock: 42, margin: 0.24, sales: 1600, rentability: 0.20, competitiveness: 0.72, growth: 0.06, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(14,'Básico',38,3),
    prixsia: mkPrixsia(4.49,5.10,5.19,5.99,[mkComp('GIASSI - CENTRO','JS CENTRO',5.49),mkComp('MAX ATAC-JD','JARDIM',4.79)]),
    shoppingBrasil: mkShop('600007','Bolacha Cream Cracker Mabel 400g',4.99,'04/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Jornal','Jun/25','200 mil','R$ 5.000')
  },
  {
    id: '600008', name: 'granola nesfit natural 300g', imageUrl: '/products/cat-padaria.png',
    price: 9.49, stock: 20, margin: 0.33, sales: 580, rentability: 0.29, competitiveness: 0.63, growth: 0.20, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(6,'Premium',12,6),
    prixsia: mkPrixsia(7.99,8.90,8.99,10.49,[mkComp('GIASSI - CENTRO','JS CENTRO',9.49),mkComp('MAX ATAC-JD','JARDIM',8.49)]),
    shoppingBrasil: mkShop('600008','Granola Nesfit Natural 300g',8.99,'10/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','100 mil','R$ 3.500')
  },
  {
    id: '600009', name: 'pao de hot dog pullman 6un', imageUrl: '/products/cat-padaria.png',
    price: 5.99, stock: 35, margin: 0.27, sales: 1400, rentability: 0.23, competitiveness: 0.71, growth: 0.09, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(18,'Básico',40,2),
    prixsia: mkPrixsia(4.99,5.60,5.69,6.49,[mkComp('GIASSI - CENTRO','JS CENTRO',5.99),mkComp('ATACADAO','SHANGRILA',5.19)]),
    shoppingBrasil: mkShop('600009','Pão de Hot Dog Pullman 6un',5.49,'05/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','TV Aberta','Jun/25','230 mil','R$ 6.500')
  },
  {
    id: '600010', name: 'biscoito wafer bauducco baunilha 140g', imageUrl: '/products/cat-padaria.png',
    price: 3.49, stock: 48, margin: 0.30, sales: 1900, rentability: 0.26, competitiveness: 0.76, growth: 0.08, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(15,'Básico',40,3),
    prixsia: mkPrixsia(2.79,3.20,3.29,3.99,[mkComp('GIASSI - CENTRO','JS CENTRO',3.49),mkComp('MAX ATAC-JD','JARDIM',2.99)]),
    shoppingBrasil: mkShop('600010','Biscoito Wafer Baunilha 140g',3.19,'03/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','310 mil','R$ 7.500')
  },
];

// ── ÁGUA MINERAL ──────────────────────────────────────────
export const aguaProducts: Product[] = [
  {
    id: '700001', name: 'agua mineral minalba 1,5l', imageUrl: '/products/cat-agua.png',
    price: 3.49, stock: 80, margin: 0.35, sales: 4200, rentability: 0.31, competitiveness: 0.85, growth: 0.06, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(18,'Básico',72,2),
    prixsia: mkPrixsia(2.79,3.20,3.29,3.99,[mkComp('GIASSI - CENTRO','JS CENTRO',3.49),mkComp('MAX ATAC-JD','JARDIM',2.99)]),
    shoppingBrasil: mkShop('700001','Água Mineral Minalba 1,5L',2.99,'01/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jul/25','250 mil','R$ 5.000')
  },
  {
    id: '700002', name: 'agua mineral cristal 500ml', imageUrl: '/products/cat-agua.png',
    price: 1.99, stock: 120, margin: 0.30, sales: 5800, rentability: 0.26, competitiveness: 0.90, growth: 0.04, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(22,'Básico',80,1),
    prixsia: mkPrixsia(1.49,1.80,1.89,2.29,[mkComp('GIASSI - CENTRO','JS CENTRO',1.99),mkComp('ATACADAO','SHANGRILA',1.59)]),
    shoppingBrasil: mkShop('700002','Água Mineral Cristal 500ml',1.79,'01/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','320 mil','R$ 8.000')
  },
  {
    id: '700003', name: 'agua tonica schweppes 350ml la', imageUrl: '/products/cat-agua.png',
    price: 4.49, stock: 30, margin: 0.28, sales: 880, rentability: 0.24, competitiveness: 0.70, growth: 0.11, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(30,'Alto',22,1),
    prixsia: mkPrixsia(3.49,4.10,4.19,4.99,[mkComp('GIASSI - CENTRO','JS CENTRO',4.49),mkComp('MAX ATAC-JD','JARDIM',3.89)]),
    shoppingBrasil: mkShop('700003','Água Tônica Schweppes 350ml',3.99,'06/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','160 mil','R$ 5.500')
  },
  {
    id: '700004', name: 'agua mineral bonafont 1,5l', imageUrl: '/products/cat-agua.png',
    price: 3.29, stock: 90, margin: 0.33, sales: 3800, rentability: 0.29, competitiveness: 0.87, growth: 0.05, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(20,'Básico',70,2),
    prixsia: mkPrixsia(2.59,3.00,3.09,3.79,[mkComp('GIASSI - CENTRO','JS CENTRO',3.29),mkComp('MAX ATAC-JD','JARDIM',2.89)]),
    shoppingBrasil: mkShop('700004','Água Mineral Bonafont 1,5L',2.89,'02/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jul/25','280 mil','R$ 6.000')
  },
  {
    id: '700005', name: 'agua mineral perrier 330ml garrafa', imageUrl: '/products/cat-agua.png',
    price: 6.99, stock: 18, margin: 0.38, sales: 380, rentability: 0.34, competitiveness: 0.55, growth: 0.18, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(5,'Premium',8,6),
    prixsia: mkPrixsia(5.49,6.50,6.59,7.99,[mkComp('GIASSI - CENTRO','JS CENTRO',6.99),mkComp('MAX ATAC-JD','JARDIM',6.29)]),
    shoppingBrasil: mkShop('700005','Água Mineral Perrier 330ml',6.49,'09/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','80 mil','R$ 3.500')
  },
  {
    id: '700006', name: 'agua coco green coco 200ml tp', imageUrl: '/products/cat-agua.png',
    price: 3.99, stock: 35, margin: 0.32, sales: 1200, rentability: 0.28, competitiveness: 0.68, growth: 0.25, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(8,'Médio',18,4),
    prixsia: mkPrixsia(3.19,3.70,3.79,4.49,[mkComp('GIASSI - CENTRO','JS CENTRO',3.99),mkComp('ATACADAO','SHANGRILA',3.39)]),
    shoppingBrasil: mkShop('700006','Água de Coco Green Coco 200ml',3.69,'08/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','140 mil','R$ 4.500')
  },
];

// ── SUCOS ─────────────────────────────────────────────────
export const sucoProducts: Product[] = [
  {
    id: '800001', name: 'suco del valle uva 1l', imageUrl: '/products/cat-sucos.png',
    price: 8.49, stock: 28, margin: 0.24, sales: 1050, rentability: 0.20, competitiveness: 0.72, growth: 0.09, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(14,'Médio',28,2),
    prixsia: mkPrixsia(6.99,7.90,7.99,9.49,[mkComp('GIASSI - CENTRO','JS CENTRO',8.49),mkComp('ATACADAO','SHANGRILA',7.29)]),
    shoppingBrasil: mkShop('800001','Suco Del Valle Uva 1L',7.99,'08/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jun/25','200 mil','R$ 6.000')
  },
  {
    id: '800002', name: 'nectar pessego sufresh 1l', imageUrl: '/products/cat-sucos.png',
    price: 6.99, stock: 22, margin: 0.22, sales: 780, rentability: 0.18, competitiveness: 0.69, growth: 0.07, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(10,'Médio',20,4),
    prixsia: mkPrixsia(5.99,6.50,6.59,7.99,[mkComp('GIASSI - CENTRO','JS CENTRO',6.99),mkComp('MAX ATAC-JD','JARDIM',6.29)]),
    shoppingBrasil: mkShop('800002','Néctar Pêssego Sufresh 1L',6.49,'07/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Maio/25','130 mil','R$ 4.000')
  },
  {
    id: '800003', name: 'suco del valle laranja 1l', imageUrl: '/products/cat-sucos.png',
    price: 7.99, stock: 30, margin: 0.23, sales: 1200, rentability: 0.19, competitiveness: 0.74, growth: 0.10, isRepeated: false, hasAd: true,
    nielsen: mkNielsen(16,'Médio',30,2),
    prixsia: mkPrixsia(6.49,7.50,7.59,8.99,[mkComp('GIASSI - CENTRO','JS CENTRO',7.99),mkComp('MAX ATAC-JD','JARDIM',7.19)]),
    shoppingBrasil: mkShop('800003','Suco Del Valle Laranja 1L',7.49,'09/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','Digital','Jul/25','240 mil','R$ 7.000')
  },
  {
    id: '800004', name: 'suco ades laranja 1l', imageUrl: '/products/cat-sucos.png',
    price: 6.49, stock: 25, margin: 0.21, sales: 950, rentability: 0.17, competitiveness: 0.71, growth: 0.08, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(12,'Médio',25,3),
    prixsia: mkPrixsia(5.49,6.10,6.19,7.29,[mkComp('GIASSI - CENTRO','JS CENTRO',6.49),mkComp('ATACADAO','SHANGRILA',5.79)]),
    shoppingBrasil: mkShop('800004','Suco AdeS Laranja 1L',5.99,'06/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','TV Aberta','Jun/25','190 mil','R$ 5.500')
  },
  {
    id: '800005', name: 'suco kapo morango 200ml tp', imageUrl: '/products/cat-sucos.png',
    price: 1.49, stock: 60, margin: 0.28, sales: 2800, rentability: 0.24, competitiveness: 0.82, growth: 0.07, isRepeated: true, hasAd: false,
    nielsen: mkNielsen(20,'Básico',48,1),
    prixsia: mkPrixsia(0.99,1.30,1.39,1.79,[mkComp('GIASSI - CENTRO','JS CENTRO',1.49),mkComp('MAX ATAC-JD','JARDIM',1.19)]),
    shoppingBrasil: mkShop('800005','Suco Kapo Morango 200ml',1.29,'04/08/2025'),
    globalSegments: mkSeg('Mercado BomPreço','TV Aberta','Jun/25','350 mil','R$ 9.000')
  },
  {
    id: '800006', name: 'suco do bem laranja 1l', imageUrl: '/products/cat-sucos.png',
    price: 12.99, stock: 16, margin: 0.30, sales: 420, rentability: 0.26, competitiveness: 0.60, growth: 0.20, isRepeated: false, hasAd: false,
    nielsen: mkNielsen(6,'Premium',12,5),
    prixsia: mkPrixsia(10.99,12.20,12.29,13.99,[mkComp('GIASSI - CENTRO','JS CENTRO',12.99),mkComp('MAX ATAC-JD','JARDIM',11.99)]),
    shoppingBrasil: mkShop('800006','Suco Do Bem Laranja 1L',11.99,'12/08/2025'),
    globalSegments: mkSeg('Super Mais Barato','Digital','Jun/25','90 mil','R$ 4.000')
  },
];

// section tag used for filtering in Dashboard
export const SECTION_GROUP_MAP: Record<string, string[]> = {
  'Todas': [],
  'Bebidas': ['80', '81', '85', '88', '93'],
  'Laticínios': ['82'],
  'Açougue': ['90'],
  'Padaria': ['91'],
};

export const mockProductGroups: ProductGroup[] = [
  {
    id: '80', name: '80-Cervejas', percentage: 29.9,
    products: mockProducts.filter(p => p.id.startsWith('1') && p.name.includes('cerv'))
  },
  {
    id: '81', name: '81-Refrigerantes', percentage: 35.4,
    products: mockProducts.filter(p => p.id.startsWith('200'))
  },
  {
    id: '82', name: '82-Laticínios', percentage: 15.2,
    products: mockProducts.filter(p => p.id.startsWith('300'))
  },
  {
    id: '88', name: '88-Energéticos', percentage: 10.3,
    products: mockProducts.filter(p => p.id.startsWith('400'))
  },
  {
    id: '85', name: '85-Água Mineral', percentage: 5.4,
    products: aguaProducts
  },
  {
    id: '93', name: '93-Suco Pronto', percentage: 3.8,
    products: sucoProducts
  },
  {
    id: '90', name: '90-Açougue', percentage: 12.1,
    products: açougueProducts
  },
  {
    id: '91', name: '91-Padaria', percentage: 8.7,
    products: padariaProducts
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
    products: [mockProducts[0], mockProducts[1], mockProducts[3], aguaProducts[0], aguaProducts[3], padariaProducts[0], padariaProducts[2], padariaProducts[6]],
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
    products: [mockProducts[2], mockProducts[4], mockProducts[5], mockProducts[6], açougueProducts[0], açougueProducts[2], açougueProducts[7], padariaProducts[1], padariaProducts[5], sucoProducts[0], sucoProducts[2]],
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
    products: [mockProducts[0], mockProducts[3], mockProducts[4], mockProducts[14], mockProducts[15], aguaProducts[1], aguaProducts[2], aguaProducts[5], sucoProducts[0], sucoProducts[1], sucoProducts[3]],
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
    products: [...mockProducts, ...açougueProducts, ...padariaProducts, ...aguaProducts, ...sucoProducts],
    avgScore: 85,
    status: 'published',
    region: 'Todas',
    campaign: 'Black Friday',
    createdBy: 'Ana Oliveira',
    totalValue: 156780.00,
    avgMargin: 0.28
  },
  {
    id: '5',
    name: 'Páscoa 2025',
    date: '2025-04-18',
    products: [mockProducts[7], mockProducts[8], mockProducts[16], mockProducts[17], mockProducts[27], mockProducts[28], açougueProducts[1], açougueProducts[3], açougueProducts[9], padariaProducts[3], padariaProducts[4], padariaProducts[7]],
    avgScore: 79,
    status: 'published',
    region: 'Curitiba',
    campaign: 'Páscoa',
    createdBy: 'Carlos Mendes',
    totalValue: 52300.00,
    avgMargin: 0.26
  },
  {
    id: '6',
    name: 'Promoção Junho 2025',
    date: '2025-06-05',
    products: [mockProducts[0], mockProducts[1], mockProducts[9], mockProducts[10], mockProducts[18], mockProducts[19], açougueProducts[4], açougueProducts[5], açougueProducts[8], aguaProducts[0], aguaProducts[3], sucoProducts[1], sucoProducts[4]],
    avgScore: 80,
    status: 'published',
    region: 'SC',
    campaign: 'Inverno',
    createdBy: 'Fernanda Lima',
    totalValue: 71200.00,
    avgMargin: 0.24
  },
  {
    id: '7',
    name: 'Festa Junina 2025',
    date: '2025-06-21',
    products: [mockProducts[3], mockProducts[4], mockProducts[5], mockProducts[11], mockProducts[12], açougueProducts[0], açougueProducts[2], açougueProducts[6], padariaProducts[0], padariaProducts[2], padariaProducts[8], aguaProducts[1]],
    avgScore: 77,
    status: 'published',
    region: 'Interior',
    campaign: 'Festa Junina',
    createdBy: 'Roberto Alves',
    totalValue: 48900.00,
    avgMargin: 0.22
  },
  {
    id: '8',
    name: 'Tabloide Julho 2025',
    date: '2025-07-10',
    products: [mockProducts[0], mockProducts[2], mockProducts[6], mockProducts[13], mockProducts[14], mockProducts[20], mockProducts[21], açougueProducts[1], açougueProducts[3], açougueProducts[7], açougueProducts[10], padariaProducts[1], padariaProducts[3], padariaProducts[9], sucoProducts[0], sucoProducts[2]],
    avgScore: 83,
    status: 'published',
    region: 'Litoral',
    campaign: 'Férias',
    createdBy: 'Juliana Souza',
    totalValue: 89400.00,
    avgMargin: 0.27
  },
  {
    id: '9',
    name: 'Tabloide Agosto 2025',
    date: '2025-08-01',
    products: [mockProducts[0], mockProducts[1], mockProducts[8], mockProducts[9], mockProducts[23], mockProducts[24], mockProducts[30], mockProducts[31], açougueProducts[0], açougueProducts[5], açougueProducts[11], padariaProducts[0], padariaProducts[5], padariaProducts[6], aguaProducts[2], aguaProducts[4], sucoProducts[3], sucoProducts[5]],
    avgScore: 81,
    status: 'published',
    region: 'Curitiba',
    campaign: 'Inverno',
    createdBy: 'Ricardo Melo',
    totalValue: 94500.00,
    avgMargin: 0.26
  },
  {
    id: '10',
    name: 'Promoção Dia dos Pais 2025',
    date: '2025-08-10',
    products: [mockProducts[2], mockProducts[3], mockProducts[7], mockProducts[11], mockProducts[12], mockProducts[26], mockProducts[27], açougueProducts[1], açougueProducts[2], açougueProducts[4], açougueProducts[8], padariaProducts[2], padariaProducts[4], padariaProducts[7], aguaProducts[0], aguaProducts[1], sucoProducts[0], sucoProducts[1]],
    avgScore: 84,
    status: 'draft',
    region: 'Todas',
    campaign: 'Dia dos Pais',
    createdBy: 'Cristiana Souza',
    totalValue: 108000.00,
    avgMargin: 0.25
  }
];

export const regions = ['Selecione uma região', 'Curitiba', 'Litoral', 'Interior', 'SC'];
export const sections = ['Todas', 'Bebidas', 'Laticínios', 'Açougue', 'Padaria'];
export const campaigns = ['Todas', 'Inverno', 'Dia das Mães', 'Verão', 'Black Friday', 'Páscoa', 'Festa Junina', 'Férias', 'Dia dos Pais'];
export const strategies = ['Maior Quantidade', 'Maior Margem', 'Maior Venda', 'Menor Preço'];
