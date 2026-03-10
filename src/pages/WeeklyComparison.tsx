import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockHistory, mockProductGroups } from "@/data/mockData";
import {
  TrendingUp, Calendar, Flame, DollarSign,
  Zap, History, Award, Send, Star, ChevronUp, ChevronDown, Tag, Sparkles
} from "lucide-react";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useSimulator } from "@/contexts/SimulatorContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// ── Seções ────────────────────────────────────────────────
const SECTION_MAP: Record<string, string[]> = {
  "Cervejas":      ["80"],
  "Refrigerantes": ["81"],
  "Laticínios":    ["82"],
  "Energéticos":   ["88"],
  "Açougue":       ["90"],
  "Padaria":       ["91"],
  "Água":          ["85"],
};

const SECTION_COLORS: Record<string, string> = {
  "Cervejas":      "hsl(var(--chart-1))",
  "Refrigerantes": "hsl(var(--chart-2))",
  "Laticínios":    "hsl(var(--chart-3))",
  "Energéticos":   "hsl(var(--chart-4))",
  "Açougue":       "hsl(var(--chart-5))",
  "Padaria":       "hsl(var(--chart-1))",
  "Água":          "hsl(var(--chart-2))",
};

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const DAY_CONTEXTS: Record<string, string> = {
  "Seg": "Reposição pós-fds",
  "Ter": "Giro médio",
  "Qua": "Pico mid-week",
  "Qui": "Antecipa fds",
  "Sex": "Alta demanda",
  "Sáb": "Pico de vendas 🔥",
  "Dom": "Família em casa 🔥",
};

const DAY_SECTION_BOOST: Record<string, string[]> = {
  "Seg": ["Laticínios", "Padaria"],
  "Ter": ["Refrigerantes", "Água"],
  "Qua": ["Cervejas", "Energéticos"],
  "Qui": ["Açougue", "Laticínios"],
  "Sex": ["Cervejas", "Refrigerantes", "Açougue"],
  "Sáb": ["Cervejas", "Refrigerantes", "Açougue", "Energéticos"],
  "Dom": ["Laticínios", "Padaria", "Refrigerantes"],
};

const DAY_REVENUE_MULT: Record<string, number> = {
  "Seg": 0.65, "Ter": 0.72, "Qua": 0.80, "Qui": 0.85,
  "Sex": 1.20, "Sáb": 1.55, "Dom": 1.23,
};

interface ProductStats {
  product: Product;
  section: string;
  appearances: number;
  avgMargin: number;
  totalSales: number;
  campaigns: string[];
  lastSeen: string;
  score: number;
}

function getSectionForGroupId(groupId: string): string {
  for (const [section, ids] of Object.entries(SECTION_MAP)) {
    if (ids.includes(groupId)) return section;
  }
  return "Outros";
}

function buildProductStats(): ProductStats[] {
  const statsMap: Record<string, {
    product: Product; section: string; appearances: number;
    marginSum: number; campaigns: string[]; dates: string[];
  }> = {};

  for (const histItem of mockHistory) {
    for (const product of histItem.products) {
      if (!statsMap[product.id]) {
        const group = mockProductGroups.find(g => g.products.some(p => p.id === product.id));
        const section = group ? getSectionForGroupId(group.id) : "Outros";
        statsMap[product.id] = { product, section, appearances: 0, marginSum: 0, campaigns: [], dates: [] };
      }
      statsMap[product.id].appearances += 1;
      statsMap[product.id].marginSum += product.margin;
      if (!statsMap[product.id].campaigns.includes(histItem.campaign))
        statsMap[product.id].campaigns.push(histItem.campaign);
      statsMap[product.id].dates.push(histItem.date);
    }
  }

  return Object.values(statsMap).map(s => {
    const avgMargin = s.marginSum / s.appearances;
    const lastSeen = s.dates.sort().reverse()[0];
    const freqScore  = Math.min(1, s.appearances / mockHistory.length) * 30;
    const marginScore = Math.min(1, avgMargin / 0.40) * 30;
    const salesScore  = Math.min(1, s.product.sales / 4000) * 20;
    const growthScore = Math.min(1, s.product.growth / 0.30) * 20;
    const score = Math.round(freqScore + marginScore + salesScore + growthScore);
    return { product: s.product, section: s.section, appearances: s.appearances, avgMargin, totalSales: s.product.sales, campaigns: s.campaigns, lastSeen, score };
  }).sort((a, b) => b.score - a.score);
}

