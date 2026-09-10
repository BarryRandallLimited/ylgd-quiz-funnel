import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLandscaperBySlug } from "@/lib/airtable";
import { PACKAGE_ORDER, PACKAGES } from "@/config/packages";
import PayHeader from "@/components/PayHeader";

/**
 * A landscaper's single personal link (pay.yourlocalgardendesigner.co.uk/l/[slug]).
 *
 * One link per landscaper, not one per package: whoever's selling on the
 * call doesn't always know in advance which of the 4 packages a prospect
 * will land on, so this shows all four and tags whichever one gets clicked
 * with ?ref=[slug], the same attribution mechanism already used everywhere else
 * (Orders table "Landscaper Ref", GHL webhook payload).
 *
 * Region is deliberately NOT part of this URL. A landscaper's region is
 * already looked up from Airtable, so if regions get renamed or subdivided
 * later (e.g. London splitting into North/West/South/East), a landscaper's
 * link never needs reissuing.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

interface PageProps {
  params: Promise<{ landscaper: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { landscaper: slug } = await params;
  const landscaper = await getLandscaperBySlug(slug);
  if (!landscaper) return {};
  return {
    title: `${landscaper.businessName} | Your Local Garden Designer`,
    robots: { index: false }, // personal referral links shouldn't show up in search
  };
}

export default async function LandscaperPage({ params }: PageProps) {
  const { landscaper: slug } = await params;
  const landscaper = await getLandscaperBySlug(slug);
  if (!landscaper) notFound();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: PAPER, fontFamily: BODY_FONT, color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
      <PayHeader />
      <div className="flex-1 px-5 py-6 md:px-10 md:py-8 max-w-lg mx-auto w-full">
        <div className="rounded-md p-5 md:p-6" style={{ border: "1px solid rgba(42,42,34,0.15)", backgroundColor: PAPER }}>
          <p
            className="text-xs font-semibold uppercase mb-2"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.1em", color: GREEN }}
          >
            Referred By {landscaper.businessName}
          </p>

          <h1
            className="uppercase font-medium leading-[1.15] mb-3 text-[1.65rem] text-balance"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em" }}
          >
            Choose Your Next Step
          </h1>

          <p className="text-[16px] leading-relaxed mb-5 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
            {landscaper.founderName ? `${landscaper.founderName} and the team at ` : ""}
            {landscaper.businessName} work with Your Local Garden Designer for design and
            planning. Pick the option that&rsquo;s right for your project below.
          </p>

          <div className="space-y-3">
            {PACKAGE_ORDER.map((slugKey) => {
              const pkg = PACKAGES[slugKey];
              return (
                <Link
                  key={pkg.slug}
                  href={`/${pkg.slug}?ref=${encodeURIComponent(landscaper.slug)}`}
                  className="w-full text-left rounded-md transition-colors duration-150 px-4 py-3.5 flex items-center gap-3"
                  style={{ border: "1px solid rgba(42,42,34,0.15)", backgroundColor: PAPER }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold uppercase mb-0.5"
                      style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.08em", color: GREEN }}
                    >
                      {pkg.eyebrow}
                    </p>
                    <p className="font-semibold text-[15px]">{pkg.name}</p>
                    <p className="text-sm leading-snug" style={{ color: "rgba(42,42,34,0.55)" }}>{pkg.tagline}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-medium" style={{ fontFamily: DISPLAY_FONT }}>
                      £{pkg.priceGBP.toLocaleString()}
                    </p>
                    {pkg.mostPopular && (
                      <p
                        className="mt-1 text-[10px] font-semibold uppercase"
                        style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.06em", color: GREEN }}
                      >
                        Most Popular
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "rgba(42,42,34,0.55)" }}>
          Your Local Garden Designer · an independent design &amp; matching service ·
          yourlocalgardendesigner.co.uk
        </p>
      </div>
    </div>
  );
}
