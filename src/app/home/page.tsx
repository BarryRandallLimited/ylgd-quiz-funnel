import type { Metadata } from "next";
import HomeLanding from "@/components/HomeLanding";

/**
 * Temporary landing page for the apex domain (yourlocalgardendesigner.co.uk),
 * routed here by middleware.ts. This is deliberately separate from
 * src/app/page.tsx, which is the quiz's own entry point on the find.
 * subdomain, so Google Ads traffic to the bare domain sees a brand/trust
 * page rather than jumping straight into the quiz. To be replaced when the
 * full site rebuild ships.
 */

export const metadata: Metadata = {
  title: "Your Local Garden Designer | Local Garden Design Network",
  description:
    "Connect with trusted local garden designers for your dream garden. Book a free, no-obligation design consultation and get matched with a vetted specialist in your area.",
  openGraph: {
    title: "Your Local Garden Designer | Local Garden Design Network",
    description:
      "Connect with trusted local garden designers for your dream garden. Book a free, no-obligation design consultation and get matched with a vetted specialist in your area.",
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
      <HomeLanding />
    </>
  );
}
