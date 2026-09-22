# CLAUDE.md - Your Local Garden Designer

Read this file before making any changes to this project.

## What This Project Is

Your Local Garden Designer (YLGD) is a garden design and landscaping matching service. This one Next.js codebase now serves four distinct surfaces on different domains/subdomains of yourlocalgardendesigner.co.uk, routed by `middleware.ts` based on the request host (see "Domains and Routing" below):

- **find.** — the original quiz funnel. Homeowners answer 9 questions about their garden, get an instant cost estimate, and submit their details to be matched with a landscaper.
- **apex / www** — a marketing landing page with a "Speak To A Design Consultant" CTA that opens a booking calendar in a modal.
- **pay.** — Stripe checkout for four fixed-price paid packages (consultation through full project management), including landscaper-specific referral links for commission attribution.
- **/magazine** (works on any domain) — a free lead-magnet download gate for Barry's monthly "Dream Gardens & Landscapes" magazine.

All four are lead or revenue generation tools. Traffic comes from paid Meta (Facebook/Instagram) ads. 90% of visitors are on mobile, so every surface is built mobile-first.

This is a client project. The client is Barry Randall, founder of YLGD. The site is owned entirely by Barry under his BarryRandallLimited accounts (GitHub, Vercel, Airtable, Stripe).

## Tech Stack

