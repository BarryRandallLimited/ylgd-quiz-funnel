import type { QuizAnswers, PriceResult, ContactDetails } from "./types";

function labelProjectType(v: string): string {
  const map: Record<string, string> = {
    new_build: "New build garden",
    renovation: "Garden renovation",
    extension: "Garden extension or addition",
    full_redesign: "Full redesign",
  };
  return map[v] ?? v;
}

function labelGardenSize(v: string): string {
  const map: Record<string, string> = {
    small: "Up to 100m\u00B2",
    medium: "100\u2013250m\u00B2",
    large: "250\u2013500m\u00B2",
    xlarge: "500\u20131,000m\u00B2",
    estate: "1,000m\u00B2+",
  };
  return map[v] ?? v;
}

function labelEngineering(v: string): string {
  const map: Record<string, string> = {
    none: "Mostly flat and easy to access",
    slope: "Slope or level changes",
    drainage: "Drainage or waterlogging",
    both: "Slope plus drainage issues",
  };
  return map[v] ?? v;
}

function labelTimeline(v: string): string {
  const map: Record<string, string> = {
    urgent: "Within the next 3 months",
    planned: "In the next 3 to 9 months",
    flexible: "Still in the research stage",
  };
  return map[v] ?? v;
}

function labelFinishLevel(v: string): string {
  const map: Record<string, string> = {
    natural: "Natural and simple",
    refined: "Refined and detailed",
    premium: "No expense spared",
  };
  return map[v] ?? v;
}

function selectedFeaturesList(features: Record<string, boolean> | import("./types").SelectedFeatures): string {
  const labels: Record<string, string> = {
    patio: "Patio or terrace",
    pergola: "Pergola or shade structure",
    pool: "Pool or hot tub area",
    waterFeature: "Water feature",
    outdoorKitchen: "Outdoor kitchen",
    lighting: "Garden lighting",
    planting: "Planting and borders",
  };
  const selected = Object.entries(features)
    .filter(([, v]) => v)
    .map(([k]) => labels[k] ?? k);
  return selected.length > 0 ? selected.join(", ") : "None selected";
}

function formatGBP(value: number): string {
  return `\u00A3${value.toLocaleString("en-GB")}`;
}

export async function submitLead(
  contact: ContactDetails,
  answers: QuizAnswers,
  price: PriceResult,
  regionSlug: string
): Promise<boolean> {
  const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[GHL] Webhook URL not configured.");
    return false;
  }

  const ghlPayload = {
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    postcode: answers.postcode,
    garden_size: labelGardenSize(answers.gardenSize ?? "medium"),
    project_type_quiz: answers.projectType
      ? labelProjectType(answers.projectType)
      : "",
    site_complexity: labelEngineering(answers.engineering ?? "none"),
    desired_features: selectedFeaturesList(answers.features),
    timeline: labelTimeline(answers.timeline ?? "planned"),
    finish_level: answers.finishLevel
      ? labelFinishLevel(answers.finishLevel)
      : "",
    estimate_low: price.low,
    estimate_mid: price.mid,
    estimate_high: price.high,
    estimate_summary: price.summary,
    estimate_range: `${formatGBP(price.low)} \u2013 ${formatGBP(price.high)}`,
    project_from: formatGBP(price.projectFrom),
    lead_source: "Your Local Garden Designer Funnel",
    region: regionSlug,
    tags: ["ylgd-lead", `ylgd-${regionSlug}`],
    utm_source:
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("utm_source") ?? ""
        : "",
    utm_medium:
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("utm_medium") ?? ""
        : "",
    utm_campaign:
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("utm_campaign") ?? ""
        : "",
    utm_content:
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("utm_content") ?? ""
        : "",
    fbclid:
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("fbclid") ?? ""
        : "",
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ghlPayload),
    });
    if (!res.ok) {
      console.warn(`[GHL] Webhook failed (${res.status})`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[GHL] Network error:", err);
    return false;
  }
}
