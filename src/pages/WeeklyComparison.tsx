import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { mockProductGroups } from "@/data/mockData";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useSimulator } from "@/contexts/SimulatorContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Send, Zap, Tag, Sparkles, ChevronDown, ChevronRight, X } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// ── Constants ────────────────────────────────────────────────
const DAYS_FULL  = ["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado","Domingo"];
const DAYS_SHORT = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];

const DAY_MULT: Record<string, number> = {
  "Seg":0.65,"Ter":0.72,"Qua":0.80,"Qui":0.85,"Sex":1.20,"Sáb":1.55,"Dom":1.23,
};
const DAY_BOOST: Record<string, string[]> = {
  "Seg":["Laticínios","Padaria","Limpeza","Frutas & Hort.","Bebidas Frias","Açougue"],
  "Ter":["Refrigerantes","Açougue","Bebidas Frias","Laticínios","Padaria"],
  "Qua":["Cervejas","Energéticos","Bebidas Frias","Açougue","Laticínios","Refrigerantes"],
  "Qui":["Açougue","Laticínios","Cervejas","Refrigerantes","Frutas & Hort.","Padaria"],
  "Sex":["Cervejas","Refrigerantes","Açougue","Bebidas Frias","Laticínios"],
  "Sáb":["Cervejas","Refrigerantes","Açougue","Energéticos","Bebidas Frias","Frutas & Hort.","Laticínios"],
  "Dom":["Laticínios","Padaria","Refrigerantes","Açougue","Cervejas","Frutas & Hort."],
};
const DAY_COLORS: Record<string, string> = {
  "Seg":"#2563eb","Ter":"#1d4ed8","Qua":"#1e40af",
  "Qui":"#1e3a8a","Sex":"#be123c","Sáb":"#9f1239","Dom":"#7f1d1d",
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
  "Frios":         "#ec4899",
  "Congelados":    "#14b8a6",
  "Mercearia":     "#a3a3a3",
};

// Map section name → group IDs
const SECTION_TO_GROUPS: Record<string, string[]> = {
  "Cervejas":      ["80"],
  "Refrigerantes": ["81"],
  "Laticínios":    ["82"],
  "Energéticos":   ["88"],
  "Açougue":       ["90"],
  "Padaria":       ["91"],
  "Água":          ["85"],
  "Frios":         ["92"],
  "Congelados":    ["94"],
  "Frutas & Hort.":["95"],
  "Mercearia":     ["96"],
};

// Departamentos → seções
const DEPTO_TO_SECTIONS: Record<string, string[]> = {
  "Bebidas":    ["Cervejas","Refrigerantes","Energéticos","Água"],
  "Alimentos":  ["Açougue","Padaria","Laticínios","Frios","Congelados","Mercearia","Frutas & Hort."],
  "Hortifruti": ["Frutas & Hort."],
  "Congelados": ["Congelados"],
};

// Fornecedores por seção (mock)
const FORNECEDORES_BY_SECTION: Record<string, string> = {
  "Cervejas":"Ambev","Refrigerantes":"Coca-Cola","Laticínios":"Nestlé",
  "Energéticos":"Red Bull","Açougue":"JBS","Padaria":"Bauducco",
  "Água":"Minalba","Frios":"Sadia","Congelados":"Sadia",
  "Frutas & Hort.":"Hortifruti","Mercearia":"Nestlé",
};

const FILIAIS = ["Matriz Centro","Batel","São José dos Pinhais","Ponta Grossa","Joinville Norte"];

// All group IDs for "all sections" 
const ALL_GROUP_IDS = Object.values(SECTION_TO_GROUPS).flat();

