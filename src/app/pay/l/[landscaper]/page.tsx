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
    <div className="min-h-screen flex flex-col font-body" style={{ backgroundColor: "#F5F5F0" }}>
      <PayHeader />
      <div className="flex-1 px-5 py-6 md:px-10 md:py-8 max-w-lg mx-auto w-full">
        <div className="rounded-2xl bg-white shadow-sm border border-stone-100 p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#C9A76A" }}>
            Referred By {landscaper.businessName}
          </p>

          <h1 className="text-[1.65rem] leading-[1.08] font-bold text-stone-950 mb-3 text-balance font-display">
            Choose Your Next Step
          </h1>

          <p className="text-[16px] text-stone-600 leading-relaxed mb-5 text-pretty">
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
                  className="w-full text-left rounded-xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-150 px-4 py-3.5 flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: "#C9A76A" }}>
                      {pkg.eyebrow}
                    </p>
                    <p className="font-bold text-stone-900 text-[15px]">{pkg.name}</p>
                    <p className="text-sm text-stone-500 leading-snug">{pkg.tagline}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-display text-lg font-bold text-stone-950">
                      £{pkg.priceGBP.toLocaleString()}
                    </p>
                    {pkg.mostPopular && (
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#C9A76A" }}>
                        Most Popular
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Your Local Garden Designer · an independent design &amp; matching service ·
          yourlocalgardendesigner.co.uk
        </p>
      </div>
    </div>
  );
}
