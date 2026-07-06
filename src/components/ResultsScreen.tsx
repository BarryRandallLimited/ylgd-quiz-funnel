"use client";

import { CheckCircle2, Star } from "lucide-react";
import { founderProfile } from "@/config/regions";
import type { PriceResult } from "@/lib/types";

interface ResultsScreenProps {
  result: PriceResult;
  countyList: string;
}

function fmt(n: number, symbol: string) {
  return `${symbol}${n.toLocaleString("en-GB")}`;
}

function VimeoEmbed({ videoId, hash, title }: { videoId: string; hash?: string; title: string }) {
  const src = hash
    ? `https://player.vimeo.com/video/${videoId}?h=${hash}&badge=0&autopause=0&player_id=0&app_id=58479`
    : `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm" style={{ paddingBottom: "56.25%" }}>
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

const testimonialVideos = [
  {
    videoId: "781421878",
    hash: "ff8ecac6c8",
    title: "Client testimonial 1",
    subhead: "\"The best possible work done and the best treatment. I feel like I've had both.\"",
    name: "Kiernan Dewsbury-Hall",
  },
  {
    videoId: "781422708",
    hash: "33ce289637",
    title: "Client testimonial 2",
    subhead: "\"We couldn't manage this on our own... It was great to know we were in safe hands.\"",
    name: "Mark and Colette",
  },
  {
    videoId: "781413313",
    hash: undefined,
    title: "Client testimonial 3",
    subhead: "\"I couldn't be happier... It's exactly how I imagined it.\"",
    name: "James Maddison",
  },
];

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
        {/* 1. Thank you and letter */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={44} style={{ color: "#1E3A2F" }} strokeWidth={1.5} />
        </div>

        <h2 className="text-[1.85rem] leading-[1.06] font-bold text-stone-950 text-center mb-2 text-balance font-display">
          Thank You For Your Enquiry, We've Received All Your Answers
        </h2>

        <p className="text-[17px] text-stone-700 text-center leading-relaxed mb-6 text-pretty font-semibold">
          Here's what happens next.
        </p>

        {/* Letter-style message */}
        <div className="rounded-2xl bg-white border border-stone-200 shadow-sm px-5 py-6 mb-8">
          <div className="text-[16px] text-stone-700 leading-relaxed text-pretty space-y-4">
            <p>
              Every project is reviewed personally by our team, not a call centre, not an algorithm.
            </p>

            <p>
              We'll talk through your ideas, confirm the budget range you're working to, and match you with the right landscaper for your project and your area.
            </p>

            <p>
              We stay involved through the design stage, to make sure what gets built is what you actually asked for.
            </p>

            <p className="font-semibold">
              A quick word on why that matters.
            </p>

            <p>
              I built the Your Local Garden Designer network after 33 years serving homeowners in this trade.
            </p>

            <p>
              I know which landscapers deliver and which ones don't because I've worked alongside them.
            </p>

            <p>
              Between us, that network has completed over 1,100 gardens, with a portfolio that includes work for Premier League clubs, footballers, musicians and other high-profile private clients.
            </p>

            <p>We'll be in touch shortly.</p>

            <p>Speak soon,</p>
          </div>

          {/* Sign-off with profile */}
          <div className="flex gap-4 items-center mt-5 pt-5 border-t border-stone-100">
            <img
              src={profile.headshot}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover object-top shrink-0 shadow-sm bg-stone-200"
            />
            <div>
              <p className="font-bold text-stone-900 text-[16px]">{profile.name}</p>
              <p className="text-sm text-stone-500">{profile.title}</p>
            </div>
          </div>
        </div>

        {/* 2. Cost guide */}
        <p
          className="text-xs font-bold uppercase tracking-widest text-center mb-4"
          style={{ color: "#C9A76A" }}
        >
          Your initial estimate
        </p>

        <h3 className="text-[1.5rem] leading-tight font-bold text-stone-950 text-center mb-3 text-balance font-display">
          A Realistic Guide To Your Garden's Cost
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
        <div className="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 mb-8 shadow-sm">
          <p className="text-[16px] text-stone-700 leading-relaxed text-pretty">
            Two identical gardens can cost very differently. A simpler finish keeps it lean. Premium materials and more detail add to it. You decide where on that scale you sit, and the design stage is where you make those calls.
          </p>
        </div>

        {/* 3. Video testimonials */}
        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-widest text-center mb-5"
            style={{ color: "#C9A76A" }}
          >
            What our clients say
          </p>
          <div className="space-y-8">
            {testimonialVideos.map((video) => (
              <div key={video.videoId}>
                <p className="text-[17px] font-semibold text-stone-800 leading-snug mb-1 text-center text-pretty">
                  {video.subhead}
                </p>
                <p className="text-[12px] font-bold uppercase tracking-widest text-stone-400 mb-3 text-center">
                  {video.name}
                </p>
                <VimeoEmbed videoId={video.videoId} hash={video.hash} title={video.title} />
              </div>
            ))}
          </div>
        </div>

        {/* 4. Text testimonials */}
        <p
          className="text-xs font-bold uppercase tracking-widest text-center mb-5"
          style={{ color: "#C9A76A" }}
        >
          Verified Google Reviews
        </p>
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
    </div>
  );
}
