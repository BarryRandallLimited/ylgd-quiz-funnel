import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLandscaperBySlug } from "@/lib/airtable";
import { PACKAGE_ORDER, PACKAGES } from "@/config/packages";

/**
 * A landscaper's single personal link (pay.yourlocalgardendesigner.co.uk/l/[slug]).
 *
 * One link per landscaper, not one per package: whoever's selling on the
 * call doesn't always know in advance which of the 4 packages a prospect
 * will land on, so this shows all four and tags whichever one gets clicked
 * with ?ref=[slug] — same attribution mechanism already used everywhere else
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
    title: `${landscaper.businessName} — Your Local Garden Designer`,
    robots: { index: false }, // personal referral links shouldn't show up in search
  };
}

export default async function LandscaperPage({ params }: PageProps) {
  const { landscaper: slug } = await params;
  const landscaper = await getLandscaperBySlug(slug);
  if (!landscaper) notFound();

  return (
    <main className="min-h-screen bg-sage font-body text-forest">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-forest">
            Your Local Garden Designer
          </p>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gold">
            Referred By {landscaper.businessName}
          </p>
          <h1 className="font-display text-3xl font-bold text-forest sm:text-4xl">
            Choose Your Next Step
          </h1>
          <p className="mt-3 text-base text-forest/80">
            {landscaper.founderName ? `${landscaper.founderName} and the team at ` : ""}
            {landscaper.businessName} work with Your Local Garden Designer for design and
            planning. Pick the option that's right for your project below.
          </p>
        </div>

        <div className="space-y-4">
          {PACKAGE_ORDER.map((slugKey) => {
            const pkg = PACKAGES[slugKey];
            return (
              <Link
                key={pkg.slug}
                href={`/${pkg.slug}?ref=${encodeURIComponent(landscaper.slug)}`}
                className="block rounded-2xl border border-gold-border bg-white p-5 shadow-sm transition hover:border-forest sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gold">
                      {pkg.eyebrow}
                    </p>
                    <h2 className="font-display text-xl font-bold text-forest">{pkg.name}</h2>
                    <p className="mt-1 text-sm text-forest/70">{pkg.tagline}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-display text-lg font-bold text-forest">
                      £{pkg.priceGBP.toLocaleString()}
                    </p>
                    {pkg.mostPopular && (
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gold">
                        Most Popular
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-forest/60">
          Your Local Garden Designer · an independent design &amp; matching service ·
          yourlocalgardendesigner.co.uk
        </p>
      </div>
    </main>
  );
}
