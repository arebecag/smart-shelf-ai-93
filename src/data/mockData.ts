import { Product, ProductGroup } from '@/types/product';

// ── HELPERS ───────────────────────────────────────────────
const mkComp = (n: string, loc: string, price: number) => ({ name: n, location: loc, price });
const mkNielsen = (ms: number, seg: string, pen: number, rank: number) => ({ marketShare: ms, coreSegment: seg, penetration: pen, regionalRanking: rank });
const mkPrixsia = (min: number, avg: number, med: number, max: number, comps: {name:string;location:string;price:number}[]) => ({ minPrice: min, avgPrice: avg, medianPrice: med, maxPrice: max, competitors: comps });
const mkShop = (id: string, title: string, adPrice: number, date: string) => ({ link: `https://www.shoppingbrasil.com.br/produto/${id}`, title, adPrice, startDate: date, detail: 'Oferta válida para o Sul do Brasil.' });
const mkSeg = (comp: string, camp: string, date: string, reach: string, invest: string) => [{ competitor: comp, lastCampaign: camp, campaignDate: date, reach, investment: invest }];

// random-ish helpers for generating realistic data from CSV names
const r = (min: number, max: number) => +(min + Math.random() * (max - min)).toFixed(2);
const ri = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));

const mkProduct = (id: string, name: string, img: string, price: number, opts: Partial<Product> = {}): Product => ({
  id, name, imageUrl: img,
  price,
  stock: opts.stock ?? ri(8, 80),
  margin: opts.margin ?? r(0.15, 0.38),
  sales: opts.sales ?? ri(200, 4000),
  rentability: opts.rentability ?? r(0.12, 0.32),
  competitiveness: opts.competitiveness ?? r(0.50, 0.92),
  growth: opts.growth ?? r(0.03, 0.28),
  isRepeated: opts.isRepeated ?? Math.random() > 0.65,
  hasAd: opts.hasAd ?? Math.random() > 0.6,
  nielsen: opts.nielsen ?? mkNielsen(ri(2, 30), ['Básico','Médio','Alto','Premium'][ri(0,4)], ri(5, 70), ri(1, 16)),
  prixsia: opts.prixsia ?? mkPrixsia(r(price*0.75, price*0.9), r(price*0.9, price*1.05), r(price*0.92, price*1.02), r(price*1.05, price*1.25), [mkComp('GIASSI - CENTRO','JS CENTRO', r(price*0.9, price*1.1)), mkComp('MAX ATAC-JD','JARDIM', r(price*0.8, price*1.0)), mkComp('ATACADAO','SHANGRILA', r(price*0.75, price*0.95))]),
  shoppingBrasil: opts.shoppingBrasil ?? mkShop(id, name, r(price*0.85, price*0.98), '08/08/2025'),
  globalSegments: opts.globalSegments ?? mkSeg(['Mercado BomPreço','Super Mais Barato','Atacadão','Big Bompreço'][ri(0,4)], ['TV Aberta','Digital','Rádio','Jornal'][ri(0,4)], ['Jun/25','Jul/25','Maio/25','Ago/25'][ri(0,4)], `${ri(80,850)} mil`, `R$ ${ri(2,45)}.000`),
});

// ── CERVEJAS (Seção 8, Grupo 80) ──────────────────────────
export const cervejaProducts: Product[] = [
  mkProduct('769088','cerv.skol pilsen 473ml la','/products/cat-cervejas.png',3.29,{margin:0.19,sales:1650,isRepeated:true,hasAd:false}),
  mkProduct('127400','cerv.brahma chopp 350ml la','/products/cat-cervejas.png',3.59,{margin:0.22,sales:1400,isRepeated:false,hasAd:true}),
  mkProduct('1875939','cerv.brahma duplo malte 350ml la','/products/cat-cervejas.png',3.99,{margin:0.25,sales:1600,isRepeated:false,hasAd:true}),
  mkProduct('1981356','cerv.spaten 350ml la','/products/cat-cervejas.png',4.79,{margin:0.19,sales:1200,isRepeated:true,hasAd:false}),
  mkProduct('1100001','cerv.heineken 350ml la','/products/cat-cervejas.png',4.99,{margin:0.24,sales:1750,isRepeated:false,hasAd:true}),
  mkProduct('1100002','cerv.corona extra 330ml garrafa','/products/cat-cervejas.png',5.49,{margin:0.26,sales:980,isRepeated:false,hasAd:false}),
  mkProduct('1100003','cerv.budweiser 350ml la','/products/cat-cervejas.png',3.89,{margin:0.21,sales:1320,isRepeated:true,hasAd:false}),
  mkProduct('1100004','cerv.amstel 350ml la','/products/cat-cervejas.png',3.69,{margin:0.20,sales:1100,isRepeated:false,hasAd:true}),
  mkProduct('1100005','cerv.skol 350ml la','/products/cat-cervejas.png',3.29,{margin:0.19,sales:1650,isRepeated:true,hasAd:false}),
  mkProduct('1100006','cerv.original 600ml garrafa','/products/cat-cervejas.png',6.49,{margin:0.23,sales:820,isRepeated:false,hasAd:true}),
  mkProduct('1100007','cerv.itaipava 350ml la','/products/cat-cervejas.png',2.99,{margin:0.18,sales:1900,isRepeated:true,hasAd:false}),
  mkProduct('1100008','cerv.devassa ruiva 350ml la','/products/cat-cervejas.png',4.49,{margin:0.22,sales:750,isRepeated:false,hasAd:false}),
  mkProduct('1100009','cerv.stella artois 350ml la','/products/cat-cervejas.png',4.29,{margin:0.23,sales:1050,isRepeated:false,hasAd:true}),
  mkProduct('1100010','cerv.eisenbahn pale ale 355ml garrafa','/products/cat-cervejas.png',7.99,{margin:0.28,sales:380,isRepeated:false,hasAd:false}),
  mkProduct('1100011','cerv.colorado appia 600ml garrafa','/products/cat-cervejas.png',11.99,{margin:0.30,sales:290,isRepeated:false,hasAd:false}),
  mkProduct('1100012','cerv.bohemia 600ml garrafa','/products/cat-cervejas.png',7.49,{margin:0.21,sales:560,isRepeated:true,hasAd:false}),
  // Novos do CSV real
  mkProduct('769070','cerv.skol pilsen 269ml la','/products/cat-cervejas.png',2.69,{margin:0.18,sales:2100,isRepeated:true}),
  mkProduct('769071','cerv.brahma chopp 473ml la','/products/cat-cervejas.png',4.19,{margin:0.21,sales:1350}),
  mkProduct('769072','cerv.antarctica pilsen 350ml la','/products/cat-cervejas.png',3.19,{margin:0.17,sales:980,isRepeated:true}),
  mkProduct('769073','cerv.heineken long neck 330ml','/products/cat-cervejas.png',5.99,{margin:0.26,sales:1420,hasAd:true}),
  mkProduct('769074','cerv.amstel ultra 350ml la','/products/cat-cervejas.png',4.49,{margin:0.22,sales:620}),
  mkProduct('769075','cerv.beck\'s 350ml la','/products/cat-cervejas.png',3.49,{margin:0.20,sales:480}),
  mkProduct('769076','cerv.petra puro malte 350ml la','/products/cat-cervejas.png',3.79,{margin:0.21,sales:390}),
  mkProduct('769077','cerv.imperial premium 350ml la','/products/cat-cervejas.png',3.99,{margin:0.20,sales:310}),
  mkProduct('769078','cerv.amstel bock 350ml la','/products/cat-cervejas.png',4.29,{margin:0.23,sales:410}),
  mkProduct('769079','cerv.brahma zero alcool 350ml la','/products/cat-cervejas.png',3.89,{margin:0.19,sales:520}),
  mkProduct('769080','cerv.heineken zero 350ml la','/products/cat-cervejas.png',4.99,{margin:0.24,sales:680,hasAd:true}),
  mkProduct('769081','cerv.budweiser zero 350ml la','/products/cat-cervejas.png',3.79,{margin:0.20,sales:340}),
];

