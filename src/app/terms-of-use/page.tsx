import type { Metadata } from "next";
import { Leaf } from "lucide-react";

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
export default function TermsOfUsePage() {
  return (
    <div className="font-body" style={{ backgroundColor: "#F5F5F0" }}>
      <header className="flex items-center justify-center px-5 py-4" style={{ backgroundColor: "#1E3A2F" }}>
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#C9A76A" }}>
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-semibold text-base tracking-tight text-white font-display">
            Your Local Garden Designer
          </span>
        </a>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-12 md:py-16">
        <h1 className="text-[1.9rem] font-bold text-stone-950 mb-2 font-display">Terms Of Use</h1>
        <p className="text-stone-500 text-sm mb-10">Last updated: [Date]</p>

        <div className="space-y-8 text-[15px] text-stone-700 leading-relaxed">
          <section>
            <h2 className="font-bold text-stone-900 text-lg mb-2">About this service</h2>
            <p>
              Your Local Garden Designer ([Company Name]) is an independent design and matching service. We
              introduce homeowners to vetted, independent garden design and landscaping specialists. We are not
              the contractor carrying out any building or landscaping work, and any contract for design or
              construction work is between you and the specialist you are matched with.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-stone-900 text-lg mb-2">Estimates</h2>
            <p>
              Any price range or estimate shown on this site is indicative only, based on the information you
              provide, and is not a fixed quote. Final pricing is confirmed by your matched specialist after
              reviewing your project in detail.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-stone-900 text-lg mb-2">Using this site</h2>
            <p>
              You agree to provide accurate information when requesting a consultation, and not to misuse this
              site, including attempting to disrupt it or access it by unauthorised means.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-stone-900 text-lg mb-2">Intellectual property</h2>
            <p>
              The content, branding, and design of this site belong to [Company Name] or its licensors, and may not
              be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-stone-900 text-lg mb-2">Liability</h2>
            <p>
              We take reasonable care in selecting specialists for our network, but we are not liable for the
              quality, timing, or outcome of any design or building work carried out by an independent specialist.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-stone-900 text-lg mb-2">Governing law</h2>
            <p>These terms are governed by the laws of England and Wales.</p>
          </section>

          <section>
            <h2 className="font-bold text-stone-900 text-lg mb-2">Contact</h2>
            <p>Questions about these terms can be sent to [Contact Email].</p>
          </section>
        </div>
      </div>
    </div>
  );
}
