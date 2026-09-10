"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import type { ServicePackage } from "@/config/packages";
import PayHeader from "@/components/PayHeader";
import PaymentTrustBadges from "@/components/PaymentTrustBadges";

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

interface PayClientProps {
  pkg: ServicePackage;
  landscaperRef?: string;
  testCode?: string;
}

export default function PayClient({ pkg, landscaperRef, testCode }: PayClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ package: pkg.slug, landscaperRef, testCode }),
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER, fontFamily: BODY_FONT, color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
      <PayHeader trailing="Secure" />

      {testCode && (
        <div className="bg-red-600 px-4 py-2 text-center text-sm font-bold uppercase tracking-wide text-white">
          Test Mode: No Real Payment Will Be Taken
        </div>
      )}

      <div className="w-full max-h-[32vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover object-center" />
      </div>

      <div className="flex-1 px-5 py-6 md:px-10 md:py-8 max-w-lg mx-auto w-full">
        <div className="rounded-md p-5 md:p-6" style={{ border: "1px solid rgba(42,42,34,0.15)", backgroundColor: PAPER }}>
          {pkg.mostPopular && (
            <div className="flex justify-start mb-4">
              <div
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5"
                style={{ border: `1px solid ${GREEN}`, backgroundColor: "rgba(47,93,58,0.1)" }}
              >
                <Star size={14} style={{ color: GREEN }} fill={GREEN} />
                <span
                  className="text-xs font-semibold uppercase"
                  style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.08em", color: GREEN }}
                >
                  Most Homeowners Choose This
                </span>
              </div>
            </div>
          )}

          <p
            className="text-xs font-semibold uppercase mb-2"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.14em", color: GREEN }}
          >
            {pkg.eyebrow}
          </p>

          <h1
            className="uppercase font-medium leading-[1.15] mb-3 text-[1.65rem] text-balance"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em" }}
          >
            {pkg.name}
          </h1>

          <p className="text-[16px] leading-relaxed mb-5 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>{pkg.tagline}</p>

          <div className="rounded-md px-4 py-3 mb-5" style={{ border: "1px solid rgba(42,42,34,0.15)", backgroundColor: "rgba(42,42,34,0.03)" }}>
            <p
              className="text-xs font-semibold uppercase mb-0.5"
              style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.1em", color: "rgba(42,42,34,0.55)" }}
            >
              Your Investment
            </p>
            <p className="text-2xl font-medium" style={{ fontFamily: DISPLAY_FONT }}>{pkg.investmentLabel}</p>
          </div>

          <p
            className="text-xs font-semibold uppercase mb-3"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.1em", color: "rgba(42,42,34,0.55)" }}
          >
            What&rsquo;s Included
          </p>
          <div className="space-y-3 mb-6">
            {pkg.features.map((feature) => (
              <div key={feature} className="flex gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: GREEN }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
                <p className="text-[15px] leading-snug" style={{ color: "rgba(42,42,34,0.75)" }}>{feature}</p>
              </div>
            ))}
          </div>

          <p
            className="text-xs font-semibold uppercase mb-2"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.1em", color: "rgba(42,42,34,0.55)" }}
          >
            How This Works: Design And Matching
          </p>
          <p className="text-[15px] leading-relaxed mb-6 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
            {pkg.howItWorksBody}
          </p>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 rounded-md uppercase font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.06em" }}
          >
            {loading
              ? "Redirecting To Secure Checkout…"
              : `Pay Securely Now · £${pkg.priceGBP.toLocaleString()} →`}
          </button>
          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          <PaymentTrustBadges />
          <p className="mt-3 text-center text-xs" style={{ color: "rgba(42,42,34,0.55)" }}>
            Payments are processed securely by Stripe. {pkg.turnaround}
          </p>

          <div className="mt-6 pt-6" style={{ borderTop: "1px solid rgba(42,42,34,0.15)" }}>
            <p
              className="text-xs font-semibold uppercase mb-4"
              style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.1em", color: "rgba(42,42,34,0.55)" }}
            >
              What Happens Next
            </p>
            <div className="space-y-4">
              {pkg.nextSteps.map((step, i) => (
                <div key={step} className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{ backgroundColor: INK }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-[15px] leading-relaxed pt-0.5" style={{ color: "rgba(42,42,34,0.75)" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "rgba(42,42,34,0.55)" }}>
          Your Local Garden Designer · an independent design &amp; matching service ·
          yourlocalgardendesigner.co.uk
        </p>
      </div>
    </div>
  );
}
