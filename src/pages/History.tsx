import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History as HistoryIcon, Calendar, Package, Eye, Download } from 'lucide-react';

const mockHistory = [
  {
    id: '1',
    name: 'Tabloide Inverno 2025',
    date: '2025-01-05',
    products: 45,
    avgScore: 78,
    status: 'published',
  },
  {
    id: '2',
    name: 'Campanha Dia das Mães',
    date: '2025-05-10',
    products: 62,
    avgScore: 82,
    status: 'draft',
  },
  {
    id: '3',
    name: 'Tabloide Verão 2024',
    date: '2024-12-15',
    products: 38,
    avgScore: 71,
    status: 'published',
  },
  {
    id: '4',
    name: 'Black Friday 2024',
    date: '2024-11-28',
    products: 120,
    avgScore: 85,
    status: 'published',
  },
];

const History = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
        <p className="text-muted-foreground">Visualize tabloides e campanhas anteriores</p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {mockHistory.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <HistoryIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {item.products} produtos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Score Médio</div>
                    <div className="text-xl font-bold text-green-600">{item.avgScore}</div>
                  </div>

                  <Badge 
                    variant={item.status === 'published' ? 'default' : 'secondary'}
                    className={item.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </Badge>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;
