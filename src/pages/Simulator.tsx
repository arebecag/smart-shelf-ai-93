import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { mockProductGroups } from "@/data/mockData";
import {
  Search, Zap, TrendingUp, TrendingDown, DollarSign, BarChart3,
  ArrowRight, AlertTriangle, CheckCircle2, Users, Send, Trash2,
  RefreshCw, ShoppingBag, ChevronRight, Sparkles, Brain, Target
} from "lucide-react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Legend
} from "recharts";

// flatten all products
const allProducts = mockProductGroups.flatMap(g => g.products);

function calcMetrics(product: Product, newPrice: number) {
  const cost = product.price * (1 - product.margin);
  const newMargin = newPrice > 0 ? (newPrice - cost) / newPrice : 0;
  const newRentability = newMargin * 0.92;
  const elasticity = -1.4;
  const pctChange = product.price > 0 ? (newPrice - product.price) / product.price : 0;
  const salesChange = elasticity * pctChange;
  const newSales = product.sales * (1 + salesChange);
  const newRevenue = newPrice * newSales;
  const oldRevenue = product.price * product.sales;
  const revenueChange = oldRevenue > 0 ? (newRevenue - oldRevenue) / oldRevenue : 0;
  return { cost, newMargin, newRentability, salesChange, newSales, newRevenue, oldRevenue, revenueChange };
}

// build elasticity curve: price points from -30% to +30%
function buildElasticityCurve(product: Product) {
  return Array.from({ length: 13 }, (_, i) => {
    const pct = (i - 6) * 0.05; // -30% .. +30% in 5% steps
    const price = product.price * (1 + pct);
    const cost = product.price * (1 - product.margin);
    const margin = price > 0 ? (price - cost) / price : 0;
    const salesChg = -1.4 * pct;
    const sales = product.sales * (1 + salesChg);
    const revenue = price * sales;
    return {
      pct: `${pct >= 0 ? "+" : ""}${(pct * 100).toFixed(0)}%`,
      price: +price.toFixed(2),
      margem: +(margin * 100).toFixed(1),
      vendas: +sales.toFixed(0),
      faturamento: +revenue.toFixed(2),
    };
  });
}

// find substitute products in same section, different group
function findSubstitutes(product: Product) {
  const productGroup = mockProductGroups.find(g => g.products.some(p => p.id === product.id));
  if (!productGroup) return [];
  const targetGroupId = parseInt(productGroup.id);
  const sectionPrefix = Math.floor(targetGroupId / 10) * 10; // e.g. group 82 → section 80-89

  return mockProductGroups
    .filter(g => {
      const gId = parseInt(g.id);
      return (
        gId !== targetGroupId &&
        gId >= sectionPrefix &&
        gId < sectionPrefix + 10
      );
    })
    .flatMap(g => g.products)
    .filter(p => {
      // Similar margin (±10pp), similar price (±40%), similar sales (±60%)
      const marginDiff = Math.abs(p.margin - product.margin);
      const priceDiff = Math.abs(p.price - product.price) / product.price;
      const salesDiff = Math.abs(p.sales - product.sales) / product.sales;
      return marginDiff < 0.10 && priceDiff < 0.40 && salesDiff < 0.60;
    })
    .sort((a, b) => Math.abs(a.margin - product.margin) - Math.abs(b.margin - product.margin))
    .slice(0, 5);
}

// cross-sell: products from complementary sections
const CROSSSELL_MAP: Record<string, string[]> = {
  "80": ["81", "91"],   // cervejas → refrigerantes, petiscos
  "81": ["80", "91"],   // refri → cervejas, padaria
  "82": ["91", "83"],   // laticiníos → padaria, frios
  "83": ["82", "91"],   // frios → laticinios, padaria
  "88": ["80", "81"],   // energéticos → cervejas, refri
  "90": ["91", "92"],   // açougue → padaria, condimentos
  "91": ["82", "90"],   // padaria → laticínios, açougue
  "85": ["80", "81"],   // água → cervejas, refri
};

function findCrossSell(product: Product): Product[] {
  const group = mockProductGroups.find(g => g.products.some(p => p.id === product.id));
  if (!group) return [];
  const crossIds = CROSSSELL_MAP[group.id] || [];
  return mockProductGroups
    .filter(g => crossIds.includes(g.id))
    .flatMap(g => g.products.slice(0, 3));
}



