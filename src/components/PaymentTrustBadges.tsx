import { Lock } from "lucide-react";

/**
 * Trust badges shown under the CTA button on every pay page: a "Secure
 * Checkout" lock label plus small Visa / Mastercard / Stripe chips, so
 * visitors recognize familiar, legitimate payment options before clicking
 * through to Stripe's hosted checkout. Built as simple inline SVG/text
 * rather than sourced logo files, so there are no external assets and
 * nothing to license.
 */
export default function PaymentTrustBadges() {
  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 text-stone-400">
        <Lock size={12} />
        <span className="text-[11px] font-semibold uppercase tracking-wide">Secure Checkout</span>
      </div>
      <div className="flex items-center gap-2">
        {/* Visa */}
        <div className="flex h-6 w-10 items-center justify-center rounded border border-stone-200 bg-white">
          <span className="text-[11px] font-black italic tracking-tighter" style={{ color: "#1A1F71" }}>
            VISA
          </span>
        </div>

        {/* Mastercard */}
        <div className="flex h-6 w-10 items-center justify-center rounded border border-stone-200 bg-white">
          <svg width="22" height="13" viewBox="0 0 22 13" aria-label="Mastercard">
            <circle cx="8" cy="6.5" r="6.5" fill="#EB001B" />
            <circle cx="14" cy="6.5" r="6.5" fill="#F79E1B" fillOpacity="0.85" />
          </svg>
        </div>

        {/* Stripe */}
        <div className="flex h-6 items-center rounded border border-stone-200 bg-white px-2">
          <span className="text-[11px] font-bold tracking-tight" style={{ color: "#635BFF" }}>
            Stripe
          </span>
        </div>
      </div>
    </div>
  );
}
