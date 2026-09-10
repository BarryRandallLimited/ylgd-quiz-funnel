"use client";

import { useEffect, useState } from "react";
import { Check, Star } from "lucide-react";
import { founderProfile } from "@/config/regions";

/**
 * Temporary marketing/ads landing page for the apex domain
 * (yourlocalgardendesigner.co.uk), served via the host-based rewrite in
 * middleware.ts. Replaces the previous developer-built site, which the team
 * lost edit access to, until the full site replacement ships.
 *
 * Content and structure mirror the previous live page (hero, trust stats,
 * how-it-works, recent-work gallery, testimonials, closing CTA), rebuilt
 * with this project's own design system (forest/gold/cream, Playfair
 * Display headings) for visual consistency with find. and pay., and with
 * the stats and testimonials already verified elsewhere in this codebase
 * (founderProfile in src/config/regions.ts) rather than the old site's
 * stale "500+ gardens / 20+ years" figures.
 *
 * The CTA opens the GHL booking widget in an in-page modal (rather than the
 * find. quiz funnel used elsewhere on the site) so ad traffic landing here
 * can book a slot directly without a full page reload. This is specific to
 * this page only; the quiz funnel's own CTAs are untouched.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

const BOOKING_URL = "https://go.yourlocalgardendesigner.com/widget/booking/FBvXsm2kuizMFl7LCTKj";

const galleryImages = [
  { src: "/images/home/gallery-1.jpg", alt: "Landscaped garden with structured planting and a stone patio" },
  { src: "/images/home/gallery-2.jpg", alt: "Modern garden design with clean lines and mature planting" },
  { src: "/images/home/gallery-3.jpg", alt: "Garden seating area surrounded by lush, layered planting" },
  { src: "/images/home/gallery-4.jpg", alt: "Landscaped garden with a mix of paving and greenery" },
  { src: "/images/home/gallery-5.jpg", alt: "Garden design completed by a Your Local Garden Designer network specialist" },
  { src: "/images/home/gallery-6.jpg", alt: "Finished garden project with lawn, planting and a defined patio area" },
];

const trustBullets = ["Vetted local specialists", "One point of contact", "Design and build, fully managed"];

const steps = [
  {
    number: "01",
    title: "Tell us your vision",
    body: "Share a few details about your garden and what you'd love it to become. Takes about two minutes.",
  },
  {
    number: "02",
    title: "We match you with a specialist",
    body: "We connect you with a trusted, vetted local designer and team, the right fit for your project.",
  },
  {
    number: "03",
    title: "Designed and built, beautifully",
    body: "From first sketch to finished garden, fully managed, to one national standard, wherever you are.",
  },
];

const stats = [
  { value: "1,100+", label: "Gardens designed and built" },
  { value: "4.9★", label: "Average client rating" },
  { value: "Nationwide", label: "Network of approved specialists" },
  { value: "33+ yrs", label: "Design and build expertise" },
];

function BookingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Book your free design consultation"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full h-[94vh] rounded-t-md md:rounded-md md:max-w-lg md:h-[85vh] shadow-xl flex flex-col overflow-hidden"
        style={{ backgroundColor: PAPER, border: "1px solid rgba(42,42,34,0.15)" }}
      >
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid rgba(42,42,34,0.15)" }}
        >
          <span
            className="uppercase font-medium text-[13px]"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.04em", color: INK }}
          >
            Book Your Free Consultation
          </span>
          <button
            onClick={onClose}
            aria-label="Close booking form"
            className="w-8 h-8 flex items-center justify-center rounded-full text-xl leading-none transition-colors"
            style={{ color: "rgba(42,42,34,0.5)" }}
          >
            &times;
          </button>
        </div>
        <iframe
          src={BOOKING_URL}
          title="Book your free design consultation"
          className="flex-1 w-full border-0"
        />
      </div>
    </div>
  );
}

export default function HomeLanding() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div style={{ backgroundColor: PAPER, fontFamily: BODY_FONT, color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-center px-5 py-4" style={{ backgroundColor: INK }}>
        <img src="/images/brand/ylgd-mark-primary.svg" alt="Your Local Garden Designer" className="h-8 w-auto" />
      </header>

      {/* Hero */}
      <section className="flex flex-col md:flex-row">
        <div className="hidden md:block md:w-1/2 sticky top-0 h-screen overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home/hero.jpg"
            alt="A recently completed garden design from the Your Local Garden Designer network"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>

        <div className="flex flex-col md:w-1/2" style={{ backgroundColor: INK }}>
          <div className="px-5 pt-8 pb-8 md:pt-14 md:pb-12 md:pl-12 md:pr-10 md:flex-1 md:flex md:flex-col md:justify-center">
            <div className="max-w-lg mx-auto md:mx-0">
              <div
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 mb-4"
                style={{ backgroundColor: "rgba(47,93,58,0.25)", border: "1px solid rgba(47,93,58,0.6)" }}
              >
                <span style={{ color: "#9CAE84" }} className="text-xs">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span className="text-[11px] font-semibold leading-tight" style={{ color: "rgba(244,239,228,0.9)" }}>
                  Nationwide network of approved garden specialists
                </span>
              </div>

              <h1
                className="uppercase font-medium leading-[1.15] md:leading-[1.05] text-balance mb-4 text-[1.9rem] md:text-[2.6rem]"
                style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.01em", color: PAPER }}
              >
                The World&rsquo;s Most Trusted Local Garden Design Network
              </h1>

              <p
                className="text-[15px] md:text-[17px] leading-relaxed text-pretty mb-6"
                style={{ color: "rgba(244,239,228,0.8)" }}
              >
                Matching homeowners with trusted garden specialists. Beautiful gardens, designed and built by
                people you can rely on, right in your area.
              </p>

              <button
                type="button"
                onClick={() => setShowBooking(true)}
                className="inline-block w-full text-center py-4 rounded-md uppercase font-semibold text-sm text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.06em" }}
              >
                Get My Free Design Consultation &rarr;
              </button>
              <p className="text-[13px] text-center mt-3" style={{ color: "rgba(244,239,228,0.6)" }}>
                No obligation &middot; reply within minutes
              </p>

              <div className="mt-6 space-y-2">
                {trustBullets.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: GREEN }}>
                      <Check size={10} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-[14px]" style={{ color: "rgba(244,239,228,0.85)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/home/hero.jpg"
              alt="A recently completed garden design from the Your Local Garden Designer network"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-5 py-10 md:py-14" style={{ borderBottom: "1px solid rgba(42,42,34,0.15)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p
                className="text-[1.9rem] md:text-[2.3rem] font-medium"
                style={{ fontFamily: DISPLAY_FONT, color: INK }}
              >
                {stat.value}
              </p>
              <p className="text-[13px] md:text-[14px] leading-snug mt-1" style={{ color: "rgba(42,42,34,0.55)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-12 md:py-16 max-w-3xl mx-auto text-center">
        <p
          className="text-xs font-semibold uppercase mb-3"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.18em", color: GREEN }}
        >
          How it works
        </p>
        <h2
          className="uppercase font-medium mb-4 text-balance text-[1.6rem] md:text-[2rem]"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.01em" }}
        >
          Trusted Specialists, Matched To You
        </h2>
        <p className="text-[16px] leading-relaxed text-pretty mb-10 max-w-xl mx-auto" style={{ color: "rgba(42,42,34,0.75)" }}>
          We do the vetting so you don&rsquo;t have to. One designer, one local team, one point of contact.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {steps.map((step) => (
            <div key={step.number}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold mb-4"
                style={{ backgroundColor: INK }}
              >
                {step.number}
              </div>
              <h3 className="font-semibold text-[17px] mb-2" style={{ color: INK }}>{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent work gallery */}
      <section className="px-5 py-12 md:py-16" style={{ borderTop: "1px solid rgba(42,42,34,0.15)" }}>
        <div className="max-w-5xl mx-auto text-center mb-10">
          <p
            className="text-xs font-semibold uppercase mb-3"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.18em", color: GREEN }}
          >
            Recent work
          </p>
          <h2
            className="uppercase font-medium text-balance text-[1.6rem] md:text-[2rem]"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.01em" }}
          >
            Gardens From Our Network
          </h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryImages.map((img) => (
            <div
              key={img.src}
              className="rounded-md overflow-hidden aspect-square"
              style={{ backgroundColor: "rgba(42,42,34,0.05)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-12 md:py-16 max-w-3xl mx-auto">
        <p
          className="text-xs font-semibold uppercase text-center mb-8"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.18em", color: GREEN }}
        >
          Verified reviews
        </p>
        <div className="space-y-4">
          {founderProfile.testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-md px-5 py-5"
              style={{ border: "1px solid rgba(42,42,34,0.15)", backgroundColor: PAPER }}
            >
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill={GREEN} color={GREEN} />
                ))}
              </div>
              <p className="text-[15px] leading-relaxed mb-3 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(42,42,34,0.55)" }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-5 py-14 md:py-20 text-center" style={{ backgroundColor: INK }}>
        <h2
          className="uppercase font-medium mb-4 text-balance max-w-xl mx-auto text-[1.7rem] md:text-[2.1rem]"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.01em", color: PAPER }}
        >
          Ready To Book Your Consultation?
        </h2>
        <p
          className="text-[16px] leading-relaxed text-pretty mb-8 max-w-lg mx-auto"
          style={{ color: "rgba(244,239,228,0.8)" }}
        >
          Book your free, no-obligation design consultation. We&rsquo;ll match you with a trusted local specialist
          and handle the rest.
        </p>
        <button
          type="button"
          onClick={() => setShowBooking(true)}
          className="inline-block px-8 py-4 rounded-md uppercase font-semibold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.06em" }}
        >
          Get My Free Design Consultation &rarr;
        </button>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 text-center" style={{ borderTop: "1px solid rgba(42,42,34,0.15)" }}>
        <p className="text-[13px] mb-2" style={{ color: "rgba(42,42,34,0.55)" }}>
          The world&rsquo;s most trusted garden design network
        </p>
        <p className="text-xs mb-3" style={{ color: "rgba(42,42,34,0.4)" }}>
          &copy; {new Date().getFullYear()} Your Local Garden Designer. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "rgba(42,42,34,0.4)" }}>
          <a href="/privacy-policy" className="hover:opacity-70">Privacy Policy</a>
          <span>&middot;</span>
          <a href="/terms-of-use" className="hover:opacity-70">Terms Of Use</a>
        </div>
      </footer>

      <BookingModal open={showBooking} onClose={() => setShowBooking(false)} />
    </div>
  );
}
