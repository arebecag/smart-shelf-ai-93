import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/mockData";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

// Gera dados simulados de vendas por dia da semana para cada produto
function generateWeeklyData(productId: string, baseSales: number) {
  const seed = productId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return DAYS.map((day, i) => {
    const variation = ((seed * (i + 3)) % 40) - 20; // -20 a +20%
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

export default function WeeklyComparison() {
  const [selected, setSelected] = useState<string[]>(
    mockProducts.slice(0, 3).map((p) => p.id)
  );
  const [metric, setMetric] = useState<"vendas" | "score">("vendas");

  const toggleProduct = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev
    );
  };

  const selectedProducts = mockProducts.filter((p) => selected.includes(p.id));

  // Junta dados de todos os produtos selecionados por dia
  const combinedData = DAYS.map((day, i) => {
    const row: Record<string, any> = { day };
    selectedProducts.forEach((p) => {
      const weekly = generateWeeklyData(p.id, p.sales);
      row[p.id] = weekly[i][metric];
    });
    return row;
  });

  // Dados para radar (média semanal por produto)
  const radarData = DAYS.map((day, i) => {
    const row: Record<string, any> = { day };
    selectedProducts.forEach((p) => {
      const weekly = generateWeeklyData(p.id, p.sales);
      row[p.id] = weekly[i][metric];
    });
    return row;
  });

  // Melhor dia por produto
  const bestDays = selectedProducts.map((p) => {
    const weekly = generateWeeklyData(p.id, p.sales);
    const best = weekly.reduce((a, b) => (a[metric] > b[metric] ? a : b));
    const total = weekly.reduce((a, b) => a + b[metric], 0);
    const avg = Math.round(total / 7);
    return { product: p, bestDay: best.day, bestValue: best[metric], avg };
  });

  const shortName = (name: string) =>
    name.split(" ").slice(0, 2).join(" ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Comparativo Semanal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Desempenho dos produtos por dia da semana
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={metric === "vendas" ? "default" : "outline"}
            onClick={() => setMetric("vendas")}
          >
            <BarChart3 className="h-4 w-4 mr-1" /> Vendas
          </Button>
          <Button
            size="sm"
            variant={metric === "score" ? "default" : "outline"}
            onClick={() => setMetric("score")}
          >
            <TrendingUp className="h-4 w-4 mr-1" /> Score IA
          </Button>
        </div>
      </div>

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
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-6 h-6 object-contain rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <span>{shortName(p.name)}</span>
                  {active && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: PRODUCT_COLORS[p.id] }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Cards de melhor dia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {bestDays.map(({ product, bestDay, bestValue, avg }) => (
          <Card key={product.id} className="relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: PRODUCT_COLORS[product.id] }}
            />
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {shortName(product.name)}
                  </p>
                  <p className="text-xs text-muted-foreground">Melhor dia</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="text-xs font-bold"
                  style={{ color: PRODUCT_COLORS[product.id] }}
                >
                  {bestDay}
                </Badge>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{bestValue}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric === "vendas" ? "un." : "pts"}
                  </p>
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
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {selectedProducts.map((p) => (
                <Bar
                  key={p.id}
                  dataKey={p.id}
                  name={shortName(p.name)}
                  fill={PRODUCT_COLORS[p.id]}
                  radius={[4, 4, 0, 0]}
                />
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
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              {selectedProducts.map((p) => (
                <Line
                  key={p.id}
                  type="monotone"
                  dataKey={p.id}
                  name={shortName(p.name)}
                  stroke={PRODUCT_COLORS[p.id]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar por produto */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição Semanal (Radar)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProducts.map((p) => {
                const weekly = generateWeeklyData(p.id, p.sales);
                const radarRows = weekly.map((d) => ({
                  day: d.day,
                  value: d[metric],
                }));
                return (
                  <div key={p.id} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <p className="text-xs font-medium text-foreground">
                        {shortName(p.name)}
                      </p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={radarRows}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis
                          dataKey="day"
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <PolarRadiusAxis tick={false} axisLine={false} />
                        <Radar
                          name={shortName(p.name)}
                          dataKey="value"
                          stroke={PRODUCT_COLORS[p.id]}
                          fill={PRODUCT_COLORS[p.id]}
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
