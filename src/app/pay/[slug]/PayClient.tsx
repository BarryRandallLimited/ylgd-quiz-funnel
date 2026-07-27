"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import type { ServicePackage } from "@/config/packages";
import PayHeader from "@/components/PayHeader";

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
    <div className="min-h-screen flex flex-col font-body" style={{ backgroundColor: "#F5F5F0" }}>
      <PayHeader trailing="Secure" />

      {testCode && (
        <div className="bg-red-600 px-4 py-2 text-center text-sm font-bold uppercase tracking-wide text-white">
          Test Mode — No Real Payment Will Be Taken
        </div>
      )}

      <div className="w-full max-h-[32vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover object-center" />
      </div>

      <div className="flex-1 px-5 py-6 md:px-10 md:py-8 max-w-lg mx-auto w-full">
        <div className="rounded-2xl bg-white shadow-sm border border-stone-100 p-5 md:p-6">
          {pkg.mostPopular && (
            <div className="flex justify-start mb-4">
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{ borderWidth: 1, borderStyle: "solid", borderColor: "#C9A76A", backgroundColor: "#FFFBF1" }}
              >
                <Star size={14} style={{ color: "#C9A76A" }} fill="#C9A76A" />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#C9A76A" }}>
                  Most Homeowners Choose This
                </span>
              </div>
            </div>
          )}

          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A76A" }}>
            {pkg.eyebrow}
          </p>

          <h1 className="text-[1.65rem] leading-[1.08] font-bold text-stone-950 mb-3 text-balance font-display">
            {pkg.name}
          </h1>

          <p className="text-[16px] text-stone-600 leading-relaxed mb-5 text-pretty">{pkg.tagline}</p>

          <div className="rounded-xl bg-stone-50 border border-stone-100 px-4 py-3 mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-0.5">
              Your Investment
            </p>
            <p className="text-2xl font-bold text-stone-950 font-display">{pkg.investmentLabel}</p>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">
            What&rsquo;s Included
          </p>
          <div className="space-y-3 mb-6">
            {pkg.features.map((feature) => (
              <div key={feature} className="flex gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: "#C9A76A" }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </div>
                <p className="text-[15px] text-stone-700 leading-snug">{feature}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">
            How This Works — Design And Matching
          </p>
          <p className="text-[15px] text-stone-600 leading-relaxed mb-6 text-pretty">
            {pkg.howItWorksBody}
          </p>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
            style={{ backgroundColor: "#1E3A2F" }}
          >
            {loading
              ? "Redirecting To Secure Checkout…"
              : `Pay Securely Now — £${pkg.priceGBP.toLocaleString()} →`}
          </button>
          {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
          <p className="mt-3 text-center text-xs text-stone-500">
            Payments are processed securely by Stripe. {pkg.turnaround}
          </p>

          <div className="mt-6 pt-6 border-t border-stone-100">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
              What Happens Next
            </p>
            <div className="space-y-4">
              {pkg.nextSteps.map((step, i) => (
                <div key={step} className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                    style={{ backgroundColor: "#1E3A2F" }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-[15px] text-stone-700 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Your Local Garden Designer · an independent design &amp; matching service ·
          yourlocalgardendesigner.co.uk
        </p>
      </div>
    </div>
  );
}
