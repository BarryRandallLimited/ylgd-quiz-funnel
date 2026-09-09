import type { Metadata } from "next";
import MagazineLanding from "@/components/MagazineLanding";

/**
 * Lead-magnet landing page for Barry's monthly "Dream Gardens & Landscapes"
 * magazine. Exempted from the apex/www -> /home rewrite in middleware.ts so
 * it resolves the same way regardless of which domain ad traffic points at
 * (apex, www, or find.).
 */

export const metadata: Metadata = {
  title: "Free Monthly Garden Magazine | Your Local Garden Designer",
  description:
    "Download this month's free issue of Dream Gardens & Landscapes, our monthly magazine with seasonal planting advice and garden design ideas.",
  openGraph: {
    title: "Free Monthly Garden Magazine | Your Local Garden Designer",
    description:
      "Download this month's free issue of Dream Gardens & Landscapes, our monthly magazine with seasonal planting advice and garden design ideas.",
    type: "website",
  },
};

const PIXEL_ID = "523719334478681";

export default function MagazinePage() {
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
      <MagazineLanding />
    </>
  );
}
