import type { RegionData, LandscaperData } from "./types";
import { fallbackRegions } from "@/config/regions";

/**
 * Airtable-backed region data.
 *
 * The site is designed to keep working even if Airtable is unreachable or
 * misconfigured: any failure below falls back to the hardcoded
 * `fallbackRegions` array in src/config/regions.ts, so a bad API key or an
 * Airtable outage never takes the site down.
 */

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appAGZVUJmvnyDAL1";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const REGIONS_TABLE = "Regions";
const LANDSCAPERS_TABLE = "Landscapers";

// Used whenever a region's "Hero Image Hosted URL" field is empty in Airtable
// (e.g. before the Vercel Blob automation has run for that record).
const DEFAULT_HERO_IMAGE = "/images/private-family-resort.jpeg";

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function mapRecordToRegion(record: AirtableRecord): RegionData {
  const f = record.fields;
  return {
    slug: str(f["Slug"]),
    regionName: str(f["Region Name"]),
    badgeText: str(f["Badge Text"]),
    heroHeadline: str(f["Hero Headline"]),
    heroSubheadline: str(f["Hero Sub-headline"]),
    countyList: str(f["County List"]),
    locationPlaceholder: str(f["Location Placeholder"]),
    heroImageUrl: str(f["Hero Image Hosted URL"], DEFAULT_HERO_IMAGE),
  };
}

/**
 * Fetches all active regions from Airtable. Falls back to the hardcoded
 * regions.ts list on any error, missing config, or empty result.
 */
export async function getRegions(): Promise<RegionData[]> {
  if (!AIRTABLE_API_KEY) {
    console.warn(
      "[Airtable] AIRTABLE_API_KEY not set, using fallbackRegions from regions.ts."
    );
    return fallbackRegions;
  }

  try {
    const records: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const url = new URL(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(REGIONS_TABLE)}`
      );
      if (offset) url.searchParams.set("offset", offset);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
        // Regions rarely change; a short revalidate window keeps builds fast
        // while still picking up edits without a full redeploy if this is
        // ever used from a route that supports ISR.
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[Airtable] Regions fetch failed (${res.status}), using fallbackRegions.`);
        return fallbackRegions;
      }

      const data = (await res.json()) as AirtableListResponse;
      records.push(...data.records);
      offset = data.offset;
    } while (offset);

    const active = records
      .filter((r) => r.fields["Active"] === true)
      .map(mapRecordToRegion)
      .filter((r) => r.slug.length > 0);

    if (active.length === 0) {
      console.warn("[Airtable] No active regions returned, using fallbackRegions.");
      return fallbackRegions;
    }

    return active;
  } catch (err) {
    console.warn("[Airtable] Regions fetch threw, using fallbackRegions:", err);
    return fallbackRegions;
  }
}

export async function getRegionBySlug(slug: string): Promise<RegionData | undefined> {
  const regions = await getRegions();
  return regions.find((r) => r.slug === slug);
}

function mapRecordToLandscaper(record: AirtableRecord): LandscaperData {
  const f = record.fields;
  return {
    slug: str(f["Slug"]),
    businessName: str(f["Business Name"]),
    founderName: str(f["Founder/MD Name"]),
  };
}

/**
 * Fetches active landscapers from Airtable, keyed by their Slug field.
 * Unlike regions, there's no hardcoded fallback list — a landscaper link is a
 * personal attribution link, not core site navigation, so if Airtable is
 * unreachable the /pay/l/[landscaper] page should 404 rather than show
 * something misleading.
 */
export async function getLandscapers(): Promise<LandscaperData[]> {
  if (!AIRTABLE_API_KEY) {
    console.warn("[Airtable] AIRTABLE_API_KEY not set, cannot fetch landscapers.");
    return [];
  }

  try {
    const records: AirtableRecord[] = [];
    let offset: string | undefined;

    do {
      const url = new URL(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(LANDSCAPERS_TABLE)}`
      );
      if (offset) url.searchParams.set("offset", offset);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`[Airtable] Landscapers fetch failed (${res.status}).`);
        return [];
      }

      const data = (await res.json()) as AirtableListResponse;
      records.push(...data.records);
      offset = data.offset;
    } while (offset);

    return records
      .filter((r) => r.fields["Active"] === true)
      .map(mapRecordToLandscaper)
      .filter((l) => l.slug.length > 0);
  } catch (err) {
    console.warn("[Airtable] Landscapers fetch threw:", err);
    return [];
  }
}

export async function getLandscaperBySlug(slug: string): Promise<LandscaperData | undefined> {
  const landscapers = await getLandscapers();
  return landscapers.find((l) => l.slug === slug);
}
