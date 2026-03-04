import { useState, useCallback, useMemo } from 'react';
import { FilterState } from '@/types/product';
import { mockProductGroups, SECTION_GROUP_MAP } from '@/data/mockData';
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

  // Filter groups by section
  const filteredGroups = useMemo(() => {
    const section = filters.section;
    if (!section || section === 'Todas') return groups;
    const allowedIds = SECTION_GROUP_MAP[section];
    if (!allowedIds || allowedIds.length === 0) return groups;
    return groups.filter(g => allowedIds.includes(g.id));
  }, [groups, filters.section]);

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
        groups={filteredGroups}
        onGroupClick={handleGroupClick}
      />

      {/* Product Groups Accordion */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Grupos de Produtos</h2>
          {filters.section && filters.section !== 'Todas' && (
            <span className="text-sm text-muted-foreground bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              Seção: {filters.section}
            </span>
          )}
        </div>
        {filteredGroups.length > 0 ? (
          <GroupAccordion
            groups={filteredGroups}
            filters={filters}
            expandedGroupId={expandedGroupId}
            onGroupToggle={handleGroupToggle}
          />
        ) : (
          <div className="bg-card rounded-xl shadow-card p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum grupo para esta seção</h3>
            <p className="text-muted-foreground">Selecione outra seção ou "Todas"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
