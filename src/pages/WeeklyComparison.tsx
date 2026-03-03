import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockProducts } from "@/data/mockData";
import { TrendingUp, Calendar, BarChart3, Lightbulb, Star, Send } from "lucide-react";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const SECTIONS: Record<string, string[]> = {
  "Cervejas": ["1", "2", "3"],
  "Refrigerantes": ["4", "5"],
  "Laticínios": ["6"],
  "Energéticos": ["7"],
};

function generateWeeklyData(productId: string, baseSales: number) {
  const seed = productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return DAYS.map((day, i) => {
    const variation = ((seed * (i + 3)) % 40) - 20;
    const weekend = i >= 5 ? 1.35 : 1;
    return {
      day,
      vendas: Math.round(baseSales * weekend * (1 + variation / 100) / 7),
      score: Math.min(100, Math.max(40, 60 + ((seed * (i + 1)) % 35))),
    };
  });
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const PRODUCT_COLORS: Record<string, string> = {};
mockProducts.forEach((p, i) => {
  PRODUCT_COLORS[p.id] = COLORS[i % COLORS.length];
});

const SECTION_COLORS: Record<string, string> = {
  "Cervejas": "hsl(var(--chart-1))",
  "Refrigerantes": "hsl(var(--chart-2))",
  "Laticínios": "hsl(var(--chart-3))",
  "Energéticos": "hsl(var(--chart-4))",
};

const SECTION_KEYWORDS: Record<string, string[]> = {
  "Cervejas": ["cerv", "beer", "spaten", "brahma", "chopp"],
  "Refrigerantes": ["refrig", "coca", "guaraná", "guarana", "pepsi", "soda"],
  "Laticínios": ["leite", "iogurt", "queijo", "manteig", "requeijao"],
  "Energéticos": ["energy", "red bull", "redbull", "monster", "energetico"],
};

function getSectionForProduct(p: Product): string {
  const name = p.name.toLowerCase();
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    if (keywords.some(k => name.includes(k))) return section;
  }
  return "Outros";
}

function getProductsForSection(sectionName: string): Product[] {
  const matching = mockProducts.filter(p => getSectionForProduct(p) === sectionName);
  if (matching.length > 0) return matching;
  // fallback: distribute evenly
  const allSections = Object.keys(SECTIONS);
  const sIdx = allSections.indexOf(sectionName);
  const chunk = Math.ceil(mockProducts.length / allSections.length);
  const slice = mockProducts.slice(sIdx * chunk, (sIdx + 1) * chunk);
  return slice.length > 0 ? slice : [mockProducts[sIdx % mockProducts.length]];
}

// Returns top N products for a section on a specific day
function getTopForSection(sectionName: string, dayIdx: number, n = 2): { product: Product; vendas: number }[] {
  return getProductsForSection(sectionName)
    .map(p => ({ product: p, vendas: generateWeeklyData(p.id, p.sales)[dayIdx].vendas }))
    .sort((a, b) => b.vendas - a.vendas)
    .slice(0, n);
}

// Best product per section by weekly average
function getBestPerSectionWeekly(): { section: string; product: Product; avgVendas: number }[] {
  return Object.keys(SECTIONS).map(section => {
    const sectionProducts = getProductsForSection(section);
    const best = sectionProducts
      .map(p => {
        const weekly = generateWeeklyData(p.id, p.sales);
        const avg = Math.round(weekly.reduce((a, d) => a + d.vendas, 0) / 7);
        return { product: p, avgVendas: avg };
      })
      .sort((a, b) => b.avgVendas - a.avgVendas)[0];
    return { section, ...best };
  });
}

const shortName = (name: string) => name.split(" ").slice(0, 2).join(" ");

