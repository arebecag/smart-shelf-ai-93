import { useState, useMemo } from 'react';
import { FilterState } from '@/types/product';
import { mockProductGroups } from '@/data/mockData';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { regions, sections, strategies } from '@/data/mockData';
import { calculateScore } from '@/utils/scoreCalculator';

const defaultFilters: FilterState = {
  searchQuery: '',
  region: 'Selecione uma região',
  section: 'Todas',
  campaign: 'Todas',
  strategy: 'Maior Quantidade',
  weightQty: 0,
  weightMargin: 0,
  weightSales: 0,
  weightCompetitiveness: 0,
  weightGrowth: 0,
  productCount: 10,
  startDate: '',
  endDate: '',
};

const SearchProducts = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'margin' | 'name'>('score');

  // Flatten all products
  const allProducts = useMemo(() => {
    return mockProductGroups.flatMap((group) => 
      group.products.map((product) => ({
        ...product,
        groupName: group.name,
      }))
    );
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.id.includes(searchLower);
      
      return matchesSearch;
    });

    // Sort
    result = result.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return calculateScore(b, filters).score - calculateScore(a, filters).score;
        case 'price':
          return a.price - b.price;
        case 'margin':
          return b.margin - a.margin;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [allProducts, filters, sortBy]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Buscar Produtos</h1>
        <p className="text-muted-foreground">Encontre produtos e visualize análises detalhadas</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">
              Buscar por nome ou código
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Ex: 789123456 ou cerveja brahma"
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Região</Label>
            <Select value={filters.region} onValueChange={(v) => updateFilter('region', v)}>
              <SelectTrigger>
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
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Estratégia IA</Label>
            <Select value={filters.strategy} onValueChange={(v) => updateFilter('strategy', v)}>
              <SelectTrigger>
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
            <Label className="text-sm font-medium text-muted-foreground mb-1.5 block">Ordenar por</Label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score IA (maior)</SelectItem>
                <SelectItem value="price">Preço (menor)</SelectItem>
                <SelectItem value="margin">Margem (maior)</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Resultados</h2>
            <Badge variant="secondary">{filteredProducts.length} produtos</Badge>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                filters={filters}
                showFullReason
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-card p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProducts;
