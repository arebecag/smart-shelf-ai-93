import { useState, useEffect } from 'react';
import { useApprovals } from '@/contexts/ApprovalsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tv, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  Package,
  DollarSign,
  Maximize,
  Minimize
} from 'lucide-react';
import { cn } from '@/lib/utils';
import logoCondor from '@/assets/logo-condor.png';

export default function TVPresentation() {
  const { approvals } = useApprovals();
  const approvedProducts = approvals.filter(a => a.status === 'approved');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && approvedProducts.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % approvedProducts.length);
      }, 5000); // 5 seconds per product
      return () => clearInterval(interval);
    }
  }, [isPlaying, approvedProducts.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + approvedProducts.length) % approvedProducts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % approvedProducts.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const currentProduct = approvedProducts[currentIndex]?.product;

  if (approvedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-secondary/50 rounded-full p-6 mb-4">
          <Tv className="w-16 h-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Nenhum produto aprovado</h2>
        <p className="text-muted-foreground max-w-md">
          Aprove produtos na tela de busca ou dashboard para visualizá-los na apresentação para TV.
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-card/80 backdrop-blur">
        <div className="flex items-center gap-4">
          <img src={logoCondor} alt="Condor" className="h-10 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Tv className="w-6 h-6 text-primary" />
              Apresentação para TV
            </h1>
            <p className="text-sm text-muted-foreground">Ricardo & Cris - Produtos Aprovados</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {currentIndex + 1} / {approvedProducts.length}
          </Badge>
          
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button 
            variant={isPlaying ? "secondary" : "default"}
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="w-5 h-5" />
          </Button>

          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {currentProduct && (
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Product Image & Basic Info */}
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <img
                      src={currentProduct.imageUrl}
                      alt={currentProduct.name}
                      className="w-64 h-64 object-contain bg-white rounded-xl border shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <Badge className="absolute -top-3 -right-3 bg-green-500 text-white text-lg px-3 py-1">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Aprovado
                    </Badge>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-foreground text-center mb-2 capitalize">
                    {currentProduct.name}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-4">#{currentProduct.id}</p>
                  
                  <div className="text-5xl font-bold text-primary">
                    R$ {currentProduct.price.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metrics & Details */}
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6 text-center">
                    <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-600 font-medium">Estoque</p>
                    <p className="text-3xl font-bold text-blue-800">{currentProduct.stock}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-600 font-medium">Margem</p>
                    <p className="text-3xl font-bold text-green-800">{(currentProduct.margin * 100).toFixed(0)}%</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-purple-600 font-medium">Vendas</p>
                    <p className="text-3xl font-bold text-purple-800">{currentProduct.sales.toLocaleString()}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-6 text-center">
                    <BarChart2 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-orange-600 font-medium">Competitividade</p>
                    <p className="text-3xl font-bold text-orange-800">{(currentProduct.competitiveness * 100).toFixed(0)}%</p>
                  </CardContent>
                </Card>
              </div>

              {/* Nielsen Data */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    Dados Nielsen
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Market Share</p>
                      <p className="text-2xl font-bold text-foreground">{currentProduct.nielsen.marketShare}%</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Penetração</p>
                      <p className="text-2xl font-bold text-foreground">{currentProduct.nielsen.penetration}%</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Ranking Regional</p>
                      <p className="text-2xl font-bold text-foreground">{currentProduct.nielsen.regionalRanking}º</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Segmento</p>
                      <p className="text-2xl font-bold text-foreground">{currentProduct.nielsen.coreSegment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Comparison */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Comparativo de Preços (Prixsia)
                  </h3>
                  <div className="flex justify-between items-center text-center">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Mínimo</p>
                      <p className="text-xl font-bold text-green-600">R$ {currentProduct.prixsia.minPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex-1 border-l border-r">
                      <p className="text-sm text-muted-foreground">Média</p>
                      <p className="text-xl font-bold text-foreground">R$ {currentProduct.prixsia.avgPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Máximo</p>
                      <p className="text-xl font-bold text-red-600">R$ {currentProduct.prixsia.maxPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Thumbnails */}
          <div className="mt-8 max-w-7xl mx-auto">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {approvedProducts.map((approval, idx) => (
                <button
                  key={approval.product.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "flex-shrink-0 p-2 rounded-lg border-2 transition-all",
                    idx === currentIndex 
                      ? "border-primary bg-primary/10" 
                      : "border-transparent bg-card hover:bg-secondary/50"
                  )}
                >
                  <img
                    src={approval.product.imageUrl}
                    alt={approval.product.name}
                    className="w-16 h-16 object-contain rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
