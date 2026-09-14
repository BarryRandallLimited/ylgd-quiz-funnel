import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side handler for the /magazine download gate.
 *
 * Writes every submission to the Airtable "Magazine Subscribers" table
 * first, then forwards it to GHL, then updates that same Airtable record
 * with whether the GHL forward succeeded. This mirrors the durable-first
 * pattern in /api/submit-lead: a signup is never silently lost just because
 * GHL_MAGAZINE_WEBHOOK_URL is unset or GHL is briefly down. The visitor
 * still gets their download link immediately regardless of either outcome,
 * since the front end doesn't gate the file on this route succeeding.
 *
 * The Airtable table itself must be created manually (the API can't create
 * new tables), see the field list in createSubscriberRecord below.
 */

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appAGZVUJmvnyDAL1";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const SUBSCRIBERS_TABLE = "Magazine Subscribers";
const GHL_MAGAZINE_WEBHOOK_URL = process.env.GHL_MAGAZINE_WEBHOOK_URL;
const MAGAZINE_ISSUE_LABEL = "September 2026";
const MAGAZINE_PDF_PATH = "/downloads/dream-gardens-landscapes-september-2026.pdf";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface MagazineSignupPayload {
  full_name: string;
  email: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  fbclid?: string;
}

interface ForwardPayload {
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  issue: string;
  download_url: string;
  lead_source: string;
  tags: string[];
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  fbclid: string;
  submitted_at: string;
}

function splitName(fullName: string): { first_name: string; last_name: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const parts = trimmed.split(" ");
  if (parts.length === 1) return { first_name: parts[0] ?? "", last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

function airtableHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

/**
 * Requires a "Magazine Subscribers" table in the same Airtable base, with
 * these fields (create manually, the API can't create tables): Email
 * (Single line text), First Name, Last Name, Issue, Download URL, Lead
 * Source, UTM Source, UTM Medium, UTM Campaign, UTM Content, Fbclid,
 * Submitted At (Single line text is fine, or Date), GHL Sync Status
 * (Single line text), GHL Sync Error (Single line text, optional).
 */
async function createSubscriberRecord(payload: ForwardPayload): Promise<{ recordId?: string; error?: string }> {
  const fields: Record<string, unknown> = {
    Email: payload.email,
    "First Name": payload.first_name,
    "Last Name": payload.last_name,
    Issue: payload.issue,
    "Download URL": payload.download_url,
    "Lead Source": payload.lead_source,
    "UTM Source": payload.utm_source,
    "UTM Medium": payload.utm_medium,
    "UTM Campaign": payload.utm_campaign,
    "UTM Content": payload.utm_content,
    Fbclid: payload.fbclid,
    "GHL Sync Status": "Pending",
    "Submitted At": payload.submitted_at,
  };

  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(SUBSCRIBERS_TABLE)}`, {
    method: "POST",
    headers: airtableHeaders(),
    body: JSON.stringify({ records: [{ fields }] }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[magazine-signup] Airtable create failed (${res.status})`, errText);
    return { error: `Airtable ${res.status}: ${errText.slice(0, 300)}` };
  }

  const data = await res.json();
  return { recordId: data.records?.[0]?.id };
}

async function updateSubscriberSyncStatus(recordId: string, status: "Sent" | "Failed", error?: string) {
  try {
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(SUBSCRIBERS_TABLE)}/${recordId}`, {
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
    console.error("[magazine-signup] Failed to update subscriber sync status:", err);
  }
}

async function forwardToGHL(payload: ForwardPayload): Promise<{ ok: boolean; error?: string }> {
  if (!GHL_MAGAZINE_WEBHOOK_URL) {
    return { ok: false, error: "GHL_MAGAZINE_WEBHOOK_URL not configured" };
  }
  try {
    const res = await fetch(GHL_MAGAZINE_WEBHOOK_URL, {
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
  let body: MagazineSignupPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const fullName = (body.full_name || "").trim();
  const email = (body.email || "").trim();

  if (!fullName) {
    return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  }

  const { first_name, last_name } = splitName(fullName);
  const downloadUrl = `${req.nextUrl.origin}${MAGAZINE_PDF_PATH}`;

  const forwardPayload: ForwardPayload = {
    full_name: fullName,
    first_name,
    last_name,
    email,
    issue: MAGAZINE_ISSUE_LABEL,
    download_url: downloadUrl,
    lead_source: "Magazine Landing Page",
    tags: ["ylgd-magazine-subscriber"],
    utm_source: body.utm_source || "",
    utm_medium: body.utm_medium || "",
    utm_campaign: body.utm_campaign || "",
    utm_content: body.utm_content || "",
    fbclid: body.fbclid || "",
    submitted_at: new Date().toISOString(),
  };

  if (!AIRTABLE_API_KEY) {
    console.error("[magazine-signup] AIRTABLE_API_KEY not set, cannot record subscriber durably.");
    // Still try GHL directly so the subscriber isn't lost outright if
    // Airtable isn't configured yet.
    const ghlResult = await forwardToGHL(forwardPayload);
    return NextResponse.json({
      ok: ghlResult.ok,
      airtable: false,
      ghl: ghlResult.ok,
      downloadUrl,
      debug: "AIRTABLE_API_KEY not set in Vercel env",
    });
  }

  const { recordId, error: airtableError } = await createSubscriberRecord(forwardPayload);

  const ghlResult = await forwardToGHL(forwardPayload);

  if (recordId) {
    await updateSubscriberSyncStatus(recordId, ghlResult.ok ? "Sent" : "Failed", ghlResult.error);
  }

  // Durably recorded in Airtable regardless of the GHL outcome, so the
  // visitor-facing result is a success as long as Airtable succeeded.
  return NextResponse.json({
    ok: Boolean(recordId) || ghlResult.ok,
    airtable: Boolean(recordId),
    ghl: ghlResult.ok,
    downloadUrl,
    // TEMP DEBUG: remove once the flow is confirmed working end-to-end.
    debug: { airtableError, ghlError: ghlResult.error },
  });
}
