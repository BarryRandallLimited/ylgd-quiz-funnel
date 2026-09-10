"use client";

import { CheckCircle2, Star } from "lucide-react";
import { founderProfile } from "@/config/regions";
import type { PriceResult } from "@/lib/types";

/**
 * Brand-test sibling of ResultsScreen.tsx. Same props/logic/copy, restyled
 * with the ink/paper/green brand guide.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";

interface ResultsScreenBrandTestProps {
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
    <div className="relative w-full rounded-md overflow-hidden border" style={{ paddingBottom: "56.25%", borderColor: "rgba(42,42,34,0.15)" }}>
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

export default function ResultsScreenBrandTest({ result, countyList }: ResultsScreenBrandTestProps) {
  const profile = founderProfile;

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: PAPER }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-center px-5 py-4" style={{ backgroundColor: INK }}>
        <img
          src="/images/brand/ylgd-mark-primary.svg"
          alt="Your Local Garden Designer"
          className="h-9 w-auto rounded-sm"
        />
      </div>

      <div className="max-w-xl mx-auto px-5 pt-6 pb-10">
        {/* 1. Thank you and letter */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={44} style={{ color: INK }} strokeWidth={1.5} />
        </div>

        <h2
          className="uppercase leading-[1.1] text-center mb-2 text-balance text-[1.55rem]"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.01em", color: INK }}
        >
          Thank You For Your Enquiry, We've Received All Your Answers
        </h2>

        <p className="text-[17px] text-center leading-relaxed mb-6 text-pretty font-semibold" style={{ color: "rgba(42,42,34,0.85)" }}>
          Here's what happens next.
        </p>

        {/* Letter-style message */}
        <div className="rounded-md border px-5 py-6 mb-8" style={{ borderColor: "rgba(42,42,34,0.15)", backgroundColor: PAPER }}>
          <div className="text-[16px] leading-relaxed text-pretty space-y-4" style={{ color: "rgba(42,42,34,0.85)" }}>
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
          <div className="flex gap-4 items-center mt-5 pt-5 border-t" style={{ borderColor: "rgba(42,42,34,0.15)" }}>
            <img
              src={profile.headshot}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover object-top shrink-0"
              style={{ backgroundColor: "rgba(42,42,34,0.1)" }}
            />
            <div>
              <p className="font-bold text-[16px]" style={{ color: INK }}>{profile.name}</p>
              <p className="text-sm" style={{ color: "rgba(42,42,34,0.55)" }}>{profile.title}</p>
            </div>
          </div>
        </div>

        {/* 2. Cost guide */}
        <p
          className="text-xs font-semibold uppercase text-center mb-4"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.14em", color: GREEN }}
        >
          Your initial estimate
        </p>

        <h3
          className="uppercase leading-tight text-center mb-3 text-balance text-[1.3rem]"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em", color: INK }}
        >
          A Realistic Guide To Your Garden's Cost
        </h3>

        <p className="text-[16px] text-center leading-relaxed mb-5 text-pretty" style={{ color: "rgba(42,42,34,0.85)" }}>
          Based on what you've told us about your {result.gardenSizeM2} garden.
        </p>

        <div className="rounded-md p-5 mb-5" style={{ backgroundColor: INK }}>
          <p
            className="text-xs font-semibold uppercase text-center mb-2"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.18em", color: "rgba(244,239,228,0.8)" }}
          >
            Your project starts from
          </p>
          <div className="text-center mb-5">
            <p
              className="text-[2.8rem] leading-none text-white"
              style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.01em" }}
            >
              {fmt(result.projectFrom, result.currency)}
            </p>
          </div>
          <p className="text-xs text-center leading-relaxed" style={{ color: "rgba(244,239,228,0.65)" }}>
            This is an online estimate, not a quote. Actual costs depend on the complexity and
            specification of your project. Speaking with our designer is the best way to get an
            accurate figure for your garden.
          </p>
        </div>

        {/* Control framing */}
        <div className="rounded-md border px-5 py-4 mb-8" style={{ borderColor: "rgba(42,42,34,0.15)", backgroundColor: "rgba(42,42,34,0.04)" }}>
          <p className="text-[16px] leading-relaxed text-pretty" style={{ color: "rgba(42,42,34,0.85)" }}>
            Two identical gardens can cost very differently. A simpler finish keeps it lean. Premium materials and more detail add to it. You decide where on that scale you sit, and the design stage is where you make those calls.
          </p>
        </div>

        {/* 3. Video testimonials */}
        <div className="mb-8">
          <p
            className="text-xs font-semibold uppercase text-center mb-5"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.14em", color: GREEN }}
          >
            What our clients say
          </p>
          <div className="space-y-8">
            {testimonialVideos.map((video) => (
              <div key={video.videoId}>
                <p className="text-[17px] font-semibold leading-snug mb-1 text-center text-pretty" style={{ color: INK }}>
                  {video.subhead}
                </p>
                <p
                  className="text-[12px] font-semibold uppercase mb-3 text-center"
                  style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.1em", color: "rgba(42,42,34,0.45)" }}
                >
                  {video.name}
                </p>
                <VimeoEmbed videoId={video.videoId} hash={video.hash} title={video.title} />
              </div>
            ))}
          </div>
        </div>

        {/* 4. Text testimonials */}
        <p
          className="text-xs font-semibold uppercase text-center mb-5"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.14em", color: GREEN }}
        >
          Verified Google Reviews
        </p>
        <div className="space-y-4 mb-6">
          {profile.testimonials.map((t) => (
            <div key={t.name} className="rounded-md border px-4 py-4" style={{ borderColor: "rgba(42,42,34,0.15)", backgroundColor: PAPER }}>
              <p className="text-[15px] leading-relaxed mb-3 text-pretty" style={{ color: "rgba(42,42,34,0.85)" }}>
                "{t.text}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.08em", color: "rgba(42,42,34,0.55)" }}
                >
                  {t.name}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: "rgba(42,42,34,0.7)" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill={GREEN} color={GREEN} />
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
