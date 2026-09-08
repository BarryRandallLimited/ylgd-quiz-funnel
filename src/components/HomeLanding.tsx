import { Check, Leaf, Star } from "lucide-react";
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
 * The CTA links out to the live, already-wired quiz funnel on the find.
 * subdomain rather than reimplementing a standalone contact form, so there
 * is exactly one lead pipeline (Airtable + GHL) instead of two.
 */

const QUIZ_URL = "https://find.yourlocalgardendesigner.co.uk/";

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

export default function HomeLanding() {
  return (
    <div className="font-body" style={{ backgroundColor: "#F5F5F0" }}>
      {/* Header */}
      <header className="flex items-center justify-center px-5 py-4" style={{ backgroundColor: "#1E3A2F" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#C9A76A" }}>
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-semibold text-base tracking-tight text-white font-display">
            Your Local Garden Designer
          </span>
        </div>
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

        <div className="flex flex-col md:w-1/2" style={{ backgroundColor: "#1E3A2F" }}>
          <div className="px-5 pt-8 pb-8 md:pt-14 md:pb-12 md:pl-12 md:pr-10 md:flex-1 md:flex md:flex-col md:justify-center">
            <div className="max-w-lg mx-auto md:mx-0">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
                style={{ backgroundColor: "rgba(201,167,106,0.18)", border: "1px solid rgba(201,167,106,0.4)" }}
              >
                <span style={{ color: "#C9A76A" }} className="text-xs">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                <span className="text-white/90 text-[11px] font-semibold leading-tight">
                  Nationwide network of approved garden specialists
                </span>
              </div>

              <h1 className="text-[1.9rem] md:text-[2.6rem] font-bold leading-[1.08] md:leading-[1.02] text-white text-balance mb-4 font-display">
                The World&rsquo;s Most Trusted Local Garden Design Network
              </h1>

              <p className="text-white/80 text-[15px] md:text-[17px] leading-relaxed text-pretty mb-6">
                Matching homeowners with trusted garden specialists. Beautiful gardens, designed and built by
                people you can rely on, right in your area.
              </p>

              <a
                href={QUIZ_URL}
                className="inline-block w-full text-center py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] text-stone-900"
                style={{ backgroundColor: "#C9A76A" }}
              >
                Get My Free Design Consultation &rarr;
              </a>
              <p className="text-white/60 text-[13px] text-center mt-3">
                No obligation &middot; reply within minutes
              </p>

              <div className="mt-6 space-y-2">
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
      <section className="px-5 py-10 md:py-14 bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[1.9rem] md:text-[2.3rem] font-bold font-display" style={{ color: "#1E3A2F" }}>
                {stat.value}
              </p>
              <p className="text-stone-500 text-[13px] md:text-[14px] leading-snug mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-12 md:py-16 max-w-3xl mx-auto text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A76A" }}>
          How it works
        </p>
        <h2 className="text-[1.6rem] md:text-[2rem] font-bold text-stone-950 mb-4 text-balance font-display">
          Trusted Specialists, Matched To You
        </h2>
        <p className="text-stone-600 text-[16px] leading-relaxed text-pretty mb-10 max-w-xl mx-auto">
          We do the vetting so you don&rsquo;t have to. One designer, one local team, one point of contact.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {steps.map((step) => (
            <div key={step.number}>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold mb-4"
                style={{ backgroundColor: "#1E3A2F" }}
              >
                {step.number}
              </div>
              <h3 className="font-bold text-stone-900 text-[17px] mb-2">{step.title}</h3>
              <p className="text-stone-600 text-[15px] leading-relaxed text-pretty">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent work gallery */}
      <section className="px-5 py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A76A" }}>
            Recent work
          </p>
          <h2 className="text-[1.6rem] md:text-[2rem] font-bold text-stone-950 text-balance font-display">
            Gardens From Our Network
          </h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryImages.map((img) => (
            <div key={img.src} className="rounded-2xl overflow-hidden aspect-square bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-12 md:py-16 max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-center mb-8" style={{ color: "#C9A76A" }}>
          Verified reviews
        </p>
        <div className="space-y-4">
          {founderProfile.testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-stone-200 bg-white px-5 py-5 shadow-sm">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#C9A76A" color="#C9A76A" />
                ))}
              </div>
              <p className="text-[15px] text-stone-700 leading-relaxed mb-3 text-pretty">&ldquo;{t.text}&rdquo;</p>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-5 py-14 md:py-20 text-center" style={{ backgroundColor: "#1E3A2F" }}>
        <h2 className="text-[1.7rem] md:text-[2.1rem] font-bold text-white mb-4 text-balance font-display max-w-xl mx-auto">
          Ready To Book Your Consultation?
        </h2>
        <p className="text-white/80 text-[16px] leading-relaxed text-pretty mb-8 max-w-lg mx-auto">
          Book your free, no-obligation design consultation. We&rsquo;ll match you with a trusted local specialist
          and handle the rest.
        </p>
        <a
          href={QUIZ_URL}
          className="inline-block px-8 py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] text-stone-900"
          style={{ backgroundColor: "#C9A76A" }}
        >
          Get My Free Design Consultation &rarr;
        </a>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 text-center border-t border-stone-100">
        <p className="text-stone-500 text-[13px] mb-2">The world&rsquo;s most trusted garden design network</p>
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
  );
}
