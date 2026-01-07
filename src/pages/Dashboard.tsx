import { useState, useCallback } from 'react';
import { FilterState } from '@/types/product';
import { mockProductGroups } from '@/data/mockData';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { GroupsChart } from '@/components/charts/GroupsChart';
import { GroupAccordion } from '@/components/products/GroupAccordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

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
  allowRepetition: '-',
  startDate: '',
  endDate: '',
};

const Dashboard = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>('80');
  const [groups] = useState(mockProductGroups);

  const handleSearch = useCallback(() => {
    console.log('Search with filters:', filters);
  }, [filters]);

  const handleGroupClick = useCallback((groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
    
    setTimeout(() => {
      const element = document.querySelector(`[data-group-id="${groupId}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleGroupToggle = useCallback((groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  }, []);

  // Stats
  const totalProducts = groups.reduce((acc, g) => acc + g.products.length, 0);
  const avgScore = 72; // Mock
  const totalGroups = groups.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">em {totalGroups} grupos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Score Médio IA
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgScore}/100</div>
            <p className="text-xs text-muted-foreground">produtos recomendados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Margem Média
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22%</div>
            <p className="text-xs text-muted-foreground">acima da meta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Grupos Analisados
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGroups}</div>
            <p className="text-xs text-muted-foreground">categorias disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
      />

      {/* Chart */}
      <GroupsChart
        groups={groups}
        onGroupClick={handleGroupClick}
      />

      {/* Product Groups Accordion */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Grupos de Produtos</h2>
        <GroupAccordion
          groups={groups}
          filters={filters}
          expandedGroupId={expandedGroupId}
          onGroupToggle={handleGroupToggle}
        />
      </div>
    </div>
  );
};

export default Dashboard;