// Section-level aggregate metrics
function buildSectionMetrics() {
  return Object.entries(SECTION_MAP).map(([section, groupIds]) => {
    const group = mockProductGroups.find(g => groupIds.includes(g.id));
    if (!group) return { section, faturamento: 0, volume: 0, rentabilidade: 0, margem: 0, products: [] as Product[] };
    const products = group.products;
    const totalSales = products.reduce((s, p) => s + p.sales, 0);
    const avgMargin = products.reduce((s, p) => s + p.margin, 0) / products.length;
    const avgPrice = products.reduce((s, p) => s + p.price, 0) / products.length;
    const faturamento = Math.round(totalSales * avgPrice);
    const rentabilidade = Math.round(faturamento * avgMargin);
    return { section, faturamento, volume: totalSales, rentabilidade, margem: avgMargin, products };
  });
}

function buildDayBarData() {
  return DAYS.map(day => {
    const mult = DAY_REVENUE_MULT[day];
    const row: Record<string, any> = { day };
    for (const section of Object.keys(SECTION_MAP)) {
      const group = mockProductGroups.find(g => SECTION_MAP[section].includes(g.id));
      const base = group ? group.products.reduce((s, p) => s + p.sales * p.price, 0) / 100 : 0;
      const boosted = (DAY_SECTION_BOOST[day] || []).includes(section) ? 1.3 : 0.7;
      row[section] = Math.round(base * mult * boosted);
    }
    return row;
  });
}

function buildSectionAreaData() {
  return Object.keys(SECTION_MAP).map(section => {
    const group = mockProductGroups.find(g => SECTION_MAP[section].includes(g.id));
    if (!group) return { section: section.slice(0, 6), faturamento: 0, volume: 0, rentabilidade: 0 };
    const totalSales = group.products.reduce((s, p) => s + p.sales, 0);
    const avgMargin = group.products.reduce((s, p) => s + p.margin, 0) / group.products.length;
    const avgPrice = group.products.reduce((s, p) => s + p.price, 0) / group.products.length;
    const faturamento = Math.round(totalSales * avgPrice / 100);
    const rentabilidade = Math.round(faturamento * avgMargin);
    return { section: section.slice(0, 6), faturamento, volume: totalSales, rentabilidade };
  });
}

