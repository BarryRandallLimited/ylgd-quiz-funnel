import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Your Local Garden Designer",
  robots: { index: false },
};

/**
 * Draft placeholder privacy policy for the temporary apex-domain landing
 * page (see src/app/home/page.tsx). Generic and GDPR-aware, but not a
 * substitute for a solicitor's review before real ad spend runs against it.
 * Placeholders in [square brackets] need filling in with the real company
 * details before this is relied on.
 */
const INK = "#2A2A22";
const PAPER = "#F4EFE4";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "rgba(42,42,34,0.55)" }}>Last updated: [Date]</p>

        <div className="space-y-8 text-[15px] leading-relaxed" style={{ color: "rgba(42,42,34,0.75)" }}>
          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Who we are</h2>
            <p>
              Your Local Garden Designer ([Company Name], company number [Company Registration Number], registered
              address [Registered Address]) operates yourlocalgardendesigner.co.uk and matches homeowners with
              vetted, independent garden design and landscaping specialists.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>What we collect</h2>
            <p>
              When you request a consultation or complete our design questionnaire, we collect your name, postcode,
              phone number, email address, and details about your garden project, such as size, budget, and the
              type of work you are considering.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>How we use it</h2>
            <p>
              We use your details to match you with a suitable specialist from our network, to contact you about
              your enquiry, and to provide an indicative project estimate. We do not sell your details to third
              parties. Your enquiry may be shared with the specific specialist matched to your project so they can
              contact you directly about your consultation.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Cookies and tracking</h2>
            <p>
              We use standard analytics and advertising tools, including Google Ads and Meta Pixel, to understand
              how visitors reach this site and to measure the effectiveness of our advertising. These tools may set
              cookies in your browser. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>How long we keep your data</h2>
            <p>
              We retain enquiry details for as long as reasonably needed to complete your consultation and any
              resulting project, and for a limited period afterward for record-keeping, unless you ask us to delete
              it sooner.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Your rights</h2>
            <p>
              Under UK GDPR, you can ask to see, correct, or delete the personal data we hold about you, or ask us
              to stop using it. To make a request, contact us at [Contact Email].
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2" style={{ color: INK }}>Contact</h2>
            <p>Questions about this policy can be sent to [Contact Email].</p>
          </section>
        </div>
      </div>
    </div>
  );
}
