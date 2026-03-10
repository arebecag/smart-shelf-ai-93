import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { mockProductGroups } from "@/data/mockData";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useSimulator } from "@/contexts/SimulatorContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Send, Zap, Tag, Sparkles } from "lucide-react";

// ── Seções ─────────────────────────────────────────────────
const SECTIONS = [
  "Açougue", "Bebidas Frias", "Limpeza", "Seca Pesada", "Seca Leve",
  "Perfumaria/Hig", "Frutas & Hort.", "Laticínios", "Padaria",
  "Energéticos", "Refrigerantes", "Cervejas"
];

const SECTION_MAP: Record<string, string[]> = {
  "Açougue":       ["90"],
  "Bebidas Frias": ["80", "81", "88"],
  "Limpeza":       ["80"],
  "Seca Pesada":   ["81"],
  "Seca Leve":     ["82"],
  "Perfumaria/Hig":["88"],
  "Frutas & Hort.":["85"],
  "Laticínios":    ["82"],
  "Padaria":       ["91"],
  "Energéticos":   ["88"],
  "Refrigerantes": ["81"],
  "Cervejas":      ["80"],
};

const PRODUCT_SECTION_MAP: Record<string, string[]> = {
  "Cervejas":      ["80"],
  "Refrigerantes": ["81"],
  "Laticínios":    ["82"],
  "Energéticos":   ["88"],
  "Açougue":       ["90"],
  "Padaria":       ["91"],
  "Água":          ["85"],
};

const DAYS_FULL = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
const DAYS_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const DAY_MULT: Record<string, number> = {
  "Seg": 0.65, "Ter": 0.72, "Qua": 0.80, "Qui": 0.85,
  "Sex": 1.20, "Sáb": 1.55, "Dom": 1.23,
};

const DAY_BOOST: Record<string, string[]> = {
  "Seg": ["Laticínios", "Padaria", "Limpeza", "Seca Pesada", "Seca Leve", "Frutas & Hort.", "Perfumaria/Hig", "Bebidas Frias", "Açougue"],
  "Ter": ["Refrigerantes", "Seca Pesada", "Açougue", "Bebidas Frias", "Limpeza", "Seca Leve", "Frutas & Hort.", "Laticínios", "Padaria"],
  "Qua": ["Cervejas", "Energéticos", "Bebidas Frias", "Limpeza", "Açougue", "Seca Pesada", "Frutas & Hort.", "Laticínios", "Refrigerantes"],
  "Qui": ["Açougue", "Laticínios", "Bebidas Frias", "Seca Pesada", "Cervejas", "Refrigerantes", "Seca Leve", "Frutas & Hort.", "Padaria"],
  "Sex": ["Cervejas", "Refrigerantes", "Açougue", "Bebidas Frias", "Limpeza", "Seca Pesada", "Seca Leve", "Perfumaria/Hig", "Laticínios"],
  "Sáb": ["Cervejas", "Refrigerantes", "Açougue", "Energéticos", "Bebidas Frias", "Limpeza", "Seca Pesada", "Frutas & Hort.", "Laticínios"],
  "Dom": ["Laticínios", "Padaria", "Refrigerantes", "Açougue", "Bebidas Frias", "Seca Leve", "Cervejas", "Frutas & Hort.", "Limpeza"],
};

const DAY_COLORS: Record<string, string> = {
  "Seg": "#2563eb", "Ter": "#1d4ed8", "Qua": "#1e40af",
  "Qui": "#1e3a8a", "Sex": "#be123c", "Sáb": "#9f1239", "Dom": "#7f1d1d",
};

const SECTION_COLORS = [
  "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6",
  "#1d4ed8", "#fb923c", "#ef4444", "#dc2626"
];

function getSectionRevenue(section: string, dayShort: string): number {
  const groupIds = PRODUCT_SECTION_MAP[section] || SECTION_MAP[section] || [];
  let base = 0;
  for (const gid of groupIds) {
    const group = mockProductGroups.find(g => g.id === gid);
    if (group) base += group.products.reduce((s, p) => s + p.sales * p.price, 0) / 120;
  }
  const mult = DAY_MULT[dayShort] ?? 1;
  const boosted = (DAY_BOOST[dayShort] || []).includes(section) ? 1.35 : 0.72;
  return Math.round(base * mult * boosted);
}

