import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms Of Use | Your Local Garden Designer",
  robots: { index: false },
};

/**
 * Draft placeholder terms of use for the temporary apex-domain landing page
 * (see src/app/home/page.tsx). Generic, and not a substitute for a
 * solicitor's review before real ad spend runs against it. Placeholders in
 * [square brackets] need filling in with the real company details.
 */
const INK = "#2A2A22";
const PAPER = "#F4EFE4";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

export default function TermsOfUsePage() {
  return (
    <div style={{ backgroundColor: PAPER, fontFamily: BODY_FONT, color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
      <header className="flex items-center justify-center px-5 py-4" style={{ backgroundColor: INK }}>
        <a href="/">
          <img src="/images/brand/ylgd-mark-primary.svg" alt="Your Local Garden Designer" className="h-8 w-auto" />
        </a>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-12 md:py-16">
        <h1
          className="uppercase font-medium leading-[1.15] mb-2 text-[1.9rem] text-balance"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em" }}
        >
          Terms Of Use
        </h1>
        <p className="text-sm mb-10" style={{ color: "rgba(42,42,34,0.55)" }}>Last updated: [Date]</p>

        <div className="space-y-8 text-[15px] leading-relaxed" style={{ color: "rgba(42,42,34,0.75)" }}>
          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>About this service</h2>
            <p>
              Your Local Garden Designer ([Company Name]) is an independent design and matching service. We
              introduce homeowners to vetted, independent garden design and landscaping specialists. We are not
              the contractor carrying out any building or landscaping work, and any contract for design or
              construction work is between you and the specialist you are matched with.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Estimates</h2>
            <p>
              Any price range or estimate shown on this site is indicative only, based on the information you
              provide, and is not a fixed quote. Final pricing is confirmed by your matched specialist after
              reviewing your project in detail.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Using this site</h2>
            <p>
              You agree to provide accurate information when requesting a consultation, and not to misuse this
              site, including attempting to disrupt it or access it by unauthorised means.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Intellectual property</h2>
            <p>
              The content, branding, and design of this site belong to [Company Name] or its licensors, and may not
              be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Liability</h2>
            <p>
              We take reasonable care in selecting specialists for our network, but we are not liable for the
              quality, timing, or outcome of any design or building work carried out by an independent specialist.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Governing law</h2>
            <p>These terms are governed by the laws of England and Wales.</p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Contact</h2>
            <p>Questions about these terms can be sent to [Contact Email].</p>
          </section>
        </div>
      </div>
    </div>
  );
}
