"use client";

import { CheckCircle2, MapPin, Star } from "lucide-react";
import { founderProfile } from "@/config/regions";
import type { PriceResult } from "@/lib/types";

interface ResultsScreenProps {
  result: PriceResult;
  countyList: string;
}

function fmt(n: number, symbol: string) {
  return `${symbol}${n.toLocaleString("en-GB")}`;
}

export default function ResultsScreen({ result, countyList }: ResultsScreenProps) {
  const profile = founderProfile;

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Header */}
      <div className="flex items-center justify-center px-5 py-4" style={{ backgroundColor: "#1E3A2F" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#C9A76A" }}>
            <span className="text-white text-xs font-bold">🌿</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-white font-display">
            Your Local Garden Designer
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 pt-6 pb-10">
        {/* 1. Intro */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={44} style={{ color: "#1E3A2F" }} strokeWidth={1.5} />
        </div>

        <h2 className="text-[1.85rem] leading-[1.06] font-bold text-stone-950 text-center mb-3 text-balance font-display">
          Here's What Happens Next
        </h2>

        <p className="text-[17px] text-stone-700 text-center leading-relaxed mb-6 text-pretty">
          Barry Randall reviews every project personally. He'll talk through your ideas, confirm your budget range, and match you with the right landscaper for the job.
        </p>

        {/* 2. Designer profile */}
        <div className="mb-6">
          <div className="flex gap-4 items-start mb-5">
            <img
              src={profile.headshot}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover object-top shrink-0 shadow-sm bg-stone-200"
            />
            <div>
              <p className="font-bold text-stone-900 text-[16px]">{profile.name}</p>
              <p className="text-sm text-stone-500 mb-2">{profile.title}</p>
            </div>
          </div>

          <div className="text-[16px] text-stone-700 leading-relaxed mb-4 text-pretty space-y-3">
            {profile.bio.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="flex items-start gap-2 mb-5 text-sm text-stone-600">
            <MapPin size={16} className="shrink-0 mt-0.5" style={{ color: "#C9A76A" }} />
            <span>Covers {profile.coverageArea}</span>
          </div>

          {/* Testimonials */}
          <div className="space-y-4 mb-6">
            {profile.testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-stone-200 bg-white px-4 py-4 shadow-sm">
                <p className="text-[15px] text-stone-700 leading-relaxed mb-3 text-pretty">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{t.name}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-600">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="#C9A76A" color="#C9A76A" />
                    ))}
                    <span className="ml-0.5">5 Stars on Google</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Cost guide */}
        <p
          className="text-xs font-bold uppercase tracking-widest text-center mb-4"
          style={{ color: "#C9A76A" }}
        >
          Your initial estimate
        </p>

        <h3 className="text-[1.5rem] leading-tight font-bold text-stone-950 text-center mb-3 text-balance font-display">
          A Realistic Guide to Your Garden's Cost
        </h3>

        <p className="text-[16px] text-stone-700 text-center leading-relaxed mb-5 text-pretty">
          Based on what you've told us about your {result.gardenSizeM2} garden.
        </p>

        <div className="rounded-[1.75rem] p-5 mb-5 shadow-sm" style={{ backgroundColor: "#1E3A2F" }}>
          <p className="text-white/80 text-xs font-bold uppercase tracking-[0.2em] text-center mb-2">
            Your project starts from
          </p>
          <div className="text-center mb-5">
            <p className="text-[2.8rem] font-bold text-white leading-none font-display">
              {fmt(result.projectFrom, result.currency)}
            </p>
          </div>
          <p className="text-white/65 text-xs text-center leading-relaxed">
            This is a starting figure based on your answers, not a quote. Where your garden lands depends on the materials and detail you choose.
          </p>
        </div>

        {/* Control framing */}
        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 mb-6 shadow-sm">
          <p className="text-[16px] text-stone-700 leading-relaxed text-pretty">
            Two identical gardens can cost very differently. A simpler finish keeps it lean. Premium materials and more detail add to it. You decide where on that scale you sit, and the design stage is where you make those calls.
          </p>
        </div>

        {/* What happens next */}
        <div
          className="rounded-2xl p-5 mb-6 border shadow-sm"
          style={{ borderColor: "#C9A76A", backgroundColor: "#FFFBF1" }}
        >
          <h3 className="text-[1.2rem] leading-tight font-bold text-stone-950 mb-3 text-balance font-display">
            What Happens Next
          </h3>
          <p className="text-[16px] text-stone-700 leading-relaxed text-pretty">
            {profile.firstName} already has your details and your answers. He'll call you within one working day to talk through your garden and, if it's a fit, scope the design. No obligation, and nothing to pay to have the conversation.
          </p>
        </div>

        <p className="text-[14px] text-stone-500 text-center leading-snug text-pretty">
          {countyList}
        </p>
      </div>
    </div>
  );
}