function buildAreaData() {
  return Object.keys(PRODUCT_SECTION_MAP).map(section => {
    const groupIds = PRODUCT_SECTION_MAP[section];
    let totalSales = 0, totalMargin = 0, totalVol = 0;
    for (const gid of groupIds) {
      const group = mockProductGroups.find(g => g.id === gid);
      if (group) {
        for (const p of group.products) {
          totalSales += p.sales * p.price;
          totalMargin += p.sales * p.price * p.margin;
          totalVol += p.sales;
        }
      }
    }
    return {
      section,
      faturamento: Math.round(totalSales / 80),
      volume: Math.round(totalVol / 10),
      rentabilidade: Math.round(totalMargin / 80),
    };
  });
}

function buildAllSectionMetrics() {
  // All sections with full metrics for the table
  const allSections = [...new Set([...Object.keys(PRODUCT_SECTION_MAP), ...SECTIONS])];
  return allSections.map(section => {
    const groupIds = PRODUCT_SECTION_MAP[section] || SECTION_MAP[section] || [];
    let fat = 0, vol = 0, rent = 0, marginSum = 0, count = 0;
    for (const gid of groupIds) {
      const group = mockProductGroups.find(g => g.id === gid);
      if (group) {
        for (const p of group.products) {
          fat += p.sales * p.price;
          vol += p.sales;
          rent += p.sales * p.price * p.margin;
          marginSum += p.margin;
          count++;
        }
      }
    }
    return {
      section,
      faturamento: Math.round(fat / 80),
      volume: Math.round(vol / 10),
      rentabilidade: Math.round(rent / 80),
      margem: count > 0 ? marginSum / count : 0,
    };
  }).sort((a, b) => b.faturamento - a.faturamento);
}

function buildDayGrid() {
  return DAYS_SHORT.map(day => {
    const order = DAY_BOOST[day] || Object.keys(PRODUCT_SECTION_MAP);
    const items = order.map(section => ({
      section,
      revenue: getSectionRevenue(section, day),
    })).sort((a, b) => b.revenue - a.revenue);
    return { day, items };
  });
}

function buildStackedData() {
  return Object.keys(PRODUCT_SECTION_MAP).map(section => {
    const row: Record<string, any> = { section: section.slice(0, 14) };
    for (const day of DAYS_SHORT) {
      const total = Object.keys(PRODUCT_SECTION_MAP).reduce(
        (s, sec) => s + getSectionRevenue(sec, day), 0
      );
      const val = getSectionRevenue(section, day);
      row[day] = total > 0 ? Math.round((val / total) * 100) : 0;
    }
    return row;
  });
}

function buildSectionProducts(section: string) {
  const groupIds = PRODUCT_SECTION_MAP[section] || SECTION_MAP[section] || [];
  const products: Product[] = [];
  for (const gid of groupIds) {
    const group = mockProductGroups.find(g => g.id === gid);
    if (group) products.push(...group.products);
  }
  const byFat = [...products].sort((a, b) => (b.sales * b.price) - (a.sales * a.price));
  const byVol = [...products].sort((a, b) => b.sales - a.sales);
  const byRent = [...products].sort((a, b) => (b.sales * b.price * b.margin) - (a.sales * a.price * a.margin));
  const withCampaign = [...products].filter(p => p.hasAd).sort((a, b) => (b.sales * b.price) - (a.sales * a.price));
  const noCampaign = [...products].filter(p => !p.hasAd).sort((a, b) => (b.sales * b.price * b.margin) - (a.sales * a.price * a.margin));
  return { byFat, byVol, byRent, withCampaign, noCampaign };
}

// All products flattened for global rankings
function buildGlobalProducts() {
  const products: Product[] = [];
  for (const groupIds of Object.values(PRODUCT_SECTION_MAP)) {
    for (const gid of groupIds) {
      const group = mockProductGroups.find(g => g.id === gid);
      if (group) products.push(...group.products);
    }
  }
  const unique = Array.from(new Map(products.map(p => [p.id, p])).values());
  const byFat = [...unique].sort((a, b) => (b.sales * b.price) - (a.sales * a.price));
  const byVol = [...unique].sort((a, b) => b.sales - a.sales);
  const byRent = [...unique].sort((a, b) => (b.sales * b.price * b.margin) - (a.sales * a.price * a.margin));
  const withCampaign = [...unique].filter(p => p.hasAd).sort((a, b) => (b.sales * b.price) - (a.sales * a.price));
  const noCampaign = [...unique].filter(p => !p.hasAd).sort((a, b) => (b.sales * b.price * b.margin) - (a.sales * a.price * a.margin));
  return { byFat, byVol, byRent, withCampaign, noCampaign };
}

