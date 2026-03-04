import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, LineChart, Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockHistory, mockProductGroups } from "@/data/mockData";
import {
  TrendingUp, TrendingDown, Calendar, BarChart3, Lightbulb,
  Star, Send, Flame, DollarSign, Zap, History, Award, ChevronRight
} from "lucide-react";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

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
  "Seg": "Reposição pós-fds • foco em básicos",
  "Ter": "Giro médio • boa margem",
  "Qua": "Pico mid-week • impulso promoções",
  "Qui": "Antecipa fds • destaque premium",
  "Sex": "Alta demanda • bebidas e frios",
  "Sáb": "Pico de vendas • tudo vende",
  "Dom": "Família em casa • laticínios e bebidas",
};

// Seção mais adequada por dia (baseado em padrão de consumo real)
const DAY_SECTION_BOOST: Record<string, string[]> = {
  "Seg": ["Laticínios", "Padaria"],
  "Ter": ["Refrigerantes", "Água"],
  "Qua": ["Cervejas", "Energéticos"],
  "Qui": ["Açougue", "Laticínios"],
  "Sex": ["Cervejas", "Refrigerantes", "Açougue"],
  "Sáb": ["Cervejas", "Refrigerantes", "Açougue", "Energéticos"],
  "Dom": ["Laticínios", "Padaria", "Refrigerantes"],
};

// ── Lógica de análise histórica ───────────────────────────

interface ProductStats {
  product: Product;
  section: string;
  appearances: number;           // quantas vezes apareceu no histórico
  avgMargin: number;
  totalSales: number;
  campaigns: string[];
  lastSeen: string;
  score: number;                 // score composto calculado
}

function getSectionForGroupId(groupId: string): string {
  for (const [section, ids] of Object.entries(SECTION_MAP)) {
    if (ids.includes(groupId)) return section;
  }
  return "Outros";
}