// ── REFRIGERANTES (Grupo 81) ─────────────────────────────
export const refrigeranteProducts: Product[] = [
  mkProduct('200001','coca-cola original 2l pet','/products/cat-refrigerantes.png',9.99,{margin:0.28,sales:2200,hasAd:true}),
  mkProduct('200002','guarana antarctica 2l pet','/products/cat-refrigerantes.png',7.99,{margin:0.24,sales:1800}),
  mkProduct('200003','pepsi black 2l pet','/products/cat-refrigerantes.png',8.49,{margin:0.22,sales:1100}),
  mkProduct('200004','fanta laranja 2l pet','/products/cat-refrigerantes.png',7.49,{margin:0.21,sales:950,hasAd:true}),
  mkProduct('200005','schweppes citrus 2l pet','/products/cat-refrigerantes.png',6.99,{margin:0.20,sales:680,isRepeated:true}),
  mkProduct('200006','sprite limao 2l pet','/products/cat-refrigerantes.png',7.29,{margin:0.21,sales:870}),
  mkProduct('200007','coca-cola zero 2l pet','/products/cat-refrigerantes.png',9.49,{margin:0.26,sales:1400,hasAd:true}),
  mkProduct('200008','kuat limao 2l pet','/products/cat-refrigerantes.png',6.49,{margin:0.19,sales:720,isRepeated:true}),
  mkProduct('200009','coca-cola 600ml garrafa pet','/products/cat-refrigerantes.png',4.49,{margin:0.25,sales:2400,isRepeated:true,hasAd:true}),
  mkProduct('200010','guarana antarctica lata 350ml','/products/cat-refrigerantes.png',3.49,{margin:0.20,sales:1650}),
  mkProduct('200011','pepsi cola 2l pet','/products/cat-refrigerantes.png',7.49,{margin:0.20,sales:980,isRepeated:true}),
  mkProduct('200012','fanta uva 2l pet','/products/cat-refrigerantes.png',7.29,{margin:0.21,sales:720}),
  // Novos do CSV
  mkProduct('200013','coca-cola lata 350ml','/products/cat-refrigerantes.png',3.99,{margin:0.26,sales:3100,hasAd:true}),
  mkProduct('200014','guarana antarctica zero 2l pet','/products/cat-refrigerantes.png',7.49,{margin:0.22,sales:680}),
  mkProduct('200015','fanta laranja lata 350ml','/products/cat-refrigerantes.png',3.49,{margin:0.20,sales:890}),
  mkProduct('200016','sprite zero 2l pet','/products/cat-refrigerantes.png',7.29,{margin:0.21,sales:560}),
  mkProduct('200017','coca-cola cherry 350ml la','/products/cat-refrigerantes.png',4.29,{margin:0.24,sales:420}),
  mkProduct('200018','pepsi twist 2l pet','/products/cat-refrigerantes.png',7.99,{margin:0.20,sales:510}),
  mkProduct('200019','schweppes tonica 350ml la','/products/cat-refrigerantes.png',4.49,{margin:0.28,sales:380}),
  mkProduct('200020','refrigerante tubaina 2l pet','/products/cat-refrigerantes.png',4.49,{margin:0.32,sales:640,isRepeated:true}),
  mkProduct('200021','pepsi zero 2l pet','/products/cat-refrigerantes.png',8.29,{margin:0.23,sales:620}),
  mkProduct('200022','coca-cola sem acucar 2l pet','/products/cat-refrigerantes.png',9.49,{margin:0.27,sales:1200,hasAd:true}),
];

