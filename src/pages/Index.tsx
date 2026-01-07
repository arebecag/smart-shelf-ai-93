import { useState, useCallback } from 'react';
import { FilterState } from '@/types/product';
import { mockProductGroups } from '@/data/mockData';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { GroupsChart } from '@/components/charts/GroupsChart';
import { GroupAccordion } from '@/components/products/GroupAccordion';
import { Sparkles } from 'lucide-react';

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

const Index = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>('80');
  const [groups] = useState(mockProductGroups);

  const handleSearch = useCallback(() => {
    // In a real app, this would trigger an API call
    console.log('Search with filters:', filters);
  }, [filters]);

  const handleGroupClick = useCallback((groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
    
    // Scroll to the group
    setTimeout(() => {
      const element = document.querySelector(`[data-group-id="${groupId}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  const handleGroupToggle = useCallback((groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">TabloideAI</h1>
              <p className="text-primary-foreground/80 text-sm">Sistema Inteligente de Sugestão de Produtos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Grupos de Produtos</h2>
          <GroupAccordion
            groups={groups}
            filters={filters}
            expandedGroupId={expandedGroupId}
            onGroupToggle={handleGroupToggle}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>TabloideAI © 2025 — Sugestão inteligente de produtos para tabloides promocionais</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
