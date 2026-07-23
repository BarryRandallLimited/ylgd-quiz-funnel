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
 * — there is no separate "pay the landscaper" path.
 *
 * landscaperRef (optional) identifies which landscaper's link the buyer
 * came from, for commission attribution. It's stored in Stripe metadata and
 * copied into the Orders table by the webhook — never used to route money.
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    console.error("[create-checkout-session] STRIPE_SECRET_KEY not configured.");
    return NextResponse.json(
      { error: "Payments aren't configured yet. Please contact us directly." },
      { status: 500 }
    );
  }

  let body: { package?: string; landscaperRef?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const pkg = body.package ? getPackage(body.package) : undefined;
  if (!pkg) {
    return NextResponse.json({ error: "Unknown package." }, { status: 400 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  const origin =
    req.headers.get("origin") ||
    `https://${req.headers.get("host") || "pay.yourlocalgardendesigner.co.uk"}`;

  const landscaperRef = (body.landscaperRef || "").trim();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      phone_number_collection: { enabled: true },
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
      },
      success_url: `${origin}/success?package=${pkg.slug}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${pkg.slug}${landscaperRef ? `?ref=${encodeURIComponent(landscaperRef)}` : ""}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[create-checkout-session] Stripe error:", err);
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 500 });
  }
}