// ── LATICÍNIOS (Seção 15, Grupo 82) ─────────────────────
export const laticinioProducts: Product[] = [
  mkProduct('300001','leite integral piracanjuba 1l','/products/cat-laticinios.png',5.49,{margin:0.18,sales:3200,isRepeated:true,hasAd:true}),
  mkProduct('300002','leite semidesnatado italac 1l','/products/cat-laticinios.png',5.29,{margin:0.17,sales:2800}),
  mkProduct('300003','iogurte grego nestle 100g','/products/cat-laticinios.png',3.49,{margin:0.28,sales:1500,hasAd:true}),
  mkProduct('300004','queijo muçarela tirolez kg','/products/cat-laticinios.png',39.90,{margin:0.30,sales:480}),
  mkProduct('300005','manteiga aviacao com sal 200g','/products/cat-laticinios.png',8.99,{margin:0.25,sales:1200,isRepeated:true,hasAd:true}),
  mkProduct('300006','cream cheese philadelphia 150g','/products/cat-laticinios.png',9.49,{margin:0.32,sales:880,hasAd:true}),
  mkProduct('300007','requeijao catupiry 200g','/products/cat-laticinios.png',7.49,{margin:0.27,sales:1350,isRepeated:true}),
  mkProduct('300008','leite condensado moca 395g','/products/cat-laticinios.png',6.49,{margin:0.26,sales:1800,isRepeated:true,hasAd:true}),
  mkProduct('300009','creme de leite nestle 200g','/products/cat-laticinios.png',3.99,{margin:0.22,sales:2100,isRepeated:true}),
  mkProduct('300010','queijo prato reino 300g fatiado','/products/cat-laticinios.png',14.99,{margin:0.28,sales:680}),
  mkProduct('300011','iogurte activia morango 160g','/products/cat-laticinios.png',4.49,{margin:0.29,sales:1100,hasAd:true}),
  mkProduct('300012','leite zero lactose lv 1l','/products/cat-laticinios.png',6.99,{margin:0.20,sales:960}),
  // Novos do CSV real (Seção 15)
  mkProduct('1184878','requeijao tirol light 180g','/products/cat-laticinios.png',6.89,{margin:0.22,sales:720}),
  mkProduct('1109883','cream cheese philadelphia original 150g','/products/cat-laticinios.png',9.49,{margin:0.30,sales:880,hasAd:true}),
  mkProduct('1231836','queijo frimesa minas padrao kg','/products/cat-laticinios.png',34.90,{margin:0.28,sales:320}),
  mkProduct('2215689','iog.atilatte natural integ.170g','/products/cat-laticinios.png',4.29,{margin:0.24,sales:480}),
  mkProduct('2215655','iog.atilatte skyr trad.170g','/products/cat-laticinios.png',5.99,{margin:0.30,sales:360}),
  mkProduct('2226447','sob.nestle chandelle chantilly choc.90g','/products/cat-laticinios.png',3.79,{margin:0.34,sales:920}),
  mkProduct('2226454','queijo catupiry processado fat.180g','/products/cat-laticinios.png',12.49,{margin:0.28,sales:540}),
  mkProduct('2352391A','iog.tirol ped.ftas mrgo 400g','/products/cat-laticinios.png',5.49,{margin:0.22,sales:680}),
  mkProduct('300013','leite integral frimesa 1l uht','/products/cat-laticinios.png',5.19,{margin:0.16,sales:2600,isRepeated:true}),
  mkProduct('300014','beb.lactea santa clara mrgo 1kg','/products/cat-laticinios.png',5.99,{margin:0.20,sales:1400}),
  mkProduct('300015','iogurte nestle morango 540g','/products/cat-laticinios.png',6.99,{margin:0.26,sales:1100,hasAd:true}),
  mkProduct('300016','queijo provolone kg','/products/cat-laticinios.png',54.90,{margin:0.32,sales:190}),
  mkProduct('300017','manteiga tirol c/sal 200g','/products/cat-laticinios.png',8.49,{margin:0.24,sales:980}),
  mkProduct('300018','leite desnatado parmalat 1l','/products/cat-laticinios.png',5.49,{margin:0.17,sales:1800}),
  mkProduct('300019','iogurte danone morango 510g','/products/cat-laticinios.png',7.29,{margin:0.25,sales:1250,hasAd:true}),
  mkProduct('300020','queijo coalho kg','/products/cat-laticinios.png',42.90,{margin:0.29,sales:280}),
];

// ── ENERGÉTICOS (Grupo 88) ───────────────────────────────
export const energeticoProducts: Product[] = [
  mkProduct('400001','red bull energy drink 250ml','/products/cat-energeticos.png',8.99,{margin:0.32,sales:900,hasAd:true}),
  mkProduct('400002','monster energy 473ml la','/products/cat-energeticos.png',9.49,{margin:0.30,sales:750,hasAd:true}),
  mkProduct('400003','TNT energy drink 269ml la','/products/cat-energeticos.png',4.99,{margin:0.28,sales:1100}),
  mkProduct('400004','burn energy drink 269ml la','/products/cat-energeticos.png',5.49,{margin:0.26,sales:640}),
  mkProduct('400005','red bull sugarfree 250ml','/products/cat-energeticos.png',8.99,{margin:0.31,sales:620}),
  mkProduct('400006','monster ultra zero 473ml la','/products/cat-energeticos.png',9.49,{margin:0.29,sales:480}),
  // Novos
  mkProduct('400007','red bull tropical 250ml','/products/cat-energeticos.png',9.49,{margin:0.33,sales:520,hasAd:true}),
  mkProduct('400008','monster mango loco 473ml la','/products/cat-energeticos.png',9.49,{margin:0.29,sales:410}),
  mkProduct('400009','TNT acai berry 269ml la','/products/cat-energeticos.png',4.99,{margin:0.27,sales:380}),
  mkProduct('400010','monster pipeline punch 473ml la','/products/cat-energeticos.png',9.49,{margin:0.28,sales:350}),
  mkProduct('400011','red bull acai 250ml','/products/cat-energeticos.png',9.49,{margin:0.32,sales:440}),
  mkProduct('400012','celsius sparkling laranja 355ml','/products/cat-energeticos.png',12.99,{margin:0.35,sales:280}),
];