function buildSmartUpselling(product: Product, inQueueIds: Set<string>) {
  return findCrossSell(product)
    .filter(p => p.id !== product.id && !inQueueIds.has(p.id))
    .slice(0, 4)
    .map(item => ({
      ...item,
      uplift: Math.max(2, Math.round((item.margin * 100) / 2 + item.sales / 80)),
    }));
}

function findBasketSimilarity(product: Product) {
  return mockProductGroups
    .flatMap(g => g.products)
    .filter(p => p.id !== product.id)
    .map(candidate => {
      const marginScore = 1 - Math.min(1, Math.abs(candidate.margin - product.margin) / 0.2);
      const priceScore = 1 - Math.min(1, Math.abs(candidate.price - product.price) / Math.max(product.price, 1));
      const salesScore = 1 - Math.min(1, Math.abs(candidate.sales - product.sales) / Math.max(product.sales, 1));
      const score = Math.round((marginScore * 0.35 + priceScore * 0.4 + salesScore * 0.25) * 100);
      return { product: candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
export default function Simulator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [proposedPrice, setProposedPrice] = useState("");
  const [notes, setNotes] = useState("");
  const { queue, addToSimulator, removeFromSimulator, submitForApproval, updateProposedPrice } = useSimulator();
  const { approveProduct } = useApprovals();
  const { toast } = useToast();

  // select first from queue if any
  useEffect(() => {
    if (queue.length > 0 && !selectedProduct) {
      setSelectedProduct(queue[0].product);
      setProposedPrice(queue[0].proposedPrice.toFixed(2));
    }
  }, [queue]);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return allProducts.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery]);

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setProposedPrice(p.price.toFixed(2));
    setSearchQuery("");
    if (!queue.find(e => e.product.id === p.id)) {
      addToSimulator(p);
    }
  };

  const parsedPrice = parseFloat(proposedPrice.replace(",", ".")) || (selectedProduct?.price ?? 0);
  const metrics = useMemo(
    () => selectedProduct ? calcMetrics(selectedProduct, parsedPrice) : null,
    [selectedProduct, parsedPrice]
  );
  const elasticityCurve = useMemo(
    () => selectedProduct ? buildElasticityCurve(selectedProduct) : [],
    [selectedProduct]
  );
  const substitutes = useMemo(
    () => selectedProduct ? findSubstitutes(selectedProduct) : [],
    [selectedProduct]
  );
  const crossSell = useMemo(
    () => selectedProduct ? findCrossSell(selectedProduct) : [],
    [selectedProduct]
  );
  const queueIds = useMemo(() => new Set(queue.map(e => e.product.id)), [queue]);
  const smartUpsell = useMemo(() => selectedProduct ? buildSmartUpselling(selectedProduct, queueIds) : [], [selectedProduct, queueIds]);
  const similaritySuggestions = useMemo(() => selectedProduct ? findBasketSimilarity(selectedProduct) : [], [selectedProduct]);

  const priceChanged = selectedProduct ? parsedPrice !== selectedProduct.price : false;
  const marginOk = metrics ? metrics.newMargin >= 0.15 : true;
  const minimumPrice = metrics ? (metrics.cost / 0.85) : 0;

  const handleSubmit = () => {
    if (!selectedProduct || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast({
        title: "Preço inválido",
        description: "Informe um preço válido para continuar.",
      });
      return;
    }
    addToSimulator(selectedProduct);
    updateProposedPrice(selectedProduct.id, parsedPrice);
    submitForApproval(selectedProduct.id, notes);
    approveProduct({ ...selectedProduct, price: parsedPrice });
    toast({
      title: "Simulação enviada para aprovação!",
      description: `${selectedProduct.name} com R$ ${parsedPrice.toFixed(2)} encaminhado.`,
    });
    setNotes("");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Simulador de Preços
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Simule alterações de preço, analise elasticidade, margem e encontre substitutos ou produtos complementares
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT — Busca + Fila */}
        <div className="space-y-4">
          {/* Busca */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                Buscar produto
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              <Input
                placeholder="Digite o nome do produto..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <p className="text-xs text-muted-foreground px-1 py-2">Nenhum produto encontrado para "{searchQuery}".</p>
              )}
              {searchResults.length > 0 && (
                <div className="border border-border rounded-xl overflow-hidden">
                  {searchResults.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-muted/50 border-b border-border last:border-0 text-left transition-colors"
                    >
                      <img
                        src={p.imageUrl}
                        className="w-8 h-8 object-contain rounded flex-shrink-0"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium capitalize truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">R$ {p.price.toFixed(2)} · {(p.margin * 100).toFixed(0)}% mg</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fila do simulador */}
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Fila do Simulador
                {queue.length > 0 && (
                  <Badge className="ml-auto bg-primary/10 text-primary border-primary/20 text-[10px]">
                    {queue.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
              {queue.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Nenhum produto na fila. Busque um produto acima.
                </p>
              )}
              {queue.map(entry => (
                <div
                  key={entry.product.id}
                  onClick={() => {
                    setSelectedProduct(entry.product);
                    setProposedPrice(entry.proposedPrice.toFixed(2));
                  }}
                  className={`flex items-center gap-2 rounded-lg p-2 cursor-pointer border transition-all ${
                    selectedProduct?.id === entry.product.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 bg-card"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium capitalize truncate">{entry.product.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-muted-foreground line-through">R$ {entry.product.price.toFixed(2)}</span>
                      {entry.proposedPrice !== entry.product.price && (
                        <>
                          <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-[10px] font-bold text-primary">R$ {entry.proposedPrice.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={entry.status === 'pending_approval' ? "default" : "outline"}
                    className={`text-[9px] ${entry.status === 'pending_approval' ? 'bg-green-100 text-green-700 border-green-200' : ''}`}
                  >
                    {entry.status === 'pending_approval' ? '✓ Enviado' : 'Rascunho'}
                  </Badge>
                  <button
                    onClick={e => { e.stopPropagation(); removeFromSimulator(entry.product.id); }}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* CENTER + RIGHT — Análise */}
        {selectedProduct && metrics ? (
          <div className="xl:col-span-2 space-y-4">
            {/* Produto selecionado */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-16 h-16 object-contain rounded-xl border bg-muted/30"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="flex-1">
                    <h2 className="font-bold text-foreground capitalize">{selectedProduct.name}</h2>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <Badge variant="outline" className="text-[10px]">Cod {selectedProduct.id}</Badge>
                      <Badge variant="outline" className="text-[10px]">Mg {(selectedProduct.margin * 100).toFixed(0)}%</Badge>
                      <Badge variant="outline" className="text-[10px]">{selectedProduct.sales.toLocaleString()} vnd/mês</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">Preço atual</p>
                    <p className="text-2xl font-bold">R$ {selectedProduct.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Input preço + métricas rápidas */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Novo preço proposto</label>
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                        <Input
                          className="pl-9 font-bold"
                          value={proposedPrice}
                          onChange={e => {
                            setProposedPrice(e.target.value);
                            const v = parseFloat(e.target.value.replace(",", "."));
                            if (!isNaN(v)) updateProposedPrice(selectedProduct.id, v);
                          }}
                        />
                      </div>
                      {priceChanged && (
                        <Badge variant={parsedPrice < selectedProduct.price ? "default" : "destructive"}>
                          {parsedPrice < selectedProduct.price ? "▼" : "▲"}{Math.abs(((parsedPrice - selectedProduct.price) / selectedProduct.price) * 100).toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Custo: R$ {metrics.cost.toFixed(2)}
                    </p>
                    <p className="text-sm font-extrabold text-cyan-600 mt-0.5">
                      Preço mínimo (15% margem): R$ {minimumPrice.toFixed(2)}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => {
                        setProposedPrice(minimumPrice.toFixed(2));
                        updateProposedPrice(selectedProduct.id, minimumPrice);
                      }}>
                        Usar preço mínimo
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => {
                        setProposedPrice(selectedProduct.price.toFixed(2));
                        updateProposedPrice(selectedProduct.id, selectedProduct.price);
                      }}>
                        Voltar ao preço atual
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-xl p-2.5 border text-center ${!marginOk && priceChanged ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/20"}`}>
                      <p className="text-[10px] text-muted-foreground">Margem</p>
                      <p className={`text-sm font-bold ${!marginOk && priceChanged ? "text-destructive" : "text-foreground"}`}>
                        {(metrics.newMargin * 100).toFixed(1)}%
                      </p>
                      {priceChanged && (
                        <p className={`text-[9px] ${metrics.newMargin > selectedProduct.margin ? "text-green-600" : "text-red-500"}`}>
                          {metrics.newMargin > selectedProduct.margin ? "▲" : "▼"} {Math.abs((metrics.newMargin - selectedProduct.margin) * 100).toFixed(1)}pp
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl p-2.5 border border-border bg-muted/20 text-center">
                      <p className="text-[10px] text-muted-foreground">Rentabilidade</p>
                      <p className="text-sm font-bold">{(metrics.newRentability * 100).toFixed(1)}%</p>
                      {priceChanged && (
                        <p className={`text-[9px] ${metrics.newRentability > selectedProduct.rentability ? "text-green-600" : "text-red-500"}`}>
                          {metrics.newRentability > selectedProduct.rentability ? "▲" : "▼"}
                        </p>
                      )}
                    </div>
                    <div className="rounded-xl p-2.5 border border-border bg-muted/20 text-center">
                      <p className="text-[10px] text-muted-foreground">Variação vendas</p>
                      <p className={`text-sm font-bold ${metrics.salesChange >= 0 ? "text-green-600" : "text-orange-500"}`}>
                        {metrics.salesChange >= 0 ? "+" : ""}{(metrics.salesChange * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-xl p-2.5 border border-border bg-muted/20 text-center">
                      <p className="text-[10px] text-muted-foreground">Faturamento</p>
                      <p className={`text-sm font-bold ${metrics.revenueChange >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {metrics.revenueChange >= 0 ? "+" : ""}{(metrics.revenueChange * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico elasticidade */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Curva de Elasticidade
                  <span className="text-[10px] text-muted-foreground font-normal ml-1">— variação de ±30% no preço</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={elasticityCurve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="pct" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      formatter={(value: number, name: string) => [
                        name === "margem" ? `${value}%` : name === "faturamento" ? `R$ ${value.toLocaleString("pt-BR")}` : value.toLocaleString("pt-BR"),
                        name === "faturamento" ? "Faturamento" : name === "margem" ? "Margem" : "Vendas"
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <ReferenceLine yAxisId="left" x="0%" stroke="hsl(var(--primary))" strokeDasharray="4 2" label={{ value: "atual", fontSize: 9 }} />
                    <Line yAxisId="left" type="monotone" dataKey="faturamento" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="faturamento" />
                    <Line yAxisId="right" type="monotone" dataKey="margem" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="margem" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Concorrência */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Concorrentes
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-3">
                  {selectedProduct.prixsia.competitors.map(comp => (
                    <div key={comp.name} className={`rounded-xl p-3 border text-center ${parsedPrice <= comp.price ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}`}>
                      <p className="text-[11px] font-medium text-foreground truncate">{comp.name.split("-")[0].trim()}</p>
                      <p className="text-[10px] text-muted-foreground">{comp.location}</p>
                      <p className="text-lg font-bold mt-1">R$ {comp.price.toFixed(2)}</p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${parsedPrice <= comp.price ? "text-green-600" : "text-orange-600"}`}>
                        {parsedPrice <= comp.price
                          ? `${((comp.price - parsedPrice) / comp.price * 100).toFixed(1)}% mais barato`
                          : `${((parsedPrice - comp.price) / comp.price * 100).toFixed(1)}% mais caro`
                        }
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center bg-muted/20 rounded-xl p-3 border border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Mín. mercado</p>
                    <p className="text-sm font-bold text-green-600">R$ {selectedProduct.prixsia.minPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Média mercado</p>
                    <p className="text-sm font-bold text-primary">R$ {selectedProduct.prixsia.avgPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Máx. mercado</p>
                    <p className="text-sm font-bold text-orange-500">R$ {selectedProduct.prixsia.maxPrice.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Substitutos */}
            {substitutes.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    Produtos Substitutos
                    <span className="text-[10px] text-muted-foreground font-normal">— mesma seção, grupo diferente, margem e faturamento similares</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2">
                  {substitutes.map(sub => {
                    const marginDiff = ((sub.margin - selectedProduct.margin) * 100).toFixed(1);
                    const priceDiff = (((sub.price - selectedProduct.price) / selectedProduct.price) * 100).toFixed(1);
                    const revSub = sub.price * sub.sales;
                    const revOrig = selectedProduct.price * selectedProduct.sales;
                    const revDiff = (((revSub - revOrig) / revOrig) * 100).toFixed(1);
                    return (
                      <div key={sub.id} className="flex items-center gap-3 rounded-xl border border-border p-3 hover:border-primary/30 transition-colors">
                        <img src={sub.imageUrl} className="w-10 h-10 object-contain rounded" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold capitalize truncate">{sub.name}</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <span className={`text-[10px] font-medium ${parseFloat(marginDiff) >= 0 ? "text-green-600" : "text-red-500"}`}>
                              Mg {(sub.margin * 100).toFixed(0)}% ({parseFloat(marginDiff) >= 0 ? "+" : ""}{marginDiff}pp)
                            </span>
                            <span className={`text-[10px] font-medium ${parseFloat(priceDiff) <= 0 ? "text-green-600" : "text-orange-500"}`}>
                              R$ {sub.price.toFixed(2)} ({parseFloat(priceDiff) >= 0 ? "+" : ""}{priceDiff}%)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">Fat. mensal</p>
                          <p className={`text-xs font-bold ${parseFloat(revDiff) >= 0 ? "text-green-600" : "text-red-500"}`}>
                            {parseFloat(revDiff) >= 0 ? "+" : ""}{revDiff}%
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[10px] h-7 px-2"
                          onClick={() => handleSelectProduct(sub)}
                        >
                          Simular
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Cross-selling */}
            {crossSell.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    Cross-Selling
                    <span className="text-[10px] text-muted-foreground font-normal">— produtos complementares para o tabloide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="grid grid-cols-3 gap-2">
                    {crossSell.slice(0, 6).map(cs => (
                      <div
                        key={cs.id}
                        className="rounded-xl border border-border p-2.5 cursor-pointer hover:border-primary/40 transition-colors bg-card"
                        onClick={() => handleSelectProduct(cs)}
                      >
                        <img src={cs.imageUrl} className="w-8 h-8 object-contain mx-auto mb-1" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <p className="text-[10px] font-medium capitalize text-center truncate">{cs.name.split(" ").slice(0, 3).join(" ")}</p>
                        <p className="text-[10px] text-primary font-bold text-center">R$ {cs.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(smartUpsell.length > 0 || similaritySuggestions.length > 0) && (
              <Card>
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Oportunidades inteligentes de cesta
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {smartUpsell.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1"><Target className="h-3.5 w-3.5 text-primary" /> Upselling sugerido</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {smartUpsell.map(item => (
                          <button key={item.id} onClick={() => handleSelectProduct(item)} className="text-left rounded-lg border border-border p-2 hover:border-primary/40 transition-colors">
                            <p className="text-xs font-medium truncate capitalize">{item.name}</p>
                            <p className="text-[10px] text-primary font-bold">R$ {item.price.toFixed(2)} · +{item.uplift}% potencial</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {similaritySuggestions.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-2 flex items-center gap-1"><Brain className="h-3.5 w-3.5 text-primary" /> Perfil de similaridade</p>
                      <div className="space-y-2">
                        {similaritySuggestions.map(({ product, score }) => (
                          <div key={product.id} className="rounded-lg border border-border p-2 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate capitalize">Clientes parecidos com sua cesta compram: {product.name}</p>
                              <p className="text-[10px] text-muted-foreground">Compatibilidade de perfil: {score}%</p>
                            </div>
                            <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => handleSelectProduct(product)}>Adicionar</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Enviar para aprovação */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Enviar para Aprovação</span>
                  {!marginOk && priceChanged && (
                    <Badge variant="destructive" className="text-[10px] ml-auto gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Margem crítica — revisar preço
                    </Badge>
                  )}
                  {marginOk && priceChanged && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] ml-auto gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Pronto para enviar
                    </Badge>
                  )}
                </div>
                <textarea
                  className="w-full min-h-[64px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Observações para a aprovação (opcional)..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedProduct || !marginOk}
                  className="w-full gap-2"
                >
                  <Send className="h-4 w-4" />
                  {priceChanged ? "Enviar para Aprovação" : "Enviar preço atual para Aprovação"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="xl:col-span-2 flex items-center justify-center bg-card rounded-2xl border border-border min-h-[400px]">
            <div className="text-center space-y-3">
              <Zap className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground font-medium">Busque um produto para iniciar a simulação</p>
              <p className="text-sm text-muted-foreground/70">Digite o nome acima ou selecione da fila</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
