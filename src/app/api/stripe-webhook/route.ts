import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPackage } from "@/config/packages";

/**
 * Stripe webhook — fires when a checkout session completes.
 *
 * Mirrors the redundancy pattern in src/app/api/submit-lead/route.ts: the
 * Orders table in Airtable is the durable record, written first. GHL is
 * forwarded to second and its outcome doesn't block acknowledging the
 * webhook (Stripe retries on non-2xx, we don't want retries just because
 * GHL is briefly down).
 *
 * Must read the raw request body (not parsed JSON) to verify the Stripe
 * signature, so this route can't use req.json() directly.
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || "appAGZVUJmvnyDAL1";
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const ORDERS_TABLE = "Orders";
const GHL_WEBHOOK_URL = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;

function airtableHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };
}

interface OrderPayload {
  stripeSessionId: string;
  stripePaymentIntentId: string;
  packageSlug: string;
  packageName: string;
  amountGBP: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  landscaperRef: string;
  purchasedAt: string;
}

async function createOrderRecord(order: OrderPayload): Promise<string | undefined> {
  if (!AIRTABLE_API_KEY) {
    console.error("[stripe-webhook] AIRTABLE_API_KEY not set, cannot record order durably.");
    return undefined;
  }

  const fields: Record<string, unknown> = {
    "Stripe Checkout Session ID": order.stripeSessionId,
    "Stripe Payment Intent ID": order.stripePaymentIntentId,
    Package: order.packageName,
    Amount: order.amountGBP,
    "Customer Name": order.customerName,
    "Customer Email": order.customerEmail,
    "Customer Phone": order.customerPhone,
    "Landscaper Ref": order.landscaperRef,
    "Payment Status": "Paid",
    "GHL Sync Status": "Pending",
    "Purchased At": order.purchasedAt,
  };

  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${ORDERS_TABLE}`, {
    method: "POST",
    headers: airtableHeaders(),
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });

  if (!res.ok) {
    console.error(`[Airtable] Order create failed (${res.status})`, await res.text());
    return undefined;
  }

  const data = await res.json();
  return data.records?.[0]?.id;
}

async function updateOrderSyncStatus(recordId: string, status: "Sent" | "Failed", error?: string) {
  try {
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${ORDERS_TABLE}/${recordId}`, {
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
    console.error("[Airtable] Failed to update order sync status:", err);
  }
}

async function forwardToGHL(order: OrderPayload): Promise<{ ok: boolean; error?: string }> {
  if (!GHL_WEBHOOK_URL) {
    return { ok: false, error: "NEXT_PUBLIC_GHL_WEBHOOK_URL not configured" };
  }
  try {
    const res = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "order_purchased",
        first_name: order.customerName.split(" ")[0] || order.customerName,
        last_name: order.customerName.split(" ").slice(1).join(" "),
        email: order.customerEmail,
        phone: order.customerPhone,
        package: order.packageName,
        package_slug: order.packageSlug,
        amount_gbp: order.amountGBP,
        landscaper_ref: order.landscaperRef,
        tags: ["order-purchased", `package-${order.packageSlug}`],
      }),
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
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe-webhook] Stripe env vars not configured.");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledge everything else so Stripe doesn't retry; we only act on completed sessions.
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const packageSlug = session.metadata?.package || "";
  const pkg = getPackage(packageSlug);

  const order: OrderPayload = {
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || "",
    packageSlug,
    packageName: pkg?.name || packageSlug,
    amountGBP: (session.amount_total || 0) / 100,
    customerName: session.customer_details?.name || "",
    customerEmail: session.customer_details?.email || "",
    customerPhone: session.customer_details?.phone || "",
    landscaperRef: session.metadata?.landscaperRef || "",
    purchasedAt: new Date().toISOString(),
  };

  const orderRecordId = await createOrderRecord(order);
  const ghlResult = await forwardToGHL(order);

  if (orderRecordId) {
    await updateOrderSyncStatus(orderRecordId, ghlResult.ok ? "Sent" : "Failed", ghlResult.error);
  }

  return NextResponse.json({ received: true, airtable: Boolean(orderRecordId), ghl: ghlResult.ok });
}
