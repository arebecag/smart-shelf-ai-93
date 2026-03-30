import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  ChevronDown, ChevronRight, Search, Filter, TrendingUp, TrendingDown,
  Tv, Radio, Newspaper, Eye, Star, ArrowUpDown, X, Calendar, Target, ShoppingCart, DollarSign
} from 'lucide-react';
import {
  cervejaProducts, refrigeranteProducts, açougueProducts, padariaProducts,
  laticinioProducts, energeticoProducts, friosProducts, congeladosProducts,
  hortifrutiProducts, merceariaProducts, aguaProducts, sucoProducts,
} from '@/data/mockData';
import { Product } from '@/types/product';

// ── Historical campaigns (mock previous year) ──
const CAMPAIGNS = [
  { id: 'c1', name: 'Tabloide TV Semana 01', type: 'TV', date: '2025-01-08', period: 'Jan/2025', products: 42, faturamento: 287000 },
  { id: 'c2', name: 'Rádio Ofertas Semana 03', type: 'Rádio', date: '2025-01-22', period: 'Jan/2025', products: 28, faturamento: 156000 },
  { id: 'c3', name: 'TV Carnaval 2025', type: 'TV', date: '2025-02-28', period: 'Fev/2025', products: 55, faturamento: 412000 },
  { id: 'c4', name: 'Tabloide TV Semana 10', type: 'TV', date: '2025-03-10', period: 'Mar/2025', products: 38, faturamento: 298000 },
  { id: 'c5', name: 'Rádio Páscoa', type: 'Rádio', date: '2025-04-15', period: 'Abr/2025', products: 35, faturamento: 245000 },
  { id: 'c6', name: 'TV Dia das Mães', type: 'TV', date: '2025-05-08', period: 'Mai/2025', products: 48, faturamento: 378000 },
  { id: 'c7', name: 'Tabloide Jornal Jun', type: 'Jornal', date: '2025-06-05', period: 'Jun/2025', products: 32, faturamento: 189000 },
  { id: 'c8', name: 'TV Festa Junina', type: 'TV', date: '2025-06-20', period: 'Jun/2025', products: 45, faturamento: 345000 },
  { id: 'c9', name: 'Rádio Inverno', type: 'Rádio', date: '2025-07-10', period: 'Jul/2025', products: 30, faturamento: 198000 },
  { id: 'c10', name: 'TV Dia dos Pais', type: 'TV', date: '2025-08-07', period: 'Ago/2025', products: 50, faturamento: 402000 },
  { id: 'c11', name: 'Tabloide TV Agosto', type: 'TV', date: '2025-08-21', period: 'Ago/2025', products: 40, faturamento: 312000 },
  { id: 'c12', name: 'TV Primavera', type: 'TV', date: '2025-09-22', period: 'Set/2025', products: 36, faturamento: 267000 },
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

// Simulate which products were NOT in a campaign but sold well
const generatePerformanceData = (campaignId: string | null) => {
  const allProducts = ALL_SECTIONS.flatMap(s => s.products.map(p => ({ ...p, section: s.name })));
  
  // Products that sold well without being in the campaign
  const seed = campaignId ? parseInt(campaignId.replace('c', '')) : 1;
  return allProducts
    .filter((_, i) => (i * (seed + 3)) % 5 !== 0) // simulate "not in campaign"
    .filter(p => p.sales > 800) // sold well
    .sort((a, b) => b.sales * b.price - a.sales * a.price)
    .map((p, i) => ({
      ...p,
      faturamento: p.sales * p.price,
      crescimento: ((Math.sin(i * 0.7 + seed) * 20) + 5),
      wasInCampaign: false,
      competitorPrice: p.price * (0.85 + Math.random() * 0.2),
      competitorName: ['Giassi', 'Atacadão', 'Big', 'Angeloni', 'Fort Atacadista'][i % 5],
    }));
};

const fmt = (v: number) => v >= 1000000 ? `R$ ${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `R$ ${(v / 1000).toFixed(0)}K` : `R$ ${v.toFixed(0)}`;
const fmtPrice = (v: number) => `R$ ${v.toFixed(2)}`;

type SortField = 'faturamento' | 'sales' | 'margin' | 'crescimento' | 'price';
type SortDir = 'asc' | 'desc';

export default function CampaignPerformance() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [campaignType, setCampaignType] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('Todas');
  const [sortField, setSortField] = useState<SortField>('faturamento');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [starredProducts, setStarredProducts] = useState<Set<string>>(new Set());

  const filteredCampaigns = useMemo(() =>
    CAMPAIGNS.filter(c => campaignType === 'Todos' || c.type === campaignType),
    [campaignType]
  );

  const performanceData = useMemo(() => {
    let data = generatePerformanceData(selectedCampaign);
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
  }, [selectedCampaign, selectedSection, searchQuery, sortField, sortDir]);

  // Group by section
  const groupedData = useMemo(() => {
    const map = new Map<string, typeof performanceData>();
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

  const toggleStar = (id: string) => {
    const next = new Set(starredProducts);
    next.has(id) ? next.delete(id) : next.add(id);
    setStarredProducts(next);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
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

  return (
    <div className="h-full w-full overflow-auto bg-muted/30">
      <div className="p-5 space-y-4 max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Padrão Campanha</h1>
            <p className="text-sm text-muted-foreground">Produtos com alta performance fora de campanha • Histórico e concorrentes</p>
          </div>
          <Badge variant="outline" className="text-xs gap-1">
            <Eye className="h-3 w-3" /> Visão Cris
          </Badge>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Produtos Identificados', value: topStats.total, icon: ShoppingCart, color: 'text-chart-1' },
            { label: 'Faturamento Potencial', value: fmt(topStats.totalFat), icon: DollarSign, color: 'text-chart-2' },
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

        {/* Filters bar */}
        <Card className="border-border/40 bg-card/80">
          <CardContent className="p-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Filtros:</span>
            </div>
            <Select value={campaignType} onValueChange={setCampaignType}>
              <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CAMPAIGN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="h-8 w-[140px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas Seções</SelectItem>
                {ALL_SECTIONS.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar produto por nome ou código..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
            {(searchQuery || selectedSection !== 'Todas' || campaignType !== 'Todos') && (
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
              </CardHeader>
              <CardContent className="p-2 max-h-[600px] overflow-auto space-y-1">
                {filteredCampaigns.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCampaign(selectedCampaign === c.id ? null : c.id)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all text-xs border ${
                      selectedCampaign === c.id
                        ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20'
                        : 'border-transparent hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${selectedCampaign === c.id ? 'text-primary' : 'text-muted-foreground'}`}>
                        {typeIcon(c.type)}
                      </span>
                      <span className="font-medium text-foreground truncate flex-1">{c.name}</span>
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

          {/* Right: Product spreadsheet */}
          <div className="col-span-9">
            <Card className="border-border/40">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-chart-4" />
                    Produtos Performance Fora de Campanha
                    <Badge variant="secondary" className="text-[10px]">{performanceData.length} itens</Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <Star className="h-3 w-3 text-yellow-500" /> {starredProducts.size} marcados
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[580px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="w-8 px-2"></TableHead>
                        <TableHead className="text-xs font-semibold text-foreground min-w-[220px]">Produto</TableHead>
                        <TableHead className="text-xs font-semibold text-foreground">Seção</TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right">
                          <SortHeader field="price">Preço</SortHeader>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right">
                          <SortHeader field="faturamento">Faturamento</SortHeader>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right">
                          <SortHeader field="sales">Volume</SortHeader>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right">
                          <SortHeader field="margin">Margem</SortHeader>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-foreground text-right">
                          <SortHeader field="crescimento">Cresc.</SortHeader>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-foreground">Concorrente</TableHead>
                        <TableHead className="text-xs font-semibold text-foreground w-8"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedData.map(group => (
                        <React.Fragment key={group.section}>
                          {/* Section header row */}
                          <TableRow
                            className="bg-muted/20 hover:bg-muted/30 cursor-pointer"
                            onClick={() => toggleSection(group.section)}
                          >
                            <TableCell className="px-2 py-2">
                              {expandedSections.has(group.section)
                                ? <ChevronDown className="h-4 w-4 text-primary" />
                                : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              }
                            </TableCell>
                            <TableCell className="py-2" colSpan={2}>
                              <span className="text-xs font-bold text-foreground">{group.section}</span>
                              <Badge variant="secondary" className="ml-2 text-[9px]">{group.products.length}</Badge>
                            </TableCell>
                            <TableCell className="text-right py-2"></TableCell>
                            <TableCell className="text-right py-2">
                              <span className="text-xs font-bold text-foreground">{fmt(group.totalFat)}</span>
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <span className="text-xs font-medium text-foreground">{group.totalVol.toLocaleString('pt-BR')}</span>
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <span className="text-xs font-medium text-foreground">{(group.avgMargin * 100).toFixed(1)}%</span>
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <span className={`text-xs font-medium ${group.avgGrowth > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {group.avgGrowth > 0 ? '+' : ''}{group.avgGrowth.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                          </TableRow>

                          {/* Product rows */}
                          {expandedSections.has(group.section) && group.products.map(p => {
                            const priceDiff = ((p.price - p.competitorPrice) / p.price) * 100;
                            return (
                              <TableRow key={p.id} className="hover:bg-muted/20 border-b border-border/20">
                                <TableCell className="px-2 py-1.5"></TableCell>
                                <TableCell className="py-1.5">
                                  <div>
                                    <p className="text-xs font-medium text-foreground leading-tight">{p.name}</p>
                                    <p className="text-[10px] text-muted-foreground">Cód: {p.id}</p>
                                  </div>
                                </TableCell>
                                <TableCell className="py-1.5">
                                  <Badge variant="outline" className="text-[9px]">{p.section}</Badge>
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
                                  <span className={`text-xs font-medium ${p.margin >= 0.25 ? 'text-emerald-600' : p.margin >= 0.20 ? 'text-foreground' : 'text-amber-600'}`}>
                                    {(p.margin * 100).toFixed(1)}%
                                  </span>
                                </TableCell>
                                <TableCell className="text-right py-1.5">
                                  <span className={`text-xs font-medium inline-flex items-center gap-0.5 ${p.crescimento > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {p.crescimento > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {p.crescimento > 0 ? '+' : ''}{p.crescimento.toFixed(1)}%
                                  </span>
                                </TableCell>
                                <TableCell className="py-1.5">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="text-xs">
                                        <p className="font-medium text-foreground">{p.competitorName}</p>
                                        <p className={`text-[10px] ${priceDiff > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                          {fmtPrice(p.competitorPrice)} ({priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(1)}%)
                                        </p>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs">
                                      Nosso preço: {fmtPrice(p.price)} vs {p.competitorName}: {fmtPrice(p.competitorPrice)}
                                    </TooltipContent>
                                  </Tooltip>
                                </TableCell>
                                <TableCell className="py-1.5 px-2">
                                  <button onClick={() => toggleStar(p.id)} className="hover:scale-110 transition-transform">
                                    <Star className={`h-4 w-4 ${starredProducts.has(p.id) ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground/30 hover:text-amber-400'}`} />
                                  </button>
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
    </div>
  );
}
