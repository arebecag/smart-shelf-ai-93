import React, { useState, useMemo } from 'react';
import { format, parse, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  ChevronDown, ChevronRight, Search, Filter, TrendingUp, TrendingDown,
  Tv, Radio, Newspaper, Eye, ArrowUpDown, X, Calendar, Target,
  ShoppingCart, DollarSign, ThumbsUp, ThumbsDown, CheckCircle2, XCircle,
  BarChart2, ExternalLink, Info, CalendarIcon, Maximize2,
} from 'lucide-react';
import {
  cervejaProducts, refrigeranteProducts, açougueProducts, padariaProducts,
  laticinioProducts, energeticoProducts, friosProducts, congeladosProducts,
  hortifrutiProducts, merceariaProducts, aguaProducts, sucoProducts,
} from '@/data/mockData';
import { Product, Competitor, GlobalSegmentData } from '@/types/product';
import { useApprovals } from '@/contexts/ApprovalsContext';
import { cn } from '@/lib/utils';

// ── Extended competitor data (mock) ──
const EXTRA_COMPETITORS: Competitor[] = [
  { name: 'Giassi Supermercados', location: 'Joinville - SC', price: 0 },
  { name: 'Atacadão', location: 'Curitiba - PR', price: 0 },
  { name: 'Big Hipermercado', location: 'Curitiba - PR', price: 0 },
  { name: 'Angeloni', location: 'Florianópolis - SC', price: 0 },
  { name: 'Fort Atacadista', location: 'Itajaí - SC', price: 0 },
  { name: 'Muffato', location: 'Londrina - PR', price: 0 },
  { name: 'Super Bom', location: 'Ponta Grossa - PR', price: 0 },
  { name: 'Festval', location: 'Curitiba - PR', price: 0 },
  { name: 'Superpão', location: 'Maringá - PR', price: 0 },
  { name: 'Cidade Canção', location: 'Maringá - PR', price: 0 },
  { name: 'Bistek Supermercados', location: 'Criciúma - SC', price: 0 },
  { name: 'Koch Hipermercado', location: 'Blumenau - SC', price: 0 },
  { name: 'Barreiros Supermercado', location: 'Curitiba - PR', price: 0 },
  { name: 'Walmart', location: 'Curitiba - PR', price: 0 },
  { name: 'Carrefour', location: 'São José dos Pinhais - PR', price: 0 },
];

const EXTRA_GLOBAL_SEGMENTS: GlobalSegmentData[] = [
  { competitor: 'Giassi', lastCampaign: 'TV Ofertas Verão', campaignDate: 'Jan/2025', reach: '850K', investment: 'R$ 120K' },
  { competitor: 'Atacadão', lastCampaign: 'Rádio Preço Baixo', campaignDate: 'Fev/2025', reach: '1.2M', investment: 'R$ 280K' },
  { competitor: 'Angeloni', lastCampaign: 'TV Qualidade', campaignDate: 'Mar/2025', reach: '600K', investment: 'R$ 95K' },
  { competitor: 'Fort Atacadista', lastCampaign: 'Jornal Semanal', campaignDate: 'Abr/2025', reach: '400K', investment: 'R$ 55K' },
  { competitor: 'Muffato', lastCampaign: 'TV Super Oferta', campaignDate: 'Mai/2025', reach: '950K', investment: 'R$ 200K' },
  { competitor: 'Festval', lastCampaign: 'Rádio Gourmet', campaignDate: 'Jun/2025', reach: '300K', investment: 'R$ 45K' },
  { competitor: 'Koch', lastCampaign: 'TV Aniversário', campaignDate: 'Jul/2025', reach: '550K', investment: 'R$ 150K' },
  { competitor: 'Bistek', lastCampaign: 'Jornal Quinzenal', campaignDate: 'Ago/2025', reach: '350K', investment: 'R$ 60K' },
];

// Generate extended competitors for a product
const getExtendedCompetitors = (product: Product): Competitor[] => {
  const existing = product.prixsia.competitors;
  const extra = EXTRA_COMPETITORS
    .filter(ec => !existing.some(e => e.name === ec.name))
    .map((ec, i) => ({
      ...ec,
      price: product.price * (0.82 + Math.sin(i * 1.3) * 0.15 + 0.08),
    }));
  return [...existing, ...extra];
};

const getExtendedGlobalSegments = (product: Product): GlobalSegmentData[] => {
  return [...product.globalSegments, ...EXTRA_GLOBAL_SEGMENTS.filter(
    eg => !product.globalSegments.some(g => g.competitor === eg.competitor)
  )];
};