// ── AÇOUGUE (Seção 21, Grupo 90) ─────────────────────────
export const açougueProducts: Product[] = [
  mkProduct('500001','frango inteiro congelado kg','/products/cat-acougue.png',12.90,{margin:0.20,sales:2800,hasAd:true}),
  mkProduct('500002','alcatra bovina kg','/products/cat-acougue.png',49.90,{margin:0.22,sales:680}),
  mkProduct('500003','linguiça toscana perdigao kg','/products/cat-acougue.png',18.90,{margin:0.24,sales:1100,hasAd:true}),
  mkProduct('500004','coxao mole bovino kg','/products/cat-acougue.png',39.90,{margin:0.21,sales:520,isRepeated:true}),
  mkProduct('500005','coxa sobrecoxa frango kg','/products/cat-acougue.png',9.90,{margin:0.19,sales:2200,isRepeated:true,hasAd:true}),
  mkProduct('500006','paleta suina kg','/products/cat-acougue.png',16.90,{margin:0.23,sales:680}),
  mkProduct('500007','costela bovina kg','/products/cat-acougue.png',44.90,{margin:0.23,sales:420}),
  mkProduct('500008','peito de frango sem osso kg','/products/cat-acougue.png',19.90,{margin:0.21,sales:1500,isRepeated:true,hasAd:true}),
  mkProduct('500009','salsicha viena sadia 500g','/products/cat-acougue.png',9.99,{margin:0.26,sales:980,hasAd:true}),
  mkProduct('500010','hamburguer bovino seara 672g','/products/cat-acougue.png',14.99,{margin:0.24,sales:780}),
  mkProduct('500011','picanha bovina kg','/products/cat-acougue.png',89.90,{margin:0.25,sales:280}),
  mkProduct('500012','frango assado temperado kg','/products/cat-acougue.png',22.90,{margin:0.32,sales:640,hasAd:true}),
  // Novos do CSV real (Seção 21 - Açougue)
  mkProduct('1891985A','picanha bovina angus argus vacuo kg','/products/cat-acougue.png',79.90,{margin:0.25,sales:220}),
  mkProduct('1202977','costela suina frimesa cong.kg','/products/cat-acougue.png',24.90,{margin:0.22,sales:480}),
  mkProduct('500013','maminha bovina kg','/products/cat-acougue.png',52.90,{margin:0.24,sales:380}),
  mkProduct('500014','file de peito frango kg','/products/cat-acougue.png',16.90,{margin:0.20,sales:1800,hasAd:true}),
  mkProduct('500015','acém bovino kg','/products/cat-acougue.png',29.90,{margin:0.21,sales:620}),
  mkProduct('500016','cupim bovino kg','/products/cat-acougue.png',34.90,{margin:0.23,sales:420}),
  mkProduct('500017','patinho bovino kg','/products/cat-acougue.png',37.90,{margin:0.22,sales:480}),
  mkProduct('500018','coxinha da asa frango kg','/products/cat-acougue.png',14.90,{margin:0.20,sales:1600,isRepeated:true}),
  mkProduct('500019','pernil suino kg','/products/cat-acougue.png',14.90,{margin:0.22,sales:720}),
  mkProduct('500020','carne moida 1a kg','/products/cat-acougue.png',24.90,{margin:0.19,sales:1400,isRepeated:true,hasAd:true}),
  mkProduct('500021','contrafile bovino kg','/products/cat-acougue.png',46.90,{margin:0.24,sales:340}),
  mkProduct('500022','linguiça calabresa perdigao kg','/products/cat-acougue.png',22.90,{margin:0.25,sales:920,hasAd:true}),
  mkProduct('500023','fraldinha bovina kg','/products/cat-acougue.png',42.90,{margin:0.23,sales:310}),
  mkProduct('500024','bisteca suina kg','/products/cat-acougue.png',19.90,{margin:0.21,sales:560}),
  mkProduct('500025','coração de frango kg','/products/cat-acougue.png',11.90,{margin:0.24,sales:840}),
  mkProduct('500026','tilapia file cong.kg','/products/cat-acougue.png',34.90,{margin:0.28,sales:380}),
];

// ── PADARIA (Seção 19, Grupo 91) ─────────────────────────
export const padariaProducts: Product[] = [
  mkProduct('600001','pao frances kg','/products/cat-padaria.png',14.90,{margin:0.38,sales:3500,isRepeated:true}),
  mkProduct('600002','bolo formigueiro bauducco 500g','/products/cat-padaria.png',12.49,{margin:0.30,sales:1200,hasAd:true}),
  mkProduct('600003','biscoito maizena estrela 400g','/products/cat-padaria.png',4.99,{margin:0.28,sales:1800,isRepeated:true}),
  mkProduct('600004','pao de forma wickbold integral 500g','/products/cat-padaria.png',8.99,{margin:0.26,sales:2100,hasAd:true}),
  mkProduct('600005','croissant amanteigado 300g','/products/cat-padaria.png',11.99,{margin:0.35,sales:760}),
  mkProduct('600006','biscoito recheado oreo 90g','/products/cat-padaria.png',3.99,{margin:0.32,sales:2200,hasAd:true}),
  mkProduct('600007','bolacha cream cracker mabel 400g','/products/cat-padaria.png',5.49,{margin:0.24,sales:1600,isRepeated:true}),
  mkProduct('600008','granola nesfit natural 300g','/products/cat-padaria.png',9.49,{margin:0.33,sales:580}),
  mkProduct('600009','pao de hot dog pullman 6un','/products/cat-padaria.png',5.99,{margin:0.27,sales:1400,isRepeated:true}),
  mkProduct('600010','biscoito wafer bauducco baunilha 140g','/products/cat-padaria.png',3.49,{margin:0.30,sales:1900}),
  // Novos do CSV real (Seção 19)
  mkProduct('1127737','bolo renata rech.choc.300g','/products/cat-padaria.png',7.99,{margin:0.28,sales:880}),
  mkProduct('1127752','bolinho renata l.justica choc/choc.40g','/products/cat-padaria.png',1.99,{margin:0.30,sales:2200,hasAd:true}),
  mkProduct('1127760','bolinho renata l.justica baun/mrgo 40g','/products/cat-padaria.png',1.99,{margin:0.30,sales:1900}),
  mkProduct('600011','pao de forma pullman 500g','/products/cat-padaria.png',9.49,{margin:0.26,sales:1800,hasAd:true}),
  mkProduct('600012','torrada bauducco trigo integ.160g','/products/cat-padaria.png',5.99,{margin:0.32,sales:920}),
  mkProduct('600013','bisc.tostines especiarias 150g','/products/cat-padaria.png',3.49,{margin:0.22,sales:540}),
  mkProduct('600014','bisc.oreo rech.baun.270g c/3','/products/cat-padaria.png',9.49,{margin:0.30,sales:1100}),
  mkProduct('600015','pao integral 7 graos wickbold 400g','/products/cat-padaria.png',9.99,{margin:0.28,sales:780}),
  mkProduct('600016','bolo ana maria choc.70g','/products/cat-padaria.png',2.99,{margin:0.34,sales:1600}),
  mkProduct('600017','rosca maria condor kg','/products/cat-padaria.png',19.90,{margin:0.42,sales:480,isRepeated:true}),
  mkProduct('600018','pao de queijo condor 100g','/products/cat-padaria.png',3.49,{margin:0.36,sales:1400}),
  mkProduct('600019','pao sovado condor 400g','/products/cat-padaria.png',8.99,{margin:0.40,sales:660}),
  mkProduct('600020','bolo da nonna sabores kg','/products/cat-padaria.png',29.90,{margin:0.45,sales:320}),
  mkProduct('600021','bolo de fuba c/goiabada kg','/products/cat-padaria.png',24.90,{margin:0.42,sales:280}),
];

