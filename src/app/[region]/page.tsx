import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRegions, getRegionBySlug } from "@/lib/airtable";
import QuizApp from "@/components/QuizApp";

export async function generateStaticParams() {
  const regions = await getRegions();
  return regions.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = await getRegionBySlug(regionSlug);
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

const PIXEL_ID = "523719334478681";

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region: regionSlug } = await params;
  const region = await getRegionBySlug(regionSlug);
  if (!region) notFound();

  return (
    <>
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
        <img height="1" width="1" style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} alt="" />
      </noscript>
      <QuizApp region={region} />
    </>
  );
}