// ── Historical campaigns ──
const CAMPAIGNS = [
  { id: 'c1', name: 'Tabloide TV Semana 01', type: 'TV', date: '2025-01-08', period: 'Jan/2025', products: 42, faturamento: 287000, productIds: [] as string[] },
  { id: 'c2', name: 'Rádio Ofertas Semana 03', type: 'Rádio', date: '2025-01-22', period: 'Jan/2025', products: 28, faturamento: 156000, productIds: [] as string[] },
  { id: 'c3', name: 'TV Carnaval 2025', type: 'TV', date: '2025-02-28', period: 'Fev/2025', products: 55, faturamento: 412000, productIds: [] as string[] },
  { id: 'c4', name: 'Tabloide TV Semana 10', type: 'TV', date: '2025-03-10', period: 'Mar/2025', products: 38, faturamento: 298000, productIds: [] as string[] },
  { id: 'c5', name: 'Rádio Páscoa', type: 'Rádio', date: '2025-04-15', period: 'Abr/2025', products: 35, faturamento: 245000, productIds: [] as string[] },
  { id: 'c6', name: 'TV Dia das Mães', type: 'TV', date: '2025-05-08', period: 'Mai/2025', products: 48, faturamento: 378000, productIds: [] as string[] },
  { id: 'c7', name: 'Tabloide Jornal Jun', type: 'Jornal', date: '2025-06-05', period: 'Jun/2025', products: 32, faturamento: 189000, productIds: [] as string[] },
  { id: 'c8', name: 'TV Festa Junina', type: 'TV', date: '2025-06-20', period: 'Jun/2025', products: 45, faturamento: 345000, productIds: [] as string[] },
  { id: 'c9', name: 'Rádio Inverno', type: 'Rádio', date: '2025-07-10', period: 'Jul/2025', products: 30, faturamento: 198000, productIds: [] as string[] },
  { id: 'c10', name: 'TV Dia dos Pais', type: 'TV', date: '2025-08-07', period: 'Ago/2025', products: 50, faturamento: 402000, productIds: [] as string[] },
  { id: 'c11', name: 'Tabloide TV Agosto', type: 'TV', date: '2025-08-21', period: 'Ago/2025', products: 40, faturamento: 312000, productIds: [] as string[] },
  { id: 'c12', name: 'TV Primavera', type: 'TV', date: '2025-09-22', period: 'Set/2025', products: 36, faturamento: 267000, productIds: [] as string[] },
];

const CAMPAIGN_TYPES = ['Todos', 'TV', 'Rádio', 'Jornal'];

const ALL_SECTIONS: { name: string; products: Product[] }[] = [
  { name: 'Cervejas', products: cervejaProducts },
  { name: 'Refrigerantes', products: refrigeranteProducts },
  { name: 'Açougue', products: açougueProducts },
  { name: 'Padaria', products: padariaProducts },
  { name: 'Laticínios', products: laticinioProducts },
  { name: 'Energéticos', products: energeticoProducts },
  { name: 'Frios & Embutidos', products: friosProducts },
  { name: 'Congelados', products: congeladosProducts },
  { name: 'Hortifruti', products: hortifrutiProducts },
  { name: 'Mercearia', products: merceariaProducts },
  { name: 'Águas', products: aguaProducts },
  { name: 'Sucos', products: sucoProducts },
];

const allProds = ALL_SECTIONS.flatMap(s => s.products);
CAMPAIGNS.forEach((c, ci) => {
  c.productIds = allProds
    .filter((_, i) => (i + ci * 7) % 4 === 0 || (i + ci * 3) % 6 === 0)
    .slice(0, c.products)
    .map(p => p.id);
});

type PerformanceProduct = Product & {
  section: string;
  faturamento: number;
  crescimento: number;
  wasInCampaign: boolean;
};

const generatePerformanceData = (campaignId: string | null): PerformanceProduct[] => {
  const allProducts = ALL_SECTIONS.flatMap(s => s.products.map(p => ({ ...p, section: s.name })));
  const seed = campaignId ? parseInt(campaignId.replace('c', '')) : 1;
  const campaign = CAMPAIGNS.find(c => c.id === campaignId);

  if (campaign) {
    return allProducts
      .filter(p => campaign.productIds.includes(p.id))
      .map((p, i) => ({
        ...p,
        faturamento: p.sales * p.price,
        crescimento: ((Math.sin(i * 0.7 + seed) * 20) + 5),
        wasInCampaign: true,
      }))
      .sort((a, b) => b.faturamento - a.faturamento);
  }

  return allProducts
    .filter(p => p.sales > 800)
    .sort((a, b) => b.sales * b.price - a.sales * a.price)
    .map((p, i) => ({
      ...p,
      faturamento: p.sales * p.price,
      crescimento: ((Math.sin(i * 0.7 + seed) * 20) + 5),
      wasInCampaign: false,
    }));
};