// ── ÁGUA MINERAL (Grupo 85) ──────────────────────────────
export const aguaProducts: Product[] = [
  mkProduct('700001','agua mineral minalba 1,5l','/products/cat-agua.png',3.49,{margin:0.35,sales:4200,isRepeated:true}),
  mkProduct('700002','agua mineral cristal 500ml','/products/cat-agua.png',1.99,{margin:0.30,sales:5800,isRepeated:true}),
  mkProduct('700003','agua tonica schweppes 350ml la','/products/cat-agua.png',4.49,{margin:0.28,sales:880,hasAd:true}),
  mkProduct('700004','agua mineral bonafont 1,5l','/products/cat-agua.png',3.29,{margin:0.33,sales:3800,isRepeated:true}),
  mkProduct('700005','agua mineral perrier 330ml garrafa','/products/cat-agua.png',6.99,{margin:0.38,sales:380}),
  mkProduct('700006','agua coco green coco 200ml tp','/products/cat-agua.png',3.99,{margin:0.32,sales:1200,hasAd:true}),
  // Novos
  mkProduct('700007','agua mineral minalba 500ml','/products/cat-agua.png',1.79,{margin:0.32,sales:4800,isRepeated:true}),
  mkProduct('700008','agua mineral ouro fino 1,5l','/products/cat-agua.png',2.99,{margin:0.34,sales:2800}),
  mkProduct('700009','agua coco kero coco 200ml','/products/cat-agua.png',3.49,{margin:0.30,sales:1600,hasAd:true}),
  mkProduct('700010','agua mineral san pellegrino 500ml','/products/cat-agua.png',7.99,{margin:0.36,sales:220}),
  mkProduct('700011','agua coco obrigado 1l','/products/cat-agua.png',8.99,{margin:0.28,sales:440}),
  mkProduct('700012','agua mineral crystal c/gas 500ml','/products/cat-agua.png',2.49,{margin:0.30,sales:1200}),
];

// ── SUCOS (Grupo 93) ─────────────────────────────────────
export const sucoProducts: Product[] = [
  mkProduct('800001','suco del valle uva 1l','/products/cat-sucos.png',8.49,{margin:0.24,sales:1050,hasAd:true}),
  mkProduct('800002','nectar pessego sufresh 1l','/products/cat-sucos.png',6.99,{margin:0.22,sales:780}),
  mkProduct('800003','suco del valle laranja 1l','/products/cat-sucos.png',7.99,{margin:0.23,sales:1200,hasAd:true}),
  mkProduct('800004','suco ades laranja 1l','/products/cat-sucos.png',6.49,{margin:0.21,sales:950,isRepeated:true}),
  mkProduct('800005','suco kapo morango 200ml tp','/products/cat-sucos.png',1.49,{margin:0.28,sales:2800,isRepeated:true}),
  mkProduct('800006','suco do bem laranja 1l','/products/cat-sucos.png',12.99,{margin:0.30,sales:420}),
  // Novos do CSV (Seção 23 / sucos pronto)
  mkProduct('2237634','suco de manga 500ml','/products/cat-sucos.png',4.99,{margin:0.24,sales:580}),
  mkProduct('800007','suco del valle goiaba 1l','/products/cat-sucos.png',7.99,{margin:0.22,sales:680}),
  mkProduct('800008','suco tang laranja po 25g','/products/cat-sucos.png',0.99,{margin:0.40,sales:4200,isRepeated:true}),
  mkProduct('800009','suco clight manga po 8g','/products/cat-sucos.png',1.49,{margin:0.38,sales:2100}),
  mkProduct('800010','nectar maguary uva 1l','/products/cat-sucos.png',6.49,{margin:0.21,sales:620}),
  mkProduct('800011','suco natural one laranja 900ml','/products/cat-sucos.png',14.99,{margin:0.32,sales:280}),
  mkProduct('800012','suco tial goiaba 1l','/products/cat-sucos.png',7.49,{margin:0.23,sales:520}),
];

