import { useState } from 'react';
import { useApprovals } from '@/contexts/ApprovalsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Download,
  AlertTriangle,
  Package,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const Approvals = () => {
  const { approvals, removeApproval, clearApprovals } = useApprovals();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<typeof approvals[0] | null>(null);

  const approvedProducts = approvals.filter((a) => a.status === 'approved');
  const rejectedProducts = approvals.filter((a) => a.status === 'rejected');

  const filterItems = (items: typeof approvals) => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const exportToCSV = (items: typeof approvals, filename: string) => {
    const headers = ['ID', 'Produto', 'Status', 'Motivo', 'Data', 'Preço', 'Margem'];
    const rows = items.map((item) => [
      item.product.id,
      item.product.name,
      item.status === 'approved' ? 'Aprovado' : 'Reprovado',
      item.reason || '-',
      format(item.approvedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      `R$ ${item.product.price.toFixed(2)}`,
      `${(item.product.margin * 100).toFixed(0)}%`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const renderProductTable = (items: typeof approvals, showReason: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Margem</TableHead>
          {showReason && <TableHead>Motivo</TableHead>}
          <TableHead>Data</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={showReason ? 6 : 5} className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum produto encontrado</p>
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-md object-contain bg-secondary border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">#{item.product.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>R$ {item.product.price.toFixed(2)}</TableCell>
              <TableCell>{(item.product.margin * 100).toFixed(0)}%</TableCell>
              {showReason && (
                <TableCell>
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {item.reason || '-'}
                  </span>
                </TableCell>
              )}
              <TableCell>
                {format(item.approvedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedApproval(item)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeApproval(item.product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aprovações</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos aprovados e reprovados para o tabloide
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportToCSV(approvals, 'todas-aprovacoes')}
            disabled={approvals.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Tudo
          </Button>
          <Button
            variant="destructive"
            onClick={clearApprovals}
            disabled={approvals.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Tudo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvals.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Aprovados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{approvedProducts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Reprovados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{rejectedProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="approved" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Aprovados ({approvedProducts.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Reprovados ({rejectedProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approved" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Produtos Aprovados</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(approvedProducts, 'produtos-aprovados')}
                disabled={approvedProducts.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              {renderProductTable(filterItems(approvedProducts), false)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Produtos Reprovados</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(rejectedProducts, 'produtos-reprovados')}
                disabled={rejectedProducts.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              {renderProductTable(filterItems(rejectedProducts), true)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedApproval?.status === 'approved' ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Aprovado
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  <XCircle className="w-3 h-3 mr-1" />
                  Reprovado
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>Detalhes da decisão</DialogDescription>
          </DialogHeader>

          {selectedApproval && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedApproval.product.imageUrl}
                  alt={selectedApproval.product.name}
                  className="w-16 h-16 rounded-lg object-contain bg-secondary border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div>
                  <h3 className="font-semibold">{selectedApproval.product.name}</h3>
                  <p className="text-sm text-muted-foreground">#{selectedApproval.product.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Preço:</span>
                  <p className="font-medium">R$ {selectedApproval.product.price.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Margem:</span>
                  <p className="font-medium">{(selectedApproval.product.margin * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estoque:</span>
                  <p className="font-medium">{selectedApproval.product.stock} unidades</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data da decisão:</span>
                  <p className="font-medium">
                    {format(selectedApproval.approvedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>

              {selectedApproval.reason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700 text-sm">Motivo da Reprovação</p>
                      <p className="text-sm text-red-600 mt-1">{selectedApproval.reason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Approvals;