// ── Formatters ───────────────────────────────────────────────
const fmtM = (v: number) => {
  if (v >= 1_000_000) return `R$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `R$${(v / 1_000).toFixed(0)}K`;
  return `R$${v}`;
};
const fmtFull = (v: number) =>
  `R$${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtVol = (v: number) => v.toLocaleString("pt-BR");
const short = (s: string, n = 22) => s.length > n ? s.slice(0, n) + "…" : s;

const today = new Date();
const todayStr = `${String(today.getDate()).padStart(2,"0")}/${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getFullYear()).slice(2)}`;

// ── Data helpers ─────────────────────────────────────────────
function getSectionRevenue(section: string, dayShort: string, mult = 1): number {
  const groupIds = SECTION_TO_GROUPS[section] || [];
  let base = 0;
  for (const gid of groupIds) {
    const g = mockProductGroups.find(g => g.id === gid);
    if (g) base += g.products.reduce((s, p) => s + p.sales * p.price, 0) / 120;
  }
  const dayMult = DAY_MULT[dayShort] ?? 1;
  const boosted = (DAY_BOOST[dayShort] || []).includes(section) ? 1.35 : 0.72;
  return Math.round(base * dayMult * boosted * mult);
}

function getProductsForSections(sections: string[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const sec of sections) {
    const gids = SECTION_TO_GROUPS[sec] || [];
    for (const gid of gids) {
      const g = mockProductGroups.find(g => g.id === gid);
      if (g) {
        for (const p of g.products) {
          if (!seen.has(p.id)) { seen.add(p.id); out.push(p); }
        }
      }
    }
  }
  return out;
}

function calcPctVsMon(v: number, monV: number): string {
  if (!monV) return "";
  const pct = Math.round(((v - monV) / monV) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

// ── Filter state type ─────────────────────────────────────────
interface Filters {
  depto: string;
  secao: string;
  grupo: string;
  filial: string;
  familia: string;
  praca: string;
  diaSemana: string;
  fornecedor: string;
  anoMes: string;
  ofertas: string;
}

// ── FilterSelect ─────────────────────────────────────────────
function FilterSelect({
  label, options, value, onChange,
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-md border border-border/60 bg-card/80 px-2 py-1.5 shadow-sm">
      <p className="text-[9.5px] font-semibold text-muted-foreground leading-none mb-1.5">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "h-7 text-[11px] px-2 py-0 min-w-[100px] max-w-[150px] border-border bg-background transition-colors",
            value !== "__all__" && "border-primary text-primary bg-primary/5"
          )}
        >
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__" className="text-[11px]">Todos</SelectItem>
          {options.map(o => (
            <SelectItem key={o} value={o} className="text-[11px]">{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ── MiniBar ───────────────────────────────────────────────────
function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 bg-muted rounded-sm overflow-hidden mt-0.5">
      <div className="h-full rounded-sm transition-all" style={{ width: `${Math.max(pct, 2)}%`, background: color }} />
    </div>
  );
}

// ── ActionBtns ────────────────────────────────────────────────
function ActionBtns({ product, onSuggest, onSimulate, isApproved, isInSimulator }: {
  product: Product; onSuggest: (p: Product) => void; onSimulate: (p: Product) => void;
  isApproved: (id: string) => boolean; isInSimulator: (id: string) => boolean;
}) {
  return (
    <div className="flex gap-1 flex-shrink-0">
      <button
        onClick={e => { e.stopPropagation(); onSuggest(product); }}
        disabled={isApproved(product.id)}
        title="Sugerir"
        className={cn(
          "w-6 h-6 rounded flex items-center justify-center border transition-colors",
          isApproved(product.id)
            ? "border-green-300 text-green-600 bg-green-50 cursor-default"
            : "border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
        )}
      >
        {isApproved(product.id) ? "✓" : <Send className="h-3 w-3" />}
      </button>
      <button
        onClick={e => { e.stopPropagation(); onSimulate(product); }}
        disabled={isInSimulator(product.id)}
        title="Simular"
        className={cn(
          "w-6 h-6 rounded flex items-center justify-center border transition-colors",
          isInSimulator(product.id)
            ? "border-violet-300 text-violet-600 bg-violet-50 cursor-default"
            : "border-violet-300 text-violet-600 hover:bg-violet-600 hover:text-white"
        )}
      >
        {isInSimulator(product.id) ? "✓" : <Zap className="h-3 w-3" />}
      </button>
    </div>
  );
}

// ── RankingPanel ──────────────────────────────────────────────
function RankingPanel({ title, color, items }: {
  title: string; color: string; items: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col border border-border rounded-lg overflow-hidden h-full">
      <div className="px-3 py-1.5 border-b border-border bg-muted/30">
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>{title}</span>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border/40">
        {items.slice(0, 6).map((item, i) => (
          <div key={i} className="px-3 py-1.5 flex items-center justify-between gap-2">
            <span className="text-[10px] font-medium truncate text-foreground">{item.label}</span>
            <span className="text-[10px] text-muted-foreground font-mono shrink-0">{item.value}</span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[10px] text-muted-foreground p-3 text-center">Sem dados</p>
        )}
      </div>
    </div>
  );
}

// ── ProductLeafRow ────────────────────────────────────────────
function ProductLeafRow({ p, maxFat, maxVol, maxRent, onSuggest, onSimulate, isApproved, isInSimulator, depth = 3 }: {
  p: Product; maxFat: number; maxVol: number; maxRent: number;
  onSuggest: (p: Product) => void; onSimulate: (p: Product) => void;
  isApproved: (id: string) => boolean; isInSimulator: (id: string) => boolean;
  depth?: number;
}) {
  const fat  = p.sales * p.price;
  const rent = fat * p.margin;
  const paddingLeft = depth === 3 ? "pl-14" : "pl-20";
  return (
    <div
      className="grid items-center hover:bg-primary/5 transition-colors border-b border-border/20"
      style={{ gridTemplateColumns: "32px 1fr 180px 120px 180px 96px 72px" }}
    >
      <div />
      <div className={cn("py-2 min-w-0 flex items-center gap-2", paddingLeft)}>
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-foreground leading-tight truncate">{p.name}</p>
          <p className="text-[10px] text-muted-foreground">R$ {p.price?.toFixed(2) ?? "—"}</p>
        </div>
      </div>
      <div className="px-2 py-2">
        <span className="text-[10px] text-blue-600 font-mono block text-right leading-none">{fmtFull(fat)}</span>
        <MiniBar pct={Math.round((fat / maxFat) * 100)} color="#3b82f6" />
      </div>
      <div className="px-2 py-2">
        <span className="text-[10px] text-orange-500 font-mono block text-right leading-none">{fmtVol(p.sales)}</span>
        <MiniBar pct={Math.round((p.sales / maxVol) * 100)} color="#f97316" />
      </div>
      <div className="px-2 py-2">
        <span className="text-[10px] text-green-700 font-mono block text-right leading-none">{fmtFull(rent)}</span>
        <MiniBar pct={Math.round((rent / maxRent) * 100)} color="#22c55e" />
      </div>
      <div className="px-2 py-2 text-right">
        <span className="text-[10px] text-purple-600 font-mono">{(p.margin * 100).toFixed(2)}%</span>
      </div>
      <div className="px-2 py-2 flex items-center justify-center">
        <ActionBtns product={p} onSuggest={onSuggest} onSimulate={onSimulate} isApproved={isApproved} isInSimulator={isInSimulator} />
      </div>
    </div>
  );
}

// ── SubgroupRow ───────────────────────────────────────────────
function SubgroupRow({ name, products, maxFat, maxVol, maxRent, onSuggest, onSimulate, isApproved, isInSimulator }: {
  name: string; products: Product[];
  maxFat: number; maxVol: number; maxRent: number;
  onSuggest: (p: Product) => void; onSimulate: (p: Product) => void;
  isApproved: (id: string) => boolean; isInSimulator: (id: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const fat  = products.reduce((s, p) => s + p.sales * p.price, 0);
  const vol  = products.reduce((s, p) => s + p.sales, 0);
  const rent = products.reduce((s, p) => s + p.sales * p.price * p.margin, 0);
  const avgM = products.length ? products.reduce((s, p) => s + p.margin, 0) / products.length : 0;

  return (
    <>
      <div
        className="grid items-center hover:bg-blue-50/40 dark:hover:bg-blue-950/10 cursor-pointer transition-colors border-b border-border/20 bg-muted/10 select-none"
        style={{ gridTemplateColumns: "32px 1fr 180px 120px 180px 96px 72px" }}
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center justify-center py-2">
          {open
            ? <ChevronDown className="h-3 w-3 text-blue-500" />
            : <ChevronRight className="h-3 w-3 text-muted-foreground/60" />}
        </div>
        <div className="py-2 min-w-0 flex items-center gap-2 pl-10">
          <span className="w-1.5 h-4 rounded-sm bg-blue-400/60 flex-shrink-0" />
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 truncate">{name}</span>
          <span className="text-[9.5px] text-muted-foreground shrink-0">({products.length})</span>
        </div>
        <div className="px-2 py-2">
          <span className="text-[10px] text-blue-600 font-mono block text-right leading-none">{fmtFull(fat)}</span>
          <MiniBar pct={Math.round((fat / maxFat) * 100)} color="#93c5fd" />
        </div>
        <div className="px-2 py-2">
          <span className="text-[10px] text-orange-500 font-mono block text-right leading-none">{fmtVol(vol)}</span>
          <MiniBar pct={Math.round((vol / maxVol) * 100)} color="#fdba74" />
        </div>
        <div className="px-2 py-2">
          <span className="text-[10px] text-green-700 font-mono block text-right leading-none">{fmtFull(rent)}</span>
          <MiniBar pct={Math.round((rent / maxRent) * 100)} color="#86efac" />
        </div>
        <div className="px-2 py-2 text-right">
          <span className="text-[10px] text-purple-600 font-mono">{(avgM * 100).toFixed(2)}%</span>
        </div>
        <div />
      </div>
      {open && products.map(p => (
        <ProductLeafRow
          key={p.id} p={p} depth={4}
          maxFat={maxFat} maxVol={maxVol} maxRent={maxRent}
          onSuggest={onSuggest} onSimulate={onSimulate}
          isApproved={isApproved} isInSimulator={isInSimulator}
        />
      ))}
    </>
  );
}

// ── GroupRow ──────────────────────────────────────────────────
function GroupRow({ group, maxFat, maxVol, maxRent, onSuggest, onSimulate, isApproved, isInSimulator }: {
  group: { id: string; name: string; products: Product[] };
  maxFat: number; maxVol: number; maxRent: number;
  onSuggest: (p: Product) => void; onSimulate: (p: Product) => void;
  isApproved: (id: string) => boolean; isInSimulator: (id: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const fat  = group.products.reduce((s, p) => s + p.sales * p.price, 0);
  const vol  = group.products.reduce((s, p) => s + p.sales, 0);
  const rent = group.products.reduce((s, p) => s + p.sales * p.price * p.margin, 0);
  const avgM = group.products.length
    ? group.products.reduce((s, p) => s + p.margin, 0) / group.products.length
    : 0;

  const subMax = useMemo(() => ({
    fat:  Math.max(...group.products.map(p => p.sales * p.price), 1),
    vol:  Math.max(...group.products.map(p => p.sales), 1),
    rent: Math.max(...group.products.map(p => p.sales * p.price * p.margin), 1),
  }), [group.products]);

  // Build subgroups: split products into meaningful subgroups by name prefix
  const subgroups = useMemo(() => {
    const buckets = new Map<string, Product[]>();
    group.products.forEach((p) => {
      const words = p.name.split(" ");
      // Use first 2 words as subgroup key if possible
      const key = words.length >= 2 ? `${words[0]} ${words[1]}` : words[0] || "Subgrupo";
      const arr = buckets.get(key) || [];
      arr.push(p);
      buckets.set(key, arr);
    });
    return Array.from(buckets.entries());
  }, [group.products]);

  return (
    <>
      <div
        className="grid items-center hover:bg-muted/40 cursor-pointer transition-colors border-b border-border/30 select-none"
        style={{ gridTemplateColumns: "32px 1fr 180px 120px 180px 96px 72px" }}
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center justify-center py-2 pl-2">
          {open
            ? <ChevronDown className="h-3.5 w-3.5 text-primary" />
            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        </div>
        <div className="py-2 min-w-0 flex items-center gap-2 pl-5">
          <span className="text-[11px] font-bold text-foreground/80 truncate">{group.name}</span>
          <span className="text-[9.5px] text-muted-foreground shrink-0">({group.products.length})</span>
        </div>
        <div className="px-2 py-2">
          <span className="text-[10px] text-blue-600 font-mono block text-right leading-none">{fmtFull(fat)}</span>
          <MiniBar pct={Math.round((fat / maxFat) * 100)} color="#60a5fa" />
        </div>
        <div className="px-2 py-2">
          <span className="text-[10px] text-orange-500 font-mono block text-right leading-none">{fmtVol(vol)}</span>
          <MiniBar pct={Math.round((vol / maxVol) * 100)} color="#fdba74" />
        </div>
        <div className="px-2 py-2">
          <span className="text-[10px] text-green-700 font-mono block text-right leading-none">{fmtFull(rent)}</span>
          <MiniBar pct={Math.round((rent / maxRent) * 100)} color="#86efac" />
        </div>
        <div className="px-2 py-2 text-right">
          <span className="text-[10px] text-purple-600 font-mono">{(avgM * 100).toFixed(2)}%</span>
        </div>
        <div />
      </div>
      {open && subgroups.map(([subName, subProds]) => (
        <SubgroupRow
          key={subName}
          name={subName}
          products={subProds}
          maxFat={subMax.fat} maxVol={subMax.vol} maxRent={subMax.rent}
          onSuggest={onSuggest} onSimulate={onSimulate}
          isApproved={isApproved} isInSimulator={isInSimulator}
        />
      ))}
    </>
  );
}

// ── SectionRow ────────────────────────────────────────────────
function SectionRow({ r, maxFat, maxVol, maxRent, onSuggest, onSimulate, isApproved, isInSimulator }: {
  r: { section: string; fat: number; vol: number; rent: number; margem: number };
  maxFat: number; maxVol: number; maxRent: number;
  onSuggest: (p: Product) => void; onSimulate: (p: Product) => void;
  isApproved: (id: string) => boolean; isInSimulator: (id: string) => boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const groups = useMemo(() => {
    const gids = SECTION_TO_GROUPS[r.section] || [];
    return gids.map(gid => mockProductGroups.find(g => g.id === gid)).filter(Boolean) as typeof mockProductGroups;
  }, [r.section]);

  const allProds = useMemo(() => groups.flatMap(g => g.products), [groups]);
  const subMax = useMemo(() => ({
    fat:  Math.max(...allProds.map(p => p.sales * p.price), 1),
    vol:  Math.max(...allProds.map(p => p.sales), 1),
    rent: Math.max(...allProds.map(p => p.sales * p.price * p.margin), 1),
  }), [allProds]);

  const sectionColor = SECTION_COLORS[r.section] ?? "hsl(var(--primary))";

  return (
    <>
      <div
        className="grid hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/40 select-none"
        style={{ gridTemplateColumns: "32px 1fr 180px 120px 180px 96px 72px" }}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center justify-center py-2.5 pl-2">
          {expanded
            ? <ChevronDown className="h-4 w-4 text-primary" />
            : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="px-2 py-2.5 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: sectionColor }} />
          <span className={cn("text-[12px] font-bold", expanded ? "text-primary" : "text-foreground")}>
            {r.section}
          </span>
          <span className="text-[10px] text-muted-foreground">({allProds.length})</span>
        </div>
        <div className="px-2 py-2.5">
          <span className="text-[11px] text-blue-600 font-semibold block text-right leading-none">{fmtFull(r.fat)}</span>
          <MiniBar pct={Math.round((r.fat / maxFat) * 100)} color="#3b82f6" />
        </div>
        <div className="px-2 py-2.5">
          <span className="text-[11px] text-orange-500 font-semibold block text-right leading-none">{fmtVol(r.vol)}</span>
          <MiniBar pct={Math.round((r.vol / maxVol) * 100)} color="#f97316" />
        </div>
        <div className="px-2 py-2.5">
          <span className="text-[11px] text-green-700 font-semibold block text-right leading-none">{fmtFull(r.rent)}</span>
          <MiniBar pct={Math.round((r.rent / maxRent) * 100)} color="#22c55e" />
        </div>
        <div className="px-2 py-2.5 flex items-center justify-end">
          <span className="text-[11px] text-purple-600 font-semibold">{(r.margem * 100).toFixed(2)}%</span>
        </div>
        <div />
      </div>
      {expanded && (
        <div className="bg-muted/5">
          {groups.length > 0 ? groups.map(grp => (
            <GroupRow
              key={grp.id} group={grp}
              maxFat={subMax.fat} maxVol={subMax.vol} maxRent={subMax.rent}
              onSuggest={onSuggest} onSimulate={onSimulate}
              isApproved={isApproved} isInSimulator={isInSimulator}
            />
          )) : (
            <p className="py-4 text-center text-[11px] text-muted-foreground">Sem grupos</p>
          )}
        </div>
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function WeeklyComparison() {
  const { approveProduct, isApproved } = useApprovals();
  const { addToSimulator, isInSimulator } = useSimulator();
  const { toast } = useToast();
  const navigate = useNavigate();

  // ── Filter state ──────────────────────────────────────────
  const [filters, setFilters] = useState<Filters>({
    depto: "__all__", secao: "__all__", grupo: "__all__", filial: "__all__",
    familia: "__all__", praca: "__all__", diaSemana: "__all__",
    fornecedor: "__all__", anoMes: "__all__", ofertas: "__all__",
  });
  const [activeSections, setActiveSections] = useState<string[]>(Object.keys(SECTION_TO_GROUPS));
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");

  const setFilter = (key: keyof Filters) => (val: string) =>
    setFilters(prev => ({ ...prev, [key]: val }));

  // ── Derived: which sections are visible based on filters ──
  const visibleSections = useMemo<string[]>(() => {
    let secs = Object.keys(SECTION_TO_GROUPS);
    if (filters.depto !== "__all__") {
      const allowed = DEPTO_TO_SECTIONS[filters.depto] ?? [];
      secs = secs.filter(s => allowed.includes(s));
    }
    if (filters.secao !== "__all__") {
      secs = secs.filter(s => s === filters.secao);
    }
    if (filters.fornecedor !== "__all__") {
      secs = secs.filter(s => FORNECEDORES_BY_SECTION[s] === filters.fornecedor);
    }
    return secs;
  }, [filters.depto, filters.secao, filters.fornecedor]);

  // When filters change, sync activeSections to visible only
  const effectiveActive = activeSections.filter(s => visibleSections.includes(s));

  // ── Derived: filtered days ────────────────────────────────
  const visibleDays = useMemo<string[]>(() => {
    if (filters.diaSemana !== "__all__") {
      const idx = DAYS_FULL.indexOf(filters.diaSemana);
      return idx >= 0 ? [DAYS_SHORT[idx]] : DAYS_SHORT;
    }
    return DAYS_SHORT;
  }, [filters.diaSemana]);

  // ── Praça multiplier ──────────────────────────────────────
  const pracaMult = useMemo(() => {
    const map: Record<string, number> = {
      "Curitiba/RMC":1.4,"Campos Gerais":1.1,"Norte PR":0.9,"Santa Catarina":1.2,
    };
    return filters.praca !== "__all__" ? (map[filters.praca] ?? 1) : 1;
  }, [filters.praca]);

  // ── Área Chart data (per visible day, per visible section) ─
  const areaData = useMemo(() => {
    return visibleDays.map(day => {
      const row: Record<string, any> = { day };
      for (const sec of visibleSections) {
        row[sec] = getSectionRevenue(sec, day, pracaMult);
      }
      return row;
    });
  }, [visibleSections, visibleDays, pracaMult]);

  // ── Section metrics (table data) ─────────────────────────
  const sectionMetrics = useMemo(() => {
    return visibleSections.map(section => {
      const gids = SECTION_TO_GROUPS[section] || [];
      let fat = 0, vol = 0, rent = 0, marginSum = 0, count = 0;
      for (const gid of gids) {
        const g = mockProductGroups.find(g => g.id === gid);
        if (g) {
          for (const p of g.products) {
            fat += p.sales * p.price;
            vol += p.sales;
            rent += p.sales * p.price * p.margin;
            marginSum += p.margin;
            count++;
          }
        }
      }
      // Apply praça and day multipliers
      const dayMultiplier = filters.diaSemana !== "__all__"
        ? (DAY_MULT[DAYS_SHORT[DAYS_FULL.indexOf(filters.diaSemana)]] ?? 1)
        : (Object.values(DAY_MULT).reduce((a, b) => a + b, 0) / DAYS_SHORT.length);
      const boost = filters.diaSemana !== "__all__"
        ? ((DAY_BOOST[DAYS_SHORT[DAYS_FULL.indexOf(filters.diaSemana)]] || []).includes(section) ? 1.35 : 0.72)
        : 1;
      const factor = (dayMultiplier * boost * pracaMult) / 80;

      return {
        section,
        fat: Math.round(fat * factor),
        vol: Math.round(vol / 10),
        rent: Math.round(rent * factor),
        margem: count > 0 ? marginSum / count : 0,
      };
    }).sort((a, b) => b.fat - a.fat);
  }, [visibleSections, filters.diaSemana, pracaMult]);

  const maxFat  = sectionMetrics[0]?.fat ?? 1;
  const maxVol  = Math.max(...sectionMetrics.map(r => r.vol), 1);
  const maxRent = Math.max(...sectionMetrics.map(r => r.rent), 1);

  // ── Day grid ──────────────────────────────────────────────
  const dayGrid = useMemo(() => {
    return visibleDays.map((day, di) => {
      const items = visibleSections.map(section => ({
        section,
        revenue: getSectionRevenue(section, day, pracaMult),
      })).sort((a, b) => b.revenue - a.revenue);
      return { day, fullDay: DAYS_FULL[DAYS_SHORT.indexOf(day)] ?? day, items };
    });
  }, [visibleSections, visibleDays, pracaMult]);

  // ── Stacked chart ─────────────────────────────────────────
  const stackedData = useMemo(() => {
    return visibleDays.map(day => {
      const revs = visibleSections.map(s => ({ s, v: getSectionRevenue(s, day, pracaMult) }));
      const total = revs.reduce((a, r) => a + r.v, 0) || 1;
      const row: Record<string, any> = { day };
      for (const { s, v } of revs) row[s] = Math.round((v / total) * 100);
      return row;
    });
  }, [visibleSections, visibleDays, pracaMult]);

  // ── Praça stacked ─────────────────────────────────────────
  const pracaData = useMemo(() => {
    const pracas = filters.praca !== "__all__"
      ? [filters.praca]
      : ["Curitiba/RMC","Campos Gerais","Norte PR","Santa Catarina"];
    const weights: Record<string, number[]> = {
      "Curitiba/RMC":[0.20,0.18,0.16,0.14,0.12,0.10,0.06,0.04],
      "Campos Gerais":[0.22,0.19,0.15,0.13,0.11,0.09,0.07,0.04],
      "Norte PR":[0.24,0.20,0.16,0.14,0.11,0.08,0.05,0.02],
      "Santa Catarina":[0.21,0.17,0.15,0.13,0.12,0.10,0.08,0.04],
    };
    return pracas.map(praca => {
      const row: Record<string, any> = { praca };
      visibleSections.forEach((s, i) => { row[s] = Math.round((weights[praca]?.[i] ?? 0.05) * 100); });
      return row;
    });
  }, [visibleSections, filters.praca]);

  // ── Products panel ────────────────────────────────────────
  const participationSections = useMemo(() => {
    const totals = visibleSections.map(sec => ({
      sec,
      total: stackedData.reduce((sum, row) => sum + (Number(row[sec]) || 0), 0),
    })).sort((a, b) => b.total - a.total);
    return totals.slice(0, 6).map(item => item.sec);
  }, [visibleSections, stackedData]);

  const panelProducts = useMemo(() => {
    const prods = selectedSection
      ? getProductsForSections([selectedSection])
      : getProductsForSections(visibleSections);
    const sorted = (fn: (a: Product, b: Product) => number) => [...prods].sort(fn);
    return {
      byFat:        sorted((a, b) => (b.sales * b.price) - (a.sales * a.price)),
      byVol:        sorted((a, b) => b.sales - a.sales),
      byRent:       sorted((a, b) => (b.sales * b.price * b.margin) - (a.sales * a.price * a.margin)),
      withCampaign: prods.filter(p => p.hasAd).sort((a, b) => (b.sales * b.price) - (a.sales * a.price)),
      noCampaign:   prods.filter(p => !p.hasAd).sort((a, b) => (b.sales * b.price * b.margin) - (a.sales * a.price * a.margin)),
    };
  }, [visibleSections, selectedSection]);

  // ── Rankings ──────────────────────────────────────────────
  const fatRank  = sectionMetrics.slice(0, 8).map(r => ({ label: r.section, value: fmtM(r.fat) }));
  const volRank  = [...sectionMetrics].sort((a, b) => b.vol - a.vol).slice(0, 8).map(r => ({ label: r.section, value: fmtVol(r.vol) }));
  const rentRank = [...sectionMetrics].sort((a, b) => b.rent - a.rent).slice(0, 8).map(r => ({ label: r.section, value: fmtM(r.rent) }));
  const margRank = [...sectionMetrics].sort((a, b) => b.margem - a.margem).slice(0, 8).map(r => ({ label: r.section, value: `${(r.margem * 100).toFixed(2)}%` }));

  // ── Handlers ──────────────────────────────────────────────
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

  // ── Active filter badge count ─────────────────────────────
  const activeFilterCount = Object.values(filters).filter(v => v !== "__all__").length + (customDateStart ? 1 : 0) + (customDateEnd ? 1 : 0);

  const resetFilters = () => {
    setFilters({
      depto:"__all__",secao:"__all__",grupo:"__all__",filial:"__all__",familia:"__all__",
      praca:"__all__",diaSemana:"__all__",fornecedor:"__all__",anoMes:"__all__",ofertas:"__all__",
    });
    setActiveSections(Object.keys(SECTION_TO_GROUPS));
    setCustomDateStart("");
    setCustomDateEnd("");
  };

  return (
    <div className="flex flex-col bg-background min-h-0">

      {/* ══ FILTROS ═══════════════════════════════════════════ */}
      <div className="border-b border-border/80 bg-muted/50 dark:bg-muted/20 px-4 py-3 flex items-end gap-2 flex-wrap shadow-sm">
        <FilterSelect label="Depto"       options={Object.keys(DEPTO_TO_SECTIONS)}              value={filters.depto}       onChange={setFilter("depto")} />
        <FilterSelect label="Seção"       options={Object.keys(SECTION_TO_GROUPS)}              value={filters.secao}       onChange={v => { setFilter("secao")(v); if (v !== "__all__") setActiveSections([v]); else setActiveSections(Object.keys(SECTION_TO_GROUPS)); }} />
        <FilterSelect label="Grupo"       options={mockProductGroups.map(g => g.name)}          value={filters.grupo}       onChange={setFilter("grupo")} />
        <FilterSelect label="Filial"      options={FILIAIS}                                        value={filters.filial}      onChange={setFilter("filial")} />
        <FilterSelect label="Família"     options={["Pilsen","Premium","Integral","Desnatado"]}  value={filters.familia}     onChange={setFilter("familia")} />
        <FilterSelect label="Praça"       options={["Curitiba/RMC","Campos Gerais","Norte PR","Santa Catarina"]} value={filters.praca} onChange={setFilter("praca")} />
        <FilterSelect label="Dia Semana"  options={DAYS_FULL}                                   value={filters.diaSemana}   onChange={setFilter("diaSemana")} />
        <FilterSelect label="Fornecedor"  options={[...new Set(Object.values(FORNECEDORES_BY_SECTION))]} value={filters.fornecedor} onChange={setFilter("fornecedor")} />
        <FilterSelect label="Ano e Mês"   options={["Jan/25","Fev/25","Mar/25","Abr/25","Mai/25","Jun/25","Jul/25"]} value={filters.anoMes} onChange={setFilter("anoMes")} />
        <FilterSelect label="Ofertas"     options={["Sim","Não"]}                               value={filters.ofertas}     onChange={setFilter("ofertas")} />
        <div className="rounded-md border border-border/60 bg-card/80 px-2 py-1.5 shadow-sm min-w-[240px]">
          <p className="text-[9.5px] font-semibold text-muted-foreground leading-none mb-1.5">Período personalizado</p>
          <div className="flex items-center gap-1.5">
            <Input type="date" value={customDateStart} onChange={e => setCustomDateStart(e.target.value)} className="h-7 text-[11px] px-2" />
            <span className="text-[10px] text-muted-foreground">até</span>
            <Input type="date" value={customDateEnd} onChange={e => setCustomDateEnd(e.target.value)} className="h-7 text-[11px] px-2" />
          </div>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors"
          >
            <X className="h-3 w-3" />
            Limpar ({activeFilterCount})
          </button>
        )}
        <span className="ml-auto text-[11px] font-mono text-muted-foreground shrink-0">{todayStr}</span>
      </div>


      {/* ── Active filter chips ── */}
      {activeFilterCount > 0 && (
        <div className="px-3 py-1 bg-primary/5 border-b border-primary/20 flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] text-primary font-semibold">Filtros ativos:</span>
          {Object.entries(filters).map(([key, val]) => val !== "__all__" ? (
            <span key={key} className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8.5px] text-primary font-medium">
              {val}
              <button onClick={() => setFilter(key as keyof Filters)("__all__")} className="hover:text-destructive">
                <X className="h-2 w-2" />
              </button>
            </span>
          ) : null)}
          {(customDateStart || customDateEnd) && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[8.5px] text-primary font-medium">
              Período: {customDateStart || "..."} → {customDateEnd || "..."}
              <button onClick={() => { setCustomDateStart(""); setCustomDateEnd(""); }} className="hover:text-destructive">
                <X className="h-2 w-2" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* ══ BLOCO 1: Line Chart + Rankings ══════════════════════ */}
      <div className="border-b border-border flex" style={{ minHeight: 340 }}>
        <div className="flex flex-col border-r border-border" style={{ flex: "0 0 65%" }}>
          {/* Pills */}
          <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center gap-2 flex-wrap">
            <span className="text-[12px] font-semibold text-foreground shrink-0">
              Faturamento por dia da semana
              {filters.praca !== "__all__" && <span className="text-primary ml-1">— {filters.praca}</span>}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap ml-2">
              {visibleSections.map(sec => {
                const isActive = effectiveActive.includes(sec);
                const color = SECTION_COLORS[sec] ?? "#6b7280";
                return (
                  <button
                    key={sec}
                    onClick={() => setActiveSections(prev =>
                      isActive
                        ? prev.length > 1 ? prev.filter(s => s !== sec) : visibleSections
                        : [...prev, sec]
                    )}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold border transition-all"
                    style={{
                      borderColor: isActive ? color : "hsl(var(--border))",
                      background: isActive ? `${color}22` : "transparent",
                      color: isActive ? color : "hsl(var(--muted-foreground))",
                      opacity: isActive ? 1 : 0.55,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: isActive ? color : "hsl(var(--muted-foreground))" }} />
                    {sec}
                  </button>
                );
              })}
              {visibleSections.length > 1 && (
                <button
                  onClick={() => setActiveSections(visibleSections)}
                  className="px-2 py-1 rounded-full text-[11px] font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors"
                >Todos</button>
              )}
            </div>
          </div>
          {/* Chart */}
          <div className="flex-1 p-3">
            {areaData.length > 0 && visibleSections.length > 0 ? (
              <ResponsiveContainer width="100%" height={272}>
                <LineChart data={areaData} margin={{ top: 28, right: 20, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 600 }} interval={0} axisLine={false} tickLine={false} />

                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    width={56} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)}
                  />
                  <Tooltip
                    contentStyle={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))", borderRadius:8, fontSize:12, boxShadow:"0 4px 16px rgba(0,0,0,.08)" }}
                    formatter={(v: any, name: string) => [fmtFull(v), name]}
                    cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                  />

                  {visibleSections.map((sec, i) => {
                    if (!effectiveActive.includes(sec)) return null;
                    const color = SECTION_COLORS[sec] ?? `hsl(${(i * 47) % 360} 65% 52%)`;
                    const monVal = areaData[0]?.[sec] ?? 0;
                    const singleMode = effectiveActive.length === 1;
                    return (
                      <Line
                        key={sec} type="monotone" dataKey={sec}
                        stroke={color} strokeWidth={singleMode ? 2.5 : 1.8}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          const val = payload[sec] ?? 0;
                          const pct = calcPctVsMon(val, monVal);
                          const isPos = pct.startsWith("+");
                          const showPct = singleMode && pct && payload.day !== areaData[0]?.day;
                          return (
                            <g key={`g-${cx}-${sec}`}>
                              <circle cx={cx} cy={cy} r={singleMode ? 4 : 3} fill={color} stroke="#fff" strokeWidth={1.5} />
                              {showPct && (
                                <>
                                  <rect x={cx-16} y={cy-22} width={32} height={13} rx={3}
                                    fill={isPos ? "#dcfce7" : "#fee2e2"} />
                                  <text x={cx} y={cy-12} textAnchor="middle" fontSize={9} fontWeight={700}
                                    fill={isPos ? "#16a34a" : "#dc2626"}>{pct}</text>
                                </>
                              )}
                            </g>
                          );
                        }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                Nenhuma seção disponível para os filtros selecionados
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 p-2">
          <RankingPanel title="Faturamento"        color="#2563eb" items={fatRank} />
          <RankingPanel title="Volume"             color="#ea580c" items={volRank} />
          <RankingPanel title="Rentab. c/Sellout"  color="#16a34a" items={rentRank} />
          <RankingPanel title="Margem c/Sellout"   color="#7c3aed" items={margRank} />
        </div>
      </div>

      {/* ══ BLOCO 2: Grade de dias ═══════════════════════════════ */}
      <div className="border-b border-border">
        <div className={cn("grid divide-x divide-border")} style={{ gridTemplateColumns: `repeat(${dayGrid.length}, 1fr)` }}>
          {dayGrid.map(({ day, fullDay, items }) => {
            const isWeekend = day === "Sáb" || day === "Dom" || day === "Sex";
            const barColor  = DAY_COLORS[day] ?? "#2563eb";
            const maxVal    = items[0]?.revenue ?? 1;
            return (
              <div key={day} className="flex flex-col">
                <div className={cn("px-2 py-2 text-center border-b border-border",
                  isWeekend ? "bg-red-50 dark:bg-red-950/20" : "bg-blue-50 dark:bg-blue-950/20")}>
                  <span className="text-[11px] font-bold leading-tight block text-foreground">{fullDay}</span>
                </div>
                <div className="divide-y divide-border/40">
                  {items.slice(0, 9).map(item => {
                    const pct = Math.round((item.revenue / maxVal) * 100);
                    return (
                      <button
                        key={item.section}
                        onClick={() => setSelectedSection(selectedSection === item.section ? null : item.section)}
                        className={cn(
                          "w-full px-2 py-1.5 flex flex-col gap-0.5 hover:bg-muted/40 transition-colors text-left",
                          selectedSection === item.section && "bg-muted/60"
                        )}
                      >
                        <span className="text-[10px] font-semibold text-foreground leading-tight truncate w-full">
                          {item.section}
                        </span>
                        <div className="w-full h-5 bg-muted/40 rounded-sm overflow-hidden relative">
                          <div className="h-full rounded-sm transition-all flex items-center justify-end pr-1.5"
                            style={{ width: `${Math.max(pct, 18)}%`, background: barColor }}>
                            <span className="text-[9px] font-bold text-white leading-none tabular-nums whitespace-nowrap">
                              {fmtM(item.revenue)} · {pct}%
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

      {/* ══ BLOCO 3: Painel de produtos 5 colunas ════════════════ */}
      <div className="border-b border-border flex flex-col" style={{ minHeight: 360 }}>
        <div className="px-4 py-2 border-b border-border bg-muted/20 flex items-center gap-2">
          <span className="text-[12px] font-semibold text-foreground">
            {selectedSection ? `Produtos — ${selectedSection}` : "TOP Produtos (Todos)"}
          </span>

          {selectedSection && (
            <button onClick={() => setSelectedSection(null)}
              className="ml-auto text-[11px] text-muted-foreground hover:text-foreground px-3 py-1 rounded border border-border hover:bg-muted transition-colors">
              ✕ Todos
            </button>
          )}
        </div>
        <div className="flex-1 grid grid-cols-5 divide-x divide-border overflow-hidden" style={{ minHeight: 320 }}>
          {[
            { key:"byFat",       label:"Faturamento",      color:"text-blue-600",   fn:(p:Product)=>fmtFull(p.sales*p.price)    },
            { key:"byVol",       label:"Volume",           color:"text-orange-500", fn:(p:Product)=>fmtVol(p.sales)              },
            { key:"byRent",      label:"Rentab. c/Sellout",color:"text-green-600",  fn:(p:Product)=>fmtFull(p.sales*p.price*p.margin) },
            { key:"withCampaign",label:"TOP em Campanha",  color:"text-primary",    fn:(p:Product)=>fmtFull(p.sales*p.price)     },
            { key:"noCampaign",  label:"TOP s/ Campanha",  color:"text-orange-500", fn:(p:Product)=>fmtFull(p.sales*p.price*p.margin) },
          ].map(({ key, label, color, fn }) => (
            <div key={key} className="flex flex-col overflow-hidden">
              <div className="px-2 py-2 border-b border-border text-center bg-muted/20">
                <span className={cn("text-[11px] font-bold", color)}>{label}</span>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/40">
                {(panelProducts[key as keyof typeof panelProducts] as Product[]).slice(0, 12).map(p => (
                  <div key={p.id} className="px-2 py-2 flex items-center justify-between gap-1.5 hover:bg-muted/30">
                    <div className="min-w-0">
                      <p className={cn("text-[11px] font-semibold leading-tight truncate", color)}>{short(p.name, 20)}</p>
                      <p className="text-[10px] text-muted-foreground">{fn(p)}</p>
                    </div>
                    <ActionBtns product={p} onSuggest={handleSuggest} onSimulate={handleSimulate}
                      isApproved={isApproved} isInSimulator={isInSimulator} />
                  </div>
                ))}
                {(panelProducts[key as keyof typeof panelProducts] as Product[]).length === 0 && (
                  <p className="text-[11px] text-muted-foreground p-3 text-center">Sem dados</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ══ BLOCO 4: Gráficos de participação ══════════════════ */}
      <div className="grid grid-cols-2 border-b border-border gap-0">
        {/* Chart 1: Participação por categoria e dia */}
        <div className="border-r border-border p-4">
          <p className="text-[12px] font-semibold text-foreground mb-1">
            Participação por categoria e dia
            {filters.praca !== "__all__" && <span className="text-primary ml-1">— {filters.praca}</span>}
          </p>
          <p className="text-[11px] text-muted-foreground mb-4">% do faturamento por seção em cada dia da semana</p>

          {/* Legend pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {participationSections.map((sec, i) => (
              <div key={sec} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: SECTION_COLORS[sec] ?? `hsl(${(i * 47) % 360} 65% 52%)` }} />
                <span className="text-[11px] text-foreground font-medium">{sec}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stackedData} margin={{ top: 8, right: 16, left: 4, bottom: 4 }} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day"
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 600 }}
                axisLine={false} tickLine={false} interval={0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                width={38} tickFormatter={v => `${v}%`} domain={[0, 100]}
                axisLine={false} tickLine={false}
              />
              <Tooltip
                contentStyle={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))", borderRadius:8, fontSize:12, boxShadow:"0 4px 16px rgba(0,0,0,.08)" }}
                formatter={(v: any, name: string) => [`${v}%`, name]}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              />
              {participationSections.map((sec, i) => (
                <Bar
                  key={sec} dataKey={sec} stackId="a"
                  fill={SECTION_COLORS[sec] ?? `hsl(${(i * 47) % 360} 65% 52%)`}
                  radius={i === participationSections.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  label={i === participationSections.length - 1 ? undefined : false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Participação por praça */}
        <div className="p-4">
          <p className="text-[12px] font-semibold text-foreground mb-1">Participação por praça</p>
          <p className="text-[11px] text-muted-foreground mb-4">% de faturamento por região e categoria</p>

          {/* Legend pills same as above */}
          <div className="flex flex-wrap gap-2 mb-4">
            {participationSections.map((sec, i) => (
              <div key={sec} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ background: SECTION_COLORS[sec] ?? `hsl(${(i * 47) % 360} 65% 52%)` }} />
                <span className="text-[11px] text-foreground font-medium">{sec}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pracaData} margin={{ top: 8, right: 16, left: 4, bottom: 28 }} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="praca"
                tick={{ fontSize: 11, fill: "hsl(var(--foreground))", fontWeight: 600 }}
                axisLine={false} tickLine={false} interval={0}
                angle={-12} textAnchor="end" height={44}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                width={38} tickFormatter={v => `${v}%`} domain={[0, 100]}
                axisLine={false} tickLine={false}
              />
              <Tooltip
                contentStyle={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))", borderRadius:8, fontSize:12, boxShadow:"0 4px 16px rgba(0,0,0,.08)" }}
                formatter={(v: any, name: string) => [`${v}%`, name]}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              />
              {participationSections.map((sec, i) => (
                <Bar
                  key={sec} dataKey={sec} stackId="b"
                  fill={SECTION_COLORS[sec] ?? `hsl(${(i * 47) % 360} 65% 52%)`}
                  radius={i === participationSections.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ══ BLOCO 5: Tabela expandível Seção → Grupo → Subgrupo → Produto ═ */}
      <div className="border-b border-border">
        <div
          className="grid bg-muted/60 border-b border-border sticky top-0 z-10"
          style={{ gridTemplateColumns: "32px 1fr 180px 120px 180px 96px 72px" }}
        >
          <div className="px-2 py-3" />
          <div className="px-3 py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
            Seção / Grupo / Subgrupo / Produto
            {activeFilterCount > 0 && (
              <span className="ml-2 text-[10px] text-primary font-normal">
                {sectionMetrics.length} seção(ões)
              </span>
            )}
          </div>
          <div className="px-2 py-3 text-[11px] font-bold text-blue-600 uppercase text-right tracking-wide">Faturamento</div>
          <div className="px-2 py-3 text-[11px] font-bold text-orange-500 uppercase text-right tracking-wide">Volume</div>
          <div className="px-2 py-3 text-[11px] font-bold text-green-700 uppercase text-right leading-tight tracking-wide">Rentab. c/ Sellout</div>
          <div className="px-2 py-3 text-[11px] font-bold text-purple-600 uppercase text-right tracking-wide">Margem</div>
          <div className="px-2 py-3 text-[11px] font-bold text-muted-foreground uppercase text-center tracking-wide">Ação</div>
        </div>

        {sectionMetrics.map(r => (
          <SectionRow
            key={r.section} r={r}
            maxFat={maxFat} maxVol={maxVol} maxRent={maxRent}
            onSuggest={handleSuggest} onSimulate={handleSimulate}
            isApproved={isApproved} isInSimulator={isInSimulator}
          />
        ))}

        {sectionMetrics.length === 0 && (
          <div className="py-10 text-center text-muted-foreground">
            Nenhuma seção encontrada para os filtros selecionados.
            <button onClick={resetFilters} className="ml-2 text-primary underline text-sm">Limpar filtros</button>
          </div>
        )}

        {/* Totais */}
        <div
          className="grid bg-muted/60 border-t-2 border-border"
          style={{ gridTemplateColumns: "32px 1fr 180px 120px 180px 96px 72px" }}
        >
          <div /><div className="px-3 py-2.5 text-[12px] font-bold text-foreground">Total</div>
          <div className="px-2 py-2.5 text-[11px] text-blue-700 font-bold text-right">
            {fmtFull(sectionMetrics.reduce((s, r) => s + r.fat, 0))}
          </div>
          <div className="px-2 py-2.5 text-[11px] text-orange-600 font-bold text-right">
            {fmtVol(sectionMetrics.reduce((s, r) => s + r.vol, 0))}
          </div>
          <div className="px-2 py-2.5 text-[11px] text-green-800 font-bold text-right">
            {fmtFull(sectionMetrics.reduce((s, r) => s + r.rent, 0))}
          </div>
          <div className="px-2 py-2.5 text-[11px] text-purple-700 font-bold text-right">
            {sectionMetrics.length > 0
              ? `${(sectionMetrics.reduce((s, r) => s + r.margem, 0) / sectionMetrics.length * 100).toFixed(2)}%`
              : "—"}
          </div>
          <div />
        </div>
      </div>

    </div>
  );
}

