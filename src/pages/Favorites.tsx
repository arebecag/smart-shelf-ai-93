import { FilterState } from '@/types/product';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';

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
  const { favorites } = useFavorites();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Favoritos</h1>
          <p className="text-muted-foreground">
            {favorites.length} {favorites.length === 1 ? 'produto salvo' : 'produtos salvos'}
          </p>
        </div>
      </div>

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
        <div className="bg-card rounded-xl shadow-card p-12 text-center">
          <Star className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Nenhum favorito ainda</h3>
          <p className="text-muted-foreground mb-4">
            Clique no ícone de estrela nos produtos para salvá-los aqui
          </p>
          <Button variant="outline" asChild>
            <a href="/buscar">Buscar Produtos</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
