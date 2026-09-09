import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side handler for the /magazine download gate.
 *
 * Deliberately simple compared to /api/submit-lead: this is a low-friction
 * name-and-email signup for a free monthly magazine, not a quiz lead or a
 * paid order, so there is no Airtable durability layer here. The visitor
 * gets their download link immediately client-side regardless of whether
 * this forward succeeds; this route's job is just to hand the subscriber
 * over to GHL so Barry's team can email them the issue and add them to the
 * mailing list. The actual GHL workflow behind GHL_MAGAZINE_WEBHOOK_URL is
 * built and maintained manually, not by this codebase.
 */

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

function splitName(fullName: string): { first_name: string; last_name: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const parts = trimmed.split(" ");
  if (parts.length === 1) return { first_name: parts[0] ?? "", last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
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

  const forwardPayload = {
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

  if (!GHL_MAGAZINE_WEBHOOK_URL) {
    console.error("[magazine-signup] GHL_MAGAZINE_WEBHOOK_URL not configured, subscriber not forwarded.");
    // Still let the visitor through to the download; the front end doesn't
    // block the file on this webhook succeeding. Barry needs to set the env
    // var before subscribers actually start reaching his mailing list.
    return NextResponse.json({ ok: true, ghl: false, downloadUrl });
  }

  try {
    const res = await fetch(GHL_MAGAZINE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(forwardPayload),
    });
    if (!res.ok) {
      console.error(`[magazine-signup] GHL webhook returned ${res.status}`);
      return NextResponse.json({ ok: true, ghl: false, downloadUrl });
    }
    return NextResponse.json({ ok: true, ghl: true, downloadUrl });
  } catch (err) {
    console.error("[magazine-signup] GHL webhook error:", err);
    return NextResponse.json({ ok: true, ghl: false, downloadUrl });
  }
}
