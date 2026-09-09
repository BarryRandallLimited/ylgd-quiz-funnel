"use client";

import { useState, type FormEvent } from "react";
import { Download } from "lucide-react";
import { pixelLead, generateEventId } from "@/lib/pixel";

/**
 * Experimental restyle of /magazine using the ACTUAL brand guide the client
 * uploaded (YLGD-Brand-Guide.md + ylgd-logo-*.svg), rather than this
 * project's existing forest/gold/Playfair system. Deliberately scoped to
 * this one page only (a sibling route, not a replacement of /magazine) so
 * it can be compared side by side before deciding whether to roll it out
 * anywhere else.
 *
 * Brand recipe, per the guide: monochrome ink (#2A2A22) on paper (#F4EFE4),
 * a typographic wordmark in a double-rule frame (no icon), geometric sans
 * (Century Gothic / Futura, Jost as the closest real web font) in uppercase
 * with wide tracking for the logo and headings, Inter for body copy, and
 * the brand green (#2F5D3A) used sparingly as a single accent, never in the
 * logo itself. Fonts are loaded with a scoped <style> import so nothing
 * outside this page is affected.
 */

const MAGAZINE_PDF_PATH = "/downloads/dream-gardens-landscapes-september-2026.pdf";
const COVER_IMAGE = "/images/magazine/dream-gardens-september-2026-cover.jpg";

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

const trustBullets = ["Free to read", "New issue every month", "Written by our design network"];

const contentsHighlights = [
  "Be Aware Of Bulb Blunders",
  "3 Ways To Enjoy, Escape And Entertain In Your Garden",
  "Revamp Your Front Garden",
  "Planting Design For Autumn",
  "Healthy Hedges",
  "Why Leaves Change Colour",
];

type FormState = "idle" | "form" | "submitting" | "success" | "error";

