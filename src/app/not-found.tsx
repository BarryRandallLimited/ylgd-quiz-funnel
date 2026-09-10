/**
 * Global 404 page, used across every host this project serves (apex, www,
 * find., pay.), since Next.js falls back to this for any unmatched route
 * regardless of which page rewrote it there. Styled with the site's own
 * design system rather than the framework default, and points people back
 * to the marketing landing page on the apex domain (per explicit request),
 * using an absolute URL so it lands there correctly no matter which
 * subdomain the visitor actually hit the 404 on.
 */
const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{ backgroundColor: PAPER, fontFamily: BODY_FONT, color: INK }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <img src="/images/brand/ylgd-mark-primary.svg" alt="Your Local Garden Designer" className="h-14 w-auto mb-8" />

      <p
        className="text-xs font-semibold uppercase mb-3"
        style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.18em", color: GREEN }}
      >
        404
      </p>

      <h1
        className="uppercase font-medium leading-[1.15] mb-3 text-[1.9rem] md:text-[2.3rem] text-balance"
        style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em" }}
      >
        Page Not Found
      </h1>

      <p className="text-[16px] leading-relaxed text-pretty max-w-md mb-8" style={{ color: "rgba(42,42,34,0.75)" }}>
        That page has either moved or never existed. Let&rsquo;s get you back to somewhere useful.
      </p>

      <a
        href="https://www.yourlocalgardendesigner.co.uk"
        className="inline-block px-8 py-4 rounded-md uppercase font-semibold text-sm text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.08em" }}
      >
        Back To The Homepage
      </a>
    </div>
  );
}