- Next.js (App Router; project currently on Next.js 16 despite this file's original Next.js 14 note — check `package.json` if it matters for your task)
- Tailwind CSS (styling)
- Vercel (hosting, auto-deploys from GitHub)
- GitHub (code repository: BarryRandallLimited/ylgd-quiz-funnel)
- Airtable (Team plan, workspace "Websites", base "YLGD" — id `appAGZVUJmvnyDAL1`. This workspace also contains a separate "BRL" base for other Barry Randall Limited projects; this project uses the YLGD base exclusively, never BRL. Five tables live here: Regions, Landscapers, Leads, Magazine Subscribers, Orders.)
- Stripe (checkout for the four paid packages; live and test modes both supported, see "Pay / Checkout Flow" below)
- HighLevel / GHL (CRM, lead and order capture via webhook)
- Meta Pixel (tracking, pixel ID `523719334478681`)

## How Deployment Works

Push to the main branch on GitHub. Vercel auto-builds and deploys within 60 seconds. There is no staging environment. Every push goes live. The build runs a `prebuild` step first (see "Regions Data" below) that must succeed for the deploy to proceed.

## Domains and Routing

`middleware.ts` (project root) reads the request host on every request and rewrites accordingly. There is no separate deployment per domain; it is all one Vercel project.

- **`pay.yourlocalgardendesigner.co.uk`** — rewrites everything to `/pay/*`, except `/success`, which is deliberately left alone so Stripe's fixed `success_url` resolves correctly no matter which subdomain started checkout.
- **Apex (`yourlocalgardendesigner.co.uk`) and `www.`** — rewrites everything to `/home/*`, except three standalone pages that are exempted so they render identically regardless of domain: `/privacy-policy`, `/terms-of-use`, and `/magazine`.
- **`find.yourlocalgardendesigner.co.uk`** — untouched, falls through to the default route tree (`src/app/page.tsx` and `src/app/[region]/page.tsx`). This is the quiz.

When adding a new standalone page that should work the same on every domain (like `/magazine`), add it to the apex/www exemption list in `middleware.ts` or it will get silently swallowed into `/home`.

## File Structure

```
middleware.ts                  # Host-based routing, see above (project root, not under src/)

src/app/
  page.tsx                     # Quiz entry point, national (find. subdomain root, no region)
  [region]/page.tsx            # Dynamic regional quiz pages, one per active row in the Airtable Regions table
  layout.tsx                   # Root HTML layout, paper (#F4EFE4) background
  globals.css                  # Global styles; still imports the old Playfair Display/Nunito Sans fonts as a
                                #   leftover from before the rebrand. Every page now sets its own font inline, so
                                #   this is dead weight rather than a live bug, but worth cleaning up eventually.
  icon.svg, apple-icon.png, favicon.ico   # Favicon, applied site-wide via Next.js's file-based convention.
                                           #   No manual <link rel="icon"> wiring needed in layout.tsx.
  not-found.tsx                # Brand-styled 404, links back to https://www.yourlocalgardendesigner.co.uk
  home/page.tsx                # Renders HomeLanding.tsx (apex/www marketing page)
  magazine/page.tsx             # Renders MagazineLanding.tsx (lead-magnet download gate)
  privacy-policy/, terms-of-use/  # Standalone legal pages, exempt from all domain rewrites
  pay/
    [slug]/page.tsx + PayClient.tsx   # Stripe checkout page per package
    l/[landscaper]/page.tsx           # A landscaper's personal referral link, lists all packages
  success/page.tsx              # Shared post-checkout confirmation page, kept outside /pay so Stripe's fixed
                                 #   success_url works from any subdomain
  api/
    submit-lead/route.ts               # Quiz lead capture: Airtable Leads table, then GHL
    magazine-signup/route.ts           # Magazine signup: Airtable Magazine Subscribers table, then GHL
    create-checkout-session/route.ts   # Creates the Stripe Checkout session
    stripe-webhook/route.ts            # On payment success: Airtable Orders table, then GHL

src/components/
  Quiz:      QuizApp.tsx (orchestrator), QuizLayout.tsx (split-screen shell), LandingScreen.tsx,
             PostcodeScreen.tsx, SingleSelectScreen.tsx, FeaturesScreen.tsx, EducationScreen.tsx,
             ContactScreen.tsx, ResultsScreen.tsx
  Home:      HomeLanding.tsx
  Magazine:  MagazineLanding.tsx
  Pay:       PayHeader.tsx (shared header bar reused across every /pay page)

src/config/
  quizConfig.ts           # All quiz questions, options, hint text, image refs
  regions.ts              # founderProfile (Barry's bio/testimonials) plus re-exports fallbackRegions
  regions.generated.ts    # Auto-generated from the Airtable Regions table by scripts/sync-regions.js on every
                           #   build. Do not hand-edit; edit the Regions table in Airtable instead.
  packages.ts             # The four paid packages: slug, price, features, successMessage

src/lib/
  types.ts                # TypeScript type definitions
  calculatePrice.ts       # Quiz pricing formula
  submitLead.ts           # Builds the quiz lead payload sent to /api/submit-lead
  pixel.ts                # Meta pixel helper functions (pixelLead, pixelViewContent, generateEventId)
  airtable.ts             # Airtable REST client for Regions and Landscapers (read side)

scripts/
  sync-regions.js          # Runs as the npm prebuild step, pulls active Regions rows from Airtable into
                            #   regions.generated.ts

public/
  images/brand/            # ylgd-mark-primary.svg (the header wordmark used everywhere, light or dark
                            #   background — it has its own bordered paper card baked in), ylgd-mark-round.svg
                            #   (favicon source), ylgd-mark-reversed.svg (exists, not currently used anywhere
                            #   in src/)
  images/, downloads/       # Per-page photography and the magazine PDF
```

## Where Copy Lives

| To change | Edit this file |
|---|---|
| Quiz landing headline, subhead, badge, county list (find. root) | src/app/page.tsx (nationalRegion object) |
| Regional quiz page copy | Airtable Regions table (synced into src/config/regions.generated.ts on every build) |
| Barry's bio, title, testimonials | src/config/regions.ts (founderProfile object) |
| Quiz questions, hints, option labels, button text | src/config/quizConfig.ts |
| Results page copy, section order, booking calendar and case study video | src/components/ResultsScreen.tsx |
| Contact form heading, hint, button text | src/components/ContactScreen.tsx |
| Which image appears on which quiz step | src/config/quizConfig.ts (images object near top) |
| Home landing page (apex/www) copy | src/components/HomeLanding.tsx |
| Magazine landing page copy | src/components/MagazineLanding.tsx |
| Paid package names, prices, features | src/config/packages.ts |
| Legal page copy | src/app/privacy-policy/page.tsx, src/app/terms-of-use/page.tsx |

## Quiz Flow

landing -> postcode -> projectType -> gardenSize -> engineering -> siteEducation -> features -> timeline -> finishLevel -> contact -> loading -> results

The flow is defined in quizConfig.ts as the quizOrder array. Lives on the find. subdomain (and its regional variants), untouched by the domain-routing middleware.

## Pricing Logic (calculatePrice.ts)

base_build = max(£25,000 floor, garden_m2 x £300/sqm x finish_multiplier)
project_from = base_build + sum(selected feature add-ons)
Rounded down to nearest £5,000.

Finish multipliers: natural = 1.0, refined = 1.4, premium = 2.0.
Feature add-ons range from £2,000 to £20,000.

Do not change the pricing formula without explicit instruction from the project owner.

## Home Landing Page (apex / www)

`src/components/HomeLanding.tsx`, served via the middleware rewrite described above. This is a temporary marketing/ads landing page built to replace a previous developer-built site the team lost edit access to, styled with this project's own brand system rather than the quiz's exact layout. It is not the quiz: its call to action opens a booking calendar in a modal rather than launching the question flow.

Structure top to bottom: header, hero (badge, headline, subhead, CTA button, trust bullets), stats bar, "How It Works" (3 steps), recent work gallery, testimonials (from founderProfile), closing CTA, footer.

The CTA button (appears in the hero and again at the bottom) opens `BookingModal`, a fixed-position dialog (bottom sheet on mobile, centred card on desktop) containing an iframe pointed at the GHL calendar widget: `https://go.yourlocalgardendesigner.com/widget/booking/FBvXsm2kuizMFl7LCTKj`. This is the same URL used for the booking calendar embedded on the quiz results page.

## Pay / Checkout Flow

Four fixed-price packages are defined in `src/config/packages.ts`: Consultation (£300), Garden Blueprint (£1,800), The Vision (£3,000, marked `mostPopular`), and The Masterpiece (£6,000).

- `src/app/pay/[slug]/page.tsx` looks up the package by slug and renders `PayClient.tsx`, which shows the package details and, on click, POSTs to `/api/create-checkout-session` with `{ package, landscaperRef, testCode }`, then redirects the browser to the returned Stripe Checkout URL.
- `src/app/pay/l/[landscaper]/page.tsx` is a landscaper's personal referral link. It looks the landscaper up from the Airtable Landscapers table and links to each package with `?ref={landscaper.slug}` for commission attribution. Not indexed by search. Region is deliberately left out of this URL so links survive future region restructuring.
- `src/app/api/create-checkout-session/route.ts` creates the Stripe session. Money always lands in YLGD's own Stripe account; landscapers never collect payment directly (per Barry, confirmed 2026-07-21). A `?test=<code>` override exists for testing, gated by `STRIPE_TEST_ACCESS_CODE`; a wrong code is rejected outright rather than silently falling back to a live charge.
- `src/app/api/stripe-webhook/route.ts` listens for `checkout.session.completed`, verifies the Stripe signature (tries the live secret, then the test secret), and uses Stripe's own `event.livemode` flag, not request data, to know whether an order is a test. Follows the durable-first pattern below: writes an Orders record to Airtable first, then forwards to `GHL_ORDERS_WEBHOOK_URL`, then patches the Airtable record's sync status. Test orders are tagged `[TEST ORDER]` in the GHL payload rather than being sent as real orders.
- `src/app/success/page.tsx` is the shared post-checkout confirmation page, kept outside `/pay` specifically so Stripe's fixed `success_url` resolves correctly regardless of which subdomain started checkout.

## Magazine Lead Magnet

`src/components/MagazineLanding.tsx`, served at `/magazine` on any domain. The form collects full name, email, and phone (all three required). On submit it POSTs to `/api/magazine-signup` along with UTM parameters and `fbclid` pulled from the URL. On success it fires a Meta pixel Lead event and reveals a "Download Your Copy" link, which opens the magazine's Google Drive folder directly (`MAGAZINE_DRIVE_URL`) in a new tab. The download is never gated on the API call succeeding.

`src/app/api/magazine-signup/route.ts` follows the durable-first pattern below, writing to the Magazine Subscribers Airtable table before forwarding to `GHL_MAGAZINE_WEBHOOK_URL`. Its `download_url` (recorded in Airtable and sent to GHL) is the same `MAGAZINE_DRIVE_URL` value as the button the visitor actually clicks in `MagazineLanding.tsx`, kept in sync manually since the two live in different files with no shared constants module; if the magazine's download link ever changes, update both.

## Lead and Order Delivery Architecture

Three separate flows (quiz leads, magazine signups, Stripe orders) all follow the same durable-first pattern, implemented independently in `src/app/api/submit-lead/route.ts`, `src/app/api/magazine-signup/route.ts`, and `src/app/api/stripe-webhook/route.ts`:

1. Write the record to its Airtable table first (Leads, Magazine Subscribers, or Orders respectively), with a "GHL Sync Status" field starting at "Pending".
2. Forward to GHL via a webhook.
3. Patch the same Airtable record's sync status to "Sent" or "Failed" based on the outcome.

This means a submission is never silently lost just because GHL is briefly down or misconfigured, since the durable Airtable write happens first and independently. The three flows deliberately use three separate GHL webhook env vars, `NEXT_PUBLIC_GHL_WEBHOOK_URL` (quiz leads), `GHL_ORDERS_WEBHOOK_URL` (Stripe orders), and `GHL_MAGAZINE_WEBHOOK_URL` (magazine signups), so a problem with one destination never looks like a problem with another, and each can be tested independently.

Airtable's free tier caps at 1,000 API requests per month per base, shared across every table and every one of these three flows. That cap was silently exceeded through most of 2026-09, which blocked every write and looked, from the outside, exactly like a broken webhook rather than a quota problem. The workspace was upgraded to a paid Team plan on 2026-09-22. If a delivery failure ever looks unexplained again, check Airtable's usage page (workspace Settings → Usage) before assuming the code is broken.

## Regions Data

The Regions and Landscapers Airtable tables are the source of truth for regional quiz pages and landscaper referral links. `scripts/sync-regions.js` runs automatically as the `prebuild` step before every `next build` (including on Vercel), pulling every "Active" row from the Regions table into `src/config/regions.generated.ts`, which `src/config/regions.ts` re-exports as `fallbackRegions`. To add, remove, or edit a regional page, edit the Regions table in Airtable directly; no code change or redeploy trigger is needed beyond the next normal push (or a manual redeploy if no code changed). The sync script fails soft: if the Airtable fetch fails or returns zero active regions, it leaves the existing generated file untouched rather than wiping regional pages.

## Meta Pixel

Pixel ID: 523719334478681

Events fired:
- PageView on page load (quiz, home, and magazine pages)
- Lead on quiz contact-form submission and on magazine signup
- ViewContent on the quiz results page

The pixel is injected per-page (src/app/page.tsx, src/app/[region]/page.tsx, src/app/home/page.tsx, src/app/magazine/page.tsx). Helper functions live in src/lib/pixel.ts.

## GHL Webhooks

Three separate environment variables, one per lead/order source, deliberately kept independent (see "Lead and Order Delivery Architecture" above):

| Env var | Source | Payload built in |
|---|---|---|
| `NEXT_PUBLIC_GHL_WEBHOOK_URL` | Quiz leads | src/lib/submitLead.ts, forwarded via src/app/api/submit-lead/route.ts |
| `GHL_ORDERS_WEBHOOK_URL` | Stripe order confirmations | src/app/api/stripe-webhook/route.ts |
| `GHL_MAGAZINE_WEBHOOK_URL` | Magazine signups | src/app/api/magazine-signup/route.ts |

The quiz webhook payload sends all contact details, labelled quiz answers, pricing estimates, region tag, UTM parameters, and fbclid. Do not change any GHL webhook payload field names without confirming with the GHL account owner, as GHL custom fields are mapped to these names in each of the three destination workflows separately.

## Brand System

The whole site (quiz, home, pay, magazine, legal pages, 404) shares one brand system, referred to in code and past conversation as "ink / paper / green":

Colours:
- Ink (near-black, primary text and dark surfaces): `#2A2A22`
- Paper (background): `#F4EFE4`
- Green (accent, used sparingly for eyebrows, small bullets, and buttons only, never as a large background or body text block): `#2F5D3A`

Fonts:
- Display/headings/eyebrows/buttons: `'Century Gothic','Futura','URW Geometric','Jost',sans-serif` (uppercase, wide letter-spacing)
- Body: `'Inter','Montserrat',sans-serif`

These are declared as local constants (`INK`, `PAPER`, `GREEN`, `DISPLAY_FONT`, `BODY_FONT`) at the top of every page-level component individually, there is no shared theme file, so a future rebrand means editing every file rather than one constants module. Fonts are loaded via a scoped inline `<style>` `@import` in each component rather than editing globals.css or tailwind.config.ts, which keeps a brand change contained and easy to revert if needed.

Corners use a small `rounded-md` radius, not sharp boxes or heavily pill-shaped cards.

Logo assets, at `public/images/brand/`:
- `ylgd-mark-primary.svg` — the header wordmark used everywhere, on both light and dark section backgrounds, since it has its own bordered paper-coloured card baked into the SVG.
- `ylgd-mark-round.svg` — the round mark, used as the source for the favicon (`src/app/icon.svg`, `apple-icon.png`, `favicon.ico`, applied site-wide automatically via Next.js's file convention, no layout.tsx wiring needed).
- `ylgd-mark-reversed.svg` — an ink-filled version intended for placing directly over a busy photo with no card behind it. Kept intentionally even though nothing in the code uses it yet, for that specific future case. A hard-won rule from earlier work on this brand: never place this reversed mark over a solid section whose background colour matches its own ink fill, the mark's frame becomes invisible. Always use `ylgd-mark-primary.svg` for any header or card sitting on a flat background, light or dark.

A second, related contrast rule: the green accent reads fine as text on the paper background, but can become illegible as text or a small icon on a dark or tinted-dark surface, including a translucent green tint sitting on an ink section. Check any accent-coloured element against the exact background it sits on; swap to a lighter tint (such as `#9CAE84` for small icons, or `rgba(244,239,228,0.9)` for label text on ink) rather than reusing the same green everywhere.

`src/app/globals.css` imports Jost and Inter as the site-wide fallback font stack and sets them as the body default, matching the brand system above (updated 2026-09-22 from the pre-rebrand Playfair Display/Nunito Sans imports it originally shipped with). Every component still sets its own font inline on top of this, so this file mainly matters as a sane fallback and for anything rendered before a component's own style tag applies.

## Copy Rules

These rules apply to ALL copy on this project, across every surface (quiz, home, pay, magazine, legal). Do not deviate.

- UK English throughout
- No em dashes anywhere. Use commas, full stops, or rewrite the sentence.
- No brochure words: stunning, bespoke, luxury, transform your outdoor space
- No false-contrast stacks or parallel repetition of sentence openers
- No hedging language
- Reading level targeting an average 15-year-old
- H1, H2, and CTA button text in Title Case. Everything else (body copy, hints, option labels, meta descriptions) in sentence case.
- No periods on H1-H4 headings. Other punctuation (question marks, commas, quote marks) is fine on headings.
- No fabricated testimonials or composite client stories. Every testimonial must be verified.
- Price figures must match the calculatePrice.ts formula (quiz estimates) or packages.ts (paid packages). Do not invent prices.

## Barry's Positioning

Barry Randall is the founder and the credibility behind the network, but the site uses "we" language throughout. The business has a team, and the copy should not create a dependency on Barry as the sole point of contact. Barry is the brain and the network builder, not the front and centre of every interaction.

His verified credentials: 33 years in the trade, network has completed over 1,100 gardens, portfolio includes work for Premier League clubs, footballers, musicians, and other high-profile private clients.

The quiz results page is structured as a personal letter from Barry, signed off with his photo and title at the bottom. But the operational language ("we'll be in touch", "our team reviews") reflects the team, not just Barry.

## Current Status

- Quiz (find.): live, national and regional pages, both driven by the flow described above.
- Home landing (apex/www): live, temporary marketing page with a booking-modal CTA (see "Home Landing Page" above).
- Pay checkout (pay.): live, four packages, Stripe live and test modes both wired up.
- Magazine lead magnet (/magazine): live, collects name/email/phone, gated download via Google Drive.
- Regional pages: fully data-driven from the Airtable Regions table (see "Regions Data" above), not hardcoded to specific regions.
- GHL webhooks: live and configured for all three lead/order sources (see "GHL Webhooks" above).
- Airtable: fully wired up on a paid Team plan (see "Lead and Order Delivery Architecture" above).
- Favicon: applied site-wide via Next.js's file convention, sourced from the round brand mark.
- Mobile layout: CTA button moved above the fold in LandingScreen.tsx (2026-07-04). Needs a periodic visual check on a real phone, particularly after any hero or brand changes.

The magazine download URL mismatch and the leftover old-font imports in `globals.css`, both previously flagged here, were fixed 2026-09-22. `ylgd-mark-reversed.svg` remains unused but intentionally kept, see "Brand System" above.

## Future Plans (Do Not Build Unless Asked)

- Dynamic designer matching on the quiz results page based on postcode (replacing the single Barry profile)
- Full directory site on the root domain, replacing the current temporary Home landing page (separate, larger project)
