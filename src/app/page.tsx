import type { Metadata } from "next";
import QuizApp from "@/components/QuizApp";
import type { RegionData } from "@/lib/types";

/**
 * Root page at find.yourlocalgardendesigner.co.uk
 *
 * Generic national quiz. No region-specific copy.
 * Regional pages live at /midlands, /cambridgeshire, etc.
 * Directory site will be added to the root domain later.
 */

const nationalRegion: RegionData = {
  slug: "national",
  regionName: "England",
  badgeText: "Vetted Landscapers Across The UK",
  heroHeadline:
    "Tell us about your garden and we'll match you with the right landscaper.",
  heroSubheadline:
    "A curated network of landscapers, vetted for quality and matched to your project, your style, and your timeline.",
  countyList:
    "Currently serving the Midlands, Cambridgeshire & Essex. More regions coming soon.",
  locationPlaceholder: "e.g. Leicester, Cambridge, NN1 1AA",
  heroImageUrl: "/images/garden-hero-night.jpg",
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

// Meta Pixel
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
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      <QuizApp region={nationalRegion} />
    </>
  );
}
