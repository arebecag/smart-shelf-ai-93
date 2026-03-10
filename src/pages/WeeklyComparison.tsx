import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockHistory, mockProductGroups } from "@/data/mockData";
import {
  TrendingUp, TrendingDown, Calendar, Flame, DollarSign,
  Zap, History, Award, Send, Star, ChevronUp, ChevronDown
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

const SECTION_BG: Record<string, string> = {
  "Cervejas":      "bg-blue-50 border-blue-200",
  "Refrigerantes": "bg-green-50 border-green-200",
  "Laticínios":    "bg-yellow-50 border-yellow-200",
  "Energéticos":   "bg-purple-50 border-purple-200",
  "Açougue":       "bg-red-50 border-red-200",
  "Padaria":       "bg-orange-50 border-orange-200",
  "Água":          "bg-sky-50 border-sky-200",
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

// Revenue multiplier per day (relative to average)
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

function getDayHighlights(stats: ProductStats[], day: string, perSection = 3) {
  const boosted = DAY_SECTION_BOOST[day] || [];
  const result: { section: string; items: ProductStats[] }[] = [];
  for (const section of boosted) {
    const items = stats
      .filter(s => s.section === section)
      .sort((a, b) => {
        const isWeekend = day === "Sáb" || day === "Dom";
        const salesW = isWeekend ? 1.4 : 1;
        return (b.totalSales * salesW + b.score * 2) - (a.totalSales * salesW + a.score * 2);
      })
      .slice(0, perSection);
    if (items.length > 0) result.push({ section, items });
  }
  return result;
}

// ── Chart data builders ─────────────────────────────────
function buildSectionAreaData() {
  return Object.keys(SECTION_MAP).map(section => {
    const group = mockProductGroups.find(g => SECTION_MAP[section].includes(g.id));
    if (!group) return { section, faturamento: 0, volume: 0, rentabilidade: 0 };
    const totalSales = group.products.reduce((s, p) => s + p.sales, 0);
    const avgMargin = group.products.reduce((s, p) => s + p.margin, 0) / group.products.length;
    const avgPrice = group.products.reduce((s, p) => s + p.price, 0) / group.products.length;
    const faturamento = Math.round(totalSales * avgPrice / 100);
    const rentabilidade = Math.round(faturamento * avgMargin);
    return { section: section.slice(0, 6), faturamento, volume: totalSales, rentabilidade };
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

// ── Ranking metrics ─────────────────────────────────────
function buildRankings() {
  return Object.keys(SECTION_MAP).map(section => {
    const group = mockProductGroups.find(g => SECTION_MAP[section].includes(g.id));
    if (!group) return { section, faturamento: 0, volume: 0, margem: 0 };
    const totalSales = group.products.reduce((s, p) => s + p.sales, 0);
    const avgMargin = group.products.reduce((s, p) => s + p.margin, 0) / group.products.length;
    const avgPrice = group.products.reduce((s, p) => s + p.price, 0) / group.products.length;
    return {
      section,
      faturamento: Math.round(totalSales * avgPrice / 100),
      volume: totalSales,
      margem: Math.round(avgMargin * 100),
    };
  });
}

const shortName = (name: string) => name.split(" ").slice(0, 3).join(" ");

// ── Component ───────────────────────────────────────────
export default function WeeklyComparison() {
  const [selectedDay, setSelectedDay] = useState<string>("Sex");
  const { approveProduct, isApproved } = useApprovals();
  const { addToSimulator, isInSimulator } = useSimulator();
  const { toast } = useToast();
  const navigate = useNavigate();

  const allStats = useMemo(() => buildProductStats(), []);
  const sectionAreaData = useMemo(() => buildSectionAreaData(), []);
  const dayBarData = useMemo(() => buildDayBarData(), []);
  const rankings = useMemo(() => buildRankings(), []);
  const dayHighlights = useMemo(() => getDayHighlights(allStats, selectedDay), [allStats, selectedDay]);

  const sortedByFat = [...rankings].sort((a, b) => b.faturamento - a.faturamento);
  const sortedByVol = [...rankings].sort((a, b) => b.volume - a.volume);
  const sortedByMarg = [...rankings].sort((a, b) => b.margem - a.margem);

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

  return (
    <div className="space-y-6">
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
            { icon: Flame, label: `${allStats.length} Produtos`, color: "text-orange-500" },
            { icon: DollarSign, label: `${Math.round(allStats.reduce((a, s) => a + s.avgMargin, 0) / (allStats.length || 1) * 100)}% Margem`, color: "text-green-600" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-3 py-1.5 text-sm font-medium">
              <Icon className={cn("h-4 w-4", color)} />
              <span className="text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 1: Area Chart + Rankings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Faturamento · Volume · Rentabilidade por Seção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
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
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="faturamento" name="Faturamento (R$ 00)" stroke="hsl(var(--chart-1))" fill="url(#gFat)" strokeWidth={2} />
                <Area type="monotone" dataKey="rentabilidade" name="Rentabilidade (R$ 00)" stroke="hsl(var(--chart-2))" fill="url(#gRent)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rankings */}
        <div className="space-y-3">
          {[
            { title: "Faturamento", data: sortedByFat, key: "faturamento" as const, prefix: "R$", icon: DollarSign, color: "text-blue-600" },
            { title: "Volume", data: sortedByVol, key: "volume" as const, prefix: "", icon: TrendingUp, color: "text-green-600" },
            { title: "Margem", data: sortedByMarg, key: "margem" as const, prefix: "", suffix: "%", icon: Award, color: "text-purple-600" },
          ].map(({ title, data, key, prefix, suffix, icon: Icon, color }) => (
            <Card key={title}>
              <CardHeader className="pb-1 pt-3 px-4">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Icon className={cn("h-3.5 w-3.5", color)} />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-3 space-y-1">
                {data.slice(0, 4).map((r, i) => (
                  <div key={r.section} className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}º</span>
                    <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${(r[key] / data[0][key]) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-foreground w-14 text-right truncate">{r.section}</span>
                    <span className="text-[10px] text-muted-foreground w-12 text-right">
                      {prefix}{r[key].toLocaleString("pt-BR")}{suffix || ""}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Section 2: Day Grid ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
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
                    "flex flex-col p-3 text-left transition-colors hover:bg-muted/50 min-h-[160px]",
                    isSelected && "bg-primary/5"
                  )}
                >
                  {/* Day header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-sm font-bold", isSelected ? "text-primary" : "text-foreground")}>
                      {day}
                    </span>
                    {(day === "Sáb" || day === "Dom") && (
                      <Flame className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                  <p className="text-[9px] text-muted-foreground leading-tight mb-2">{DAY_CONTEXTS[day]}</p>

                  {/* Revenue indicator */}
                  <div className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded mb-2",
                    mult >= 1.3 ? "bg-green-100 text-green-700" :
                    mult >= 1.0 ? "bg-blue-100 text-blue-700" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {mult >= 1.3 ? <ChevronUp className="h-2.5 w-2.5 inline" /> : mult < 0.75 ? <ChevronDown className="h-2.5 w-2.5 inline" /> : null}
                    {(mult * 100).toFixed(0)}%
                  </div>

                  {/* Boosted sections */}
                  <div className="space-y-1">
                    {boosted.slice(0, 3).map(section => (
                      <div
                        key={section}
                        className={cn("text-[9px] px-1.5 py-0.5 rounded border font-medium truncate", SECTION_BG[section] || "bg-muted")}
                      >
                        {section}
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="mt-2 w-full h-0.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: Selected Day Products ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-base font-bold text-foreground">
            Produtos em Destaque — {selectedDay}
          </h2>
          <Badge variant="secondary">{DAY_CONTEXTS[selectedDay]}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {dayHighlights.map(({ section, items }) => (
            <Card key={section} className="overflow-hidden">
              <CardHeader className="pb-2 pt-3 px-4 bg-muted/30 border-b border-border">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: SECTION_COLORS[section] }} />
                  {section}
                  <Badge variant="secondary" className="text-[10px] ml-auto">destaque {selectedDay}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {items.map((stat, rank) => {
                  const already = isApproved(stat.product.id);
                  const inSim = isInSimulator(stat.product.id);
                  return (
                    <div
                      key={stat.product.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-2.5 border",
                        rank === 0 ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-transparent"
                      )}
                    >
                      <div className="w-5 flex-shrink-0 text-center">
                        {rank === 0
                          ? <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-400 mx-auto" />
                          : <span className="text-[10px] font-bold text-muted-foreground">{rank + 1}º</span>}
                      </div>

                      <img
                        src={stat.product.imageUrl}
                        alt={stat.product.name}
                        className="w-9 h-9 object-contain flex-shrink-0 rounded"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{shortName(stat.product.name)}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[10px] text-muted-foreground">{stat.appearances}x tabloides</span>
                          <span className="text-[10px] font-medium text-green-600">{Math.round(stat.avgMargin * 100)}% mg</span>
                          <span className="text-[10px] font-medium text-primary">score {stat.score}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-xs font-bold text-foreground">R$ {stat.product.price.toFixed(2)}</span>
                        <button
                          onClick={() => handleSuggest(stat.product)}
                          disabled={already}
                          className={cn(
                            "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors font-medium",
                            already
                              ? "border-green-400 text-green-600 bg-green-50 cursor-default"
                              : "border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                          )}
                        >
                          {already ? "✓ Tabloide" : <><Send className="h-2.5 w-2.5" /> Sugerir</>}
                        </button>
                        <button
                          onClick={() => handleAddToSimulator(stat.product)}
                          disabled={inSim}
                          className={cn(
                            "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors font-medium",
                            inSim
                              ? "border-violet-300 text-violet-600 bg-violet-50 cursor-default"
                              : "border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white"
                          )}
                        >
                          {inSim ? "✓ Simulador" : <><Zap className="h-2.5 w-2.5" /> Simular</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}

          {dayHighlights.length === 0 && (
            <div className="col-span-full bg-card rounded-xl border border-border p-10 text-center">
              <Calendar className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Nenhum destaque disponível para {selectedDay}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Section 4: Stacked bar by day ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Participação por Seção ao Longo da Semana (R$)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dayBarData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {Object.keys(SECTION_MAP).map((section, i) => (
                <Bar key={section} dataKey={section} stackId="a" fill={SECTION_COLORS[section]} radius={i === Object.keys(SECTION_MAP).length - 1 ? [4, 4, 0, 0] : undefined} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
