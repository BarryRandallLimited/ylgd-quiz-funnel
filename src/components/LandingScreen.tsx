"use client";

import { Leaf } from "lucide-react";
import type { RegionData } from "@/lib/types";

interface LandingScreenProps {
  region: RegionData;
  onStart: () => void;
}

export default function LandingScreen({ region, onStart }: LandingScreenProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body">
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
      <div
        className="flex flex-col md:w-1/2 md:min-h-screen"
        style={{ backgroundColor: "#F5F5F0" }}
      >
        {/* Hero band */}
        <div
          className="px-5 pt-8 pb-10 md:pl-12 md:pr-10"
          style={{ backgroundColor: "#1E3A2F" }}
        >
          <div className="max-w-lg mx-auto md:mx-0">
            {/* Brand mark */}
            <div className="flex items-center gap-2 mb-8">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#C9A76A" }}
              >
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-semibold text-base tracking-tight text-white font-display">
                Your Local Garden Designer
              </span>
            </div>

            {/* Trust badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
              style={{
                backgroundColor: "rgba(201,167,106,0.18)",
                border: "1px solid rgba(201,167,106,0.4)",
              }}
            >
              <span style={{ color: "#C9A76A" }} className="text-xs">
                ★★★★★
              </span>
              <span className="text-white/90 text-[11px] font-semibold leading-tight">
                {region.badgeText}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.6rem] font-bold leading-[1.02] text-white text-balance mb-4 font-display">
              {region.heroHeadline}
            </h1>

            {/* Sub-headline */}
            <p className="text-white/80 text-[17px] leading-relaxed text-pretty">
              {region.heroSubheadline}
            </p>
          </div>
        </div>

        {/* Mobile image */}
        <div className="md:hidden w-full">
          <img
            src={region.heroImageUrl}
            alt="Beautifully designed garden"
            className="w-full h-auto block"
            loading="eager"
          />
        </div>

        {/* CTA card */}
        <div className="flex-1 px-4 pb-8 md:flex md:flex-col md:justify-center md:pl-12 md:pr-10 md:py-10">
          <div className="rounded-2xl bg-white shadow-sm border border-stone-100 p-6 max-w-lg w-full mx-auto md:mx-0">
            <h2 className="text-[1.35rem] font-bold text-stone-900 mb-3 text-balance leading-snug font-display">
              Takes about 2 minutes
            </h2>
            <p className="text-stone-600 text-[16px] leading-relaxed mb-6 text-pretty">
              A few questions about your garden, your goals, and what you want
              from a landscaper. That's it.
            </p>
            <button
              onClick={onStart}
              className="w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] text-stone-900"
              style={{ backgroundColor: "#C9A76A" }}
            >
              Find My Landscaper Match →
            </button>
            <p className="text-stone-500 text-[14px] text-center mt-4 leading-snug">
              {region.countyList}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
