import { useState } from 'react';
import { Product, FilterState } from '@/types/product';
import { calculateScore, getWeights } from '@/utils/scoreCalculator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  BarChart2, 
  ShoppingCart, 
  Tv, 
  Sparkles,
  Star,
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useApprovals } from '@/contexts/ApprovalsContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductCardProps {
  product: Product;
  filters: FilterState;
  showFullReason?: boolean;
}

export const ProductCard = ({ product, filters, showFullReason = true }: ProductCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const scoreResult = calculateScore(product, filters);
  const weights = getWeights(filters);
  const { addFavorite, removeFavorite, isFavorite, addToCompare, removeFromCompare, isInCompare } = useFavorites();
  const { approveProduct, rejectProduct, isApproved, isRejected, getApprovalStatus, removeApproval } = useApprovals();

  const approvalStatus = getApprovalStatus(product.id);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-green-100 border-green-200';
    if (score >= 50) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const handleFavoriteClick = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleCompareClick = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleApprove = () => {
    approveProduct(product);
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      rejectProduct(product, rejectReason.trim());
      setShowRejectDialog(false);
      setRejectReason('');
    }
  };

  const handleUndoApproval = () => {
    removeApproval(product.id);
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
          <div className="relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 rounded-lg object-contain bg-secondary border border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            {product.isRepeated && (
              <div className="absolute -top-2 -right-2">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="bg-warning text-warning-foreground rounded-full p-1">
                      <AlertTriangle className="w-3 h-3" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Produto já encartado anteriormente</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">#{product.id}</p>
              </div>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleFavoriteClick}
                    >
                      <Star className={cn(
                        "w-4 h-4",
                        isFavorite(product.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFavorite(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCompareClick}
                    >
                      <GitCompare className={cn(
                        "w-4 h-4",
                        isInCompare(product.id) ? "text-primary" : "text-muted-foreground"
                      )} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isInCompare(product.id) ? "Remover da comparação" : "Adicionar para comparar"}</TooltipContent>
                </Tooltip>
              </div>
            </div>
            
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
              {' • '}
              Margem: {(product.margin * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        {/* Score Section */}
        <div className={cn(
          "mt-4 p-3 rounded-lg border",
          getScoreBg(scoreResult.score)
        )}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Score IA</span>
            </div>
            <span className={cn("text-xl font-bold", getScoreColor(scoreResult.score))}>
              {scoreResult.score}/100
            </span>
          </div>
          
          {showFullReason && (
            <div className="space-y-1.5">
              {scoreResult.detailedReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  {reason.startsWith('⚠') ? (
                    <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  )}
                  <span className="text-muted-foreground">{reason.replace('⚠ ', '')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approval Status Badge */}
        {approvalStatus && (
          <div className={cn(
            "mt-3 p-2 rounded-lg flex items-center justify-between",
            approvalStatus.status === 'approved' 
              ? "bg-green-100 border border-green-200" 
              : "bg-red-100 border border-red-200"
          )}>
            <div className="flex items-center gap-2">
              {approvalStatus.status === 'approved' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Aprovado</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <div>
                    <span className="text-sm font-medium text-red-700">Reprovado</span>
                    {approvalStatus.reason && (
                      <p className="text-xs text-red-600 mt-0.5">{approvalStatus.reason}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndoApproval}
              className="h-7 text-xs"
            >
              Desfazer
            </Button>
          </div>
        )}

        {/* Approval Buttons */}
        {!approvalStatus && (
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
              onClick={handleApprove}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={() => setShowRejectDialog(true)}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              Reprovar
            </Button>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant="outline"
          className="w-full mt-3"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Ocultar Fontes de Dados
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Ver Fontes de Dados
            </>
          )}
        </Button>

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
                      <span className="font-semibold">Pesos Aplicados:</span>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-muted-foreground">
                        <span>• Quantidade: {Math.round(weights.qty * 100)}%</span>
                        <span>• Margem: {Math.round(weights.margin * 100)}%</span>
                        <span>• Vendas: {Math.round(weights.sales * 100)}%</span>
                        <span>• Competitividade: {Math.round(weights.competitiveness * 100)}%</span>
                        <span>• Crescimento: {Math.round(weights.growth * 100)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Motivos da Recomendação:</span>
                      <ul className="mt-1 ml-4 list-disc space-y-1 text-muted-foreground">
                        {scoreResult.detailedReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                      Fontes: DW Condor (vendas/estoque/margem), Shopping Brasil & Prixsia (concorrência), Global Segmentos (mídia).
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Reprovar Produto
            </DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação do produto "{product.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Digite o motivo da reprovação..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
