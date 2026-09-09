/**
 * Global 404 page, used across every host this project serves (apex, www,
 * find., pay.), since Next.js falls back to this for any unmatched route
 * regardless of which page rewrote it there. Styled with the site's own
 * design system rather than the framework default, and points people back
 * to the marketing landing page on the apex domain (per explicit request),
 * using an absolute URL so it lands there correctly no matter which
 * subdomain the visitor actually hit the 404 on.
 */
export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 font-body text-center"
      style={{ backgroundColor: "#F5F5F0" }}
    >
      <img
        src="/images/brand/ylgd-mark-round.svg"
        alt="Your Local Garden Designer"
        className="w-14 h-14 rounded-full mb-8"
      />

      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C9A76A" }}>
        404
      </p>

      <h1 className="text-[1.9rem] md:text-[2.3rem] font-bold text-stone-950 mb-3 text-balance font-display">
        Page Not Found
      </h1>

      <p className="text-stone-600 text-[16px] leading-relaxed text-pretty max-w-md mb-8">
        That page has either moved or never existed. Let&rsquo;s get you back to somewhere useful.
      </p>

      <a
        href="https://www.yourlocalgardendesigner.co.uk"
        className="inline-block px-8 py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] text-stone-900"
        style={{ backgroundColor: "#C9A76A" }}
      >
        Back To The Homepage
      </a>
    </div>
  );
}
