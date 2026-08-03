import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPackage } from "@/config/packages";

/**
 * Creates a Stripe Checkout Session for one of the four fixed-price
 * packages (Consultation / Blueprint / Vision / Masterpiece).
 *
 * Money always lands with YLGD first (this is Barry's explicit requirement
 * from the 2026-07-21 voice note: landscapers must never collect payment
 * directly, so YLGD can distribute each landscaper's share manually rather
 * than chasing them for it). So this always uses YLGD's own Stripe account
 * there is no separate "pay the landscaper" path.
 *
 * landscaperRef (optional) identifies which landscaper's link the buyer
 * came from, for commission attribution. It's stored in Stripe metadata and
 * copied into the Orders table by the webhook, but never used to route money.
 *
 * Test mode: real pages always use the live key by default. Appending
 * ?test=<STRIPE_TEST_ACCESS_CODE> to any pay page switches just that
 * checkout session to Stripe's test key, so a full run-through (Stripe test
 * card 4242 4242 4242 4242 → webhook → Airtable → GHL) can happen anytime
 * without touching real money or swapping any env vars. If a testCode is
 * supplied but doesn't match, the request is rejected outright rather than
 * silently falling back to live: a mistyped code should never turn into an
 * accidental real charge.
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_SECRET_KEY_TEST = process.env.STRIPE_SECRET_KEY_TEST;
const STRIPE_TEST_ACCESS_CODE = process.env.STRIPE_TEST_ACCESS_CODE;

export async function POST(req: NextRequest) {
  let body: { package?: string; landscaperRef?: string; testCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const pkg = body.package ? getPackage(body.package) : undefined;
  if (!pkg) {
    return NextResponse.json({ error: "Unknown package." }, { status: 400 });
  }

  const requestedTestCode = (body.testCode || "").trim();
  let useTestMode = false;

  if (requestedTestCode) {
    if (!STRIPE_TEST_ACCESS_CODE || requestedTestCode !== STRIPE_TEST_ACCESS_CODE) {
      return NextResponse.json({ error: "Invalid test code." }, { status: 403 });
    }
    if (!STRIPE_SECRET_KEY_TEST) {
      return NextResponse.json({ error: "Test mode isn't configured yet." }, { status: 500 });
    }
    useTestMode = true;
  }

  const activeKey = useTestMode ? STRIPE_SECRET_KEY_TEST : STRIPE_SECRET_KEY;

  if (!activeKey) {
    console.error("[create-checkout-session] Stripe key not configured for this mode.");
    return NextResponse.json(
      { error: "Payments aren't configured yet. Please contact us directly." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(activeKey);

  const origin =
    req.headers.get("origin") ||
    `https://${req.headers.get("host") || "pay.yourlocalgardendesigner.co.uk"}`;

  const landscaperRef = (body.landscaperRef || "").trim();

  // Preserve ?ref= and ?test= on both the success and cancel redirects, so
  // cancelling a test checkout lands back in test mode, not a live page.
  const cancelParams = new URLSearchParams();
  if (landscaperRef) cancelParams.set("ref", landscaperRef);
  if (useTestMode) cancelParams.set("test", requestedTestCode);
  const cancelQuery = cancelParams.toString() ? `?${cancelParams.toString()}` : "";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      phone_number_collection: { enabled: true },
      billing_address_collection: "required",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: pkg.priceGBP * 100,
            product_data: {
              name: pkg.name,
              description: pkg.tagline,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        package: pkg.slug,
        landscaperRef,
        isTest: useTestMode ? "true" : "false",
      },
      success_url: `${origin}/success?package=${pkg.slug}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${pkg.slug}${cancelQuery}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[create-checkout-session] Stripe error:", err);
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 500 });
  }
}
