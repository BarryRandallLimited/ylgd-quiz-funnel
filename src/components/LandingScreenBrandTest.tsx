"use client";

import type { RegionData } from "@/lib/types";

/**
 * Brand-test sibling of LandingScreen.tsx. Same props/logic/copy, restyled
 * with the ink/paper/green brand guide. See MagazineLandingBrandTest.tsx for
 * the established pattern this mirrors.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";

interface LandingScreenBrandTestProps {
  region: RegionData;
  onStart: () => void;
}

export default function LandingScreenBrandTest({ region, onStart }: LandingScreenBrandTestProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Left column: full-height image (desktop only) */}
      <div className="hidden md:block md:w-1/2 sticky top-0 h-screen overflow-hidden shrink-0">
        <img
          src={region.heroImageUrl}
          alt="Beautifully designed garden"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* Right column */}
      <div className="flex flex-col md:w-1/2 md:min-h-screen" style={{ backgroundColor: PAPER }}>
        {/* Hero band */}
        <div className="px-5 pt-6 pb-6 md:pt-8 md:pb-10 md:pl-12 md:pr-10" style={{ backgroundColor: INK }}>
          <div className="max-w-lg mx-auto md:mx-0">
            {/* Brand mark */}
            <div className="flex items-center gap-2 mb-4 md:mb-8">
              <img
                src="/images/brand/ylgd-mark-primary.svg"
                alt="Your Local Garden Designer"
                className="h-10 w-auto rounded-sm"
              />
            </div>

            {/* Trust badge */}
            <div
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 mb-3 md:mb-5"
              style={{ backgroundColor: "rgba(47,93,58,0.12)", border: "1px solid rgba(47,93,58,0.35)" }}
            >
              <span style={{ color: "#9CAE84" }} className="text-xs">★★★★★</span>
              <span className="text-[11px] font-semibold leading-tight" style={{ color: "rgba(244,239,228,0.9)" }}>
                {region.badgeText}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="uppercase leading-[1.12] text-white text-balance mb-2 md:mb-4 text-[1.7rem] md:text-[2.3rem]"
              style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em" }}
            >
              {region.heroHeadline}
            </h1>

            {/* Sub-headline */}
            <p className="text-white/80 text-[14px] md:text-[17px] leading-relaxed text-pretty">
              {region.heroSubheadline}
            </p>
          </div>
        </div>

        {/* CTA card - placed immediately after the hero band on mobile so it sits above the fold */}
        <div className="px-4 pt-5 pb-6 flex-1 md:flex md:flex-col md:justify-center md:pl-12 md:pr-10 md:py-10">
          <div className="rounded-md border p-6 max-w-lg w-full mx-auto md:mx-0" style={{ borderColor: INK, backgroundColor: PAPER }}>
            <h2
              className="uppercase mb-3 text-balance leading-snug text-[1.15rem]"
              style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.03em", color: INK }}
            >
              Takes About 2 Minutes
            </h2>
            <p className="text-[16px] leading-relaxed mb-6 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
              A few questions about your garden, your goals, and what you want from a landscaper. That's it.
            </p>
            <button
              onClick={onStart}
              className="w-full py-4 rounded-md uppercase font-semibold text-base text-white transition-all duration-150 active:scale-[0.98]"
              style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.06em" }}
            >
              Find My Landscaper Match →
            </button>
            <p className="text-[14px] text-center mt-4 leading-snug" style={{ color: "rgba(42,42,34,0.55)" }}>
              {region.countyList}
            </p>
          </div>
        </div>

        {/* Mobile image - shown below the CTA as supporting visual, no longer blocking the button from view */}
        <div className="md:hidden w-full">
          <img
            src={region.heroImageUrl}
            alt="Beautifully designed garden"
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
