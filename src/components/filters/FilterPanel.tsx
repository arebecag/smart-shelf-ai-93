import { FilterState } from '@/types/product';
import { regions, sections, campaigns, strategies } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, Zap, Settings2 } from 'lucide-react';
import { getDefaultWeights } from '@/utils/scoreCalculator';
import { useState } from 'react';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
}

const WEIGHT_LABELS: Record<string, { label: string; description: string; color: string }> = {
  weightQty:             { label: 'Estoque',        description: 'Volume disponível no CD',         color: 'text-blue-600' },
  weightMargin:          { label: 'Margem',          description: 'Rentabilidade do produto',        color: 'text-green-600' },
  weightSales:           { label: 'Vendas',          description: 'Histórico de giro',               color: 'text-orange-600' },
  weightCompetitiveness: { label: 'Competitividade', description: 'Preço vs concorrentes',           color: 'text-purple-600' },
  weightGrowth:          { label: 'Tendência',       description: 'Crescimento/sazonalidade',        color: 'text-pink-600' },
};

type WeightKey = 'weightQty' | 'weightMargin' | 'weightSales' | 'weightCompetitiveness' | 'weightGrowth';
const WEIGHT_KEYS: WeightKey[] = ['weightQty', 'weightMargin', 'weightSales', 'weightCompetitiveness', 'weightGrowth'];

export const FilterPanel = ({ filters, onFiltersChange, onSearch }: FilterPanelProps) => {
  const [autoWeights, setAutoWeights] = useState(true);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleStrategyChange = (strategy: string) => {
    const def = getDefaultWeights(strategy);
    onFiltersChange({
      ...filters,
      strategy,
      weightQty: def.qty,
      weightMargin: def.margin,
      weightSales: def.sales,
      weightCompetitiveness: def.competitiveness,
      weightGrowth: def.growth,
    });
  };

  const handleAutoToggle = () => {
    if (!autoWeights) {
      // switching to auto: reset to defaults
      const def = getDefaultWeights(filters.strategy);
      onFiltersChange({
        ...filters,
        weightQty: def.qty,
        weightMargin: def.margin,
        weightSales: def.sales,
        weightCompetitiveness: def.competitiveness,
        weightGrowth: def.growth,
      });
    }
    setAutoWeights(v => !v);
  };

  // Normalize weights for display (sum to 100%)
  const rawWeights = {
    weightQty: filters.weightQty || 0,
    weightMargin: filters.weightMargin || 0,
    weightSales: filters.weightSales || 0,
    weightCompetitiveness: filters.weightCompetitiveness || 0,
    weightGrowth: filters.weightGrowth || 0,
  };
  const totalW = WEIGHT_KEYS.reduce((s, k) => s + rawWeights[k], 0) || 1;

  const getDefaultVal = (key: WeightKey): number => {
    const def = getDefaultWeights(filters.strategy);
    const map: Record<WeightKey, number> = {
      weightQty: def.qty,
      weightMargin: def.margin,
      weightSales: def.sales,
      weightCompetitiveness: def.competitiveness,
      weightGrowth: def.growth,
    };
    return map[key];
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Filtros do Dashboard</h2>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
        {/* First row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Região</Label>
            <Select value={filters.region} onValueChange={(v) => updateFilter('region', v)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Seção</Label>
            <Select value={filters.section} onValueChange={(v) => updateFilter('section', v)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Second row - campaign, strategy, count, dates */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Campanha</Label>
            <Select value={filters.campaign} onValueChange={(v) => updateFilter('campaign', v)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Estratégia</Label>
            <Select value={filters.strategy} onValueChange={handleStrategyChange}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Qtd Produtos</Label>
            <Input
              type="number"
              min={1}
              max={100}
              placeholder="10"
              value={filters.productCount || ''}
              onChange={(e) => updateFilter('productCount', parseInt(e.target.value))}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Data Início</Label>
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilter('startDate', e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Data Fim</Label>
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilter('endDate', e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>
        </div>

        {/* Weights section */}
        <div className="border border-border rounded-xl p-4 mb-4 bg-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Pesos do Score IA</span>
              <Badge variant="secondary" className="text-[10px]">
                {autoWeights ? 'Automático' : 'Manual'}
              </Badge>
            </div>
            <Button
              type="button"
              variant={autoWeights ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5 h-7 text-xs"
              onClick={handleAutoToggle}
            >
              <Zap className="w-3 h-3" />
              {autoWeights ? 'Automático ativo' : 'Usar automático'}
            </Button>
          </div>

          {autoWeights && (
            <p className="text-xs text-muted-foreground mb-4 bg-primary/5 rounded-lg px-3 py-2 border border-primary/10">
              ✨ Os pesos são definidos automaticamente pela estratégia selecionada. Alterne para <strong>Manual</strong> para personalizar.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {WEIGHT_KEYS.map((key) => {
              const meta = WEIGHT_LABELS[key];
              const pct = Math.round((rawWeights[key] / totalW) * 100);
              const sliderVal = Math.round(rawWeights[key] * 100);
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-foreground">{meta.label}</Label>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 font-bold ${meta.color}`}
                    >
                      {pct}%
                    </Badge>
                  </div>
                  <Slider
                    min={1}
                    max={60}
                    step={1}
                  value={[sliderVal || Math.round(getDefaultVal(key) * 100)]}
                    onValueChange={([v]) => {
                      if (autoWeights) setAutoWeights(false);
                      updateFilter(key as keyof FilterState, v / 100 as any);
                    }}
                    disabled={false}
                    className="w-full"
                  />
                  <p className="text-[10px] text-muted-foreground leading-tight">{meta.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="gradient-primary text-primary-foreground font-semibold h-10 px-8">
            <Search className="w-4 h-4 mr-2" />
            Buscar Produtos
          </Button>
        </div>
      </form>
    </div>
  );
};
