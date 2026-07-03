export type GardenSize = "small" | "medium" | "large" | "xlarge" | "estate";
export type Engineering = "none" | "slope" | "drainage" | "both";
export type Timeline = "urgent" | "planned" | "flexible";
export type ProjectType = "new_build" | "renovation" | "extension" | "full_redesign";
export type FinishLevel = "natural" | "refined" | "premium";

export interface SelectedFeatures {
  patio: boolean;
  pergola: boolean;
  pool: boolean;
  waterFeature: boolean;
  outdoorKitchen: boolean;
  lighting: boolean;
  planting: boolean;
}

export interface QuizAnswers {
  postcode: string;
  projectType: ProjectType | null;
  gardenSize: GardenSize | null;
  engineering: Engineering | null;
  features: SelectedFeatures;
  timeline: Timeline | null;
  finishLevel: FinishLevel | null;
}

export interface PriceResult {
  low: number;
  high: number;
  mid: number;
  projectFrom: number;
  baseBuild: number;
  featureBreakdown: Array<{ label: string; from: number }>;
  currency: string;
  summary: string;
  gardenSizeM2: string;
}

export interface ContactDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface RegionData {
  slug: string;
  regionName: string;
  badgeText: string;
  heroHeadline: string;
  heroSubheadline: string;
  countyList: string;
  locationPlaceholder: string;
  heroImageUrl: string;
}
