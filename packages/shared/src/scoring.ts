export interface WeightedInput {
  score: number;
  weight: number;
}

export function computeWeightedScore(items: WeightedInput[]): number {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) {
    return 0;
  }

  const weighted = items.reduce((sum, item) => sum + item.score * item.weight, 0);
  return Number((weighted / totalWeight).toFixed(2));
}

export function computePercentage(part: number, total: number): number {
  if (!total) {
    return 0;
  }

  return Number(((part / total) * 100).toFixed(2));
}

export function classifyBand(score: number): "مرتفع" | "جيد" | "متوسط" | "منخفض" {
  if (score >= 85) return "مرتفع";
  if (score >= 70) return "جيد";
  if (score >= 50) return "متوسط";
  return "منخفض";
}
