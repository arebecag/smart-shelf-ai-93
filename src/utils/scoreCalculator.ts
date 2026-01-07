import { Product, ScoreResult, FilterState } from '@/types/product';

interface Weights {
  qty: number;
  margin: number;
  sales: number;
  competitiveness: number;
  growth: number;
}

const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

export const getDefaultWeights = (strategy: string): Weights => {
  switch (strategy) {
    case 'Maior Margem':
      return { qty: 0.10, margin: 0.55, sales: 0.10, competitiveness: 0.15, growth: 0.10 };
    case 'Maior Venda':
      return { qty: 0.20, margin: 0.20, sales: 0.40, competitiveness: 0.10, growth: 0.10 };
    case 'Menor Preço':
      return { qty: 0.15, margin: 0.15, sales: 0.20, competitiveness: 0.35, growth: 0.15 };
    default: // Maior Quantidade
      return { qty: 0.35, margin: 0.15, sales: 0.25, competitiveness: 0.15, growth: 0.10 };
  }
};

export const getWeights = (filters: FilterState): Weights => {
  const defaultWeights = getDefaultWeights(filters.strategy);
  
  const weights: Weights = {
    qty: !isNaN(filters.weightQty) && filters.weightQty > 0 ? filters.weightQty : defaultWeights.qty,
    margin: !isNaN(filters.weightMargin) && filters.weightMargin > 0 ? filters.weightMargin : defaultWeights.margin,
    sales: !isNaN(filters.weightSales) && filters.weightSales > 0 ? filters.weightSales : defaultWeights.sales,
    competitiveness: !isNaN(filters.weightCompetitiveness) && filters.weightCompetitiveness > 0 ? filters.weightCompetitiveness : defaultWeights.competitiveness,
    growth: !isNaN(filters.weightGrowth) && filters.weightGrowth > 0 ? filters.weightGrowth : defaultWeights.growth,
  };

  // Normalize to sum to 1
  const sum = weights.qty + weights.margin + weights.sales + weights.competitiveness + weights.growth;
  return {
    qty: weights.qty / sum,
    margin: weights.margin / sum,
    sales: weights.sales / sum,
    competitiveness: weights.competitiveness / sum,
    growth: weights.growth / sum,
  };
};

export const calculateScore = (product: Product, filters: FilterState): ScoreResult => {
  const weights = getWeights(filters);
  
  // Normalize values
  const nSales = clamp01(product.sales / 2000);
  const nStock = clamp01(product.stock / 20);
  const nRentAdj = clamp01(product.rentability * 1.0);

  // Calculate base score
  let score = 0;
  score += weights.qty * nStock;
  score += weights.margin * product.margin;
  score += weights.sales * nSales;
  score += weights.competitiveness * product.competitiveness;
  score += weights.growth * product.growth;

  // Rentability adjustment
  score += 0.05 * nRentAdj;

  // Repetition penalty
  if (product.isRepeated && filters.allowRepetition === 'Não') {
    score -= 0.08;
  }

  // Ad bonus
  if (product.hasAd && product.competitiveness >= 0.65) {
    score += 0.04;
  }

  score = clamp01(score);

  // Build explanations
  const reasons: string[] = [];
  
  if (product.margin >= 0.22 && weights.margin > 0.2) {
    reasons.push('Margem acima da média para a seção');
  }
  if (nStock >= 0.35 && weights.qty > 0.2) {
    reasons.push('Estoque adequado para execução do tabloide');
  }
  if (nSales >= 0.5 && weights.sales > 0.2) {
    reasons.push('Bom histórico de vendas recentes');
  }
  if (product.competitiveness >= 0.7 && weights.competitiveness > 0.2) {
    reasons.push('Preço competitivo vs concorrência (Shopping Brasil/Prixsia)');
  }
  if (product.growth >= 0.10 && weights.growth > 0.1) {
    reasons.push('Categoria/produto em tendência de alta (sazonalidade)');
  }
  if (product.hasAd) {
    reasons.push('Concorrente com mídia ativa (Global Segmentos) — potencial de tráfego');
  }
  if (product.isRepeated) {
    reasons.push('⚠ Já encartado no mês anterior (evitar repetição, salvo exceção)');
  }
  
  if (reasons.length === 0) {
    reasons.push('Equilíbrio geral entre margem, vendas, estoque e competitividade');
  }

  const shortReason = reasons[0] + (reasons.length > 1 ? ' + …' : '');

  return {
    score: Math.round(score * 100),
    shortReason,
    detailedReasons: reasons,
  };
};
