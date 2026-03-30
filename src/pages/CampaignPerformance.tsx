import React, { useState, useMemo } from 'react';
import { format, parse, isSameMonth } from 'date-fns';
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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  ChevronDown, ChevronRight, Search, Filter, TrendingUp, TrendingDown,
  Tv, Radio, Newspaper, Eye, Star, ArrowUpDown, X, Calendar, Target,
  ShoppingCart, DollarSign, ThumbsUp, ThumbsDown, CheckCircle2, XCircle,
  BarChart2, Sparkles, ExternalLink, Info, CalendarIcon,
} from 'lucide-react';
import {
  cervejaProducts, refrigeranteProducts, açougueProducts, padariaProducts,
  laticinioProducts, energeticoProducts, friosProducts, congeladosProducts,
  hortifrutiProducts, merceariaProducts, aguaProducts, sucoProducts,
} from '@/data/mockData';
import { Product } from '@/types/product';
import { useApprovals } from '@/contexts/ApprovalsContext';
import { cn } from '@/lib/utils';

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

// Pre-assign products to campaigns deterministically
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
    // Show products that WERE in this campaign
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

  // Default: products that sold well WITHOUT being in campaigns
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

export default function CampaignPerformance() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [campaignType, setCampaignType] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('Todas');
  const [sortField, setSortField] = useState<SortField>('faturamento');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { approveProduct, rejectProduct, isApproved, isRejected, getApprovalStatus, removeApproval } = useApprovals();

  const filteredCampaigns = useMemo(() => {
    let list = CAMPAIGNS.filter(c => campaignType === 'Todos' || c.type === campaignType);
    if (selectedDate) {
      // Show campaigns from same month (previous year)
      list = list.filter(c => {
        const cDate = parse(c.date, 'yyyy-MM-dd', new Date());
        return cDate.getMonth() === selectedDate.getMonth();
      });
    }
    return list;
  }, [campaignType, selectedDate]);

  // When date is selected, auto-select first matching campaign
  const effectiveCampaign = useMemo(() => {
    if (selectedCampaign) return selectedCampaign;
    if (selectedDate && filteredCampaigns.length > 0) return filteredCampaigns[0].id;
    return null;
  }, [selectedCampaign, selectedDate, filteredCampaigns]);

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
    return data;
  }, [effectiveCampaign, selectedSection, searchQuery, sortField, sortDir]);

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

  const topStats = useMemo(() => {
    const total = performanceData.length;
    const totalFat = performanceData.reduce((s, p) => s + p.faturamento, 0);
    const growing = performanceData.filter(p => p.crescimento > 0).length;
    const avgMargin = total > 0 ? performanceData.reduce((s, p) => s + p.margin, 0) / total : 0;
    return { total, totalFat, growing, avgMargin };
  }, [performanceData]);

  const selectedCampaignObj = CAMPAIGNS.find(c => c.id === effectiveCampaign);

  // ── Product detail panel ──
  const ProductDetailPanel = ({ product }: { product: Product }) => (
    <div className="bg-muted/30 border border-border/40 rounded-lg p-4 space-y-4">
      {/* Approve/Reject */}
      <div className="flex items-center gap-2">
        {getApprovalStatus(product.id) ? (
          <div className={cn(
            "flex-1 flex items-center justify-between p-2.5 rounded-lg",
            isApproved(product.id) ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"
          )}>
            <div className="flex items-center gap-2">
              {isApproved(product.id)
                ? <><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="text-sm font-medium text-emerald-700">Aprovado para campanha</span></>
                : <><XCircle className="h-4 w-4 text-red-600" /><div><span className="text-sm font-medium text-red-700">Reprovado</span>{getApprovalStatus(product.id)?.reason && <p className="text-xs text-red-500">{getApprovalStatus(product.id)?.reason}</p>}</div></>
              }
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => removeApproval(product.id)}>Desfazer</Button>
          </div>
        ) : (
          <>
            <Button size="sm" variant="outline" className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50" onClick={() => approveProduct(product)}>
              <ThumbsUp className="h-3.5 w-3.5 mr-1.5" /> Aprovar p/ Campanha
            </Button>
            <Button size="sm" variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50" onClick={() => { setRejectTarget(product); setShowRejectDialog(true); }}>
              <ThumbsDown className="h-3.5 w-3.5 mr-1.5" /> Reprovar
            </Button>
          </>
        )}
      </div>

      {/* Tabs: Nielsen / Prixsia / Shopping Brasil / Global Segmentos */}
      <Tabs defaultValue="nielsen" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-muted/60 p-0.5 h-8">
          <TabsTrigger value="nielsen" className="text-[11px] gap-1 h-7"><BarChart2 className="h-3 w-3" />Nielsen</TabsTrigger>
          <TabsTrigger value="prixsia" className="text-[11px] gap-1 h-7"><TrendingUp className="h-3 w-3" />Prixsia</TabsTrigger>
          <TabsTrigger value="shopping" className="text-[11px] gap-1 h-7"><ShoppingCart className="h-3 w-3" />Shopping BR</TabsTrigger>
          <TabsTrigger value="global" className="text-[11px] gap-1 h-7"><Tv className="h-3 w-3" />Global Seg.</TabsTrigger>
        </TabsList>

        <TabsContent value="nielsen" className="mt-2 bg-card rounded-lg p-3 border border-border/30">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Share de Mercado:</span><span className="font-semibold">{product.nielsen.marketShare}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Core Segment:</span><span className="font-semibold">{product.nielsen.coreSegment}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Penetração:</span><span className="font-semibold">{product.nielsen.penetration}%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ranking Regional:</span><span className="font-semibold">{product.nielsen.regionalRanking}º</span></div>
          </div>
        </TabsContent>

        <TabsContent value="prixsia" className="mt-2 bg-card rounded-lg p-3 border border-border/30 space-y-3">
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { label: 'Mínimo', val: product.prixsia.minPrice },
              { label: 'Média', val: product.prixsia.avgPrice },
              { label: 'Mediana', val: product.prixsia.medianPrice },
              { label: 'Máximo', val: product.prixsia.maxPrice },
            ].map(v => (
              <div key={v.label} className="bg-muted/50 rounded-md p-2 text-center">
                <p className="text-muted-foreground text-[10px]">{v.label}</p>
                <p className="font-bold text-foreground">{fmtPrice(v.val)}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold mb-1.5">Concorrentes Prixsia</p>
            <div className="grid grid-cols-3 gap-2">
              {product.prixsia.competitors.map((comp, idx) => {
                const diff = ((comp.price - product.price) / product.price) * 100;
                return (
                  <div key={idx} className="bg-muted/40 rounded-md p-2 text-xs border border-border/30">
                    <p className="font-semibold text-foreground truncate">{comp.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{comp.location}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-bold text-foreground">{fmtPrice(comp.price)}</span>
                      <span className={cn("text-[10px] font-medium", diff > 0 ? "text-emerald-600" : "text-red-500")}>
                        ({diff > 0 ? '+' : ''}{diff.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shopping" className="mt-2 bg-card rounded-lg p-3 border border-border/30">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-primary" />
              <a href={product.shoppingBrasil.link} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs truncate">
                {product.shoppingBrasil.link}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-muted-foreground">Título:</span> <span className="font-medium">{product.shoppingBrasil.title}</span></div>
              <div><span className="text-muted-foreground">Preço Anúncio:</span> <span className="font-bold text-primary">{fmtPrice(product.shoppingBrasil.adPrice)}</span></div>
              <div><span className="text-muted-foreground">Data Início:</span> <span className="font-medium">{product.shoppingBrasil.startDate}</span></div>
              <div><span className="text-muted-foreground">Detalhe:</span> <span className="font-medium">{product.shoppingBrasil.detail}</span></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="global" className="mt-2 bg-card rounded-lg p-3 border border-border/30">
          <div className="space-y-2">
            {product.globalSegments.map((seg, idx) => (
              <div key={idx} className="bg-muted/30 rounded-md p-2.5 text-xs border border-border/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-foreground">{seg.competitor}</span>
                  <Badge variant="outline" className="text-[9px]">{seg.campaignDate}</Badge>
                </div>
                <p className="text-muted-foreground">Campanha: <span className="font-medium text-foreground">{seg.lastCampaign}</span></p>
                <div className="flex gap-4 mt-1 text-muted-foreground">
                  <span>Alcance: <span className="font-medium text-foreground">{seg.reach}</span></span>
                  <span>Investimento: <span className="font-medium text-foreground">{seg.investment}</span></span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

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
                : 'Selecione uma campanha para ver seus produtos ou veja os destaques fora de campanha'
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
            {/* Date picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("h-8 w-[180px] justify-start text-left text-xs bg-card/80", !selectedDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Filtrar por data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => { setSelectedDate(d); setSelectedCampaign(null); }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Select value={campaignType} onValueChange={v => { setCampaignType(v); setSelectedCampaign(null); }}>
              <SelectTrigger className="h-8 w-[120px] text-xs bg-card/80"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CAMPAIGN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="h-8 w-[140px] text-xs bg-card/80"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas Seções</SelectItem>
                {ALL_SECTIONS.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Buscar produto..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-8 pl-8 text-xs bg-card/80" />
            </div>
            {(searchQuery || selectedSection !== 'Todas' || campaignType !== 'Todos' || effectiveCampaign || selectedDate) && (
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1"
                onClick={() => { setSearchQuery(''); setSelectedSection('Todas'); setCampaignType('Todos'); setSelectedCampaign(null); }}>
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
                <p className="text-[10px] text-muted-foreground mt-0.5">Clique para ver os produtos da campanha</p>
              </CardHeader>
              <CardContent className="p-2 max-h-[650px] overflow-auto space-y-1">
                {filteredCampaigns.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCampaign(effectiveCampaign === c.id ? null : c.id)}
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
                    {selectedCampaign
                      ? <><Tv className="h-4 w-4 text-primary" /> Produtos da Campanha</>
                      : <><TrendingUp className="h-4 w-4 text-chart-4" /> Produtos Performance Fora de Campanha</>
                    }
                    <Badge variant="secondary" className="text-[10px]">{performanceData.length} itens</Badge>
                  </CardTitle>
                  {effectiveCampaign && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Info className="h-3 w-3" />
                      Aprove ou reprove produtos para a próxima campanha
                    </div>
                  )}
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
                            const isExpanded = expandedProduct === p.id;
                            const approved = isApproved(p.id);
                            const rejected = isRejected(p.id);

                            return (
                              <React.Fragment key={p.id}>
                                <TableRow
                                  className={cn(
                                    "hover:bg-muted/20 border-b border-border/20 cursor-pointer transition-colors",
                                    isExpanded && "bg-primary/5",
                                    approved && "bg-emerald-50/50",
                                    rejected && "bg-red-50/50",
                                  )}
                                  onClick={() => setExpandedProduct(isExpanded ? null : p.id)}
                                >
                                  <TableCell className="px-2 py-1.5">
                                    {isExpanded
                                      ? <ChevronDown className="h-3.5 w-3.5 text-primary" />
                                      : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />}
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
                                  <TableCell className="py-1.5">
                                    <span className="text-[10px] text-muted-foreground">{p.section}</span>
                                  </TableCell>
                                  <TableCell className="text-right py-1.5">
                                    <span className="text-xs font-medium text-foreground">{fmtPrice(p.price)}</span>
                                  </TableCell>
                                  <TableCell className="text-right py-1.5">
                                    <span className="text-xs font-bold text-foreground">{fmt(p.faturamento)}</span>
                                  </TableCell>
                                  <TableCell className="text-right py-1.5">
                                    <span className="text-xs text-foreground">{p.sales.toLocaleString('pt-BR')}</span>
                                  </TableCell>
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

                                {/* Expanded detail row */}
                                {isExpanded && (
                                  <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={10} className="p-3 bg-muted/10">
                                      <ProductDetailPanel product={p} />
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
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

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Reprovar Produto
            </DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação de "{rejectTarget?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Digite o motivo da reprovação..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
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
