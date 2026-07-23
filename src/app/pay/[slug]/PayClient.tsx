"use client";

import { useState } from "react";
import type { ServicePackage } from "@/config/packages";

interface PayClientProps {
  pkg: ServicePackage;
  landscaperRef?: string;
}

export default function PayClient({ pkg, landscaperRef }: PayClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package: pkg.slug, landscaperRef }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Something went wrong starting checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-sage font-body text-forest">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-forest">
            Your Local Garden Designer
          </p>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gold">
            {pkg.eyebrow}
          </p>
          <h1 className="font-display text-3xl font-bold text-forest sm:text-4xl">
            {pkg.name}
          </h1>
          <p className="mt-3 text-base text-forest/80">{pkg.tagline}</p>
          {pkg.mostPopular && (
            <span className="mt-4 inline-block rounded-full bg-gold-light px-4 py-1 text-xs font-semibold uppercase tracking-wide text-forest">
              Most Homeowners Choose This
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-gold-border bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-1 text-sm text-forest/70">Your investment</p>
          <p className="mb-6 font-display text-3xl font-bold text-forest">
            {pkg.investmentLabel}
          </p>

          <h2 className="mb-4 font-display text-lg font-bold text-forest">
            What&rsquo;s Included
          </h2>
          <ul className="mb-8 space-y-3">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-sm text-forest/90">
                <span className="mt-0.5 flex-shrink-0 text-gold">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <h2 className="mb-3 font-display text-lg font-bold text-forest">
            How This Works — Design And Matching
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-forest/90">{pkg.howItWorksBody}</p>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full rounded-xl bg-forest px-6 py-4 text-center font-display text-lg font-bold text-white transition hover:bg-forest-light disabled:opacity-60"
          >
            {loading ? "Redirecting To Secure Checkout…" : `Pay Securely Now — £${pkg.priceGBP.toLocaleString()}`}
          </button>
          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          <p className="mt-3 text-center text-xs text-forest/60">
            Payments are processed securely by Stripe. {pkg.turnaround}
          </p>

          <div className="mt-8 border-t border-gold-border pt-6">
            <h2 className="mb-3 font-display text-base font-bold text-forest">
              What Happens Next
            </h2>
            <ol className="space-y-2 text-sm text-forest/90">
              {pkg.nextSteps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex-shrink-0 font-display font-bold text-gold">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-forest/60">
          Your Local Garden Designer · an independent design &amp; matching service ·
          yourlocalgardendesigner.co.uk
        </p>
      </div>
    </main>
  );
}