function buildProductStats(): ProductStats[] {
  // Mapa: productId → acumuladores
  const statsMap: Record<string, {
    product: Product; section: string; appearances: number;
    marginSum: number; campaigns: string[]; dates: string[];
  }> = {};

  // Percorre histórico
  for (const histItem of mockHistory) {
    for (const product of histItem.products) {
      if (!statsMap[product.id]) {
        // Descobre seção pelo groupId
        const group = mockProductGroups.find(g => g.products.some(p => p.id === product.id));
        const section = group ? getSectionForGroupId(group.id) : "Outros";
        statsMap[product.id] = {
          product, section, appearances: 0,
          marginSum: 0, campaigns: [], dates: [],
        };
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
    // Score composto: frequência 30% + margem 30% + vendas base 20% + crescimento 20%
    const freqScore  = Math.min(1, s.appearances / mockHistory.length) * 30;
    const marginScore = Math.min(1, avgMargin / 0.40) * 30;
    const salesScore  = Math.min(1, s.product.sales / 4000) * 20;
    const growthScore = Math.min(1, s.product.growth / 0.30) * 20;
    const score = Math.round(freqScore + marginScore + salesScore + growthScore);
    return {
      product: s.product, section: s.section,
      appearances: s.appearances, avgMargin,
      totalSales: s.product.sales, campaigns: s.campaigns,
      lastSeen, score,
    };
  }).sort((a, b) => b.score - a.score);
}

// Top N por seção
function topBySection(stats: ProductStats[], section: string, n = 3): ProductStats[] {
  return stats.filter(s => s.section === section).slice(0, n);
}

// Produto destaque do dia: cruza boosted sections com melhor score
function getDayHighlights(stats: ProductStats[], day: string, perSection = 2) {
  const boosted = DAY_SECTION_BOOST[day] || [];
  const result: { section: string; items: ProductStats[] }[] = [];
  for (const section of boosted) {
    const items = stats
      .filter(s => s.section === section)
      .sort((a, b) => {
        // Day-specific boost: sales + growth weighted by day pattern
        const isWeekend = day === "Sáb" || day === "Dom";
        const salesW = isWeekend ? 1.4 : 1;
        return (b.totalSales * salesW + b.score * 2) - (a.totalSales * salesW + a.score * 2);
      })
      .slice(0, perSection);
    if (items.length > 0) result.push({ section, items });
  }
  return result;
}

// Histórico semanal para gráfico — agrega vendas por seção ao longo dos tabloides
function buildWeeklyChartData() {
  return mockHistory.map(h => {
    const row: Record<string, any> = {
      name: h.name.split(" ").slice(0, 2).join(" "),
      score: h.avgScore,
      margem: Math.round(h.avgMargin * 100),
      produtos: h.products.length,
    };
    for (const section of Object.keys(SECTION_MAP)) {
      const group = mockProductGroups.find(g =>
        SECTION_MAP[section].includes(g.id)
      );
      const count = group
        ? h.products.filter(p => group.products.some(gp => gp.id === p.id)).length
        : 0;
      row[section] = count;
    }
    return row;
  });
}

const shortName = (name: string) => name.split(" ").slice(0, 3).join(" ");

// ── Componente ────────────────────────────────────────────
export default function WeeklyComparison() {
  const [selectedDay, setSelectedDay] = useState<string>("Sex");
  const { approveProduct, isApproved } = useApprovals();
  const { toast } = useToast();

  const allStats = useMemo(() => buildProductStats(), []);
  const chartData = useMemo(() => buildWeeklyChartData(), []);
  const dayHighlights = useMemo(() => getDayHighlights(allStats, selectedDay), [allStats, selectedDay]);

  const handleSuggest = (product: Product) => {
    approveProduct(product);
    toast({
      title: "Produto sugerido para tabloide!",
      description: `${product.name} adicionado ao fluxo de aprovação.`,
    });
  };

  // Seções com pelo menos 1 produto no histórico
  const activeSections = Object.keys(SECTION_MAP).filter(
    s => allStats.some(st => st.section === s)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Comparativo Semanal
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Sugestões automáticas baseadas no histórico real de {mockHistory.length} tabloides
        </p>
      </div>

      {/* Resumo rápido do histórico */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><History className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xl font-bold">{mockHistory.length}</p>
              <p className="text-[11px] text-muted-foreground">Tabloides analisados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100"><Flame className="h-4 w-4 text-orange-500" /></div>
            <div>
              <p className="text-xl font-bold">{allStats.length}</p>
              <p className="text-[11px] text-muted-foreground">Produtos no histórico</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100"><DollarSign className="h-4 w-4 text-green-600" /></div>
            <div>
              <p className="text-xl font-bold">{Math.round(allStats.reduce((a, s) => a + s.avgMargin, 0) / (allStats.length || 1) * 100)}%</p>
              <p className="text-[11px] text-muted-foreground">Margem média histórica</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100"><Zap className="h-4 w-4 text-blue-600" /></div>
            <div>
              <p className="text-xl font-bold">{allStats[0]?.score ?? 0}</p>
              <p className="text-[11px] text-muted-foreground">Maior score composto</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sugestoes">
        <TabsList>
          <TabsTrigger value="sugestoes"><Lightbulb className="h-4 w-4 mr-1" />Sugestões por Dia</TabsTrigger>
          <TabsTrigger value="ranking"><Award className="h-4 w-4 mr-1" />Ranking por Seção</TabsTrigger>
          <TabsTrigger value="historico"><BarChart3 className="h-4 w-4 mr-1" />Evolução Histórica</TabsTrigger>
        </TabsList>

        {/* ── ABA: SUGESTÕES POR DIA ─────────────────────── */}
        <TabsContent value="sugestoes" className="space-y-5 mt-4">
          <p className="text-sm text-muted-foreground">
            Produtos com maior recorrência, margem e volume de vendas nos tabloides anteriores — priorizados conforme o padrão de consumo do dia.
          </p>

          {/* Seletor de dia */}
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  selectedDay === day
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <span>{day}</span>
                {(day === "Sáb" || day === "Dom") && (
                  <span className="ml-1.5 text-[10px] opacity-70">🔥</span>
                )}
              </button>
            ))}
          </div>

          {/* Contexto do dia */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 flex items-center gap-3">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <div>
              <span className="font-semibold text-sm text-foreground">{selectedDay} — </span>
              <span className="text-sm text-muted-foreground">{DAY_CONTEXTS[selectedDay]}</span>
            </div>
          </div>

          {/* Seções com destaque para o dia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dayHighlights.map(({ section, items }) => (
              <Card key={section} className="overflow-hidden">
                <CardHeader className="pb-2 pt-3 px-4 bg-muted/20 border-b border-border">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: SECTION_COLORS[section] }} />
                    {section}
                    <Badge variant="secondary" className="text-[10px] ml-auto">destaque {selectedDay}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {items.map((stat, rank) => {
                    const already = isApproved(stat.product.id);
                    return (
                      <div
                        key={stat.product.id}
                        className={`flex items-center gap-3 rounded-lg p-2.5 ${rank === 0 ? "bg-primary/5 border border-primary/15" : "bg-muted/20"}`}
                      >
                        {/* Rank */}
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
                            <span className="text-[10px] text-muted-foreground">
                              {stat.appearances}x em tabloides
                            </span>
                            <span className="text-[10px] font-medium text-green-600">
                              {Math.round(stat.avgMargin * 100)}% mg
                            </span>
                            <span className="text-[10px] font-medium text-primary">
                              score {stat.score}
                            </span>
                          </div>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {stat.campaigns.map(c => (
                              <span key={c} className="text-[9px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">{c}</span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-xs font-bold text-foreground">R$ {stat.product.price.toFixed(2)}</span>
                          <button
                            onClick={() => handleSuggest(stat.product)}
                            disabled={already}
                            title={already ? "Já no tabloide" : "Sugerir para tabloide"}
                            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors font-medium ${
                              already
                                ? "border-green-400 text-green-600 bg-green-50 cursor-default"
                                : "border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                            }`}
                          >
                            {already ? "✓ No tabloide" : <><Send className="h-2.5 w-2.5" /> Sugerir</>}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          {dayHighlights.length === 0 && (
            <div className="bg-card rounded-xl border border-border p-10 text-center">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">Nenhum destaque mapeado para este dia ainda.</p>
            </div>
          )}
        </TabsContent>

        {/* ── ABA: RANKING POR SEÇÃO ─────────────────────── */}
        <TabsContent value="ranking" className="space-y-5 mt-4">
          <p className="text-sm text-muted-foreground">
            Produtos mais recorrentes e rentáveis por seção — calculados a partir dos tabloides históricos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSections.map(section => {
              const top = topBySection(allStats, section, 4);
              if (!top.length) return null;
              return (
                <Card key={section}>
                  <CardHeader className="pb-2 pt-3 px-4 border-b border-border">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: SECTION_COLORS[section] }} />
                      {section}
                      <span className="ml-auto text-[11px] text-muted-foreground font-normal">{top.length} produtos</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {top.map((stat, rank) => {
                      const already = isApproved(stat.product.id);
                      const scoreColor = stat.score >= 70 ? "text-green-600" : stat.score >= 50 ? "text-yellow-600" : "text-muted-foreground";
                      return (
                        <div key={stat.product.id} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                          <span className={`text-xs font-bold w-5 text-center ${rank === 0 ? "text-yellow-500" : "text-muted-foreground"}`}>
                            {rank + 1}
                          </span>
                          <img
                            src={stat.product.imageUrl}
                            alt={stat.product.name}
                            className="w-8 h-8 object-contain rounded flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{shortName(stat.product.name)}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {stat.appearances}x · {Math.round(stat.avgMargin * 100)}%mg · R$ {stat.product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className={`text-xs font-bold ${scoreColor}`}>{stat.score}pts</div>
                            <button
                              onClick={() => handleSuggest(stat.product)}
                              disabled={already}
                              className={`p-1 rounded-full transition-colors ${
                                already ? "text-green-500 cursor-default" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                              }`}
                            >
                              {already
                                ? <span className="text-[10px]">✓</span>
                                : <Send className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── ABA: EVOLUÇÃO HISTÓRICA ────────────────────── */}
        <TabsContent value="historico" className="space-y-5 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Score e Margem por Tabloide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="score" name="Score Médio" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="margem" name="Margem %" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Produtos por Seção em cada Tabloide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  {activeSections.map((section, i) => (
                    <Bar key={section} dataKey={section} name={section} fill={SECTION_COLORS[section]} radius={[3, 3, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabela de histórico resumida */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tabloides Analisados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 border-b border-border">
                    <tr>
                      <th className="text-left p-3 font-medium text-muted-foreground">Tabloide</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Campanha</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Produtos</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Score</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Margem</th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHistory.map((h, idx) => (
                      <tr key={h.id} className={idx % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <td className="p-3 font-medium text-foreground">{h.name}</td>
                        <td className="p-3 text-center text-muted-foreground">{h.campaign}</td>
                        <td className="p-3 text-center">{h.products.length}</td>
                        <td className="p-3 text-center font-bold text-green-600">{h.avgScore}</td>
                        <td className="p-3 text-center">{Math.round(h.avgMargin * 100)}%</td>
                        <td className="p-3 text-center">
                          <Badge variant={h.status === "published" ? "default" : "secondary"}
                            className={h.status === "published" ? "bg-green-100 text-green-800 text-[10px]" : "text-[10px]"}>
                            {h.status === "published" ? "Publicado" : "Rascunho"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
