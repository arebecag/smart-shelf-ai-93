import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockHistory, HistoryItem } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  History as HistoryIcon, 
  Calendar, 
  Package, 
  Eye, 
  Download, 
  Search,
  Filter,
  FileText,
  User,
  MapPin,
  Target,
  DollarSign,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const History = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter history
  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.campaign.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (item: HistoryItem) => {
    setSelectedItem(item);
  };

  const handleExport = async (item: HistoryItem) => {
    setIsExporting(true);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create CSV content
    const csvContent = [
      ['ID', 'Produto', 'Preço', 'Margem', 'Estoque', 'Score'].join(','),
      ...item.products.map(p => [
        p.id,
        p.name,
        `R$ ${p.price.toFixed(2)}`,
        `${(p.margin * 100).toFixed(0)}%`,
        p.stock,
        '75' // Mock score
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${item.name.replace(/\s+/g, '_')}.csv`;
    link.click();
    
    setIsExporting(false);
    
    toast({
      title: "Exportação concluída",
      description: `O arquivo ${item.name}.csv foi baixado com sucesso.`,
    });
  };

  const handleUseAsTemplate = (item: HistoryItem) => {
    toast({
      title: "Template carregado",
      description: `O tabloide "${item.name}" foi carregado como base para um novo.`,
    });
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
          <p className="text-muted-foreground">Visualize tabloides e campanhas anteriores</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tabloide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="published">Publicados</SelectItem>
              <SelectItem value="draft">Rascunhos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockHistory.length}</p>
              <p className="text-xs text-muted-foreground">Total de tabloides</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockHistory.filter(h => h.status === 'published').length}</p>
              <p className="text-xs text-muted-foreground">Publicados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockHistory.reduce((acc, h) => acc + h.products.length, 0)}</p>
              <p className="text-xs text-muted-foreground">Produtos encartados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(mockHistory.reduce((acc, h) => acc + h.avgScore, 0) / mockHistory.length)}</p>
              <p className="text-xs text-muted-foreground">Score médio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <HistoryIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {item.products.length} produtos
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {item.region}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {item.campaign}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {item.createdBy}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Score Médio</div>
                      <div className="text-xl font-bold text-green-600">{item.avgScore}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Valor Total</div>
                      <div className="text-lg font-semibold">
                        R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <Badge 
                      variant={item.status === 'published' ? 'default' : 'secondary'}
                      className={item.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(item)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleExport(item)}
                        disabled={isExporting}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {isExporting ? 'Exportando...' : 'Exportar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <HistoryIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros de busca</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-primary" />
              {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              Criado em {selectedItem && new Date(selectedItem.date).toLocaleDateString('pt-BR')} por {selectedItem?.createdBy}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{selectedItem.products.length}</p>
                  <p className="text-xs text-muted-foreground">Produtos</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedItem.avgScore}</p>
                  <p className="text-xs text-muted-foreground">Score Médio</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{(selectedItem.avgMargin * 100).toFixed(0)}%</p>
                  <p className="text-xs text-muted-foreground">Margem Média</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold">R$ {(selectedItem.totalValue / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                </div>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Região:</span>
                  <span className="font-medium">{selectedItem.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Campanha:</span>
                  <span className="font-medium">{selectedItem.campaign}</span>
                </div>
              </div>

              {/* Products Table */}
              <div>
                <h4 className="font-semibold mb-3">Produtos do Tabloide</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Produto</th>
                        <th className="text-right p-3 font-medium">Preço</th>
                        <th className="text-right p-3 font-medium">Margem</th>
                        <th className="text-right p-3 font-medium">Estoque</th>
                        <th className="text-right p-3 font-medium">Vendas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItem.products.map((product, idx) => (
                        <tr key={product.id} className={idx % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-10 h-10 rounded object-contain bg-secondary"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">#{product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-right font-medium">R$ {product.price.toFixed(2)}</td>
                          <td className="p-3 text-right">{(product.margin * 100).toFixed(0)}%</td>
                          <td className="p-3 text-right">{product.stock} un</td>
                          <td className="p-3 text-right">{product.sales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => handleExport(selectedItem)}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button onClick={() => handleUseAsTemplate(selectedItem)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Usar como Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
