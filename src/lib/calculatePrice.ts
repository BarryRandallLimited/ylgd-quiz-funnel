import type { QuizAnswers, PriceResult } from "./types";

/**
 * Pricing formula:
 *   base_build = max(LANDSCAPING_FLOOR, garden_m2 x BASE_RATE_PER_SQM x FINISH_MULTIPLIER)
 *   project_from = base_build + sum(selected feature add-ons)
 *   Round project_from DOWN to nearest £5,000
 */

const BASE_RATE_PER_SQM = 300;
const LANDSCAPING_FLOOR = 25_000;

const GARDEN_M2: Record<string, number> = {
  small: 75,
  medium: 175,
  large: 375,
  xlarge: 750,
  estate: 1500,
};

const GARDEN_M2_LABEL: Record<string, string> = {
  small: "75m\u00B2",
  medium: "175m\u00B2",
  large: "375m\u00B2",
  xlarge: "750m\u00B2",
  estate: "1,500m\u00B2",
};

const FINISH_MULTIPLIER: Record<string, number> = {
  natural: 1.0,
  refined: 1.4,
  premium: 2.0,
};

const FEATURE_ADDONS: Record<string, { label: string; from: number }> = {
  pergola: { label: "Pergola or shade structure", from: 2_000 },
  outdoorKitchen: { label: "Outdoor kitchen", from: 3_000 },
  pool: { label: "Pool or hot tub area", from: 20_000 },
  lighting: { label: "Lighting scheme", from: 2_000 },
  patio: { label: "Patio or paving", from: 5_000 },
  planting: { label: "Planting scheme", from: 3_000 },
  waterFeature: { label: "Water feature", from: 4_000 },
};

function roundDownTo5k(n: number): number {
  return Math.floor(n / 5_000) * 5_000;
}

export function calculatePrice(answers: QuizAnswers): PriceResult {
  const sizeKey = answers.gardenSize ?? "medium";
  const finishKey = answers.finishLevel ?? "natural";

  const m2 = GARDEN_M2[sizeKey] ?? 175;
  const multiplier = FINISH_MULTIPLIER[finishKey] ?? 1.0;

  const rawBase = m2 * BASE_RATE_PER_SQM * multiplier;
  const baseBuild = Math.max(LANDSCAPING_FLOOR, rawBase);

  const featureBreakdown: Array<{ label: string; from: number }> = [];
  let featureTotal = 0;
  const f = answers.features;
  for (const [key, selected] of Object.entries(f)) {
    if (selected && FEATURE_ADDONS[key]) {
      featureBreakdown.push(FEATURE_ADDONS[key]);
      featureTotal += FEATURE_ADDONS[key].from;
    }
  }

  const rawTotal = baseBuild + featureTotal;
  const projectFrom = roundDownTo5k(rawTotal);

  const mid = projectFrom;
  const low = roundDownTo5k(projectFrom * 0.85);
  const high = roundDownTo5k(projectFrom * 1.3);

  const finishLabels: Record<string, string> = {
    natural: "Natural and simple",
    refined: "Refined and detailed",
    premium: "No expense spared",
  };
  const sizeLabels: Record<string, string> = {
    small: "small garden",
    medium: "medium garden",
    large: "large garden",
    xlarge: "extra-large garden",
    estate: "estate garden",
  };
  const summary = `${finishLabels[finishKey] ?? finishKey} \u00B7 ${sizeLabels[sizeKey] ?? sizeKey}`;

  return {
    low,
    high,
    mid,
    projectFrom,
    baseBuild: roundDownTo5k(baseBuild),
    featureBreakdown,
    currency: "\u00A3",
    summary,
    gardenSizeM2: GARDEN_M2_LABEL[sizeKey] ?? `${m2}m\u00B2`,
  };
}
