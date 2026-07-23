import type { Metadata } from "next";
import QuizApp from "@/components/QuizApp";
import type { RegionData } from "@/lib/types";

const nationalRegion: RegionData = {
  slug: "national",
  regionName: "the UK",
  badgeText: "Approved Landscapers Across The UK, Ireland And Spain",
  heroHeadline: "Tell Us About Your Garden And We'll Match You With The Right Landscaper",
  heroSubheadline: "A curated network of landscapers, approved for quality and matched to your project, your style, and your timeline. Plus an initial estimate to help you plan.",
  countyList: "",
  locationPlaceholder: "e.g. LE1 1AA",
  heroImageUrl: "/images/private-family-resort.jpeg",
};

export const metadata: Metadata = {
  title: "Your Local Garden Designer | Find Your Landscaper Match",
  description: nationalRegion.heroSubheadline,
  openGraph: {
    title: "Your Local Garden Designer | Find Your Landscaper Match",
    description: nationalRegion.heroSubheadline,
    type: "website",
  },
};

const PIXEL_ID = "523719334478681";

export default function HomePage() {
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
      <QuizApp region={nationalRegion} />
    </>
  );
}