// ── FRIOS & EMBUTIDOS (Seção 14, Grupo 92) ───────────────
export const friosProducts: Product[] = [
  mkProduct('769266A','presunto cozido sadia fatiado kg','/products/cat-acougue.png',32.90,{margin:0.24,sales:980,hasAd:true}),
  mkProduct('F00002','mortadela perdigao fatiada kg','/products/cat-acougue.png',14.90,{margin:0.22,sales:1400,isRepeated:true}),
  mkProduct('F00003','peito de peru sadia fatiado kg','/products/cat-acougue.png',49.90,{margin:0.28,sales:520}),
  mkProduct('769088A','salame sulita tipo hamburgues kg','/products/cat-acougue.png',39.90,{margin:0.26,sales:320}),
  mkProduct('F00005','salame sulita tipo milano kg','/products/cat-acougue.png',44.90,{margin:0.27,sales:280}),
  mkProduct('F00006','salame sulita tipo salaminho kg','/products/cat-acougue.png',42.90,{margin:0.26,sales:240}),
  mkProduct('F00007','apresuntado sadia fatiado kg','/products/cat-acougue.png',22.90,{margin:0.23,sales:760,hasAd:true}),
  mkProduct('F00008','queijo muçarela fatiado kg','/products/cat-acougue.png',38.90,{margin:0.29,sales:680}),
  mkProduct('F00009','bacon perdigao fatiado kg','/products/cat-acougue.png',44.90,{margin:0.25,sales:460}),
  mkProduct('769088B','manteiga aviacao c/sal 200g pote','/products/cat-laticinios.png',8.99,{margin:0.24,sales:1200,isRepeated:true,hasAd:true}),
  mkProduct('F00011','copa seara fatiada kg','/products/cat-acougue.png',54.90,{margin:0.28,sales:180}),
  mkProduct('F00012','lombo canadense sadia fatiado kg','/products/cat-acougue.png',46.90,{margin:0.26,sales:210}),
];

// ── CONGELADOS (Seção 16, Grupo 94) ──────────────────────
export const congeladosProducts: Product[] = [
  mkProduct('1044536','steak de frango sadia 100g','/products/cat-acougue.png',2.99,{margin:0.28,sales:1600,hasAd:true}),
  mkProduct('C00002','pizza seara muçarela 440g','/products/cat-acougue.png',12.99,{margin:0.26,sales:980}),
  mkProduct('C00003','lasanha sadia bolognesa 600g','/products/cat-acougue.png',14.99,{margin:0.24,sales:860,hasAd:true}),
  mkProduct('C00004','nuggets sadia tradicional 300g','/products/cat-acougue.png',11.99,{margin:0.27,sales:1200,isRepeated:true}),
  mkProduct('C00005','hamburguer seara gourmet 360g','/products/cat-acougue.png',16.99,{margin:0.25,sales:520}),
  mkProduct('C00006','empanado sadia hot pocket 145g','/products/cat-acougue.png',6.49,{margin:0.30,sales:880}),
  mkProduct('2041754','almondega bovina sadia 900g','/products/cat-acougue.png',19.99,{margin:0.22,sales:640}),
  mkProduct('C00008','batata frita mccain congelada 400g','/products/cat-acougue.png',9.99,{margin:0.28,sales:1100,hasAd:true}),
  mkProduct('C00009','acai frooty natural 500g','/products/cat-acougue.png',14.99,{margin:0.32,sales:720}),
  mkProduct('C00010','sorvete kibon napolitano 1,5l','/products/cat-acougue.png',19.99,{margin:0.30,sales:580,hasAd:true}),
  mkProduct('C00011','pao de queijo forno de minas 400g','/products/cat-acougue.png',13.49,{margin:0.28,sales:940}),
  mkProduct('C00012','coxinha de frango sadia 300g','/products/cat-acougue.png',12.99,{margin:0.26,sales:560}),
  mkProduct('C00013','torta de frango sadia 500g','/products/cat-acougue.png',16.99,{margin:0.24,sales:420}),
  mkProduct('C00014','sorvete ben & jerrys 458ml','/products/cat-acougue.png',34.90,{margin:0.35,sales:220}),
];

// ── HORTIFRUTI (Seção 23, Grupo 95) ──────────────────────
export const hortifrutiProducts: Product[] = [
  mkProduct('H00001','banana nanica kg','/products/cat-padaria.png',3.99,{margin:0.32,sales:5200,isRepeated:true}),
  mkProduct('H00002','maça fuji kg','/products/cat-padaria.png',7.99,{margin:0.28,sales:2800}),
  mkProduct('H00003','tomate salada kg','/products/cat-padaria.png',6.99,{margin:0.30,sales:3200,isRepeated:true,hasAd:true}),
  mkProduct('H00004','cebola branca kg','/products/cat-padaria.png',4.99,{margin:0.26,sales:2400}),
  mkProduct('H00005','batata inglesa kg','/products/cat-padaria.png',5.49,{margin:0.24,sales:2800,isRepeated:true}),
  mkProduct('H00006','alface crespa unid','/products/cat-padaria.png',2.99,{margin:0.35,sales:1800}),
  mkProduct('H00007','laranja pera kg','/products/cat-padaria.png',4.49,{margin:0.28,sales:2200,hasAd:true}),
  mkProduct('H00008','cenoura kg','/products/cat-padaria.png',5.99,{margin:0.27,sales:1600}),
  mkProduct('H00009','abacaxi perola unid','/products/cat-padaria.png',5.99,{margin:0.30,sales:1400}),
  mkProduct('H00010','manga tommy kg','/products/cat-padaria.png',4.99,{margin:0.28,sales:1200}),
  mkProduct('H00011','morango bandeja 300g','/products/cat-padaria.png',8.99,{margin:0.34,sales:980,hasAd:true}),
  mkProduct('H00012','melancia kg','/products/cat-padaria.png',2.99,{margin:0.22,sales:1800,isRepeated:true}),
  mkProduct('H00013','uva italia kg','/products/cat-padaria.png',9.99,{margin:0.30,sales:680}),
  mkProduct('H00014','limão tahiti kg','/products/cat-padaria.png',4.99,{margin:0.32,sales:1600}),
  mkProduct('H00015','brócolis maço','/products/cat-padaria.png',4.49,{margin:0.28,sales:920}),
  mkProduct('H00016','pepino japones kg','/products/cat-padaria.png',5.99,{margin:0.26,sales:640}),
];

