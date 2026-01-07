import { FilterState } from '@/types/product';
import { regions, sections, campaigns, strategies } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
}

export const FilterPanel = ({ filters, onFiltersChange, onSearch }: FilterPanelProps) => {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Filtros de Busca</h2>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSearch(); }}>
        {/* First row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2">
            <Label htmlFor="search" className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Buscar produto
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Ex: 789123456 ou cerveja"
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="pl-10 bg-secondary/50 border-border focus:bg-card"
              />
            </div>
          </div>

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

        {/* Second row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-4">
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
            <Select value={filters.strategy} onValueChange={(v) => updateFilter('strategy', v)}>
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
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Peso Qtd</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              placeholder="0.6"
              value={filters.weightQty || ''}
              onChange={(e) => updateFilter('weightQty', parseFloat(e.target.value))}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Peso Margem</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              placeholder="0.3"
              value={filters.weightMargin || ''}
              onChange={(e) => updateFilter('weightMargin', parseFloat(e.target.value))}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Peso Venda</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              placeholder="0.1"
              value={filters.weightSales || ''}
              onChange={(e) => updateFilter('weightSales', parseFloat(e.target.value))}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Peso Compet.</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              placeholder="0.2"
              value={filters.weightCompetitiveness || ''}
              onChange={(e) => updateFilter('weightCompetitiveness', parseFloat(e.target.value))}
              className="bg-secondary/50 border-border"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Peso Cresc.</Label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              placeholder="0.15"
              value={filters.weightGrowth || ''}
              onChange={(e) => updateFilter('weightGrowth', parseFloat(e.target.value))}
              className="bg-secondary/50 border-border"
            />
          </div>
        </div>

        {/* Third row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
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
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Permitir Repetição</Label>
            <Select value={filters.allowRepetition} onValueChange={(v) => updateFilter('allowRepetition', v)}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">-</SelectItem>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
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

          <Button type="submit" className="gradient-primary text-primary-foreground font-semibold h-10">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </form>
    </div>
  );
};