export default function WeeklyComparison() {
  const [selected, setSelected] = useState<string[]>(
    mockProducts.slice(0, 3).map((p) => p.id)
  );
  const [metric, setMetric] = useState<"vendas" | "score">("vendas");
  const { approveProduct, isApproved } = useApprovals();
  const { toast } = useToast();

  const toggleProduct = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const selectedProducts = mockProducts.filter((p) => selected.includes(p.id));

  const combinedData = DAYS.map((day, i) => {
    const row: Record<string, any> = { day };
    selectedProducts.forEach((p) => {
      const weekly = generateWeeklyData(p.id, p.sales);
      row[p.id] = weekly[i][metric];
    });
    return row;
  });

  const bestDays = selectedProducts.map((p) => {
    const weekly = generateWeeklyData(p.id, p.sales);
    const best = weekly.reduce((a, b) => (a[metric] > b[metric] ? a : b));
    const total = weekly.reduce((a, b) => a + b[metric], 0);
    const avg = Math.round(total / 7);
    return { product: p, bestDay: best.day, bestValue: best[metric], avg };
  });

  const smartSuggestions = getBestPerSectionWeekly();

  const handleSuggest = (product: Product) => {
    approveProduct(product);
    toast({
      title: "Produto sugerido para tabloide!",
      description: `${product.name} foi adicionado ao fluxo de aprovação.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Comparativo Semanal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Desempenho e sugestões de produtos por dia da semana
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={metric === "vendas" ? "default" : "outline"} onClick={() => setMetric("vendas")}>
            <BarChart3 className="h-4 w-4 mr-1" /> Vendas
          </Button>
          <Button size="sm" variant={metric === "score" ? "default" : "outline"} onClick={() => setMetric("score")}>
            <TrendingUp className="h-4 w-4 mr-1" /> Score IA
          </Button>
        </div>
      </div>

      <Tabs defaultValue="comparativo">
        <TabsList className="mb-2">
          <TabsTrigger value="comparativo"><BarChart3 className="h-4 w-4 mr-1" />Comparativo</TabsTrigger>
          <TabsTrigger value="sugestoes"><Lightbulb className="h-4 w-4 mr-1" />Sugestões por Dia</TabsTrigger>
        </TabsList>

        {/* ======= ABA COMPARATIVO ======= */}
        <TabsContent value="comparativo" className="space-y-6">
          {/* Seleção de produtos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Selecione até 5 produtos para comparar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockProducts.map((p) => {
                  const active = selected.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleProduct(p.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                        active
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border bg-background text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <img src={p.imageUrl} alt={p.name} className="w-6 h-6 object-contain rounded"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      <span>{shortName(p.name)}</span>
                      {active && <span className="w-2 h-2 rounded-full" style={{ background: PRODUCT_COLORS[p.id] }} />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Cards melhor dia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {bestDays.map(({ product, bestDay, bestValue, avg }) => (
              <Card key={product.id} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: PRODUCT_COLORS[product.id] }} />
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{shortName(product.name)}</p>
                      <p className="text-xs text-muted-foreground">Melhor dia</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs font-bold" style={{ color: PRODUCT_COLORS[product.id] }}>
                      {bestDay}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{bestValue}</p>
                      <p className="text-xs text-muted-foreground">{metric === "vendas" ? "un." : "pts"}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Média: <span className="font-medium text-foreground">{avg}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráfico de barras */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {metric === "vendas" ? "Vendas por Dia da Semana" : "Score IA por Dia da Semana"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={combinedData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  {selectedProducts.map((p) => (
                    <Bar key={p.id} dataKey={p.id} name={shortName(p.name)} fill={PRODUCT_COLORS[p.id]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de linha */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tendência ao Longo da Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  {selectedProducts.map((p) => (
                    <Line key={p.id} type="monotone" dataKey={p.id} name={shortName(p.name)}
                      stroke={PRODUCT_COLORS[p.id]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar */}
          {selectedProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição Semanal (Radar)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProducts.map((p) => {
                    const weekly = generateWeeklyData(p.id, p.sales);
                    const radarRows = weekly.map((d) => ({ day: d.day, value: d[metric] }));
                    return (
                      <div key={p.id} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          <p className="text-xs font-medium text-foreground">{shortName(p.name)}</p>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                          <RadarChart data={radarRows}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                            <PolarRadiusAxis tick={false} axisLine={false} />
                            <Radar name={shortName(p.name)} dataKey="value"
                              stroke={PRODUCT_COLORS[p.id]} fill={PRODUCT_COLORS[p.id]} fillOpacity={0.3} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ======= ABA SUGESTÕES POR DIA ======= */}
        <TabsContent value="sugestoes" className="space-y-6">

          {/* Sugestões Inteligentes — melhores da semana por seção */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                Sugestões Inteligentes — Melhores da Semana por Seção
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Produto com maior média de vendas semanal por seção. Clique para sugerir para o tabloide de aprovação.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {smartSuggestions.map(({ section, product, avgVendas }) => {
                  const already = isApproved(product.id);
                  return (
                    <div
                      key={section}
                      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm"
                      style={{ borderTop: `3px solid ${SECTION_COLORS[section]}` }}
                    >
                      <div className="flex items-center gap-2">
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <div>
                          <p className="text-[11px] font-bold text-muted-foreground uppercase">{section}</p>
                          <p className="text-xs font-semibold text-foreground leading-tight">{shortName(product.name)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Média semanal</span>
                        <span className="font-bold text-foreground">{avgVendas} un.</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full text-xs h-7"
                        variant={already ? "secondary" : "default"}
                        disabled={already}
                        onClick={() => handleSuggest(product)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        {already ? "Já no tabloide" : "Sugerir para Tabloide"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top produtos por dia da semana */}
          <div className="space-y-4">
            {DAYS.map((day, dayIdx) => (
              <Card key={day}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {day} — Melhores por Seção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.keys(SECTIONS).map(section => {
                      const top = getTopForSection(section, dayIdx, 2);
                      return (
                        <div key={section} className="rounded-lg border border-border bg-muted/30 p-2">
                          <p
                            className="text-[10px] font-bold uppercase mb-2 pb-1 border-b border-border"
                            style={{ color: SECTION_COLORS[section] }}
                          >
                            {section}
                          </p>
                          <div className="space-y-2">
                            {top.map(({ product, vendas }, rank) => {
                              const already = isApproved(product.id);
                              return (
                                <div key={product.id} className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold w-4 text-center rounded-full ${rank === 0 ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                                    {rank + 1}
                                  </span>
                                  <img src={product.imageUrl} alt={product.name} className="w-7 h-7 object-contain flex-shrink-0"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-medium text-foreground truncate">{shortName(product.name)}</p>
                                    <p className="text-[10px] text-muted-foreground">{vendas} un.</p>
                                  </div>
                                  <button
                                    onClick={() => handleSuggest(product)}
                                    disabled={already}
                                    title={already ? "Já no tabloide" : "Sugerir para tabloide"}
                                    className={`flex-shrink-0 p-1 rounded-full transition-colors ${
                                      already
                                        ? 'text-green-500 cursor-default'
                                        : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                                    }`}
                                  >
                                    {already
                                      ? <CheckIcon />
                                      : <Send className="h-3 w-3" />
                                    }
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}