const fmt = (v: number) => v >= 1000000 ? `R$ ${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `R$ ${(v / 1000).toFixed(0)}K` : `R$ ${v.toFixed(0)}`;
const fmtPrice = (v: number) => `R$ ${v.toFixed(2)}`;

type SortField = 'faturamento' | 'sales' | 'margin' | 'crescimento' | 'price';
type SortDir = 'asc' | 'desc';

// ═══════════════════════════════════════════════════════════════
// Product Detail Modal
// ═══════════════════════════════════════════════════════════════
function ProductDetailModal({ product, open, onClose }: { product: Product | null; open: boolean; onClose: () => void }) {
  const [compSearchPrixsia, setCompSearchPrixsia] = useState('');
  const [compSearchGlobal, setCompSearchGlobal] = useState('');
  const [compSearchShopping, setCompSearchShopping] = useState('');
  const { approveProduct, rejectProduct, isApproved, isRejected, getApprovalStatus, removeApproval } = useApprovals();
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!product) return null;

  const allCompetitors = getExtendedCompetitors(product);
  const allGlobalSegs = getExtendedGlobalSegments(product);

  const filteredPrixsia = compSearchPrixsia
    ? allCompetitors.filter(c => c.name.toLowerCase().includes(compSearchPrixsia.toLowerCase()))
    : allCompetitors.slice(0, 5);

  const filteredGlobal = compSearchGlobal
    ? allGlobalSegs.filter(g => g.competitor.toLowerCase().includes(compSearchGlobal.toLowerCase()))
    : allGlobalSegs.slice(0, 5);

  // Mock shopping competitors
  const shoppingCompetitors = allCompetitors.slice(0, 10).map((c, i) => ({
    name: c.name,
    adTitle: `${product.name} - Oferta ${c.name}`,
    adPrice: product.price * (0.85 + i * 0.03),
    date: `${String((i % 28) + 1).padStart(2, '0')}/03/2025`,
    link: product.shoppingBrasil.link,
  }));
  const filteredShopping = compSearchShopping
    ? shoppingCompetitors.filter(c => c.name.toLowerCase().includes(compSearchShopping.toLowerCase()))
    : shoppingCompetitors.slice(0, 5);

  const approvalStatus = getApprovalStatus(product.id);

  const handleReject = () => {
    if (rejectReason.trim()) {
      rejectProduct(product, rejectReason);
      setShowReject(false);
      setRejectReason('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-border/40">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-foreground">{product.name}</span>
                <p className="text-xs text-muted-foreground font-normal mt-0.5">Cód: {product.id}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Product KPIs */}
          <div className="grid grid-cols-5 gap-2 mt-3">
            {[
              { label: 'Preço', value: fmtPrice(product.price) },
              { label: 'Estoque', value: product.stock.toLocaleString('pt-BR') },
              { label: 'Margem', value: `${(product.margin * 100).toFixed(1)}%` },
              { label: 'Vendas', value: product.sales.toLocaleString('pt-BR') },
              { label: 'Faturamento', value: fmt(product.sales * product.price) },
            ].map(k => (
              <div key={k.label} className="bg-muted/50 rounded-lg p-2 text-center">
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
                <p className="text-sm font-bold text-foreground">{k.value}</p>
              </div>
            ))}
          </div>

          {/* Approve / Reject */}
          <div className="flex items-center gap-2 mt-3">
            {approvalStatus ? (
              <div className={cn(
                "flex-1 flex items-center justify-between p-2 rounded-lg text-sm",
                isApproved(product.id) ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
              )}>
                <div className="flex items-center gap-2">
                  {isApproved(product.id)
                    ? <><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="font-medium text-emerald-700">Aprovado para campanha</span></>
                    : <><XCircle className="h-4 w-4 text-red-600" /><div><span className="font-medium text-red-700">Reprovado</span>{approvalStatus.reason && <p className="text-xs text-red-500">{approvalStatus.reason}</p>}</div></>
                  }
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => removeApproval(product.id)}>Desfazer</Button>
              </div>
            ) : showReject ? (
              <div className="flex-1 space-y-2">
                <Textarea placeholder="Motivo da reprovação..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="min-h-[60px] text-sm" />
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>Confirmar Reprovação</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setShowReject(false); setRejectReason(''); }}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <>
                <Button size="sm" variant="outline" className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50" onClick={() => approveProduct(product)}>
                  <ThumbsUp className="h-3.5 w-3.5 mr-1.5" /> Aprovar p/ Campanha
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50" onClick={() => setShowReject(true)}>
                  <ThumbsDown className="h-3.5 w-3.5 mr-1.5" /> Reprovar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tabs content */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-5 pt-3">
            <Tabs defaultValue="prixsia" className="w-full">
              <TabsList className="w-full grid grid-cols-4 bg-muted/60 p-0.5 h-9">
                <TabsTrigger value="nielsen" className="text-xs gap-1.5"><BarChart2 className="h-3.5 w-3.5" />Nielsen</TabsTrigger>
                <TabsTrigger value="prixsia" className="text-xs gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Prixsia</TabsTrigger>
                <TabsTrigger value="shopping" className="text-xs gap-1.5"><ShoppingCart className="h-3.5 w-3.5" />Shopping BR</TabsTrigger>
                <TabsTrigger value="global" className="text-xs gap-1.5"><Tv className="h-3.5 w-3.5" />Global Seg.</TabsTrigger>
              </TabsList>

              {/* Nielsen */}
              <TabsContent value="nielsen" className="mt-3">
                <Card className="border-border/30">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        { label: 'Share de Mercado', value: `${product.nielsen.marketShare}%` },
                        { label: 'Core Segment', value: product.nielsen.coreSegment },
                        { label: 'Penetração', value: `${product.nielsen.penetration}%` },
                        { label: 'Ranking Regional', value: `${product.nielsen.regionalRanking}º` },
                      ].map(item => (
                        <div key={item.label} className="flex justify-between bg-muted/30 rounded-lg p-3">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className="font-bold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Prixsia */}
              <TabsContent value="prixsia" className="mt-3 space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Mínimo', val: product.prixsia.minPrice, color: 'text-emerald-600' },
                    { label: 'Média', val: product.prixsia.avgPrice, color: 'text-foreground' },
                    { label: 'Mediana', val: product.prixsia.medianPrice, color: 'text-foreground' },
                    { label: 'Máximo', val: product.prixsia.maxPrice, color: 'text-red-500' },
                  ].map(v => (
                    <div key={v.label} className="bg-muted/40 rounded-lg p-3 text-center border border-border/20">
                      <p className="text-[10px] text-muted-foreground mb-0.5">{v.label}</p>
                      <p className={cn("text-sm font-bold", v.color)}>{fmtPrice(v.val)}</p>
                    </div>
                  ))}
                </div>

                <Card className="border-border/30">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold">Top 5 Concorrentes Prixsia</CardTitle>
                      <div className="relative w-[220px]">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Buscar concorrente..."
                          value={compSearchPrixsia}
                          onChange={e => setCompSearchPrixsia(e.target.value)}
                          className="h-7 pl-7 text-xs"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-1.5">
                      {filteredPrixsia.map((comp, idx) => {
                        const diff = ((comp.price - product.price) / product.price) * 100;
                        return (
                          <div key={idx} className="flex items-center justify-between bg-muted/20 rounded-lg p-2.5 border border-border/20 hover:bg-muted/40 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{comp.name}</p>
                              <p className="text-[10px] text-muted-foreground">{comp.location}</p>
                            </div>
                            <div className="text-right ml-3">
                              <p className="text-xs font-bold text-foreground">{fmtPrice(comp.price)}</p>
                              <p className={cn("text-[10px] font-medium", diff < 0 ? "text-emerald-600" : diff > 0 ? "text-red-500" : "text-muted-foreground")}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}% vs nosso
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {filteredPrixsia.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">Nenhum concorrente encontrado</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Shopping Brasil */}
              <TabsContent value="shopping" className="mt-3 space-y-3">
                <Card className="border-border/30">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                      <div className="bg-muted/30 rounded-lg p-2.5">
                        <span className="text-muted-foreground">Título:</span>
                        <p className="font-medium text-foreground mt-0.5">{product.shoppingBrasil.title}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2.5">
                        <span className="text-muted-foreground">Preço Anúncio:</span>
                        <p className="font-bold text-primary mt-0.5">{fmtPrice(product.shoppingBrasil.adPrice)}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2.5">
                        <span className="text-muted-foreground">Data Início:</span>
                        <p className="font-medium text-foreground mt-0.5">{product.shoppingBrasil.startDate}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2.5 flex items-center gap-2">
                        <ExternalLink className="h-3.5 w-3.5 text-primary shrink-0" />
                        <a href={product.shoppingBrasil.link} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs truncate">
                          Ver anúncio
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/30">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold">Top 5 Anúncios Concorrentes</CardTitle>
                      <div className="relative w-[220px]">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Buscar concorrente..."
                          value={compSearchShopping}
                          onChange={e => setCompSearchShopping(e.target.value)}
                          className="h-7 pl-7 text-xs"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-1.5">
                      {filteredShopping.map((comp, idx) => {
                        const diff = ((comp.adPrice - product.price) / product.price) * 100;
                        return (
                          <div key={idx} className="flex items-center justify-between bg-muted/20 rounded-lg p-2.5 border border-border/20 hover:bg-muted/40 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{comp.name}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{comp.adTitle}</p>
                              <p className="text-[10px] text-muted-foreground">{comp.date}</p>
                            </div>
                            <div className="text-right ml-3">
                              <p className="text-xs font-bold text-foreground">{fmtPrice(comp.adPrice)}</p>
                              <p className={cn("text-[10px] font-medium", diff < 0 ? "text-emerald-600" : "text-red-500")}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {filteredShopping.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">Nenhum concorrente encontrado</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Global Segmentos */}
              <TabsContent value="global" className="mt-3 space-y-3">
                <Card className="border-border/30">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold">Top 5 Concorrentes — Mídia e Campanhas</CardTitle>
                      <div className="relative w-[220px]">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder="Buscar concorrente..."
                          value={compSearchGlobal}
                          onChange={e => setCompSearchGlobal(e.target.value)}
                          className="h-7 pl-7 text-xs"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-1.5">
                      {filteredGlobal.map((seg, idx) => (
                        <div key={idx} className="bg-muted/20 rounded-lg p-3 border border-border/20 hover:bg-muted/40 transition-colors">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-foreground">{seg.competitor}</span>
                            <Badge variant="outline" className="text-[9px]">{seg.campaignDate}</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground">Campanha: <span className="font-medium text-foreground">{seg.lastCampaign}</span></p>
                          <div className="flex gap-6 mt-1 text-[11px] text-muted-foreground">
                            <span>Alcance: <span className="font-medium text-foreground">{seg.reach}</span></span>
                            <span>Investimento: <span className="font-medium text-foreground">{seg.investment}</span></span>
                          </div>
                        </div>
                      ))}
                      {filteredGlobal.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">Nenhum concorrente encontrado</p>}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════════
export default function CampaignPerformance() {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [campaignType, setCampaignType] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('Todas');
  const [topN, setTopN] = useState<number>(10);
  const [sortField, setSortField] = useState<SortField>('faturamento');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { approveProduct, rejectProduct, isApproved, isRejected, getApprovalStatus, removeApproval } = useApprovals();

  const filteredCampaigns = useMemo(() => {
    let list = CAMPAIGNS.filter(c => campaignType === 'Todos' || c.type === campaignType);
    if (dateFrom || dateTo) {
      list = list.filter(c => {
        const cDate = parse(c.date, 'yyyy-MM-dd', new Date());
        if (dateFrom && dateTo) return isWithinInterval(cDate, { start: dateFrom, end: dateTo });
        if (dateFrom) return cDate >= dateFrom;
        if (dateTo) return cDate <= dateTo;
        return true;
      });
    }
    return list;
  }, [campaignType, dateFrom, dateTo]);

  const effectiveCampaign = useMemo(() => {
    if (selectedCampaign) return selectedCampaign;
    if ((dateFrom || dateTo) && filteredCampaigns.length > 0) return filteredCampaigns[0].id;
    return null;
  }, [selectedCampaign, dateFrom, dateTo, filteredCampaigns]);

  const performanceData = useMemo(() => {
    let data = generatePerformanceData(effectiveCampaign);
    if (selectedSection !== 'Todas') data = data.filter(p => p.section === selectedSection);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(p => p.name.toLowerCase().includes(q) || p.id.includes(q));
    }
    data.sort((a, b) => {
      const va = a[sortField] as number;
      const vb = b[sortField] as number;
      return sortDir === 'desc' ? vb - va : va - vb;
    });
    // Apply topN limit per section
    if (topN > 0) {
      const sectionMap = new Map<string, PerformanceProduct[]>();
      data.forEach(p => {
        const arr = sectionMap.get(p.section) || [];
        arr.push(p);
        sectionMap.set(p.section, arr);
      });
      data = [];
      sectionMap.forEach(products => {
        data.push(...products.slice(0, topN));
      });
      // Re-sort after slicing
      data.sort((a, b) => {
        const va = a[sortField] as number;
        const vb = b[sortField] as number;
        return sortDir === 'desc' ? vb - va : va - vb;
      });
    }
    return data;
  }, [effectiveCampaign, selectedSection, searchQuery, sortField, sortDir, topN]);

  const groupedData = useMemo(() => {
    const map = new Map<string, PerformanceProduct[]>();
    performanceData.forEach(p => {
      const existing = map.get(p.section) || [];
      existing.push(p);
      map.set(p.section, existing);
    });
    return Array.from(map.entries())
      .map(([section, products]) => ({
        section,
        products,
        totalFat: products.reduce((s, p) => s + p.faturamento, 0),
        totalVol: products.reduce((s, p) => s + p.sales, 0),
        avgMargin: products.reduce((s, p) => s + p.margin, 0) / products.length,
        avgGrowth: products.reduce((s, p) => s + p.crescimento, 0) / products.length,
      }))
      .sort((a, b) => b.totalFat - a.totalFat);
  }, [performanceData]);

  const toggleSection = (s: string) => {
    const next = new Set(expandedSections);
    next.has(s) ? next.delete(s) : next.add(s);
    setExpandedSections(next);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const handleReject = () => {
    if (rejectTarget && rejectReason.trim()) {
      rejectProduct(rejectTarget, rejectReason);
      setShowRejectDialog(false);
      setRejectTarget(null);
      setRejectReason('');
    }
  };

  const clearAll = () => {
    setSearchQuery(''); setSelectedSection('Todas'); setCampaignType('Todos');
    setSelectedCampaign(null); setDateFrom(undefined); setDateTo(undefined); setTopN(10);
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {children}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-primary' : 'text-muted-foreground/40'}`} />
    </button>
  );

  const typeIcon = (type: string) => {
    if (type === 'TV') return <Tv className="h-3.5 w-3.5" />;
    if (type === 'Rádio') return <Radio className="h-3.5 w-3.5" />;
    return <Newspaper className="h-3.5 w-3.5" />;
  };

  const selectedCampaignObj = CAMPAIGNS.find(c => c.id === effectiveCampaign);
  const hasFilters = searchQuery || selectedSection !== 'Todas' || campaignType !== 'Todos' || effectiveCampaign || dateFrom || dateTo || topN !== 10;

  return (
    <div className="h-full w-full overflow-auto bg-muted/30">
      <div className="p-5 space-y-4 max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Padrão Campanha</h1>
            <p className="text-sm text-muted-foreground">
              {selectedCampaignObj
                ? <>Produtos da campanha <span className="font-semibold text-primary">{selectedCampaignObj.name}</span> • {selectedCampaignObj.period}</>
                : (dateFrom || dateTo)
                  ? <>Campanhas no período {dateFrom ? format(dateFrom, 'dd/MM/yy') : '...'} — {dateTo ? format(dateTo, 'dd/MM/yy') : '...'} • {filteredCampaigns.length} encontradas</>
                  : 'Selecione um período ou campanha para ver os produtos do ano anterior'
              }
            </p>
          </div>
          <Badge variant="outline" className="text-xs gap-1">
            <Eye className="h-3 w-3" /> Visão Cris
          </Badge>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: effectiveCampaign ? 'Produtos na Campanha' : 'Produtos Identificados', value: topStats.total, icon: ShoppingCart, color: 'text-chart-1' },
            { label: 'Faturamento Total', value: fmt(topStats.totalFat), icon: DollarSign, color: 'text-chart-2' },
            { label: 'Em Crescimento', value: `${topStats.growing} produtos`, icon: TrendingUp, color: 'text-chart-4' },
            { label: 'Margem Média', value: `${(topStats.avgMargin * 100).toFixed(1)}%`, icon: Target, color: 'text-chart-5' },
          ].map(kpi => (
            <Card key={kpi.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted/80 ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-border/40 bg-muted/40">
          <CardContent className="p-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Filtros:</span>
            </div>

            {/* Date FROM */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-8 w-[150px] justify-start text-left text-xs bg-card/80", !dateFrom && "text-muted-foreground")}>
                  <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data início"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={dateFrom} onSelect={d => { setDateFrom(d); setSelectedCampaign(null); }} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>

            {/* Date TO */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-8 w-[150px] justify-start text-left text-xs bg-card/80", !dateTo && "text-muted-foreground")}>
                  <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data fim"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={dateTo} onSelect={d => { setDateTo(d); setSelectedCampaign(null); }} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>

            {/* Campaign type */}
            <Select value={campaignType} onValueChange={v => { setCampaignType(v); setSelectedCampaign(null); }}>
              <SelectTrigger className="h-8 w-[130px] text-xs bg-card/80"><SelectValue placeholder="Campanha" /></SelectTrigger>
              <SelectContent>
                {CAMPAIGN_TYPES.map(t => <SelectItem key={t} value={t}>{t === 'Todos' ? 'Todas Campanhas' : t}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Section */}
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="h-8 w-[140px] text-xs bg-card/80"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas Seções</SelectItem>
                {ALL_SECTIONS.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Buscar produto..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 pl-8 text-xs bg-card/80" />
            </div>

            {hasFilters && (
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={clearAll}>
                <X className="h-3 w-3" /> Limpar
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-12 gap-4">
          {/* Left: Campaign timeline */}
          <div className="col-span-3">
            <Card className="border-border/40 h-full">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Campanhas Anteriores
                </CardTitle>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {filteredCampaigns.length} campanhas {(dateFrom || dateTo) ? 'no período' : 'disponíveis'}
                </p>
              </CardHeader>
              <CardContent className="p-2 max-h-[650px] overflow-auto space-y-1">
                {filteredCampaigns.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">Nenhuma campanha encontrada neste período</p>
                )}
                {filteredCampaigns.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCampaign(effectiveCampaign === c.id ? null : c.id); }}
                    className={cn(
                      "w-full text-left p-2.5 rounded-lg transition-all text-xs border",
                      effectiveCampaign === c.id
                        ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20'
                        : 'border-transparent hover:bg-muted/60'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={effectiveCampaign === c.id ? 'text-primary' : 'text-muted-foreground'}>
                        {typeIcon(c.type)}
                      </span>
                      <span className="font-medium text-foreground truncate flex-1">{c.name}</span>
                      <Badge variant="outline" className="text-[9px] shrink-0">{c.type}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{c.period}</span>
                      <span>{c.products} prod.</span>
                      <span className="font-medium text-foreground">{fmt(c.faturamento)}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right: Product table */}
          <div className="col-span-9">
            <Card className="border-border/40">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {effectiveCampaign
                      ? <><Tv className="h-4 w-4 text-primary" /> Produtos da Campanha</>
                      : <><TrendingUp className="h-4 w-4 text-chart-4" /> Produtos Performance</>
                    }
                    <Badge variant="secondary" className="text-[10px]">{performanceData.length} itens</Badge>
                  </CardTitle>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Maximize2 className="h-3 w-3" />
                    Clique no produto para abrir detalhes
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[620px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-8 px-2"></TableHead>
                        <TableHead className="text-xs font-semibold text-foreground min-w-[200px]">Produto</TableHead>
                        <TableHead className="text-xs font-semibold text-foreground">Seção</TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right"><SortHeader field="price">Preço</SortHeader></TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right"><SortHeader field="faturamento">Faturamento</SortHeader></TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right"><SortHeader field="sales">Volume</SortHeader></TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right"><SortHeader field="margin">Margem</SortHeader></TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right"><SortHeader field="crescimento">Cresc.</SortHeader></TableHead>
                        <TableHead className="text-xs font-semibold text-foreground">Concorrente</TableHead>
                        <TableHead className="text-xs font-semibold text-foreground w-[80px] text-center">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedData.map(group => (
                        <React.Fragment key={group.section}>
                          <TableRow className="bg-muted/20 hover:bg-muted/30 cursor-pointer" onClick={() => toggleSection(group.section)}>
                            <TableCell className="px-2 py-2">
                              {expandedSections.has(group.section)
                                ? <ChevronDown className="h-4 w-4 text-primary" />
                                : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </TableCell>
                            <TableCell className="py-2" colSpan={2}>
                              <span className="text-xs font-bold text-foreground">{group.section}</span>
                              <Badge variant="secondary" className="ml-2 text-[9px]">{group.products.length}</Badge>
                            </TableCell>
                            <TableCell className="text-right py-2"></TableCell>
                            <TableCell className="text-right py-2"><span className="text-xs font-bold text-foreground">{fmt(group.totalFat)}</span></TableCell>
                            <TableCell className="text-right py-2"><span className="text-xs font-medium text-foreground">{group.totalVol.toLocaleString('pt-BR')}</span></TableCell>
                            <TableCell className="text-right py-2"><span className="text-xs font-medium text-foreground">{(group.avgMargin * 100).toFixed(1)}%</span></TableCell>
                            <TableCell className="text-right py-2">
                              <span className={cn("text-xs font-medium", group.avgGrowth > 0 ? 'text-emerald-600' : 'text-red-500')}>
                                {group.avgGrowth > 0 ? '+' : ''}{group.avgGrowth.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>

                          {expandedSections.has(group.section) && group.products.map(p => {
                            const bestComp = p.prixsia.competitors[0];
                            const priceDiff = bestComp ? ((p.price - bestComp.price) / p.price) * 100 : 0;
                            const approved = isApproved(p.id);
                            const rejected = isRejected(p.id);

                            return (
                              <TableRow
                                key={p.id}
                                className={cn(
                                  "hover:bg-muted/30 border-b border-border/20 cursor-pointer transition-colors",
                                  approved && "bg-emerald-50/50",
                                  rejected && "bg-red-50/50",
                                )}
                                onClick={() => setModalProduct(p)}
                              >
                                <TableCell className="px-2 py-1.5">
                                  <Maximize2 className="h-3 w-3 text-muted-foreground/30" />
                                </TableCell>
                                <TableCell className="py-1.5">
                                  <div className="flex items-center gap-2">
                                    {(approved || rejected) && (
                                      approved
                                        ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                        : <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                    )}
                                    <div>
                                      <p className="text-xs font-medium text-foreground leading-tight">{p.name}</p>
                                      <p className="text-[10px] text-muted-foreground">Cód: {p.id}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-1.5"><span className="text-[10px] text-muted-foreground">{p.section}</span></TableCell>
                                <TableCell className="text-right py-1.5"><span className="text-xs font-medium text-foreground">{fmtPrice(p.price)}</span></TableCell>
                                <TableCell className="text-right py-1.5"><span className="text-xs font-bold text-foreground">{fmt(p.faturamento)}</span></TableCell>
                                <TableCell className="text-right py-1.5"><span className="text-xs text-foreground">{p.sales.toLocaleString('pt-BR')}</span></TableCell>
                                <TableCell className="text-right py-1.5">
                                  <span className={cn("text-xs font-medium", p.margin >= 0.25 ? 'text-emerald-600' : p.margin >= 0.20 ? 'text-foreground' : 'text-amber-600')}>
                                    {(p.margin * 100).toFixed(1)}%
                                  </span>
                                </TableCell>
                                <TableCell className="text-right py-1.5">
                                  <span className={cn("text-xs font-medium inline-flex items-center gap-0.5", p.crescimento > 0 ? 'text-emerald-600' : 'text-red-500')}>
                                    {p.crescimento > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {p.crescimento > 0 ? '+' : ''}{p.crescimento.toFixed(1)}%
                                  </span>
                                </TableCell>
                                <TableCell className="py-1.5">
                                  {bestComp && (
                                    <div className="text-xs">
                                      <p className="font-medium text-foreground">{bestComp.name}</p>
                                      <p className={cn("text-[10px]", priceDiff > 0 ? 'text-red-500' : 'text-emerald-600')}>
                                        {fmtPrice(bestComp.price)} ({priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(1)}%)
                                      </p>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="py-1.5 px-2 text-center" onClick={e => e.stopPropagation()}>
                                  {!getApprovalStatus(p.id) ? (
                                    <div className="flex gap-1 justify-center">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button className="p-1 rounded hover:bg-emerald-100 transition-colors" onClick={() => approveProduct(p)}>
                                            <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-xs">Aprovar</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button className="p-1 rounded hover:bg-red-100 transition-colors" onClick={() => { setRejectTarget(p); setShowRejectDialog(true); }}>
                                            <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-xs">Reprovar</TooltipContent>
                                      </Tooltip>
                                    </div>
                                  ) : (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button className="p-1 rounded hover:bg-muted transition-colors" onClick={() => removeApproval(p.id)}>
                                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent className="text-xs">Desfazer</TooltipContent>
                                    </Tooltip>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal product={modalProduct} open={!!modalProduct} onClose={() => setModalProduct(null)} />

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Reprovar Produto
            </DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação de &quot;{rejectTarget?.name}&quot;
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea placeholder="Digite o motivo da reprovação..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="min-h-[100px]" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowRejectDialog(false); setRejectTarget(null); setRejectReason(''); }}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>Confirmar Reprovação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
