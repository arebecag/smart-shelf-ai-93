import { Link } from 'react-router-dom';
import { FilterState } from '@/types/product';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Search, Trash2, Download, GitCompare } from 'lucide-react';
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
  allowRepetition: '-',
  startDate: '',
  endDate: '',
};

const Favorites = () => {
  const { favorites, removeFavorite, addToCompare, isInCompare } = useFavorites();
  const { toast } = useToast();

  const handleExportFavorites = () => {
    if (favorites.length === 0) return;

    const csvContent = [
      ['ID', 'Produto', 'Preço', 'Margem', 'Estoque', 'Vendas'].join(','),
      ...favorites.map(p => [
        p.id,
        `"${p.name}"`,
        `R$ ${p.price.toFixed(2)}`,
        `${(p.margin * 100).toFixed(0)}%`,
        p.stock,
        p.sales
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'favoritos.csv';
    link.click();

    toast({
      title: "Exportação concluída",
      description: `${favorites.length} produtos exportados com sucesso.`,
    });
  };

  const handleAddAllToCompare = () => {
    const toAdd = favorites.filter(p => !isInCompare(p.id)).slice(0, 4);
    toAdd.forEach(p => addToCompare(p));
    
    toast({
      title: "Produtos adicionados",
      description: `${toAdd.length} produtos adicionados à comparação.`,
    });
  };

  const handleClearAll = () => {
    favorites.forEach(p => removeFavorite(p.id));
    toast({
      title: "Favoritos limpos",
      description: "Todos os produtos foram removidos dos favoritos.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Favoritos</h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}
          </p>
        </div>
        
        {favorites.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddAllToCompare}>
              <GitCompare className="w-4 h-4 mr-2" />
              Comparar Todos
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportFavorites}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{favorites.length}</p>
              <p className="text-xs text-muted-foreground">Produtos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                R$ {(favorites.reduce((acc, p) => acc + p.price, 0) / favorites.length).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Preço Médio</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {(favorites.reduce((acc, p) => acc + p.margin, 0) / favorites.length * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">Margem Média</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {favorites.reduce((acc, p) => acc + p.stock, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Estoque Total</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              filters={defaultFilters}
              showFullReason
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Star className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Nenhum favorito ainda</h3>
            <p className="text-muted-foreground mb-4">
              Clique no ícone <Star className="w-4 h-4 inline" /> nos produtos para salvá-los aqui
            </p>
            <Button asChild>
              <Link to="/buscar">
                <Search className="w-4 h-4 mr-2" />
                Buscar Produtos
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Favorites;
