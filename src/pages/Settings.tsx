import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    defaultStrategy: 'Maior Quantidade',
    weightQty: 0.35,
    weightMargin: 0.15,
    weightSales: 0.25,
    weightCompetitiveness: 0.15,
    weightGrowth: 0.10,
    autoRefresh: true,
    refreshInterval: 5,
    showRepeatedWarning: true,
    minScore: 50,
  });

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleReset = () => {
    setSettings({
      defaultStrategy: 'Maior Quantidade',
      weightQty: 0.35,
      weightMargin: 0.15,
      weightSales: 0.25,
      weightCompetitiveness: 0.15,
      weightGrowth: 0.10,
      autoRefresh: true,
      refreshInterval: 5,
      showRepeatedWarning: true,
      minScore: 50,
    });
    toast({
      title: "Configurações restauradas",
      description: "As configurações padrão foram restauradas.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Personalize o comportamento do TabloideAI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Strategy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Estratégia de IA</CardTitle>
          <CardDescription>Configure os pesos padrão para cálculo do score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Estratégia Padrão</Label>
            <Select 
              value={settings.defaultStrategy} 
              onValueChange={(v) => setSettings({ ...settings, defaultStrategy: v })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maior Quantidade">Maior Quantidade</SelectItem>
                <SelectItem value="Maior Margem">Maior Margem</SelectItem>
                <SelectItem value="Maior Venda">Maior Venda</SelectItem>
                <SelectItem value="Menor Preço">Menor Preço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Peso Quantidade: {(settings.weightQty * 100).toFixed(0)}%</Label>
              <Slider
                value={[settings.weightQty * 100]}
                onValueChange={([v]) => setSettings({ ...settings, weightQty: v / 100 })}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Peso Margem: {(settings.weightMargin * 100).toFixed(0)}%</Label>
              <Slider
                value={[settings.weightMargin * 100]}
                onValueChange={([v]) => setSettings({ ...settings, weightMargin: v / 100 })}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Peso Vendas: {(settings.weightSales * 100).toFixed(0)}%</Label>
              <Slider
                value={[settings.weightSales * 100]}
                onValueChange={([v]) => setSettings({ ...settings, weightSales: v / 100 })}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Peso Competitividade: {(settings.weightCompetitiveness * 100).toFixed(0)}%</Label>
              <Slider
                value={[settings.weightCompetitiveness * 100]}
                onValueChange={([v]) => setSettings({ ...settings, weightCompetitiveness: v / 100 })}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Peso Crescimento: {(settings.weightGrowth * 100).toFixed(0)}%</Label>
              <Slider
                value={[settings.weightGrowth * 100]}
                onValueChange={([v]) => setSettings({ ...settings, weightGrowth: v / 100 })}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Exibição</CardTitle>
          <CardDescription>Configurações de interface e alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exibir alerta de produtos repetidos</Label>
              <p className="text-sm text-muted-foreground">Mostra ícone de alerta em produtos já encartados</p>
            </div>
            <Switch
              checked={settings.showRepeatedWarning}
              onCheckedChange={(v) => setSettings({ ...settings, showRepeatedWarning: v })}
            />
          </div>

          <div>
            <Label>Score mínimo para recomendação: {settings.minScore}</Label>
            <Slider
              value={[settings.minScore]}
              onValueChange={([v]) => setSettings({ ...settings, minScore: v })}
              max={100}
              step={5}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Produtos com score abaixo deste valor serão destacados em vermelho
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Dados</CardTitle>
          <CardDescription>Configurações de atualização de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Atualização automática</Label>
              <p className="text-sm text-muted-foreground">Atualiza os dados automaticamente</p>
            </div>
            <Switch
              checked={settings.autoRefresh}
              onCheckedChange={(v) => setSettings({ ...settings, autoRefresh: v })}
            />
          </div>

          {settings.autoRefresh && (
            <div>
              <Label>Intervalo de atualização (minutos)</Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={settings.refreshInterval}
                onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) || 5 })}
                className="mt-1.5 w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
