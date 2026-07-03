import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fallbackRegions } from "@/config/regions";
import QuizApp from "@/components/QuizApp";

// Generate static pages for all known regions at build time
export function generateStaticParams() {
  return fallbackRegions
    .filter((r) => true) // In production, filter by active flag from Airtable
    .map((r) => ({ region: r.slug }));
}

// Dynamic metadata per region for SEO
export function generateMetadata({
  params,
}: {
  params: { region: string };
}): Metadata {
  const region = fallbackRegions.find((r) => r.slug === params.region);
  if (!region) return {};

  return {
    title: `Your Local Garden Designer | ${region.regionName}`,
    description: region.heroSubheadline,
    openGraph: {
      title: `Your Local Garden Designer | ${region.regionName}`,
      description: region.heroSubheadline,
      type: "website",
    },
  };
}

// Meta Pixel script
const PIXEL_ID = "523719334478681";

export default function RegionPage({
  params,
}: {
  params: { region: string };
}) {
  const region = fallbackRegions.find((r) => r.slug === params.region);

  if (!region) {
    notFound();
  }

  return (
    <>
      {/* Meta Pixel */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      <QuizApp region={region} />
    </>
  );
}
