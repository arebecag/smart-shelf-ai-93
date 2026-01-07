import { useState } from 'react';
import { Product, FilterState, ScoreResult } from '@/types/product';
import { calculateScore, getWeights } from '@/utils/scoreCalculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, TrendingUp, BarChart2, ShoppingCart, Tv, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  filters: FilterState;
}

export const ProductCard = ({ product, filters }: ProductCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scoreResult = calculateScore(product, filters);
  const weights = getWeights(filters);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  return (
    <div className={cn(
      "bg-card rounded-xl shadow-card transition-all duration-300 overflow-hidden",
      "hover:shadow-card-hover",
      "flex-1 min-w-[340px] max-w-[600px]"
    )}>
      <div className="p-5">
        {/* Header */}
        <div className="flex gap-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-20 h-20 rounded-lg object-contain bg-secondary border border-border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
            <p className="text-sm text-muted-foreground mb-2">#{product.id}</p>
            
            <div className="flex gap-2 mb-2">
              <span title="Nielsen" className="text-lg opacity-75">📊</span>
              <span title="Prixsia" className="text-lg opacity-75">📈</span>
              <span title="Shopping Brasil" className="text-lg opacity-75">🛒</span>
              <span title="Global Segmentos" className="text-lg opacity-75">📺</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Preço: <span className="font-semibold text-foreground">R$ {product.price.toFixed(2)}</span>
              {' • '}
              Estoque: {product.stock}
            </p>
            
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm">Score IA:</span>
              <span className={cn("font-bold", getScoreColor(scoreResult.score))}>
                {scoreResult.score}/100
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {scoreResult.shortReason}
              </span>
            </div>
            
            <Button
              variant="default"
              size="sm"
              className="mt-3 gradient-primary text-primary-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Ocultar Detalhes
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Ver Detalhes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <Tabs defaultValue="nielsen" className="w-full">
              <TabsList className="w-full flex overflow-x-auto bg-secondary/50 p-1 rounded-lg">
                <TabsTrigger value="nielsen" className="flex-1 text-xs">
                  <BarChart2 className="w-3 h-3 mr-1" />
                  Nielsen
                </TabsTrigger>
                <TabsTrigger value="prixsia" className="flex-1 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Prixsia
                </TabsTrigger>
                <TabsTrigger value="shopping" className="flex-1 text-xs">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Shopping
                </TabsTrigger>
                <TabsTrigger value="global" className="flex-1 text-xs">
                  <Tv className="w-3 h-3 mr-1" />
                  Global
                </TabsTrigger>
                <TabsTrigger value="ia" className="flex-1 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  IA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nielsen" className="mt-3 bg-secondary/30 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Share de Mercado:</span>
                    <span className="font-medium">{product.nielsen.marketShare}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Core Segment:</span>
                    <span className="font-medium">{product.nielsen.coreSegment}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Penetração:</span>
                    <span className="font-medium">{product.nielsen.penetration}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Ranking Regional:</span>
                    <span className="font-medium">{product.nielsen.regionalRanking}º</span>
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="prixsia" className="mt-3 bg-secondary/30 rounded-lg p-4">
                <div className="mb-4">
                  <h5 className="font-semibold text-sm mb-2">Concorrência Prixsia</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Mínimo:</span> R$ {product.prixsia.minPrice.toFixed(2)}</div>
                    <div><span className="text-muted-foreground">Média:</span> R$ {product.prixsia.avgPrice.toFixed(2)}</div>
                    <div><span className="text-muted-foreground">Mediana:</span> R$ {product.prixsia.medianPrice.toFixed(2)}</div>
                    <div><span className="text-muted-foreground">Máximo:</span> R$ {product.prixsia.maxPrice.toFixed(2)}</div>
                  </div>
                </div>
                
                <h5 className="font-semibold text-sm mb-2">Concorrentes</h5>
                <div className="grid grid-cols-2 gap-2">
                  {product.prixsia.competitors.map((comp, idx) => (
                    <div key={idx} className="bg-card rounded-md p-2 text-xs border border-border">
                      <p className="font-medium truncate">{comp.name}</p>
                      <p className="text-muted-foreground truncate">{comp.location}</p>
                      <p className="font-semibold text-primary">R$ {comp.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="shopping" className="mt-3 bg-secondary/30 rounded-lg p-4">
                <div className="bg-card border border-border rounded-lg p-3">
                  <h5 className="font-semibold text-sm text-primary mb-2">Anúncio Shopping Brasil</h5>
                  <a 
                    href={product.shoppingBrasil.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary text-sm underline block mb-2 truncate"
                  >
                    {product.shoppingBrasil.link}
                  </a>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Título:</span> {product.shoppingBrasil.title}</p>
                    <p><span className="text-muted-foreground">Preço Anúncio:</span> R$ {product.shoppingBrasil.adPrice.toFixed(2)}</p>
                    <p><span className="text-muted-foreground">Data Início:</span> {product.shoppingBrasil.startDate}</p>
                    <p><span className="text-muted-foreground">Detalhe:</span> {product.shoppingBrasil.detail}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="global" className="mt-3 bg-secondary/30 rounded-lg p-4">
                <ul className="space-y-3">
                  {product.globalSegments.map((seg, idx) => (
                    <li key={idx} className="bg-card border border-border rounded-lg p-3 text-sm">
                      <p className="font-semibold">{seg.competitor}</p>
                      <p className="text-muted-foreground">
                        Última campanha: {seg.lastCampaign} <span className="font-medium">({seg.campaignDate})</span>
                      </p>
                      <p className="text-muted-foreground">Alcance: {seg.reach}</p>
                      <p className="text-muted-foreground">Investimento: {seg.investment}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="ia" className="mt-3 bg-secondary/30 rounded-lg p-4">
                <div className="bg-card border border-primary/20 rounded-lg p-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary mb-3">
                    <Sparkles className="w-3 h-3 mr-1" />
                    IA explicável
                  </Badge>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold">Score:</span>{' '}
                      <span className={cn("font-bold", getScoreColor(scoreResult.score))}>
                        {scoreResult.score}/100
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Pesos:</span>{' '}
                      <span className="text-muted-foreground">
                        Qtd {Math.round(weights.qty * 100)}% · 
                        Margem {Math.round(weights.margin * 100)}% · 
                        Venda {Math.round(weights.sales * 100)}% · 
                        Competitiv. {Math.round(weights.competitiveness * 100)}% · 
                        Cresc. {Math.round(weights.growth * 100)}%
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Motivos:</span>
                      <ul className="mt-1 ml-4 list-disc space-y-1 text-muted-foreground">
                        {scoreResult.detailedReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      Fontes: DW Condor (vendas/estoque/margem), Shopping Brasil & Prixsia (concorrência), Global Segmentos (mídia).
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};
