import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side lead capture.
 *
 * Why this exists: the previous flow POSTed straight from the visitor's
 * browser to the GHL webhook with nothing else recording the lead. If that
 * request failed for any reason (network blip, ad blocker, GHL outage), the
 * lead vanished with no trace, silently wasting paid ad spend.
 *
 * This route writes every submission to the Airtable Leads table first,
 * which is the durable record, then forwards it to GHL, then updates the
 * same Airtable record with whether the GHL forward succeeded. The visitor's
 * experience never depends on GHL succeeding — the lead is safe the moment
 * it's in Airtable.
 */

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appAGZVUJmvnyDAL1";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const LEADS_TABLE = "Leads";
const REGIONS_TABLE = "Regions";
const GHL_WEBHOOK_URL = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;

interface LeadPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  postcode: string;
  garden_size: string;
  project_type_quiz: string;
  site_complexity: string;
  desired_features: string;
  timeline: string;
  finish_level: string;
  estimate_low: number;
  estimate_mid: number;
  estimate_high: number;
  estimate_summary: string;
  estimate_range: string;
  project_from: string;
  lead_source: string;
  region: string;
  tags: string[];
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  fbclid: string;
}

function airtableHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

async function findRegionRecordId(slug: string): Promise<string | undefined> {
  if (!slug) return undefined;
  try {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${REGIONS_TABLE}`);
    url.searchParams.set("filterByFormula", `{Slug} = "${slug}"`);
    url.searchParams.set("maxRecords", "1");
    const res = await fetch(url.toString(), { headers: airtableHeaders() });
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.records?.[0]?.id;
  } catch {
    return undefined;
  }
}

async function createLeadRecord(payload: LeadPayload): Promise<string | undefined> {
  const regionRecordId = await findRegionRecordId(payload.region);

  const fields: Record<string, unknown> = {
    Email: payload.email,
    "First Name": payload.first_name,
    "Last Name": payload.last_name,
    Phone: payload.phone,
    Postcode: payload.postcode,
    "Garden Size": payload.garden_size,
    "Project Type": payload.project_type_quiz,
    "Site Complexity": payload.site_complexity,
    "Desired Features": payload.desired_features,
    Timeline: payload.timeline,
    "Finish Level": payload.finish_level,
    "Estimate Low": payload.estimate_low,
    "Estimate Mid": payload.estimate_mid,
    "Estimate High": payload.estimate_high,
    "Estimate Summary": payload.estimate_summary,
    "Project From": payload.project_from,
    "UTM Source": payload.utm_source,
    "UTM Medium": payload.utm_medium,
    "UTM Campaign": payload.utm_campaign,
    "UTM Content": payload.utm_content,
    Fbclid: payload.fbclid,
    "GHL Sync Status": "Pending",
    "Submitted At": new Date().toISOString(),
  };
  if (regionRecordId) fields["Region"] = [regionRecordId];

  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${LEADS_TABLE}`, {
    method: "POST",
    headers: airtableHeaders(),
    body: JSON.stringify({ records: [{ fields }] }),
  });

  if (!res.ok) {
    console.error(`[Airtable] Lead create failed (${res.status})`, await res.text());
    return undefined;
  }

  const data = await res.json();
  return data.records?.[0]?.id;
}

async function updateLeadSyncStatus(
  recordId: string,
  status: "Sent" | "Failed",
  error?: string
) {
  try {
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${LEADS_TABLE}/${recordId}`, {
      method: "PATCH",
      headers: airtableHeaders(),
      body: JSON.stringify({
        fields: {
          "GHL Sync Status": status,
          ...(error ? { "GHL Sync Error": error } : {}),
        },
      }),
    });
  } catch (err) {
    console.error("[Airtable] Failed to update lead sync status:", err);
  }
}

async function forwardToGHL(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  if (!GHL_WEBHOOK_URL) {
    return { ok: false, error: "NEXT_PUBLIC_GHL_WEBHOOK_URL not configured" };
  }
  try {
    const res = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, error: `GHL webhook returned ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function POST(req: NextRequest) {
  let payload: LeadPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!AIRTABLE_API_KEY) {
    console.error("[submit-lead] AIRTABLE_API_KEY not set, cannot record lead durably.");
    // Still try GHL directly so leads aren't lost outright if Airtable isn't configured yet.
    const ghlResult = await forwardToGHL(payload);
    return NextResponse.json({ ok: ghlResult.ok, airtable: false });
  }

  const leadRecordId = await createLeadRecord(payload);

  const ghlResult = await forwardToGHL(payload);

  if (leadRecordId) {
    await updateLeadSyncStatus(leadRecordId, ghlResult.ok ? "Sent" : "Failed", ghlResult.error);
  }

  // The lead is durably recorded in Airtable regardless of the GHL outcome,
  // so the visitor-facing result is a success as long as Airtable succeeded.
  return NextResponse.json({ ok: Boolean(leadRecordId) || ghlResult.ok, airtable: Boolean(leadRecordId), ghl: ghlResult.ok });
}