const fmt = (v: number) => v.toLocaleString("pt-BR");
const fmtR = (v: number) => `R$${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const shortName = (name: string) =>
  name.length > 32 ? name.slice(0, 32) + "…" : name;

// ── ProductColumn ─────────────────────────────────────────
interface ProductColProps {
  title: string;
  color: string;
  items: { name: string; value: string }[];
  onSuggest: (name: string) => void;
  onSimulate: (name: string) => void;
}
function ProductColumn({ title, color, items }: { title: string; color: string; items: { name: string; value: string }[] }) {
  return (
    <div className="flex flex-col border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-muted/40 border-b border-border text-center">
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color }}>{title}</span>
      </div>
      <div className="divide-y divide-border flex-1">
        {items.map((item, i) => (
          <div key={i} className="px-3 py-2.5 hover:bg-muted/30 transition-colors">
            <p className="text-[11px] font-semibold leading-snug" style={{ color }}>{shortName(item.name)}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Component ───────────────────────────────────────────
export default function WeeklyComparison() {
  const [selectedDay, setSelectedDay] = useState<string>("Sex");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { approveProduct, isApproved } = useApprovals();
  const { addToSimulator, isInSimulator } = useSimulator();
  const { toast } = useToast();
  const navigate = useNavigate();

  const allStats = useMemo(() => buildProductStats(), []);
  const sectionMetrics = useMemo(() => buildSectionMetrics(), []);
  const sectionAreaData = useMemo(() => buildSectionAreaData(), []);
  const dayBarData = useMemo(() => buildDayBarData(), []);

  // Active section detail
  const activeSectionData = useMemo(() => {
    if (!selectedSection) return null;
    const metrics = sectionMetrics.find(s => s.section === selectedSection);
    if (!metrics) return null;
    const products = metrics.products;
    // top by faturamento
    const byFat = [...products].sort((a, b) => (b.sales * b.price) - (a.sales * a.price));
    // top by volume
    const byVol = [...products].sort((a, b) => b.sales - a.sales);
    // top by rentabilidade (margin * revenue)
    const byRent = [...products].sort((a, b) => (b.sales * b.price * b.margin) - (a.sales * a.price * a.margin));
    // with campaign (hasAd)
    const withCampaign = [...products].filter(p => p.hasAd).sort((a, b) => (b.sales * b.price) - (a.sales * a.price));
    // without campaign (opportunity)
    const noCampaign = [...products].filter(p => !p.hasAd).sort((a, b) => (b.sales * b.price * b.margin) - (a.sales * a.price * a.margin));
    return { metrics, byFat, byVol, byRent, withCampaign, noCampaign };
  }, [selectedSection, sectionMetrics]);

  const handleSuggest = (product: Product) => {
    approveProduct(product);
    toast({ title: "Sugerido para tabloide!", description: `${product.name} adicionado à fila de aprovação.` });
  };

  const handleAddToSimulator = (product: Product) => {
    addToSimulator(product);
    toast({
      title: "Adicionado ao Simulador!",
      description: `${product.name} pronto para simulação.`,
      action: <button onClick={() => navigate("/simulador")} className="text-xs underline font-semibold">Ver Simulador</button>,
    });
  };

  // Summaries for header chips
  const totalProducts = allStats.length;
  const avgMarginPct = Math.round(allStats.reduce((a, s) => a + s.avgMargin, 0) / (allStats.length || 1) * 100);

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Comparativo Semanal
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Análise baseada em {mockHistory.length} tabloides históricos
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { icon: History, label: `${mockHistory.length} Tabloides`, color: "text-primary" },
            { icon: Flame, label: `${totalProducts} Produtos`, color: "text-orange-500" },
            { icon: DollarSign, label: `${avgMarginPct}% Margem Média`, color: "text-green-600" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-3 py-1.5 text-sm font-medium">
              <Icon className={cn("h-4 w-4", color)} />
              <span className="text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Area Chart ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Faturamento · Rentabilidade por Seção
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={sectionAreaData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gRent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="section" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="faturamento" name="Faturamento" stroke="hsl(var(--chart-1))" fill="url(#gFat)" strokeWidth={2} />
              <Area type="monotone" dataKey="rentabilidade" name="Rentabilidade" stroke="hsl(var(--chart-2))" fill="url(#gRent)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Section Table + Detail Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: section table */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="pb-2 pt-3 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Seções — clique para detalhar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2 bg-muted/40 border-y border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
              <span>Seção</span>
              <span className="text-right">Faturamento</span>
              <span className="text-right">Volume</span>
              <span className="text-right">Margem</span>
            </div>
            <div className="divide-y divide-border">
              {sectionMetrics.map(row => {
                const isActive = selectedSection === row.section;
                return (
                  <button
                    key={row.section}
                    onClick={() => setSelectedSection(isActive ? null : row.section)}
                    className={cn(
                      "w-full grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/40",
                      isActive && "bg-primary/8 border-l-2 border-primary"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-semibold flex items-center gap-1.5",
                      isActive ? "text-primary" : "text-foreground"
                    )}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SECTION_COLORS[row.section] }} />
                      {row.section}
                    </span>
                    <span className="text-[11px] font-medium text-foreground tabular-nums">
                      {fmtR(row.faturamento)}
                    </span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {fmt(row.volume)}
                    </span>
                    <span className={cn(
                      "text-[11px] font-semibold tabular-nums",
                      row.margem >= 0.25 ? "text-green-600" :
                      row.margem >= 0.18 ? "text-orange-500" :
                      "text-destructive"
                    )}>
                      {(row.margem * 100).toFixed(1)}%
                    </span>
                  </button>
                );
              })}
              {/* Total row */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2.5 bg-muted/30 text-[11px] font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-foreground tabular-nums">
                  {fmtR(sectionMetrics.reduce((s, r) => s + r.faturamento, 0))}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {fmt(sectionMetrics.reduce((s, r) => s + r.volume, 0))}
                </span>
                <span className="text-green-600 tabular-nums">
                  {(sectionMetrics.reduce((s, r) => s + r.margem, 0) / sectionMetrics.length * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: section detail or placeholder */}
        <div className="lg:col-span-2">
          {activeSectionData ? (
            <div className="space-y-3 h-full">
              {/* Section headline */}
              <div className="flex items-center gap-3 px-1">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: SECTION_COLORS[selectedSection!] }} />
                <h2 className="text-base font-bold text-foreground">{selectedSection}</h2>
                <div className="flex gap-2 text-xs ml-auto">
                  <span className="bg-muted px-2 py-1 rounded-lg font-medium text-muted-foreground">
                    Fat.: {fmtR(activeSectionData.metrics.faturamento)}
                  </span>
                  <span className="bg-muted px-2 py-1 rounded-lg font-medium text-muted-foreground">
                    Vol.: {fmt(activeSectionData.metrics.volume)}
                  </span>
                  <span className="bg-green-50 border border-green-200 px-2 py-1 rounded-lg font-semibold text-green-700">
                    Rentab.: {fmtR(activeSectionData.metrics.rentabilidade)}
                  </span>
                  <span className="bg-green-50 border border-green-200 px-2 py-1 rounded-lg font-semibold text-green-700">
                    {(activeSectionData.metrics.margem * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* 3 top-product columns */}
              <div className="grid grid-cols-3 gap-3">
                <ProductColumn
                  title="Faturamento"
                  color="hsl(var(--chart-1))"
                  items={activeSectionData.byFat.slice(0, 8).map(p => ({
                    name: p.name,
                    value: fmtR(p.sales * p.price),
                  }))}
                  onSuggest={() => {}}
                  onSimulate={() => {}}
                />
                <ProductColumn
                  title="Volume"
                  color="hsl(var(--chart-3))"
                  items={activeSectionData.byVol.slice(0, 8).map(p => ({
                    name: p.name,
                    value: fmt(p.sales),
                  }))}
                  onSuggest={() => {}}
                  onSimulate={() => {}}
                />
                <ProductColumn
                  title="Rentab. c/ Sellout"
                  color="hsl(var(--chart-2))"
                  items={activeSectionData.byRent.slice(0, 8).map(p => ({
                    name: p.name,
                    value: fmtR(p.sales * p.price * p.margin),
                  }))}
                  onSuggest={() => {}}
                  onSimulate={() => {}}
                />
              </div>

              {/* Campaign vs opportunity */}
              <div className="grid grid-cols-2 gap-3">
                {/* With campaign */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-muted/40 border-b border-border flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">TOP Produtos em Campanha</span>
                  </div>
                  <div className="divide-y divide-border max-h-52 overflow-y-auto">
                    {activeSectionData.withCampaign.slice(0, 6).map((p, i) => (
                      <div key={p.id} className="px-3 py-2.5 flex items-start justify-between gap-2 hover:bg-muted/30 transition-colors">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-primary leading-snug truncate">{shortName(p.name)}</p>
                          <p className="text-[11px] text-muted-foreground">{fmtR(p.sales * p.price)}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleSuggest(p)}
                            disabled={isApproved(p.id)}
                            title="Sugerir"
                            className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded border font-medium transition-colors",
                              isApproved(p.id)
                                ? "border-green-300 text-green-600 bg-green-50"
                                : "border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
                            )}
                          >
                            {isApproved(p.id) ? "✓" : <Send className="h-2.5 w-2.5" />}
                          </button>
                          <button
                            onClick={() => handleAddToSimulator(p)}
                            disabled={isInSimulator(p.id)}
                            title="Simular"
                            className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded border font-medium transition-colors",
                              isInSimulator(p.id)
                                ? "border-violet-300 text-violet-600 bg-violet-50"
                                : "border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white"
                            )}
                          >
                            {isInSimulator(p.id) ? "✓" : <Zap className="h-2.5 w-2.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    {activeSectionData.withCampaign.length === 0 && (
                      <p className="text-[11px] text-muted-foreground px-3 py-4 text-center">Nenhum produto em campanha</p>
                    )}
                  </div>
                </div>

                {/* No campaign — opportunity */}
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-muted/40 border-b border-border flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-wide">TOP Produtos SEM Campanha (Oportunidades)</span>
                  </div>
                  <div className="divide-y divide-border max-h-52 overflow-y-auto">
                    {activeSectionData.noCampaign.slice(0, 6).map((p, i) => (
                      <div key={p.id} className="px-3 py-2.5 flex items-start justify-between gap-2 hover:bg-muted/30 transition-colors">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-orange-600 leading-snug truncate">{shortName(p.name)}</p>
                          <p className="text-[11px] text-muted-foreground">{fmtR(p.sales * p.price * p.margin)}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleSuggest(p)}
                            disabled={isApproved(p.id)}
                            title="Sugerir"
                            className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded border font-medium transition-colors",
                              isApproved(p.id)
                                ? "border-green-300 text-green-600 bg-green-50"
                                : "border-orange-300 text-orange-600 hover:bg-orange-500 hover:text-white"
                            )}
                          >
                            {isApproved(p.id) ? "✓" : <Send className="h-2.5 w-2.5" />}
                          </button>
                          <button
                            onClick={() => handleAddToSimulator(p)}
                            disabled={isInSimulator(p.id)}
                            title="Simular"
                            className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded border font-medium transition-colors",
                              isInSimulator(p.id)
                                ? "border-violet-300 text-violet-600 bg-violet-50"
                                : "border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white"
                            )}
                          >
                            {isInSimulator(p.id) ? "✓" : <Zap className="h-2.5 w-2.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                    {activeSectionData.noCampaign.length === 0 && (
                      <p className="text-[11px] text-muted-foreground px-3 py-4 text-center">Sem oportunidades mapeadas</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border text-center gap-3">
              <Award className="h-10 w-10 text-muted-foreground/30" />
              <div>
                <p className="text-sm font-semibold text-foreground">Selecione uma seção</p>
                <p className="text-xs text-muted-foreground mt-1">Clique em uma linha da tabela para ver os rankings detalhados</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Day Grid ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Destaques por Dia da Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 divide-x divide-border border-t border-border">
            {DAYS.map(day => {
              const isSelected = selectedDay === day;
              const mult = DAY_REVENUE_MULT[day];
              const boosted = DAY_SECTION_BOOST[day] || [];
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex flex-col p-3 text-left transition-colors hover:bg-muted/50 min-h-[150px]",
                    isSelected && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn("text-sm font-bold", isSelected ? "text-primary" : "text-foreground")}>{day}</span>
                    {(day === "Sáb" || day === "Dom") && <Flame className="h-3 w-3 text-orange-500" />}
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-tight mb-2">{DAY_CONTEXTS[day]}</p>
                  <div className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded mb-2 w-fit",
                    mult >= 1.3 ? "bg-green-100 text-green-700" :
                    mult >= 1.0 ? "bg-blue-100 text-blue-700" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {mult >= 1.3 ? <ChevronUp className="h-2.5 w-2.5 inline" /> : mult < 0.75 ? <ChevronDown className="h-2.5 w-2.5 inline" /> : null}
                    {(mult * 100).toFixed(0)}%
                  </div>
                  <div className="space-y-1">
                    {boosted.slice(0, 3).map(section => (
                      <div
                        key={section}
                        className="text-[9px] px-1.5 py-0.5 rounded border font-medium truncate bg-muted text-muted-foreground border-border"
                      >
                        {section}
                      </div>
                    ))}
                  </div>
                  {isSelected && <div className="mt-2 w-full h-0.5 rounded-full bg-primary" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Selected Day products ── */}
      {(() => {
        const boosted = DAY_SECTION_BOOST[selectedDay] || [];
        const dayHighlights = boosted.flatMap(section => {
          const items = allStats
            .filter(s => s.section === section)
            .sort((a, b) => {
              const isWeekend = selectedDay === "Sáb" || selectedDay === "Dom";
              const w = isWeekend ? 1.4 : 1;
              return (b.totalSales * w + b.score * 2) - (a.totalSales * w + a.score * 2);
            })
            .slice(0, 3);
          return items.length > 0 ? [{ section, items }] : [];
        });
        return (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-sm font-bold text-foreground">Produtos Destaque — {selectedDay}</h2>
              <Badge variant="secondary">{DAY_CONTEXTS[selectedDay]}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {dayHighlights.map(({ section, items }) => (
                <Card key={section} className="overflow-hidden">
                  <CardHeader className="pb-2 pt-3 px-4 bg-muted/30 border-b border-border">
                    <CardTitle className="text-xs font-bold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: SECTION_COLORS[section] }} />
                      {section}
                      <Badge variant="secondary" className="text-[9px] ml-auto">destaque {selectedDay}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 space-y-1.5">
                    {items.map((stat, rank) => {
                      const already = isApproved(stat.product.id);
                      const inSim = isInSimulator(stat.product.id);
                      return (
                        <div
                          key={stat.product.id}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg p-2 border",
                            rank === 0 ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-transparent"
                          )}
                        >
                          <div className="w-4 text-center flex-shrink-0">
                            {rank === 0 ? <Star className="h-3 w-3 text-yellow-500 fill-yellow-400 mx-auto" /> : <span className="text-[9px] font-bold text-muted-foreground">{rank + 1}º</span>}
                          </div>
                          <img src={stat.product.imageUrl} alt={stat.product.name} className="w-8 h-8 object-contain flex-shrink-0 rounded"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-foreground truncate">{shortName(stat.product.name)}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] text-muted-foreground">{stat.appearances}x</span>
                              <span className="text-[9px] font-medium text-green-600">{Math.round(stat.avgMargin * 100)}%</span>
                              <span className="text-[9px] font-medium text-primary">s{stat.score}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-[11px] font-bold text-foreground">R$ {stat.product.price.toFixed(2)}</span>
                            <button onClick={() => handleSuggest(stat.product)} disabled={already}
                              className={cn("flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-medium transition-colors",
                                already ? "border-green-400 text-green-600 bg-green-50 cursor-default" : "border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground")}>
                              {already ? "✓" : <><Send className="h-2 w-2" /> Sugerir</>}
                            </button>
                            <button onClick={() => handleAddToSimulator(stat.product)} disabled={inSim}
                              className={cn("flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full border font-medium transition-colors",
                                inSim ? "border-violet-300 text-violet-600 bg-violet-50 cursor-default" : "border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white")}>
                              {inSim ? "✓" : <><Zap className="h-2 w-2" /> Simular</>}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Stacked bar by day ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Participação por Seção ao Longo da Semana
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dayBarData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {Object.keys(SECTION_MAP).map((section, i) => (
                <Bar key={section} dataKey={section} stackId="a" fill={SECTION_COLORS[section]}
                  radius={i === Object.keys(SECTION_MAP).length - 1 ? [4, 4, 0, 0] : undefined} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