function getUtmParams() {
  if (typeof window === "undefined") {
    return { utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "", fbclid: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") ?? "",
    utm_medium: params.get("utm_medium") ?? "",
    utm_campaign: params.get("utm_campaign") ?? "",
    utm_content: params.get("utm_content") ?? "",
    fbclid: params.get("fbclid") ?? "",
  };
}

export default function MagazineLandingBrandTest() {
  const [state, setState] = useState<FormState>("idle");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(MAGAZINE_PDF_PATH);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/magazine-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, ...getUtmParams() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("error");
        return;
      }
      pixelLead({ value: 0, contentName: "Magazine Signup (brand test)", eventId: generateEventId() });
      setDownloadUrl(data.downloadUrl || MAGAZINE_PDF_PATH);
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <div style={{ backgroundColor: PAPER, fontFamily: BODY_FONT, color: INK }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-center px-5 py-6 border-b" style={{ borderColor: "rgba(42,42,34,0.15)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/ylgd-mark-primary.svg" alt="Your Local Garden Designer" className="h-16 w-auto" />
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-10">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-10 md:gap-14 items-center py-10 md:py-16">
          <div className="order-2 md:order-1">
            <p
              className="text-xs font-semibold uppercase mb-4"
              style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.18em", color: GREEN }}
            >
              Free Monthly Magazine
            </p>
            <h1
              className="uppercase font-medium leading-[1.15] mb-4 text-[1.7rem] md:text-[2.3rem] text-balance"
              style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em" }}
            >
              Get This Month&rsquo;s Copy Of Dream Gardens &amp; Landscapes
            </h1>
            <p className="text-[16px] leading-relaxed mb-6 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
              Seasonal planting advice, design ideas and tips from our network of garden designers, free to
              download every month.
            </p>

            <div className="space-y-2 mb-8">
              {trustBullets.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 shrink-0" style={{ backgroundColor: GREEN }} />
                  <span className="text-[14px]" style={{ color: "rgba(42,42,34,0.8)" }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA / form card */}
            <div className="border p-6" style={{ borderColor: INK }}>
              {state === "idle" && (
                <>
                  <h2
                    className="uppercase font-medium mb-2 text-[1.1rem]"
                    style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.04em" }}
                  >
                    Read September&rsquo;s Issue
                  </h2>
                  <p className="text-[14px] leading-relaxed mb-5" style={{ color: "rgba(42,42,34,0.75)" }}>
                    Tell us where to send it and we&rsquo;ll add you to the mailing list for future issues too.
                  </p>
                  <button
                    type="button"
                    onClick={() => setState("form")}
                    className="w-full py-3.5 uppercase font-semibold text-sm text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.08em" }}
                  >
                    Get My Free Copy
                  </button>
                </>
              )}

              {(state === "form" || state === "submitting" || state === "error") && (
                <form onSubmit={handleSubmit}>
                  <h2
                    className="uppercase font-medium mb-2 text-[1.1rem]"
                    style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.04em" }}
                  >
                    Where Should We Send It?
                  </h2>
                  <p className="text-[13px] leading-relaxed mb-5" style={{ color: "rgba(42,42,34,0.75)" }}>
                    We&rsquo;ll only use this to send your magazine and future issues. Unsubscribe any time.
                  </p>

                  <label className="block mb-4">
                    <span className="block text-xs font-semibold uppercase mb-1.5" style={{ letterSpacing: "0.06em" }}>
                      Full name
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full border px-3.5 py-2.5 text-[15px] focus:outline-none"
                      style={{ borderColor: "rgba(42,42,34,0.3)", color: INK, backgroundColor: PAPER }}
                    />
                  </label>

                  <label className="block mb-5">
                    <span className="block text-xs font-semibold uppercase mb-1.5" style={{ letterSpacing: "0.06em" }}>
                      Email address
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full border px-3.5 py-2.5 text-[15px] focus:outline-none"
                      style={{ borderColor: "rgba(42,42,34,0.3)", color: INK, backgroundColor: PAPER }}
                    />
                  </label>

                  {state === "error" && (
                    <p className="text-sm mb-4" style={{ color: "#9A3B2F" }}>
                      Something went wrong sending that. Please check your details and try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="w-full py-3.5 uppercase font-semibold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.08em" }}
                  >
                    {state === "submitting" ? "Sending..." : "Send Me My Copy"}
                  </button>
                </form>
              )}

              {state === "success" && (
                <>
                  <h2
                    className="uppercase font-medium mb-2 text-[1.1rem]"
                    style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.04em" }}
                  >
                    You&rsquo;re All Set
                  </h2>
                  <p className="text-[14px] leading-relaxed mb-5" style={{ color: "rgba(42,42,34,0.75)" }}>
                    Your copy is ready below. We&rsquo;ve also added you to our mailing list, so you&rsquo;ll get
                    every new issue as soon as it&rsquo;s out.
                  </p>
                  <a
                    href={downloadUrl}
                    download
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 uppercase font-semibold text-sm text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.08em" }}
                  >
                    <Download size={16} />
                    Download Your Copy
                  </a>
                </>
              )}
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="border p-2" style={{ borderColor: INK }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={COVER_IMAGE}
                alt="Dream Gardens and Landscapes magazine cover, September 2026 issue"
                className="w-full h-auto block"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* What's inside */}
        <section className="py-10 md:py-14 border-t" style={{ borderColor: "rgba(42,42,34,0.15)" }}>
          <p
            className="text-xs font-semibold uppercase mb-3"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.18em", color: GREEN }}
          >
            What&rsquo;s Inside This Issue
          </p>
          <h2
            className="uppercase font-medium mb-6 text-[1.3rem] text-balance"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em" }}
          >
            A Few Things You&rsquo;ll Find In September&rsquo;s Edition
          </h2>
          <div className="grid sm:grid-cols-2 gap-x-10">
            {contentsHighlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 py-3 border-b"
                style={{ borderColor: "rgba(42,42,34,0.12)" }}
              >
                <span className="w-1.5 h-1.5 mt-1.5 shrink-0" style={{ backgroundColor: GREEN }} />
                <span className="text-[15px] leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer
        className="px-5 py-8 text-center border-t"
        style={{ borderColor: "rgba(42,42,34,0.15)" }}
      >
        <p className="text-xs mb-3" style={{ color: "rgba(42,42,34,0.55)" }}>
          &copy; {new Date().getFullYear()} Your Local Garden Designer. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "rgba(42,42,34,0.55)" }}>
          <a href="/privacy-policy" className="hover:opacity-70">Privacy Policy</a>
          <span>&middot;</span>
          <a href="/terms-of-use" className="hover:opacity-70">Terms Of Use</a>
        </div>
      </footer>
    </div>
  );
}
