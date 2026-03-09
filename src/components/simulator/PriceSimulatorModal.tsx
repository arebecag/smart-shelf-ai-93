import { useState, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3,
  ArrowRight, AlertTriangle, CheckCircle2, Zap, Send
} from "lucide-react";
import { useSimulator } from "@/contexts/SimulatorContext";
import { useToast } from "@/hooks/use-toast";

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

function calcMetrics(product: Product, newPrice: number) {
  const cost = product.price * (1 - product.margin);
  const newMargin = newPrice > 0 ? (newPrice - cost) / newPrice : 0;
  const newRentability = newMargin * 0.92;
  const priceElasticity = product.price > 0 ? -1.4 * ((newPrice - product.price) / product.price) : 0;
  const estimatedSalesChange = priceElasticity;
  const estimatedRevenue = newPrice * product.sales * (1 + estimatedSalesChange);
  const originalRevenue = product.price * product.sales;
  const revenueChange = originalRevenue > 0 ? (estimatedRevenue - originalRevenue) / originalRevenue : 0;
  const competitorAvg = product.prixsia.avgPrice;
  const competitorPosition = newPrice < competitorAvg
    ? "Abaixo da concorrência ✓"
    : newPrice === competitorAvg
    ? "Na média"
    : "Acima da concorrência";
  return {
    cost,
    newMargin,
    newRentability,
    estimatedSalesChange,
    estimatedRevenue,
    originalRevenue,
    revenueChange,
    competitorAvg,
    competitorPosition,
  };
}

