import { useMemo } from 'react';
import { mockProductGroups, mockProducts, mockHistory } from '@/data/mockData';
import { calculateScore } from '@/utils/scoreCalculator';
import { FilterState } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, Package, DollarSign, Target, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['#2155ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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

const Statistics = () => {
  // Calculate all statistics from real data
  const stats = useMemo(() => {
    const allProducts = mockProducts;
    
    // Score distribution
    const scores = allProducts.map(p => calculateScore(p, defaultFilters).score);
    const scoreDistribution = [
      { range: '0-50', count: scores.filter(s => s < 50).length },
      { range: '50-70', count: scores.filter(s => s >= 50 && s < 70).length },
      { range: '70-85', count: scores.filter(s => s >= 70 && s < 85).length },
      { range: '85-100', count: scores.filter(s => s >= 85).length },
    ];

    // Margin distribution
    const marginDistribution = [
      { range: '0-15%', count: allProducts.filter(p => p.margin < 0.15).length },
      { range: '15-20%', count: allProducts.filter(p => p.margin >= 0.15 && p.margin < 0.20).length },
      { range: '20-25%', count: allProducts.filter(p => p.margin >= 0.20 && p.margin < 0.25).length },
      { range: '25-30%', count: allProducts.filter(p => p.margin >= 0.25 && p.margin < 0.30).length },
      { range: '30%+', count: allProducts.filter(p => p.margin >= 0.30).length },
    ];

    // Group data
    const groupData = mockProductGroups
      .filter(g => g.products.length > 0 || g.percentage > 0)
      .map((g) => ({
        name: g.name.split('-')[1] || g.name,
        produtos: g.products.length,
        participacao: g.percentage,
      }))
      .sort((a, b) => b.participacao - a.participacao);

    // Weekly trend (mock based on history)
    const weeklyTrend = [
      { week: 'Sem 1', score: 68, produtos: 45, vendas: 12500 },
      { week: 'Sem 2', score: 72, produtos: 52, vendas: 15800 },
      { week: 'Sem 3', score: 75, produtos: 48, vendas: 14200 },
      { week: 'Sem 4', score: 78, produtos: 55, vendas: 18900 },
    ];

    // Monthly trend
    const monthlyTrend = [
      { month: 'Jul', tabloides: 2, produtos: 85, valor: 45000 },
      { month: 'Ago', tabloides: 3, produtos: 120, valor: 68000 },
      { month: 'Set', tabloides: 2, produtos: 78, valor: 42000 },
      { month: 'Out', tabloides: 4, produtos: 156, valor: 89000 },
      { month: 'Nov', tabloides: 5, produtos: 210, valor: 125000 },
      { month: 'Dez', tabloides: 3, produtos: 145, valor: 95000 },
    ];

    // Top products by score
    const topProducts = allProducts
      .map(p => ({
        ...p,
        score: calculateScore(p, defaultFilters).score
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Calculations
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const avgMargin = allProducts.length > 0 
      ? (allProducts.reduce((acc, p) => acc + p.margin, 0) / allProducts.length * 100).toFixed(1)
      : 0;
    const totalSales = allProducts.reduce((acc, p) => acc + p.sales, 0);
    const productsWithAds = allProducts.filter(p => p.hasAd).length;
    const repeatedProducts = allProducts.filter(p => p.isRepeated).length;

    return {
      totalProducts: allProducts.length,
      avgScore,
      avgMargin,
      totalSales,
      productsWithAds,
      repeatedProducts,
      scoreDistribution,
      marginDistribution,
      groupData,
      weeklyTrend,
      monthlyTrend,
      topProducts,
      totalTabloides: mockHistory.length,
      publishedTabloides: mockHistory.filter(h => h.status === 'published').length,
    };
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    trendValue 
  }: { 
    title: string; 
    value: string | number; 
    subtitle: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trend && trendValue && (
            <span className={cn(
              "text-xs font-medium flex items-center",
              trend === 'up' && "text-green-600",
              trend === 'down' && "text-red-500",
              trend === 'neutral' && "text-muted-foreground"
            )}>
              {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              {trendValue}
            </span>
          )}
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estatísticas</h1>
        <p className="text-muted-foreground">Análise de desempenho e métricas dos produtos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Produtos Analisados"
          value={stats.totalProducts}
          subtitle="em análise"
          icon={Package}
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Score Médio IA"
          value={stats.avgScore}
          subtitle="de 100 pontos"
          icon={TrendingUp}
          trend="up"
          trendValue="+5pts"
        />
        <StatCard
          title="Margem Média"
          value={`${stats.avgMargin}%`}
          subtitle="dos produtos"
          icon={DollarSign}
          trend="up"
          trendValue="+2.3%"
        />
        <StatCard
          title="Taxa de Conversão"
          value={`${Math.round((stats.totalProducts - stats.repeatedProducts) / stats.totalProducts * 100)}%`}
          subtitle="produtos únicos"
          icon={Target}
          trend="neutral"
          trendValue="estável"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tabloides Publicados</p>
                <p className="text-2xl font-bold">{stats.publishedTabloides}</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                de {stats.totalTabloides} total
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produtos com Anúncio Ativo</p>
                <p className="text-2xl font-bold">{stats.productsWithAds}</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {Math.round(stats.productsWithAds / stats.totalProducts * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Produtos Repetidos</p>
                <p className="text-2xl font-bold">{stats.repeatedProducts}</p>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {Math.round(stats.repeatedProducts / stats.totalProducts * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participação por Grupo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Participação por Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.groupData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="participacao"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stats.groupData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Participação']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Scores IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value, 'Produtos']}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Produtos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tendência Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Score Médio"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="produtos" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Produtos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Margens */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Margens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.marginDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [value, 'Produtos']}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="Produtos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolução Mensal de Tabloides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'valor') return [`R$ ${(value / 1000).toFixed(0)}k`, 'Valor'];
                    return [value, name === 'tabloides' ? 'Tabloides' : 'Produtos'];
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="produtos" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)"
                  name="Produtos"
                />
                <Area 
                  type="monotone" 
                  dataKey="tabloides" 
                  stroke="#10b981" 
                  fill="#10b98133"
                  name="Tabloides"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top 5 Produtos por Score IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topProducts.map((product, index) => (
              <div 
                key={product.id} 
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30"
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  index === 0 && "bg-yellow-100 text-yellow-700",
                  index === 1 && "bg-gray-100 text-gray-700",
                  index === 2 && "bg-orange-100 text-orange-700",
                  index > 2 && "bg-secondary text-muted-foreground"
                )}>
                  {index + 1}
                </div>
                <img 
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 rounded object-contain bg-card border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Margem: {(product.margin * 100).toFixed(0)}% • Preço: R$ {product.price.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{product.score}</p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
