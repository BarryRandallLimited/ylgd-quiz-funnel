"use client";

import { useState, type FormEvent } from "react";
import { Check, Download } from "lucide-react";
import { pixelLead, generateEventId } from "@/lib/pixel";

/**
 * Landing page for /magazine: a free-download gate for Barry's monthly
 * "Dream Gardens & Landscapes" magazine. Visitor gives their name and email,
 * we forward it to GHL (src/app/api/magazine-signup/route.ts) so Barry's
 * team can add them to the mailing list, and hand them a direct download
 * link to the current issue regardless of whether that forward succeeds.
 *
 * Reuses the same split-screen shell as LandingScreen.tsx (sticky image on
 * desktop, hero band + white CTA card on the right, image below the CTA on
 * mobile) since that pattern already reads clearly as "this site" and keeps
 * the CTA above the fold on mobile, where 90% of this project's traffic is.
 */

const MAGAZINE_PDF_PATH = "/downloads/dream-gardens-landscapes-september-2026.pdf";
const COVER_IMAGE = "/images/magazine/dream-gardens-september-2026-cover.jpg";

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

export default function MagazineLanding() {
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
        body: JSON.stringify({
          full_name: fullName,
          email,
          ...getUtmParams(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setState("error");
        return;
      }
      pixelLead({ value: 0, contentName: "Magazine Signup", eventId: generateEventId() });
      setDownloadUrl(data.downloadUrl || MAGAZINE_PDF_PATH);
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body">
      {/* Left column: full-height cover image (desktop only) */}
      <div className="hidden md:block md:w-1/2 sticky top-0 h-screen overflow-hidden shrink-0 bg-stone-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={COVER_IMAGE}
          alt="Dream Gardens and Landscapes magazine cover, September 2026 issue"
          className="w-full h-full object-contain object-center"
          loading="eager"
        />
      </div>

      {/* Right column */}
      <div className="flex flex-col md:w-1/2 md:min-h-screen" style={{ backgroundColor: "#F5F5F0" }}>
        {/* Header */}
        <div className="flex items-center justify-center px-5 py-4" style={{ backgroundColor: "#1E3A2F" }}>
          <div className="flex items-center gap-2">
            <img
              src="/images/brand/ylgd-mark-round.svg"
              alt="Your Local Garden Designer"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold text-base tracking-tight text-white font-display">
              Your Local Garden Designer
            </span>
          </div>
        </div>

        {/* Hero band */}
        <div className="px-5 pt-8 pb-6 md:pt-12 md:pb-8 md:pl-12 md:pr-10" style={{ backgroundColor: "#1E3A2F" }}>
          <div className="max-w-lg mx-auto md:mx-0">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A76A" }}>
              Free monthly magazine
            </p>
            <h1 className="text-[1.8rem] md:text-[2.3rem] font-bold leading-[1.1] text-white text-balance mb-3 font-display">
              Get This Month&rsquo;s Copy Of Dream Gardens &amp; Landscapes
            </h1>
            <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed text-pretty mb-5">
              Seasonal planting advice, design ideas and tips from our network of garden designers, free to
              download every month.
            </p>
            <div className="space-y-2">
              {trustBullets.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#C9A76A" }}>
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-white/85 text-[14px]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA / form card */}
        <div className="px-4 pt-5 pb-6 flex-1 md:flex md:flex-col md:justify-center md:pl-12 md:pr-10 md:py-10">
          <div className="rounded-2xl bg-white shadow-sm border border-stone-100 p-6 max-w-lg w-full mx-auto md:mx-0">
            {state === "idle" && (
              <>
                <h2 className="text-[1.35rem] font-bold text-stone-900 mb-2 text-balance leading-snug font-display">
                  Read September&rsquo;s Issue
                </h2>
                <p className="text-stone-600 text-[15px] leading-relaxed mb-5 text-pretty">
                  Tell us where to send it and we&rsquo;ll add you to the mailing list for future issues too.
                </p>
                <button
                  type="button"
                  onClick={() => setState("form")}
                  className="w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] text-stone-900"
                  style={{ backgroundColor: "#C9A76A" }}
                >
                  Get My Free Copy
                </button>
              </>
            )}

            {(state === "form" || state === "submitting" || state === "error") && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-[1.35rem] font-bold text-stone-900 mb-2 text-balance leading-snug font-display">
                  Where Should We Send It?
                </h2>
                <p className="text-stone-600 text-[14px] leading-relaxed mb-5 text-pretty">
                  We&rsquo;ll only use this to send your magazine and future issues. Unsubscribe any time.
                </p>

                <label className="block mb-4">
                  <span className="block text-sm font-semibold text-stone-700 mb-1.5">Full name</span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-[15px] text-stone-900 focus:outline-none focus:ring-2"
                    style={{ ["--tw-ring-color" as string]: "rgba(201,167,106,0.5)" }}
                  />
                </label>

                <label className="block mb-5">
                  <span className="block text-sm font-semibold text-stone-700 mb-1.5">Email address</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-xl border border-stone-200 px-4 py-3 text-[15px] text-stone-900 focus:outline-none focus:ring-2"
                    style={{ ["--tw-ring-color" as string]: "rgba(201,167,106,0.5)" }}
                  />
                </label>

                {state === "error" && (
                  <p className="text-sm text-red-600 mb-4">
                    Something went wrong sending that. Please check your details and try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] text-stone-900 disabled:opacity-60"
                  style={{ backgroundColor: "#C9A76A" }}
                >
                  {state === "submitting" ? "Sending..." : "Send Me My Copy"}
                </button>
              </form>
            )}

            {state === "success" && (
              <>
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1E3A2F" }}>
                    <Check size={22} className="text-white" strokeWidth={3} />
                  </div>
                </div>
                <h2 className="text-[1.35rem] font-bold text-stone-900 mb-2 text-center text-balance leading-snug font-display">
                  You&rsquo;re All Set
                </h2>
                <p className="text-stone-600 text-[15px] leading-relaxed mb-5 text-pretty text-center">
                  Your copy of Dream Gardens &amp; Landscapes is ready below. We&rsquo;ve also added you to our
                  mailing list, so you&rsquo;ll get every new issue as soon as it&rsquo;s out.
                </p>
                <a
                  href={downloadUrl}
                  download
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] text-stone-900"
                  style={{ backgroundColor: "#C9A76A" }}
                >
                  <Download size={18} />
                  Download Your Copy
                </a>
              </>
            )}
          </div>
        </div>

        {/* Mobile cover image, shown below the CTA card */}
        <div className="md:hidden w-full bg-stone-950 px-8 py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={COVER_IMAGE}
            alt="Dream Gardens and Landscapes magazine cover, September 2026 issue"
            className="w-full h-auto block mx-auto max-w-[280px]"
            loading="lazy"
          />
        </div>

        {/* What's inside */}
        <div className="px-5 py-10 md:py-14 md:pl-12 md:pr-10 bg-white border-t border-stone-100">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A76A" }}>
            What&rsquo;s inside this issue
          </p>
          <h2 className="text-[1.4rem] font-bold text-stone-950 mb-5 text-balance font-display">
            A Few Things You&rsquo;ll Find In September&rsquo;s Edition
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {contentsHighlights.map((item) => (
              <div key={item} className="flex items-start gap-2.5 rounded-xl bg-stone-50 border border-stone-100 px-4 py-3">
                <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: "#C9A76A" }} />
                <span className="text-stone-700 text-[14px] leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="px-5 py-8 text-center border-t border-stone-100 bg-white">
          <p className="text-stone-400 text-xs mb-3">
            &copy; {new Date().getFullYear()} Your Local Garden Designer. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-stone-400">
            <a href="/privacy-policy" className="hover:text-stone-600">Privacy Policy</a>
            <span>&middot;</span>
            <a href="/terms-of-use" className="hover:text-stone-600">Terms Of Use</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