export function PriceSimulatorModal({ product, open, onClose }: Props) {
  const [newPrice, setNewPrice] = useState<string>("");
  const { addToSimulator, isInSimulator, submitForApproval, getEntry, updateProposedPrice } = useSimulator();
  const { toast } = useToast();

  const parsedPrice = parseFloat(newPrice.replace(",", ".")) || (product?.price ?? 0);
  const metrics = useMemo(
    () => product ? calcMetrics(product, parsedPrice) : null,
    [product, parsedPrice]
  );

  if (!product || !metrics) return null;

  const marginOk = metrics.newMargin >= 0.15;
  const priceChanged = parsedPrice !== product.price;

  const handleSendToSimulator = () => {
    addToSimulator(product);
    if (priceChanged) updateProposedPrice(product.id, parsedPrice);
    submitForApproval(product.id, `Preço sugerido: R$ ${parsedPrice.toFixed(2)}`);
    toast({
      title: "Enviado para aprovação!",
      description: `${product.name} com novo preço R$ ${parsedPrice.toFixed(2)} enviado para análise.`,
    });
    onClose();
  };

  const Stat = ({ label, old: oldVal, newVal, unit = "", warn = false }: {
    label: string; old: string; newVal: string; unit?: string; warn?: boolean;
  }) => (
    <div className={`rounded-xl border p-3 ${warn ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-muted-foreground line-through">{oldVal}{unit}</span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className={`text-sm font-bold ${warn ? "text-destructive" : "text-foreground"}`}>{newVal}{unit}</span>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Simulador de Preço
          </DialogTitle>
          <DialogDescription>
            Simule o impacto de uma alteração de preço antes de enviar para aprovação
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Produto info */}
          <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-14 h-14 object-contain rounded-lg border bg-card"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <p className="font-semibold text-foreground capitalize">{product.name}</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-[10px]">Cod: {product.id}</Badge>
                {product.hasAd && <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">Com anúncio</Badge>}
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[11px] text-muted-foreground">Preço atual</p>
              <p className="text-2xl font-bold text-foreground">R$ {product.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Input novo preço */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Novo preço proposto (Andreia)
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">R$</span>
                <Input
                  className="pl-9 text-lg font-bold"
                  placeholder={product.price.toFixed(2)}
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                />
              </div>
              {priceChanged && (
                <Badge
                  variant={parsedPrice < product.price ? "default" : "destructive"}
                  className="text-sm px-3 py-1.5"
                >
                  {parsedPrice < product.price ? "▼" : "▲"}{" "}
                  {Math.abs(((parsedPrice - product.price) / product.price) * 100).toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>

          {/* Análise antes/depois */}
          {priceChanged && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">Análise Antes → Depois</h3>
                {!marginOk && (
                  <Badge variant="destructive" className="text-[10px] gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Margem crítica
                  </Badge>
                )}
                {marginOk && (
                  <Badge className="text-[10px] bg-green-100 text-green-700 border-green-200 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Margem OK
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Stat
                  label="Margem (%)"
                  old={`${(product.margin * 100).toFixed(1)}%`}
                  newVal={`${(metrics.newMargin * 100).toFixed(1)}%`}
                  warn={!marginOk}
                />
                <Stat
                  label="Rentabilidade"
                  old={`${(product.rentability * 100).toFixed(1)}%`}
                  newVal={`${(metrics.newRentability * 100).toFixed(1)}%`}
                  warn={metrics.newRentability < 0.12}
                />
                <Stat
                  label="Variação estimada de vendas"
                  old="0%"
                  newVal={`${metrics.estimatedSalesChange >= 0 ? "+" : ""}${(metrics.estimatedSalesChange * 100).toFixed(1)}%`}
                />
                <Stat
                  label="Impacto no faturamento"
                  old={`R$ ${metrics.originalRevenue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`}
                  newVal={`R$ ${metrics.estimatedRevenue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`}
                  warn={metrics.revenueChange < -0.05}
                />
              </div>

              {/* Concorrência */}
              <div className="bg-muted/30 rounded-xl p-3 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Posicionamento vs. Concorrência</span>
                  <span className={`text-xs font-semibold ${parsedPrice < metrics.competitorAvg ? "text-green-600" : "text-orange-500"}`}>
                    {metrics.competitorPosition}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {product.prixsia.competitors.slice(0, 3).map(comp => (
                    <div key={comp.name} className="bg-card rounded-lg p-2 border text-center">
                      <p className="text-[10px] text-muted-foreground truncate">{comp.name.split("-")[0]}</p>
                      <p className="text-xs font-bold">R$ {comp.price.toFixed(2)}</p>
                      <p className={`text-[10px] font-medium ${parsedPrice <= comp.price ? "text-green-600" : "text-red-500"}`}>
                        {parsedPrice <= comp.price ? "✓ menor" : "▲ maior"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custo do produto */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-800">Custo fixo do produto</p>
                  <p className="text-sm font-bold text-amber-900">R$ {metrics.cost.toFixed(2)}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-amber-700">Preço mínimo sugerido (15% mg)</p>
                  <p className="text-sm font-bold text-amber-900">
                    R$ {(metrics.cost / 0.85).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Elasticidade */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Elasticidade do Produto</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[10px] text-muted-foreground">Mínimo concorrência</p>
                <p className="text-sm font-bold text-green-600">R$ {product.prixsia.minPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Médio mercado</p>
                <p className="text-sm font-bold text-primary">R$ {product.prixsia.avgPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Máximo mercado</p>
                <p className="text-sm font-bold text-orange-500">R$ {product.prixsia.maxPrice.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-3 relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-green-400 via-primary to-orange-400"
                style={{ width: "100%" }}
              />
              {/* marcador do preço atual */}
              <div
                className="absolute h-4 w-1 bg-foreground rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{
                  left: `${Math.max(0, Math.min(100, ((product.price - product.prixsia.minPrice) / (product.prixsia.maxPrice - product.prixsia.minPrice)) * 100))}%`
                }}
                title="Preço atual"
              />
              {/* marcador do novo preço */}
              {priceChanged && (
                <div
                  className="absolute h-4 w-1 bg-primary rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 border border-white"
                  style={{
                    left: `${Math.max(0, Math.min(100, ((parsedPrice - product.prixsia.minPrice) / (product.prixsia.maxPrice - product.prixsia.minPrice)) * 100))}%`
                  }}
                  title="Novo preço"
                />
              )}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
              <span>Min R$ {product.prixsia.minPrice.toFixed(2)}</span>
              <span className="text-[9px] text-primary font-medium">■ atual  {priceChanged && "■ novo"}</span>
              <span>Max R$ {product.prixsia.maxPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Fechar
            </Button>
            <Button
              onClick={handleSendToSimulator}
              disabled={!priceChanged || !marginOk}
              className="flex-1 gap-2"
            >
              <Send className="h-4 w-4" />
              Enviar para Aprovação
            </Button>
          </div>
          {!marginOk && priceChanged && (
            <p className="text-xs text-destructive text-center -mt-2">
              ⚠️ Margem abaixo de 15% — ajuste o preço antes de enviar
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
