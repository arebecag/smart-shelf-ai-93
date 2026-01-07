import { FilterState } from '@/types/product';
import { useFavorites } from '@/contexts/FavoritesContext';
import { calculateScore, getWeights } from '@/utils/scoreCalculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCompare, X, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

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

const radarColors = ['#2155ff', '#10b981', '#f59e0b', '#ef4444'];

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useFavorites();

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  // Build radar chart data
  const radarData = [
    { attribute: 'Margem', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, p.margin * 100])) },
    { attribute: 'Vendas', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, (p.sales / 2000) * 100])) },
    { attribute: 'Estoque', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, (p.stock / 20) * 100])) },
    { attribute: 'Competitiv.', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, p.competitiveness * 100])) },
    { attribute: 'Crescimento', ...Object.fromEntries(compareList.map((p, i) => [`p${i}`, p.growth * 100])) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Comparar Produtos</h1>
          <p className="text-muted-foreground">
            Compare até 4 produtos lado a lado
          </p>
        </div>
        {compareList.length > 0 && (
          <Button variant="outline" onClick={clearCompare}>
            <X className="w-4 h-4 mr-2" />
            Limpar comparação
          </Button>
        )}
      </div>

      {compareList.length > 0 ? (
        <>
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
                          name={product.name}
                          dataKey={`p${index}`}
                          stroke={radarColors[index]}
                          fill={radarColors[index]}
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${compareList.length}, minmax(280px, 1fr))` }}>
              {compareList.map((product, index) => {
                const scoreResult = calculateScore(product, defaultFilters);
                
                return (
                  <Card key={product.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removeFromCompare(product.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
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
                      </div>
                      <CardTitle className="text-sm mt-2">{product.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">#{product.id}</p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Score */}
                      <div className="bg-secondary/50 rounded-lg p-3 text-center">
                        <div className="text-xs text-muted-foreground mb-1">Score IA</div>
                        <div className={cn("text-2xl font-bold", getScoreColor(scoreResult.score))}>
                          {scoreResult.score}/100
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Preço</span>
                          <span className="font-medium">R$ {product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Margem</span>
                          <span className="font-medium">{(product.margin * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estoque</span>
                          <span className="font-medium">{product.stock} un</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vendas</span>
                          <span className="font-medium">{product.sales}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Competitividade</span>
                          <span className="font-medium">{(product.competitiveness * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Crescimento</span>
                          <span className="font-medium">{(product.growth * 100).toFixed(0)}%</span>
                        </div>
                      </div>

                      {/* Nielsen */}
                      <div className="pt-3 border-t border-border">
                        <div className="text-xs font-medium mb-2">Nielsen</div>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <span className="text-muted-foreground">Share:</span>
                          <span>{product.nielsen.marketShare}%</span>
                          <span className="text-muted-foreground">Ranking:</span>
                          <span>{product.nielsen.regionalRanking}º</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1">
                        {product.hasAd && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Anúncio ativo
                          </Badge>
                        )}
                        {product.isRepeated && (
                          <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Repetido
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-card rounded-xl shadow-card p-12 text-center">
          <GitCompare className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Nenhum produto para comparar</h3>
          <p className="text-muted-foreground mb-4">
            Clique no ícone de comparação nos produtos para adicioná-los aqui
          </p>
          <Button variant="outline" asChild>
            <a href="/buscar">
              <ArrowRight className="w-4 h-4 mr-2" />
              Buscar Produtos
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Compare;