const fmtM = (v: number) => {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1_000) return `R$${(v / 1_000).toFixed(0)}K`;
  return `R$${v}`;
};
const fmtFull = (v: number) =>
  `R$${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtVol = (v: number) => v.toLocaleString("pt-BR");
const short = (s: string, n = 22) => s.length > n ? s.slice(0, n) + "…" : s;

const AreaTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-foreground/90 text-background rounded-lg p-3 text-xs shadow-xl min-w-[180px]">
      <p className="font-bold text-sm mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-background/70">{p.name}</span>
          <span className="font-semibold ml-auto">{fmtFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// ── Component ───────────────────────────────────────────────
export default function WeeklyComparison() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { approveProduct, isApproved } = useApprovals();
  const { addToSimulator, isInSimulator } = useSimulator();
  const { toast } = useToast();
  const navigate = useNavigate();

  const areaData = useMemo(() => buildAreaData(), []);
  const allSectionMetrics = useMemo(() => buildAllSectionMetrics(), []);
  const dayGrid = useMemo(() => buildDayGrid(), []);
  const stackedData = useMemo(() => buildStackedData(), []);
  const globalProducts = useMemo(() => buildGlobalProducts(), []);

  const sectionDetail = useMemo(() => {
    if (!selectedSection) return null;
    return buildSectionProducts(selectedSection);
  }, [selectedSection]);

  // The panel on the right shows section detail when selected, else global
  const panelData = sectionDetail ?? globalProducts;

  const maxFat = allSectionMetrics[0]?.faturamento ?? 1;
  const maxVol = Math.max(...allSectionMetrics.map(r => r.volume));
  const maxRent = Math.max(...allSectionMetrics.map(r => r.rentabilidade));

  const handleSuggest = (product: Product) => {
    approveProduct(product);
    toast({ title: "Sugerido!", description: `${product.name} adicionado.` });
  };
  const handleSimulate = (product: Product) => {
    addToSimulator(product);
    toast({
      title: "Adicionado ao Simulador!",
      description: `${product.name} pronto para simulação.`,
      action: <button onClick={() => navigate("/simulador")} className="text-xs underline font-semibold">Ver</button>,
    });
  };

  return (
    <div className="space-y-0 bg-background">

      {/* ════════════════════════════════════════════════════════
          BLOCO 1: Tabela de Seções + Painel de Produtos (sempre visível)
          ══════════════════════════════════════════════════════ */}
      <div className="flex border-b border-border" style={{ minHeight: 420 }}>

        {/* Esquerda: Tabela de seções */}
        <div className="flex flex-col border-r border-border" style={{ minWidth: 520, maxWidth: 560 }}>
          {/* Cabeçalho da tabela */}
          <div className="grid border-b border-border bg-muted/40" style={{ gridTemplateColumns: "1fr 110px 80px 110px 70px" }}>
            <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase">Seção</div>
            <div className="px-2 py-2 text-[10px] font-bold text-blue-500 uppercase text-right">Faturamento</div>
            <div className="px-2 py-2 text-[10px] font-bold text-orange-500 uppercase text-right">Volume</div>
            <div className="px-2 py-2 text-[10px] font-bold text-green-600 uppercase text-right leading-tight">Rentab. c/ Sellout</div>
            <div className="px-2 py-2 text-[10px] font-bold text-purple-500 uppercase text-right">Margem</div>
          </div>

          {/* Linhas das seções */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {allSectionMetrics.map((r) => {
              const fatPct = Math.round((r.faturamento / maxFat) * 100);
              const volPct = Math.round((r.volume / maxVol) * 100);
              const rentPct = Math.round((r.rentabilidade / maxRent) * 100);
              const isSelected = selectedSection === r.section;
              return (
                <button
                  key={r.section}
                  onClick={() => setSelectedSection(isSelected ? null : r.section)}
                  className={cn(
                    "w-full text-left hover:bg-muted/40 transition-colors",
                    isSelected && "bg-primary/8 border-l-2 border-primary"
                  )}
                  style={{ display: "grid", gridTemplateColumns: "1fr 110px 80px 110px 70px" }}
                >
                  {/* Nome da seção */}
                  <div className="px-3 py-1.5 flex items-center">
                    <span className={cn(
                      "text-[10px] font-semibold leading-tight",
                      isSelected ? "text-primary" : "text-foreground"
                    )}>
                      {r.section}
                    </span>
                  </div>
                  {/* Faturamento com barra */}
                  <div className="px-2 py-1.5 flex flex-col justify-center gap-0.5">
                    <span className="text-[9px] text-blue-500 font-semibold text-right leading-none">{fmtFull(r.faturamento)}</span>
                    <div className="h-2 bg-muted rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm bg-blue-200" style={{ width: `${fatPct}%` }} />
                    </div>
                  </div>
                  {/* Volume com barra */}
                  <div className="px-2 py-1.5 flex flex-col justify-center gap-0.5">
                    <span className="text-[9px] text-orange-500 font-semibold text-right leading-none">{fmtVol(r.volume)}</span>
                    <div className="h-2 bg-muted rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm bg-orange-200" style={{ width: `${volPct}%` }} />
                    </div>
                  </div>
                  {/* Rentabilidade com barra verde */}
                  <div className="px-2 py-1.5 flex flex-col justify-center gap-0.5">
                    <span className="text-[9px] text-green-600 font-semibold text-right leading-none">{fmtFull(r.rentabilidade)}</span>
                    <div className="h-2 bg-muted rounded-sm overflow-hidden">
                      <div className="h-full rounded-sm bg-green-300" style={{ width: `${rentPct}%` }} />
                    </div>
                  </div>
                  {/* Margem */}
                  <div className="px-2 py-1.5 flex items-center justify-end">
                    <span className="text-[9px] text-purple-500 font-semibold">{(r.margem * 100).toFixed(2)}%</span>
                  </div>
                </button>
              );
            })}
            {/* Total */}
            <div
              className="bg-muted/60 font-bold"
              style={{ display: "grid", gridTemplateColumns: "1fr 110px 80px 110px 70px" }}
            >
              <div className="px-3 py-2 text-[10px] font-bold text-foreground">Total</div>
              <div className="px-2 py-2 text-[9px] text-blue-600 font-bold text-right">
                {fmtFull(allSectionMetrics.reduce((s, r) => s + r.faturamento, 0))}
              </div>
              <div className="px-2 py-2 text-[9px] text-orange-600 font-bold text-right">
                {fmtVol(allSectionMetrics.reduce((s, r) => s + r.volume, 0))}
              </div>
              <div className="px-2 py-2 text-[9px] text-green-700 font-bold text-right">
                {fmtFull(allSectionMetrics.reduce((s, r) => s + r.rentabilidade, 0))}
              </div>
              <div className="px-2 py-2 text-[9px] text-purple-600 font-bold text-right">
                {(allSectionMetrics.reduce((s, r) => s + r.margem, 0) / allSectionMetrics.length * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Direita: Painel de produtos (sempre visível) */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Título do painel */}
          {selectedSection && (
            <div className="px-4 py-1.5 border-b border-border bg-primary/5 flex items-center gap-2">
              <span className="text-[11px] font-bold text-primary">{selectedSection}</span>
              <button
                onClick={() => setSelectedSection(null)}
                className="ml-auto text-[10px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded border border-border hover:bg-muted transition-colors"
              >✕ Todos</button>
            </div>
          )}

          {/* 3 colunas de ranking + 2 colunas campanha */}
          <div className="flex-1 grid grid-cols-5 divide-x divide-border overflow-hidden">
            {/* Faturamento */}
            <div className="flex flex-col overflow-hidden">
              <div className="px-3 py-1.5 border-b border-border text-center">
                <span className="text-[10px] font-bold text-blue-500">Faturamento</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/40">
                {panelData.byFat.slice(0, 10).map((p) => (
                  <div key={p.id} className="px-3 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-blue-500 leading-tight truncate">{short(p.name)}</p>
                      <p className="text-[9px] text-muted-foreground">{fmtFull(p.sales * p.price)}</p>
                    </div>
                    <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                  </div>
                ))}
              </div>
            </div>
            {/* Volume */}
            <div className="flex flex-col overflow-hidden">
              <div className="px-3 py-1.5 border-b border-border text-center">
                <span className="text-[10px] font-bold text-orange-500">Volume</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/40">
                {panelData.byVol.slice(0, 10).map((p) => (
                  <div key={p.id} className="px-3 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-orange-500 leading-tight truncate">{short(p.name)}</p>
                      <p className="text-[9px] text-muted-foreground">{fmtVol(p.sales)}</p>
                    </div>
                    <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                  </div>
                ))}
              </div>
            </div>
            {/* Rentab. c/ Sellout */}
            <div className="flex flex-col overflow-hidden">
              <div className="px-3 py-1.5 border-b border-border text-center">
                <span className="text-[10px] font-bold text-green-600">Rentab. c/ Sellout</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/40">
                {panelData.byRent.slice(0, 10).map((p) => (
                  <div key={p.id} className="px-3 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-green-600 leading-tight truncate">{short(p.name)}</p>
                      <p className="text-[9px] text-muted-foreground">{fmtFull(p.sales * p.price * p.margin)}</p>
                    </div>
                    <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                  </div>
                ))}
              </div>
            </div>
            {/* TOP em Campanha */}
            <div className="flex flex-col overflow-hidden">
              <div className="px-3 py-1.5 border-b border-border flex items-center justify-center gap-1">
                <Tag className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="text-[10px] font-bold text-primary">TOP em Campanha</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/40">
                {panelData.withCampaign.slice(0, 10).map((p) => (
                  <div key={p.id} className="px-3 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-primary leading-tight truncate">{short(p.name)}</p>
                      <p className="text-[9px] text-muted-foreground">{fmtFull(p.sales * p.price)}</p>
                    </div>
                    <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                  </div>
                ))}
                {panelData.withCampaign.length === 0 && (
                  <p className="text-[10px] text-muted-foreground px-3 py-4 text-center">Nenhum em campanha</p>
                )}
              </div>
            </div>
            {/* Oportunidades SEM campanha */}
            <div className="flex flex-col overflow-hidden">
              <div className="px-3 py-1.5 border-b border-border flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3 text-orange-500 flex-shrink-0" />
                <span className="text-[10px] font-bold text-orange-500 leading-tight text-center">TOP **SEM** Campanha<br/>(Oportunidades)</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/40">
                {panelData.noCampaign.slice(0, 10).map((p) => (
                  <div key={p.id} className="px-3 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-orange-500 leading-tight truncate">{short(p.name)}</p>
                      <p className="text-[9px] text-muted-foreground">{fmtFull(p.sales * p.price * p.margin)}</p>
                    </div>
                    <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                  </div>
                ))}
                {panelData.noCampaign.length === 0 && (
                  <p className="text-[10px] text-muted-foreground px-3 py-4 text-center">Sem oportunidades</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          BLOCO 2: Area Chart — Faturamento/Volume/Rentabilidade por categoria
          ══════════════════════════════════════════════════════ */}
      <div className="border-b border-border p-3">
        <p className="text-[11px] font-semibold text-muted-foreground text-center mb-2">
          Faturamento, volume e rentabilidade (c/sellout) por categorias
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={areaData} margin={{ top: 5, right: 5, left: 0, bottom: 50 }}>
            <defs>
              <linearGradient id="gFat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gVol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gRent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="section"
              tick={{ fontSize: 9.5, fill: "hsl(var(--muted-foreground))" }}
              angle={-40}
              textAnchor="end"
              interval={0}
              height={55}
            />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={38} />
            <Tooltip content={<AreaTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 0 }}
              formatter={(v) =>
                v === "faturamento" ? "Faturamento" :
                v === "volume" ? "Volume" : "Rentabilidade c/ Sellout"
              }
            />
            <Area type="monotone" dataKey="faturamento" name="faturamento" stroke="#3b82f6" fill="url(#gFat)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="volume" name="volume" stroke="#f97316" fill="url(#gVol)" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="rentabilidade" name="rentabilidade" stroke="#22c55e" fill="url(#gRent)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ════════════════════════════════════════════════════════
          BLOCO 3: Grade de 7 dias com barras horizontais
          ══════════════════════════════════════════════════════ */}
      <div className="border-b border-border">
        <div className="grid grid-cols-7 divide-x divide-border">
          {dayGrid.map(({ day, items }, di) => {
            const fullDay = DAYS_FULL[di];
            const isWeekend = day === "Sáb" || day === "Dom";
            const barColor = DAY_COLORS[day];
            const maxVal = items[0]?.revenue ?? 1;
            return (
              <div key={day} className="flex flex-col">
                <div className={cn(
                  "px-2 py-2 text-center border-b border-border",
                  isWeekend ? "bg-red-50 dark:bg-red-950/20" : "bg-blue-50 dark:bg-blue-950/20"
                )}>
                  <span className="text-[11px] font-bold" style={{ color: barColor }}>{fullDay}</span>
                </div>
                <div className="flex-1 divide-y divide-border/40">
                  {items.slice(0, 9).map((item) => {
                    const pct = Math.round((item.revenue / maxVal) * 100);
                    return (
                      <button
                        key={item.section}
                        onClick={() => setSelectedSection(selectedSection === item.section ? null : item.section)}
                        className={cn(
                          "w-full px-1.5 py-1.5 flex items-center gap-1 hover:bg-muted/40 transition-colors text-left",
                          selectedSection === item.section && "bg-muted/60"
                        )}
                      >
                        <span className="text-[9px] text-muted-foreground w-14 shrink-0 leading-tight truncate">
                          {item.section}
                        </span>
                        <div className="flex-1 flex items-center gap-1 min-w-0">
                          <div className="flex-1 h-4 bg-muted/50 rounded-sm overflow-hidden">
                            <div className="h-full rounded-sm transition-all" style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                          <span className="text-[9px] font-bold shrink-0 tabular-nums" style={{ color: barColor }}>
                            {fmtM(item.revenue)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          BLOCO 4: Stacked Bar — Participação por dia da semana
          ══════════════════════════════════════════════════════ */}
      <div className="border-b border-border p-3">
        <p className="text-[11px] font-semibold text-muted-foreground text-center mb-3">
          Participação em faturamento por categoria e dia da semana (Acumulado Rede)
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stackedData} margin={{ top: 5, right: 20, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="section"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              angle={-40}
              textAnchor="end"
              interval={0}
              height={65}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
              width={32}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 11,
              }}
              formatter={(v, name) => [`${v}%`, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: 10 }}
              iconSize={10}
              iconType="square"
              formatter={(v) => {
                const map: Record<string, string> = {
                  "Seg": "1.Segunda-Feira", "Ter": "2.Terça-Feira", "Qua": "3.Quarta-Feira",
                  "Qui": "4.Quinta-Feira", "Sex": "5.Sexta-Feira", "Sáb": "6.Sábado", "Dom": "7.Domingo"
                };
                return map[v] ?? v;
              }}
            />
            {DAYS_SHORT.map((day, i) => (
              <Bar
                key={day}
                dataKey={day}
                stackId="a"
                fill={SECTION_COLORS[i % SECTION_COLORS.length]}
                radius={i === DAYS_SHORT.length - 1 ? [3, 3, 0, 0] : undefined}
                label={{
                  position: "center",
                  fontSize: 8,
                  fontWeight: 600,
                  fill: i <= 3 ? "#1e3a8a" : "#7f1d1d",
                  formatter: (v: number) => v >= 8 ? `${v}%` : "",
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── ActionBtns helper ──────────────────────────────────────
function ActionBtns({
  product, onSuggest, onSimulate, isApproved, isInSimulator
}: {
  product: Product;
  onSuggest: (p: Product) => void;
  onSimulate: (p: Product) => void;
  isApproved: (id: string) => boolean;
  isInSimulator: (id: string) => boolean;
}) {
  return (
    <div className="flex gap-0.5 flex-shrink-0">
      <button
        onClick={(e) => { e.stopPropagation(); onSuggest(product); }}
        disabled={isApproved(product.id)}
        title="Sugerir"
        className={cn(
          "w-5 h-5 rounded flex items-center justify-center border transition-colors",
          isApproved(product.id)
            ? "border-green-300 text-green-600 bg-green-50 cursor-default"
            : "border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
        )}
      >
        {isApproved(product.id) ? "✓" : <Send className="h-2.5 w-2.5" />}
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onSimulate(product); }}
        disabled={isInSimulator(product.id)}
        title="Simular"
        className={cn(
          "w-5 h-5 rounded flex items-center justify-center border transition-colors",
          isInSimulator(product.id)
            ? "border-violet-300 text-violet-600 bg-violet-50 cursor-default"
            : "border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white"
        )}
      >
        {isInSimulator(product.id) ? "✓" : <Zap className="h-2.5 w-2.5" />}
      </button>
    </div>
  );
}