// ── MERCEARIA SECA (Grupo 96) ────────────────────────────
export const merceariaProducts: Product[] = [
  mkProduct('M00001','arroz tio joao tipo 1 5kg','/products/cat-padaria.png',24.90,{margin:0.18,sales:3200,isRepeated:true,hasAd:true}),
  mkProduct('M00002','feijao carioca kicaldo 1kg','/products/cat-padaria.png',7.99,{margin:0.20,sales:2800,isRepeated:true}),
  mkProduct('M00003','oleo de soja liza 900ml','/products/cat-padaria.png',6.99,{margin:0.16,sales:3400,hasAd:true}),
  mkProduct('M00004','acucar uniao cristal 1kg','/products/cat-padaria.png',4.99,{margin:0.18,sales:2600}),
  mkProduct('1070622','cafe coamo trad.almof.500g','/products/cat-padaria.png',12.99,{margin:0.22,sales:1800,isRepeated:true}),
  mkProduct('M00006','farinha de trigo dona benta 1kg','/products/cat-padaria.png',5.49,{margin:0.20,sales:1400}),
  mkProduct('M00007','macarrão renata espaguete 500g','/products/cat-padaria.png',3.49,{margin:0.24,sales:2200}),
  mkProduct('M00008','molho de tomate heinz 340g','/products/cat-padaria.png',4.49,{margin:0.26,sales:1600,hasAd:true}),
  mkProduct('M00009','achoc.nescau 730g','/products/cat-padaria.png',14.99,{margin:0.22,sales:1200}),
  mkProduct('M00010','leite em po ninho fases 1+ 400g','/products/cat-padaria.png',16.99,{margin:0.18,sales:980}),
  mkProduct('799823','amido de milho maizena 200g','/products/cat-padaria.png',4.99,{margin:0.22,sales:1400}),
  mkProduct('M00012','sal refinado cisne 1kg','/products/cat-padaria.png',2.49,{margin:0.24,sales:2200,isRepeated:true}),
  mkProduct('M00013','azeite gallo extra virgem 500ml','/products/cat-padaria.png',29.90,{margin:0.28,sales:680}),
  mkProduct('M00014','maionese hellmanns 500g','/products/cat-padaria.png',8.99,{margin:0.22,sales:1400,hasAd:true}),
  mkProduct('M00015','extrato tomate elefante 340g','/products/cat-padaria.png',5.99,{margin:0.24,sales:1200}),
  mkProduct('M00016','cafe melitta trad.500g','/products/cat-padaria.png',14.49,{margin:0.20,sales:2200,isRepeated:true,hasAd:true}),
  mkProduct('M00017','sardinha gomes da costa 125g','/products/cat-padaria.png',5.99,{margin:0.26,sales:980}),
  mkProduct('M00018','fermento fleischmann inst.10g','/products/cat-padaria.png',1.49,{margin:0.30,sales:1600}),
];

// ── SECTION GROUP MAP ─────────────────────────────────────
export const SECTION_GROUP_MAP: Record<string, string[]> = {
  'Todas': [],
  'Bebidas': ['80', '81', '85', '88', '93'],
  'Laticínios': ['82'],
  'Açougue': ['90'],
  'Padaria': ['91'],
  'Frios & Embutidos': ['92'],
  'Congelados': ['94'],
  'Hortifruti': ['95'],
  'Mercearia': ['96'],
};

export const mockProductGroups: ProductGroup[] = [
  { id: '80', name: '80-Cervejas', percentage: 22.5, products: cervejaProducts },
  { id: '81', name: '81-Refrigerantes', percentage: 18.2, products: refrigeranteProducts },
  { id: '82', name: '82-Laticínios', percentage: 14.8, products: laticinioProducts },
  { id: '88', name: '88-Energéticos', percentage: 5.6, products: energeticoProducts },
  { id: '85', name: '85-Água Mineral', percentage: 4.2, products: aguaProducts },
  { id: '93', name: '93-Suco Pronto', percentage: 4.0, products: sucoProducts },
  { id: '90', name: '90-Açougue', percentage: 12.8, products: açougueProducts },
  { id: '91', name: '91-Padaria', percentage: 8.4, products: padariaProducts },
  { id: '92', name: '92-Frios & Embutidos', percentage: 3.5, products: friosProducts },
  { id: '94', name: '94-Congelados', percentage: 3.2, products: congeladosProducts },
  { id: '95', name: '95-Hortifruti', percentage: 1.8, products: hortifrutiProducts },
  { id: '96', name: '96-Mercearia Seca', percentage: 1.0, products: merceariaProducts },
];

