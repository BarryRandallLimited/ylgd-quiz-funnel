import { NextRequest, NextResponse } from "next/server";

/**
 * Host-based routing for the three faces of this one Next.js project:
 *
 * pay.yourlocalgardendesigner.co.uk/consultation  -> src/app/pay/[slug]/page.tsx
 * pay.yourlocalgardendesigner.co.uk/success        -> shared confirmation page,
 *   deliberately NOT under /pay so Stripe's success_url ("/success") works the
 *   same regardless of which subdomain the checkout started from.
 * yourlocalgardendesigner.co.uk (apex) and www.  -> src/app/home/page.tsx,
 *   the temporary marketing/ads landing page (see src/app/home/page.tsx doc
 *   comment for why this lives apart from the quiz's own root page).
 *
 * find.yourlocalgardendesigner.co.uk is untouched and falls through to the
 * default route tree (src/app/page.tsx and src/app/[region]/page.tsx).
 */
export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  const isPaySubdomain = hostname.startsWith("pay.");
  const alreadyUnderPay = pathname.startsWith("/pay");
  const isSharedRoute = pathname.startsWith("/success");

  if (isPaySubdomain && !alreadyUnderPay && !isSharedRoute) {
    const url = req.nextUrl.clone();
    url.pathname = `/pay${pathname}`;
    return NextResponse.rewrite(url);
  }

  const isApexOrWww =
    hostname === "yourlocalgardendesigner.co.uk" || hostname === "www.yourlocalgardendesigner.co.uk";
  const alreadyUnderHome = pathname.startsWith("/home");
  const isStandaloneLegalPage =
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms-of-use") ||
    pathname.startsWith("/magazine");

  if (isApexOrWww && !alreadyUnderHome && !isStandaloneLegalPage) {
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/home" : `/home${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images).*)"],
};
