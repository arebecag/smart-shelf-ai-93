import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  Sparkles, 
  BarChart2, 
  TrendingUp, 
  ShoppingCart, 
  Tv,
  Star,
  GitCompare,
  Settings,
  Search
} from 'lucide-react';

const Help = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Central de Ajuda</h1>
        <p className="text-muted-foreground">Aprenda a usar o TabloideAI de forma eficiente</p>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Início Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-semibold mb-2">1. Defina os filtros</h4>
              <p className="text-sm text-muted-foreground">
                Use os filtros de região, seção e campanha para segmentar os produtos relevantes.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-semibold mb-2">2. Escolha a estratégia</h4>
              <p className="text-sm text-muted-foreground">
                Selecione a estratégia de IA que melhor se adequa ao seu objetivo.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-semibold mb-2">3. Analise os scores</h4>
              <p className="text-sm text-muted-foreground">
                Produtos com score alto são os mais recomendados pela IA.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <h4 className="font-semibold mb-2">4. Compare e exporte</h4>
              <p className="text-sm text-muted-foreground">
                Use favoritos e comparação para facilitar sua decisão final.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Fontes de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <BarChart2 className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold">Nielsen</h4>
                <p className="text-sm text-muted-foreground">
                  Dados de market share, penetração de mercado, ranking regional e segmentação.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Prixsia</h4>
                <p className="text-sm text-muted-foreground">
                  Monitoramento de preços da concorrência com mínimo, média, mediana e máximo.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <ShoppingCart className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-semibold">Shopping Brasil</h4>
                <p className="text-sm text-muted-foreground">
                  Anúncios ativos de concorrentes com preços promocionais e datas de campanha.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <Tv className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold">Global Segmentos</h4>
                <p className="text-sm text-muted-foreground">
                  Dados de mídia e campanhas publicitárias dos concorrentes (TV, rádio, digital).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="score">
              <AccordionTrigger>Como é calculado o Score IA?</AccordionTrigger>
              <AccordionContent>
                O score é calculado combinando múltiplos fatores: margem do produto, volume de vendas, 
                estoque disponível, competitividade de preço e tendência de crescimento. Cada fator 
                recebe um peso baseado na estratégia selecionada. Produtos com anúncios ativos da 
                concorrência recebem bônus por potencial de tráfego.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="strategy">
              <AccordionTrigger>Qual estratégia devo escolher?</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Maior Quantidade:</strong> Prioriza produtos com bom estoque para alta execução</li>
                  <li><strong>Maior Margem:</strong> Foca em rentabilidade do tabloide</li>
                  <li><strong>Maior Venda:</strong> Prioriza produtos com alto giro histórico</li>
                  <li><strong>Menor Preço:</strong> Foca em competitividade de preço vs mercado</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="repeated">
              <AccordionTrigger>O que significa o alerta de produto repetido?</AccordionTrigger>
              <AccordionContent>
                Produtos marcados como repetidos já foram encartados em tabloides anteriores recentes. 
                Evitar repetição excessiva ajuda a manter o interesse dos clientes. Você pode permitir 
                ou não repetições nos filtros.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="favorites">
              <AccordionTrigger>Como usar favoritos e comparação?</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    Clique na estrela para salvar produtos nos favoritos
                  </p>
                  <p className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-primary" />
                    Clique no ícone de comparação para adicionar à comparação lado a lado
                  </p>
                  <p>Você pode comparar até 4 produtos simultaneamente com gráfico radar.</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="weights">
              <AccordionTrigger>Posso personalizar os pesos da IA?</AccordionTrigger>
              <AccordionContent>
                Sim! Nos filtros você pode ajustar os pesos manualmente. Também pode configurar 
                pesos padrão em <Settings className="w-4 h-4 inline" /> Configurações para que 
                sejam aplicados automaticamente em novas buscas.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Funcionalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Search className="w-8 h-8 mx-auto text-primary mb-2" />
              <h4 className="font-semibold">Busca Inteligente</h4>
              <p className="text-sm text-muted-foreground">Encontre produtos por nome ou código</p>
            </div>
            <div className="text-center p-4">
              <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
              <h4 className="font-semibold">Favoritos</h4>
              <p className="text-sm text-muted-foreground">Salve produtos para análise posterior</p>
            </div>
            <div className="text-center p-4">
              <GitCompare className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <h4 className="font-semibold">Comparação</h4>
              <p className="text-sm text-muted-foreground">Compare até 4 produtos lado a lado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
