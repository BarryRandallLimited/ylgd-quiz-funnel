import { NextRequest, NextResponse } from "next/server";

/**
 * Routes the pay. subdomain to the /pay/[slug] page group.
 *
 * pay.yourlocalgardendesigner.co.uk/consultation  -> renders src/app/pay/[slug]/page.tsx
 * pay.yourlocalgardendesigner.co.uk/success        -> shared confirmation page,
 *   deliberately NOT under /pay so Stripe's success_url ("/success") works the
 *   same regardless of which subdomain the checkout started from.
 *
 * All other hosts (the apex domain, find., etc.) are untouched — this only
 * ever rewrites requests whose Host header starts with "pay.".
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images).*)"],
};
