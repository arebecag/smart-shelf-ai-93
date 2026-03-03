import { FilterState } from '@/types/product';
import { useFavorites } from '@/contexts/FavoritesContext';
import { calculateScore, getWeights } from '@/utils/scoreCalculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GitCompare, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Download,
  Plus,
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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

const radarColors = ['#2155ff', '#10b981', '#f59e0b', '#ef4444'];

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useFavorites();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  // Calculate scores for all products
  const productsWithScores = compareList.map((product) => ({
    ...product,
    scoreResult: calculateScore(product, defaultFilters),
  }));

  // Find best in each category
  const bestScore = productsWithScores.length > 0 
    ? Math.max(...productsWithScores.map(p => p.scoreResult.score))
    : 0;
  const bestMargin = compareList.length > 0 
    ? Math.max(...compareList.map(p => p.margin))
    : 0;
  const bestPrice = compareList.length > 0 
    ? Math.min(...compareList.map(p => p.price))
    : 0;
  const bestCompetitiveness = compareList.length > 0 
    ? Math.max(...compareList.map(p => p.competitiveness))
    : 0;

  // Build radar chart data
  const radarData = [
    { attribute: 'Margem', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, p.margin * 100])) },
    { attribute: 'Vendas', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, (p.sales / 2000) * 100])) },
    { attribute: 'Estoque', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, (p.stock / 20) * 100])) },
    { attribute: 'Competitiv.', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, p.competitiveness * 100])) },
    { attribute: 'Crescimento', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, p.growth * 100])) },
  ];

  // Comparison data for table
  const comparisonMetrics = [
    { 
      label: 'Preço', 
      key: 'price', 
      format: (v: number) => `R$ ${v.toFixed(2)}`,
      best: 'min'
    },
    { 
      label: 'Margem', 
      key: 'margin', 
      format: (v: number) => `${(v * 100).toFixed(0)}%`,
      best: 'max'
    },
    { 
      label: 'Estoque', 
      key: 'stock', 
      format: (v: number) => `${v} un`,
      best: 'max'
    },
    { 
      label: 'Vendas', 
      key: 'sales', 
      format: (v: number) => v.toString(),
      best: 'max'
    },
    { 
      label: 'Competitividade', 
      key: 'competitiveness', 
      format: (v: number) => `${(v * 100).toFixed(0)}%`,
      best: 'max'
    },
    { 
      label: 'Crescimento', 
      key: 'growth', 
      format: (v: number) => `${(v * 100).toFixed(0)}%`,
      best: 'max'
    },
    { 
      label: 'Share de Mercado', 
      key: 'nielsen.marketShare', 
      format: (v: number) => `${v}%`,
      best: 'max'
    },
    { 
      label: 'Ranking Regional', 
      key: 'nielsen.regionalRanking', 
      format: (v: number) => `${v}º`,
      best: 'min'
    },
  ];

  const getValue = (product: any, key: string) => {
    const keys = key.split('.');
    let value = product;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  };

  const isBest = (products: any[], key: string, value: number, best: 'min' | 'max') => {
    const values = products.map(p => getValue(p, key));
    if (best === 'max') return value === Math.max(...values);
    return value === Math.min(...values);
  };

  const handleExportComparison = () => {
    const csvContent = [
      ['Métrica', ...compareList.map(p => p.name)].join(','),
      ...comparisonMetrics.map(metric => [
        metric.label,
        ...compareList.map(p => metric.format(getValue(p, metric.key)))
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'comparacao_produtos.csv';
    link.click();

    toast({
      title: "Exportação concluída",
      description: "O arquivo de comparação foi baixado com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Comparar Produtos</h1>
          <p className="text-muted-foreground">
            {compareList.length === 0 
              ? 'Adicione produtos para comparar' 
              : `Comparando ${compareList.length} produto${compareList.length > 1 ? 's' : ''}`}
          </p>
        </div>
        {compareList.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportComparison}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" onClick={clearCompare}>
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        )}
      </div>

      {compareList.length > 0 ? (
        <>
          {/* Winner Card (if 2+ products) */}
          {compareList.length >= 2 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Melhor Recomendação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const winner = productsWithScores.reduce((a, b) => 
                    a.scoreResult.score > b.scoreResult.score ? a : b
                  );
                  return (
                    <div className="flex items-center gap-4">
                      <img 
                        src={winner.imageUrl}
                        alt={winner.name}
                        className="w-16 h-16 rounded-lg object-contain bg-card border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-lg">{winner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Score IA: <span className={cn("font-bold", getScoreColor(winner.scoreResult.score))}>
                            {winner.scoreResult.score}/100
                          </span>
                          {' • '}
                          Margem: {(winner.margin * 100).toFixed(0)}%
                          {' • '}
                          Preço: R$ {winner.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Radar Chart */}
          {compareList.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comparativo de Atributos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="attribute" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      {compareList.map((product, index) => (
                        <Radar
                          key={product.id}
                          name={product.name.length > 20 ? product.name.substring(0, 20) + '...' : product.name}
                          dataKey={`p${index}`}
                          stroke={radarColors[index]}
                          fill={radarColors[index]}
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tabela Comparativa</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium bg-secondary/30">Métrica</th>
                    {compareList.map((product, index) => (
                      <th key={product.id} className="p-3 text-center min-w-[180px]">
                        <div className="flex flex-col items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: radarColors[index] }}
                          />
                          <img 
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-contain bg-secondary border border-border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                          <span className="font-medium text-xs">{product.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => removeFromCompare(product.id)}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Score Row */}
                  <tr className="border-b bg-primary/5">
                    <td className="p-3 font-medium">Score IA</td>
                    {productsWithScores.map((product) => (
                      <td key={product.id} className="p-3 text-center">
                        <span className={cn(
                          "text-xl font-bold",
                          getScoreColor(product.scoreResult.score)
                        )}>
                          {product.scoreResult.score}
                        </span>
                        {product.scoreResult.score === bestScore && compareList.length > 1 && (
                          <Trophy className="w-4 h-4 text-yellow-500 inline ml-1" />
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Metrics Rows */}
                  {comparisonMetrics.map((metric, idx) => (
                    <tr key={metric.key} className={idx % 2 === 0 ? '' : 'bg-secondary/20'}>
                      <td className="p-3 font-medium">{metric.label}</td>
                      {compareList.map((product) => {
                        const value = getValue(product, metric.key);
                        const isThisBest = isBest(compareList, metric.key, value, metric.best as 'min' | 'max');
                        return (
                          <td key={product.id} className="p-3 text-center">
                            <span className={cn(isThisBest && compareList.length > 1 && "font-bold text-green-600")}>
                              {metric.format(value)}
                            </span>
                            {isThisBest && compareList.length > 1 && (
                              <TrendingUp className="w-3 h-3 text-green-600 inline ml-1" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Flags Row */}
                  <tr className="border-t">
                    <td className="p-3 font-medium">Status</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-3 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {product.hasAd && (
                            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Anúncio
                            </Badge>
                          )}
                          {product.isRepeated && (
                            <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Repetido
                            </Badge>
                          )}
                          {!product.hasAd && !product.isRepeated && (
                            <Badge variant="secondary" className="text-xs">
                              <Minus className="w-3 h-3 mr-1" />
                              Normal
                            </Badge>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Add more products hint */}
          {compareList.length < 4 && (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Plus className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">
                  Você pode adicionar mais {4 - compareList.length} produto{4 - compareList.length > 1 ? 's' : ''} para comparar
                </p>
                <Button variant="outline" className="mt-3" onClick={() => navigate('/buscar')}>
                  Buscar mais produtos
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <GitCompare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum produto para comparar</h3>
            <p className="text-muted-foreground mb-4">
              Clique no ícone <GitCompare className="w-4 h-4 inline" /> nos produtos para adicioná-los aqui
            </p>
            <Button onClick={() => navigate('/buscar')}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Buscar Produtos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Compare;