// Backward-compatible export
export const mockProducts: Product[] = [
  ...cervejaProducts,
  ...refrigeranteProducts,
  ...laticinioProducts,
  ...energeticoProducts,
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
    id: '1', name: 'Tabloide Inverno 2025', date: '2025-01-05',
    products: [cervejaProducts[0], cervejaProducts[1], cervejaProducts[4], aguaProducts[0], aguaProducts[3], padariaProducts[0], padariaProducts[2], padariaProducts[6], merceariaProducts[0], merceariaProducts[4]],
    avgScore: 78, status: 'published', region: 'Curitiba', campaign: 'Inverno', createdBy: 'João Silva', totalValue: 45890.50, avgMargin: 0.23
  },
  {
    id: '2', name: 'Campanha Dia das Mães', date: '2025-05-10',
    products: [cervejaProducts[2], cervejaProducts[5], cervejaProducts[6], refrigeranteProducts[0], açougueProducts[0], açougueProducts[2], açougueProducts[7], padariaProducts[1], padariaProducts[5], sucoProducts[0], sucoProducts[2], laticinioProducts[3], laticinioProducts[5]],
    avgScore: 82, status: 'draft', region: 'Litoral', campaign: 'Dia das Mães', createdBy: 'Maria Santos', totalValue: 62450.00, avgMargin: 0.25
  },
  {
    id: '3', name: 'Tabloide Verão 2024', date: '2024-12-15',
    products: [cervejaProducts[0], cervejaProducts[4], cervejaProducts[5], cervejaProducts[10], cervejaProducts[11], aguaProducts[1], aguaProducts[2], aguaProducts[5], sucoProducts[0], sucoProducts[1], sucoProducts[3], hortifrutiProducts[0], hortifrutiProducts[6]],
    avgScore: 71, status: 'published', region: 'Interior', campaign: 'Verão', createdBy: 'Pedro Costa', totalValue: 38200.00, avgMargin: 0.21
  },
  {
    id: '4', name: 'Black Friday 2024', date: '2024-11-28',
    products: [...cervejaProducts.slice(0,10), ...refrigeranteProducts.slice(0,8), ...açougueProducts.slice(0,8), ...padariaProducts.slice(0,6), ...laticinioProducts.slice(0,6), ...aguaProducts.slice(0,4), ...sucoProducts.slice(0,4), ...congeladosProducts.slice(0,4)],
    avgScore: 85, status: 'published', region: 'Todas', campaign: 'Black Friday', createdBy: 'Ana Oliveira', totalValue: 156780.00, avgMargin: 0.28
  },
  {
    id: '5', name: 'Páscoa 2025', date: '2025-04-18',
    products: [cervejaProducts[7], cervejaProducts[8], cervejaProducts[12], cervejaProducts[13], açougueProducts[1], açougueProducts[3], açougueProducts[9], padariaProducts[3], padariaProducts[4], padariaProducts[7], laticinioProducts[8], laticinioProducts[9], merceariaProducts[5]],
    avgScore: 79, status: 'published', region: 'Curitiba', campaign: 'Páscoa', createdBy: 'Carlos Mendes', totalValue: 52300.00, avgMargin: 0.26
  },
  {
    id: '6', name: 'Promoção Junho 2025', date: '2025-06-05',
    products: [cervejaProducts[0], cervejaProducts[1], cervejaProducts[9], cervejaProducts[16], refrigeranteProducts[6], refrigeranteProducts[12], açougueProducts[4], açougueProducts[5], açougueProducts[8], aguaProducts[0], aguaProducts[3], sucoProducts[1], sucoProducts[4], friosProducts[0], friosProducts[1]],
    avgScore: 80, status: 'published', region: 'SC', campaign: 'Inverno', createdBy: 'Fernanda Lima', totalValue: 71200.00, avgMargin: 0.24
  },
  {
    id: '7', name: 'Festa Junina 2025', date: '2025-06-21',
    products: [cervejaProducts[3], cervejaProducts[4], cervejaProducts[5], cervejaProducts[11], cervejaProducts[17], açougueProducts[0], açougueProducts[2], açougueProducts[6], padariaProducts[0], padariaProducts[2], padariaProducts[8], aguaProducts[1], merceariaProducts[0], merceariaProducts[2], hortifrutiProducts[2]],
    avgScore: 77, status: 'published', region: 'Interior', campaign: 'Festa Junina', createdBy: 'Roberto Alves', totalValue: 48900.00, avgMargin: 0.22
  },
  {
    id: '8', name: 'Tabloide Julho 2025', date: '2025-07-10',
    products: [cervejaProducts[0], cervejaProducts[2], cervejaProducts[6], cervejaProducts[13], cervejaProducts[18], cervejaProducts[19], açougueProducts[1], açougueProducts[3], açougueProducts[7], açougueProducts[10], padariaProducts[1], padariaProducts[3], padariaProducts[9], sucoProducts[0], sucoProducts[2], congeladosProducts[2], congeladosProducts[3]],
    avgScore: 83, status: 'published', region: 'Litoral', campaign: 'Férias', createdBy: 'Juliana Souza', totalValue: 89400.00, avgMargin: 0.27
  },
  {
    id: '9', name: 'Tabloide Agosto 2025', date: '2025-08-01',
    products: [cervejaProducts[0], cervejaProducts[1], cervejaProducts[8], cervejaProducts[9], cervejaProducts[20], cervejaProducts[21], refrigeranteProducts[0], refrigeranteProducts[6], açougueProducts[0], açougueProducts[5], açougueProducts[11], padariaProducts[0], padariaProducts[5], padariaProducts[6], aguaProducts[2], aguaProducts[4], sucoProducts[3], sucoProducts[5], friosProducts[2], hortifrutiProducts[0], hortifrutiProducts[3]],
    avgScore: 81, status: 'published', region: 'Curitiba', campaign: 'Inverno', createdBy: 'Ricardo Melo', totalValue: 94500.00, avgMargin: 0.26
  },
  {
    id: '10', name: 'Promoção Dia dos Pais 2025', date: '2025-08-10',
    products: [cervejaProducts[2], cervejaProducts[3], cervejaProducts[7], cervejaProducts[11], cervejaProducts[22], açougueProducts[1], açougueProducts[2], açougueProducts[4], açougueProducts[8], açougueProducts[12], padariaProducts[2], padariaProducts[4], padariaProducts[7], aguaProducts[0], aguaProducts[1], sucoProducts[0], sucoProducts[1], energeticoProducts[0], energeticoProducts[6], merceariaProducts[12], laticinioProducts[14]],
    avgScore: 84, status: 'published', region: 'Curitiba', campaign: 'Dia dos Pais', createdBy: 'Marcela Vieira', totalValue: 87600.00, avgMargin: 0.25
  },
];

// ── Filter Options ────────────────────────────────────────
export const regions = [
  'Selecione uma região', 'Curitiba', 'Litoral', 'Ponta Grossa', 'Castro', 'Lapa', 'Irati', 'Interior', 'SC', 'Todas'
];

export const sections = [
  'Todas', 'Bebidas', 'Laticínios', 'Açougue', 'Padaria', 'Frios & Embutidos', 'Congelados', 'Hortifruti', 'Mercearia'
];

export const strategies = [
  'Maior Quantidade', 'Maior Margem', 'Maior Score IA', 'Equilíbrio', 'Competitividade', 'Crescimento'
];

export const campaigns = [
  'Todas', 'Inverno', 'Verão', 'Black Friday', 'Páscoa', 'Dia das Mães', 'Dia dos Pais', 'Festa Junina', 'Férias', 'Aniversário'
];
