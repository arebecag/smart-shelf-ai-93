import { useState, useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";
import { mockProductGroups } from "@/data/mockData";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useSimulator } from "@/contexts/SimulatorContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Send, Zap, Tag, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ── Seções ──────────────────────────────────────────────────
const SECTIONS = [
  "Açougue", "Bebidas Frias", "Limpeza", "Seca Pesada", "Seca Leve",
  "Perfumaria/Hig", "Frutas & Hort.", "Laticínios", "Padaria",
  "Energéticos", "Refrigerantes", "Cervejas"
];

const SECTION_MAP: Record<string, string[]> = {
  "Açougue":        ["90"],
  "Bebidas Frias":  ["80", "81", "88"],
  "Limpeza":        ["80"],
  "Seca Pesada":    ["81"],
  "Seca Leve":      ["82"],
  "Perfumaria/Hig": ["88"],
  "Frutas & Hort.": ["85"],
  "Laticínios":     ["82"],
  "Padaria":        ["91"],
  "Energéticos":    ["88"],
  "Refrigerantes":  ["81"],
  "Cervejas":       ["80"],
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

const DAYS_FULL  = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
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

const SECTION_COLORS: Record<string, string> = {
  "Cervejas":      "#2563eb",
  "Refrigerantes": "#0ea5e9",
  "Bebidas Frias": "#38bdf8",
  "Energéticos":   "#8b5cf6",
  "Laticínios":    "#f59e0b",
  "Açougue":       "#ef4444",
  "Padaria":       "#f97316",
  "Frutas & Hort.":"#22c55e",
  "Água":          "#06b6d4",
};

// ── Data builders ────────────────────────────────────────────
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

// X = days, each section is a key with its faturamento for that day
function buildAreaData() {
  return DAYS_SHORT.map(day => {
    const row: Record<string, any> = { day };
    for (const section of Object.keys(PRODUCT_SECTION_MAP)) {
      row[section] = getSectionRevenue(section, day);
    }
    return row;
  });
}

// For the "% vs Monday" custom dot label
function calcPctVsMon(dayRevenue: number, monRevenue: number): string {
  if (!monRevenue) return "";
  const pct = Math.round(((dayRevenue - monRevenue) / monRevenue) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

function buildAllSectionMetrics() {
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

// X = days, segments = sections (% of that day's total)
function buildStackedData() {
  return DAYS_SHORT.map(day => {
    const sectionRevs = Object.keys(PRODUCT_SECTION_MAP).map(section => ({
      section,
      revenue: getSectionRevenue(section, day),
    }));
    const total = sectionRevs.reduce((s, r) => s + r.revenue, 0) || 1;
    const row: Record<string, any> = { day };
    for (const { section, revenue } of sectionRevs) {
      row[section] = Math.round((revenue / total) * 100);
    }
    return row;
  });
}

// X = praças, segments = sections %
function buildPracaData() {
  const pracas = ["Curitiba/RMC", "Campos Gerais", "Norte PR", "Santa Catarina"];
  const baseWeights: Record<string, number[]> = {
    "Curitiba/RMC":   [0.18, 0.16, 0.15, 0.12, 0.11, 0.10, 0.09, 0.09],
    "Campos Gerais":  [0.20, 0.17, 0.14, 0.13, 0.12, 0.10, 0.08, 0.06],
    "Norte PR":       [0.22, 0.18, 0.15, 0.14, 0.11, 0.09, 0.07, 0.04],
    "Santa Catarina": [0.21, 0.16, 0.15, 0.13, 0.12, 0.10, 0.08, 0.05],
  };
  const sections = Object.keys(PRODUCT_SECTION_MAP);
  return pracas.map(praca => {
    const row: Record<string, any> = { praca };
    const weights = baseWeights[praca];
    sections.forEach((sec, i) => {
      row[sec] = Math.round((weights[i] ?? 0.05) * 100);
    });
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

// ── Formatters ───────────────────────────────────────────────
const fmtM = (v: number) => {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1_000)     return `R$${(v / 1_000).toFixed(0)}K`;
  return `R$${v}`;
};
const fmtFull = (v: number) =>
  `R$${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtVol = (v: number) => v.toLocaleString("pt-BR");
const short = (s: string, n = 22) => s.length > n ? s.slice(0, n) + "…" : s;

const today = new Date();
const todayStr = `${String(today.getDate()).padStart(2,"0")}/${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getFullYear()).slice(2)}`;

// ── Sub-components ───────────────────────────────────────────
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

function RankingPanel({ title, color, items }: {
  title: string; color: string; items: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col border border-border rounded overflow-hidden h-full">
      <div className="px-2 py-1 border-b border-border bg-muted/30">
        <span className="text-[9px] font-bold uppercase" style={{ color }}>{title}</span>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border/40">
        {items.slice(0, 6).map((item, i) => (
          <div key={i} className="px-2 py-1 flex items-center justify-between gap-1">
            <span className="text-[9px] font-semibold truncate" style={{ color }}>{item.label}</span>
            <span className="text-[9px] text-muted-foreground font-mono shrink-0">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBtns({ product, onSuggest, onSimulate, isApproved, isInSimulator }: {
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

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <Select>
      <SelectTrigger className="h-6 text-[10px] px-2 py-0 min-w-[90px] max-w-[120px] border-border bg-background">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__" className="text-[10px]">Todos</SelectItem>
        {options.map(o => (
          <SelectItem key={o} value={o} className="text-[10px]">{o}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── Expandable Section Row ───────────────────────────────────
function SectionRow({ r, maxFat, maxVol, maxRent, onSuggest, onSimulate, isApproved, isInSimulator }: {
  r: { section: string; faturamento: number; volume: number; rentabilidade: number; margem: number };
  maxFat: number; maxVol: number; maxRent: number;
  onSuggest: (p: Product) => void;
  onSimulate: (p: Product) => void;
  isApproved: (id: string) => boolean;
  isInSimulator: (id: string) => boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const fatPct  = Math.round((r.faturamento   / maxFat)  * 100);
  const volPct  = Math.round((r.volume        / maxVol)  * 100);
  const rentPct = Math.round((r.rentabilidade / maxRent) * 100);

  const products = useMemo(() => {
    const groupIds = PRODUCT_SECTION_MAP[r.section] || SECTION_MAP[r.section] || [];
    const prods: Product[] = [];
    for (const gid of groupIds) {
      const group = mockProductGroups.find(g => g.id === gid);
      if (group) prods.push(...group.products);
    }
    return prods.sort((a, b) => (b.sales * b.price) - (a.sales * a.price));
  }, [r.section]);

  return (
    <>
      <div
        className="grid hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/40 select-none"
        style={{ gridTemplateColumns: "28px 1fr 170px 110px 170px 90px" }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center justify-center py-1.5 pl-2">
          {expanded
            ? <ChevronDown className="h-3.5 w-3.5 text-primary" />
            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          }
        </div>
        <div className="px-2 py-1.5 flex items-center">
          <span className={cn("text-[10px] font-semibold", expanded ? "text-primary" : "text-foreground")}>
            {r.section}
          </span>
        </div>
        <div className="px-2 py-1.5 flex flex-col justify-center gap-0.5">
          <span className="text-[9px] text-blue-600 font-semibold text-right leading-none">{fmtFull(r.faturamento)}</span>
          <div className="h-1.5 bg-muted rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-blue-400" style={{ width: `${fatPct}%` }} />
          </div>
        </div>
        <div className="px-2 py-1.5 flex flex-col justify-center gap-0.5">
          <span className="text-[9px] text-orange-500 font-semibold text-right leading-none">{fmtVol(r.volume)}</span>
          <div className="h-1.5 bg-muted rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-orange-300" style={{ width: `${volPct}%` }} />
          </div>
        </div>
        <div className="px-2 py-1.5 flex flex-col justify-center gap-0.5">
          <span className="text-[9px] text-green-700 font-semibold text-right leading-none">{fmtFull(r.rentabilidade)}</span>
          <div className="h-1.5 bg-muted rounded-sm overflow-hidden">
            <div className="h-full rounded-sm bg-green-400" style={{ width: `${rentPct}%` }} />
          </div>
        </div>
        <div className="px-2 py-1.5 flex items-center justify-end">
          <span className="text-[9px] text-purple-600 font-semibold">{(r.margem * 100).toFixed(2)}%</span>
        </div>
      </div>

      {expanded && (
        <div className="bg-muted/10 border-b border-border/60">
          {/* Product sub-header */}
          <div
            className="grid bg-muted/50 border-b border-border/60"
            style={{ gridTemplateColumns: "56px 1fr 140px 90px 140px 70px 64px" }}
          >
            <div className="px-2 py-1 text-[8.5px] font-bold text-muted-foreground uppercase">#</div>
            <div className="px-3 py-1 text-[8.5px] font-bold text-muted-foreground uppercase">Produto</div>
            <div className="px-2 py-1 text-[8.5px] font-bold text-blue-600 uppercase text-right">Faturamento</div>
            <div className="px-2 py-1 text-[8.5px] font-bold text-orange-500 uppercase text-right">Volume</div>
            <div className="px-2 py-1 text-[8.5px] font-bold text-green-700 uppercase text-right">Rentab. c/Sellout</div>
            <div className="px-2 py-1 text-[8.5px] font-bold text-purple-600 uppercase text-right">Margem</div>
            <div className="px-2 py-1 text-[8.5px] font-bold text-muted-foreground uppercase text-center">Ação</div>
          </div>
          {products.slice(0, 15).map((p, pi) => (
            <div
              key={p.id}
              className={cn(
                "grid items-center hover:bg-primary/5 transition-colors border-b border-border/30",
                pi % 2 === 0 ? "bg-background/60" : "bg-muted/5"
              )}
              style={{ gridTemplateColumns: "56px 1fr 140px 90px 140px 70px 64px" }}
            >
              <div className="px-2 py-1.5 text-[8px] text-muted-foreground font-mono text-center">{pi + 1}</div>
              <div className="px-3 py-1.5 min-w-0">
                <p className="text-[9.5px] font-semibold text-foreground leading-tight truncate">{p.name}</p>
                <p className="text-[8px] text-muted-foreground">R$ {p.price?.toFixed(2) ?? "—"}</p>
              </div>
              <div className="px-2 py-1.5 text-[9px] text-blue-600 font-mono text-right">{fmtFull(p.sales * p.price)}</div>
              <div className="px-2 py-1.5 text-[9px] text-orange-500 font-mono text-right">{fmtVol(p.sales)}</div>
              <div className="px-2 py-1.5 text-[9px] text-green-700 font-mono text-right">{fmtFull(p.sales * p.price * p.margin)}</div>
              <div className="px-2 py-1.5 text-[9px] text-purple-600 font-mono text-right">{(p.margin * 100).toFixed(2)}%</div>
              <div className="px-2 py-1.5 flex items-center justify-center">
                <ActionBtns product={p} onSuggest={onSuggest} onSimulate={onSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="py-3 text-center text-[9px] text-muted-foreground">Nenhum produto encontrado</div>
          )}
        </div>
      )}
    </>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function WeeklyComparison() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { approveProduct, isApproved } = useApprovals();
  const { addToSimulator, isInSimulator } = useSimulator();
  const { toast } = useToast();
  const navigate = useNavigate();

  const areaData          = useMemo(() => buildAreaData(), []);
  const allSectionMetrics = useMemo(() => buildAllSectionMetrics(), []);
  const dayGrid           = useMemo(() => buildDayGrid(), []);
  const stackedData       = useMemo(() => buildStackedData(), []);
  const pracaData         = useMemo(() => buildPracaData(), []);
  const globalProducts    = useMemo(() => buildGlobalProducts(), []);

  const sectionDetail = useMemo(() => {
    if (!selectedSection) return null;
    return buildSectionProducts(selectedSection);
  }, [selectedSection]);

  const panelData = sectionDetail ?? globalProducts;

  const maxFat  = allSectionMetrics[0]?.faturamento ?? 1;
  const maxVol  = Math.max(...allSectionMetrics.map(r => r.volume));
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

  const fatRanking    = allSectionMetrics.slice(0, 8).map(r => ({ label: r.section, value: fmtM(r.faturamento) }));
  const volRanking    = [...allSectionMetrics].sort((a, b) => b.volume - a.volume).slice(0, 8).map(r => ({ label: r.section, value: fmtVol(r.volume) }));
  const rentRanking   = [...allSectionMetrics].sort((a, b) => b.rentabilidade - a.rentabilidade).slice(0, 8).map(r => ({ label: r.section, value: fmtM(r.rentabilidade) }));
  const margemRanking = [...allSectionMetrics].sort((a, b) => b.margem - a.margem).slice(0, 8).map(r => ({ label: r.section, value: `${(r.margem * 100).toFixed(2)}%` }));

  const sectionKeys = Object.keys(PRODUCT_SECTION_MAP);

  return (
    <div className="flex flex-col bg-background min-h-0">

      {/* ══ BLOCO 0: Filtros ═══════════════════════════════════ */}
      <div className="border-b border-border bg-muted/20 px-3 py-1.5 flex items-center gap-2 flex-wrap">
        <FilterSelect label="Depto"        options={["Alimentos", "Bebidas", "Higiene", "Limpeza", "FLV"]} />
        <FilterSelect label="Seção"        options={SECTIONS} />
        <FilterSelect label="Grupo Família" options={["Cervejas Long Neck", "Cervejas Lata", "Achocolatados", "Iogurtes"]} />
        <FilterSelect label="Família"      options={["Pilsen", "Premium", "Integral", "Desnatado"]} />
        <FilterSelect label="Praça"        options={["Curitiba/RMC", "Campos Gerais", "Norte PR", "Santa Catarina"]} />
        <FilterSelect label="Dia Semana"   options={DAYS_FULL} />
        <FilterSelect label="Fornecedor"   options={["Ambev", "Heineken", "Coca-Cola", "Nestlé", "JBS"]} />
        <FilterSelect label="Ano e Mês"    options={["Jan/25", "Fev/25", "Mar/25", "Abr/25", "Mai/25"]} />
        <FilterSelect label="Prod. Ofertas" options={["Sim", "Não"]} />
        <span className="ml-auto text-[10px] font-mono text-muted-foreground shrink-0">{todayStr}</span>
      </div>

      {/* ══ BLOCO 1: Area Chart + 4 Rankings ══════════════════ */}
      <div className="border-b border-border flex" style={{ minHeight: 260 }}>
        <div className="flex flex-col border-r border-border" style={{ flex: "0 0 65%" }}>
          <div className="px-3 py-1.5 border-b border-border bg-muted/20">
            <span className="text-[10px] font-semibold text-muted-foreground">
              Faturamento, volume e rentabilidade (c/sellout) por categorias
            </span>
          </div>
          <div className="flex-1 p-2">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={areaData} margin={{ top: 4, right: 8, left: 0, bottom: 52 }}>
                <defs>
                  <linearGradient id="gFat"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="gVol"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gRent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="section" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} angle={-38} textAnchor="end" interval={0} height={56} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={36} />
                <Tooltip content={<AreaTooltip />} />
                <Legend wrapperStyle={{ fontSize: 9 }} formatter={(v) =>
                  v === "faturamento" ? "Faturamento" : v === "volume" ? "Volume" : "Rentabilidade c/ Sellout"
                } />
                <Area type="monotone" dataKey="faturamento"  name="faturamento"  stroke="#3b82f6" fill="url(#gFat)"  strokeWidth={2}   dot={false} />
                <Area type="monotone" dataKey="volume"       name="volume"       stroke="#f97316" fill="url(#gVol)"  strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="rentabilidade" name="rentabilidade" stroke="#22c55e" fill="url(#gRent)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-2">
          <RankingPanel title="Faturamento"       color="#2563eb" items={fatRanking} />
          <RankingPanel title="Volume"            color="#ea580c" items={volRanking} />
          <RankingPanel title="Rentab. c/Sellout" color="#16a34a" items={rentRanking} />
          <RankingPanel title="Margem c/Sellout"  color="#7c3aed" items={margemRanking} />
        </div>
      </div>

      {/* ══ BLOCO 2: Grade de 7 dias ═══════════════════════════ */}
      <div className="border-b border-border">
        <div className="grid grid-cols-7 divide-x divide-border">
          {dayGrid.map(({ day, items }, di) => {
            const fullDay  = DAYS_FULL[di];
            const isWeekend = day === "Sáb" || day === "Dom" || day === "Sex";
            const barColor  = DAY_COLORS[day];
            const maxVal    = items[0]?.revenue ?? 1;
            return (
              <div key={day} className="flex flex-col">
                <div className={cn(
                  "px-2 py-1.5 text-center border-b border-border",
                  isWeekend ? "bg-red-50 dark:bg-red-950/20" : "bg-blue-50 dark:bg-blue-950/20"
                )}>
                  <span className="text-[10px] font-bold leading-tight block text-foreground">{fullDay}</span>
                </div>
                <div className="divide-y divide-border/40">
                  {items.slice(0, 9).map((item) => {
                    const pct = Math.round((item.revenue / maxVal) * 100);
                    return (
                      <button
                        key={item.section}
                        onClick={() => setSelectedSection(selectedSection === item.section ? null : item.section)}
                        className={cn(
                          "w-full px-1.5 py-1 flex flex-col gap-0.5 hover:bg-muted/40 transition-colors text-left",
                          selectedSection === item.section && "bg-muted/60"
                        )}
                      >
                        <span className="text-[8.5px] font-semibold text-foreground leading-tight truncate w-full">
                          {item.section}
                        </span>
                        <div className="w-full h-4 bg-muted/40 rounded-sm overflow-hidden relative">
                          <div
                            className="h-full rounded-sm transition-all flex items-center justify-end pr-1"
                            style={{ width: `${Math.max(pct, 18)}%`, background: barColor }}
                          >
                            <span className="text-[7.5px] font-bold text-white leading-none tabular-nums whitespace-nowrap">
                              {fmtM(item.revenue)}
                            </span>
                          </div>
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

      {/* ══ BLOCO 3: Painel de Produtos 5 colunas ══════════════ */}
      <div className="border-b border-border flex flex-col" style={{ minHeight: 320 }}>
        <div className="px-3 py-1.5 border-b border-border bg-muted/20 flex items-center gap-2">
          <span className="text-[10px] font-semibold text-muted-foreground">
            {selectedSection ? `Produtos — ${selectedSection}` : "TOP Produtos (Todos)"}
          </span>
          {selectedSection && (
            <button
              onClick={() => setSelectedSection(null)}
              className="ml-auto text-[10px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded border border-border hover:bg-muted transition-colors"
            >✕ Todos</button>
          )}
        </div>
        <div className="flex-1 grid grid-cols-5 divide-x divide-border overflow-hidden" style={{ minHeight: 280 }}>
          {/* Faturamento */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-2 py-1.5 border-b border-border text-center bg-muted/20">
              <span className="text-[9.5px] font-bold text-blue-600">Faturamento</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {panelData.byFat.slice(0, 12).map((p) => (
                <div key={p.id} className="px-2 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-semibold text-blue-600 leading-tight truncate">{short(p.name, 18)}</p>
                    <p className="text-[8.5px] text-muted-foreground">{fmtFull(p.sales * p.price)}</p>
                  </div>
                  <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                </div>
              ))}
            </div>
          </div>
          {/* Volume */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-2 py-1.5 border-b border-border text-center bg-muted/20">
              <span className="text-[9.5px] font-bold text-orange-500">Volume</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {panelData.byVol.slice(0, 12).map((p) => (
                <div key={p.id} className="px-2 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-semibold text-orange-500 leading-tight truncate">{short(p.name, 18)}</p>
                    <p className="text-[8.5px] text-muted-foreground">{fmtVol(p.sales)}</p>
                  </div>
                  <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                </div>
              ))}
            </div>
          </div>
          {/* Rentab. */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-2 py-1.5 border-b border-border text-center bg-muted/20">
              <span className="text-[9.5px] font-bold text-green-600">Rentab. c/Sellout</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {panelData.byRent.slice(0, 12).map((p) => (
                <div key={p.id} className="px-2 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-semibold text-green-600 leading-tight truncate">{short(p.name, 18)}</p>
                    <p className="text-[8.5px] text-muted-foreground">{fmtFull(p.sales * p.price * p.margin)}</p>
                  </div>
                  <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                </div>
              ))}
            </div>
          </div>
          {/* TOP em Campanha */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-2 py-1.5 border-b border-border flex items-center justify-center gap-1 bg-muted/20">
              <Tag className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="text-[9.5px] font-bold text-primary">TOP em Campanha</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {panelData.withCampaign.slice(0, 12).map((p) => (
                <div key={p.id} className="px-2 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-semibold text-primary leading-tight truncate">{short(p.name, 18)}</p>
                    <p className="text-[8.5px] text-muted-foreground">{fmtFull(p.sales * p.price)}</p>
                  </div>
                  <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                </div>
              ))}
              {panelData.withCampaign.length === 0 && (
                <p className="text-[9.5px] text-muted-foreground px-2 py-4 text-center">Nenhum em campanha</p>
              )}
            </div>
          </div>
          {/* TOP SEM Campanha */}
          <div className="flex flex-col overflow-hidden">
            <div className="px-2 py-1.5 border-b border-border flex items-center justify-center gap-1 bg-muted/20">
              <Sparkles className="h-3 w-3 text-orange-500 flex-shrink-0" />
              <span className="text-[9.5px] font-bold text-orange-500 leading-tight">TOP SEM Campanha</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/40">
              {panelData.noCampaign.slice(0, 12).map((p) => (
                <div key={p.id} className="px-2 py-1.5 flex items-center justify-between gap-1 hover:bg-muted/30">
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-semibold text-orange-500 leading-tight truncate">{short(p.name, 18)}</p>
                    <p className="text-[8.5px] text-muted-foreground">{fmtFull(p.sales * p.price * p.margin)}</p>
                  </div>
                  <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
                </div>
              ))}
              {panelData.noCampaign.length === 0 && (
                <p className="text-[9.5px] text-muted-foreground px-2 py-4 text-center">Sem oportunidades</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ BLOCO 4: Participação (categoria) + Praça ══════════ */}
      <div className="flex border-b border-border">
        {/* X=dias, empilhado por seção */}
        <div className="border-r border-border p-3" style={{ flex: "0 0 60%" }}>
          <p className="text-[10px] font-semibold text-muted-foreground text-center mb-2">
            Participação em faturamento por categoria e dia da semana (Acumulado Rede)
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stackedData} margin={{ top: 5, right: 10, left: 5, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--foreground))" }} interval={0} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={30} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                formatter={(v, name) => [`${v}%`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 9 }} iconSize={9} iconType="square" />
              {sectionKeys.map((section, i) => (
                <Bar key={section} dataKey={section} stackId="a"
                  fill={SECTION_COLORS[section] ?? `hsl(${(i * 47) % 360} 65% 52%)`}
                  radius={i === sectionKeys.length - 1 ? [3, 3, 0, 0] : undefined}
                >
                  {stackedData.map((_, di) => (
                    <Cell key={`c-${di}`} fill={SECTION_COLORS[section] ?? `hsl(${(i * 47) % 360} 65% 52%)`} />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* X=praças, empilhado por seção */}
        <div className="p-3 flex-1">
          <p className="text-[10px] font-semibold text-muted-foreground text-center mb-2">
            Participação em faturamento por praça e categoria
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pracaData} margin={{ top: 5, right: 10, left: 5, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="praca" tick={{ fontSize: 8, fill: "hsl(var(--foreground))" }} angle={-15} textAnchor="end" interval={0} height={40} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} width={30} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                formatter={(v, name) => [`${v}%`, name]}
              />
              {sectionKeys.map((section, i) => (
                <Bar key={section} dataKey={section} stackId="b"
                  fill={SECTION_COLORS[section] ?? `hsl(${(i * 47) % 360} 65% 52%)`}
                  radius={i === sectionKeys.length - 1 ? [3, 3, 0, 0] : undefined}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ══ BLOCO 5: Tabela de Seções Expandível ═══════════════ */}
      <div className="border-b border-border">
        {/* Header */}
        <div
          className="grid bg-muted/60 border-b border-border sticky top-0 z-10"
          style={{ gridTemplateColumns: "28px 1fr 170px 110px 170px 90px" }}
        >
          <div className="px-2 py-1.5" />
          <div className="px-2 py-1.5 text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">Seção</div>
          <div className="px-2 py-1.5 text-[9.5px] font-bold text-blue-600 uppercase text-right tracking-wide">Faturamento</div>
          <div className="px-2 py-1.5 text-[9.5px] font-bold text-orange-500 uppercase text-right tracking-wide">Volume</div>
          <div className="px-2 py-1.5 text-[9.5px] font-bold text-green-700 uppercase text-right leading-tight tracking-wide">Rentab. c/ Sellout</div>
          <div className="px-2 py-1.5 text-[9.5px] font-bold text-purple-600 uppercase text-right tracking-wide">MargemSellout</div>
        </div>

        {allSectionMetrics.map(r => (
          <SectionRow
            key={r.section}
            r={r}
            maxFat={maxFat}
            maxVol={maxVol}
            maxRent={maxRent}
            onSuggest={handleSuggest}
            onSimulate={handleSimulate}
            isApproved={isApproved}
            isInSimulator={isInSimulator}
          />
        ))}

        {/* Totals */}
        <div
          className="grid bg-muted/60 border-t border-border"
          style={{ gridTemplateColumns: "28px 1fr 170px 110px 170px 90px" }}
        >
          <div />
          <div className="px-3 py-2 text-[10px] font-bold text-foreground">Total</div>
          <div className="px-2 py-2 text-[9.5px] text-blue-700 font-bold text-right">
            {fmtFull(allSectionMetrics.reduce((s, r) => s + r.faturamento, 0))}
          </div>
          <div className="px-2 py-2 text-[9.5px] text-orange-600 font-bold text-right">
            {fmtVol(allSectionMetrics.reduce((s, r) => s + r.volume, 0))}
          </div>
          <div className="px-2 py-2 text-[9.5px] text-green-800 font-bold text-right">
            {fmtFull(allSectionMetrics.reduce((s, r) => s + r.rentabilidade, 0))}
          </div>
          <div className="px-2 py-2 text-[9.5px] text-purple-700 font-bold text-right">
            {(allSectionMetrics.reduce((s, r) => s + r.margem, 0) / allSectionMetrics.length * 100).toFixed(2)}%
          </div>
        </div>
      </div>

    </div>
  );
}
