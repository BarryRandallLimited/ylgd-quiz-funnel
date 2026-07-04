# CLAUDE.md - Your Local Garden Designer Quiz Funnel

Read this file before making any changes to this project.

## What This Project Is

A quiz funnel for Your Local Garden Designer (YLGD), live at find.yourlocalgardendesigner.co.uk. Homeowners answer 9 questions about their garden, receive a cost estimate, and are matched with Barry Randall, who then connects them with a local landscaper.

The site is a lead generation tool. Traffic comes from paid Meta (Facebook/Instagram) ads. 90% of visitors are on mobile.

This is a client project. The client is Barry Randall, founder of YLGD. The site is owned entirely by Barry under his BarryRandallLimited accounts (GitHub, Vercel, Airtable).

## Tech Stack

- Next.js 14 (React framework)
- Tailwind CSS (styling)
- Vercel (hosting, auto-deploys from GitHub)
- GitHub (code repository: BarryRandallLimited/ylgd-quiz-funnel)
- Airtable (future region data, not yet wired up)
- HighLevel / GHL (CRM, lead capture via webhook)
- Meta Pixel (tracking)

## How Deployment Works

Push to the main branch on GitHub. Vercel auto-builds and deploys within 60 seconds. There is no staging environment. Every push goes live.

## File Structure

```
src/
  app/
    page.tsx              # Homepage (national quiz, no region)
    layout.tsx            # Root HTML layout
    globals.css           # Global styles, font imports
    [region]/
      page.tsx            # Dynamic regional pages (/midlands, /cambridgeshire)
  components/
    QuizApp.tsx           # Main orchestrator - manages quiz state and screen flow
    QuizLayout.tsx        # Split-screen shell (image left, content right)
    LandingScreen.tsx     # Hero landing page with CTA
    PostcodeScreen.tsx    # Postcode input with UK format validation
    SingleSelectScreen.tsx # Radio-card selection for single-choice steps
    FeaturesScreen.tsx    # Multi-select checkmark toggle
    EducationScreen.tsx   # Planning note interstitial
    ContactScreen.tsx     # Name, phone, email form
    ResultsScreen.tsx     # Results page with profile, testimonials, pricing
  config/
    quizConfig.ts         # All quiz questions, options, hint text, image refs
    regions.ts            # Region data (fallback) and Barry's founder profile
  lib/
    types.ts              # TypeScript type definitions
    calculatePrice.ts     # Pricing formula
    submitLead.ts         # GHL webhook POST with labelled quiz answers
    pixel.ts              # Meta pixel helper functions
public/
  images/                 # All site images (garden photos, Barry's headshot)
```

## Where Copy Lives

| To change | Edit this file |
|---|---|
| Landing page headline, subhead, badge, county list | src/app/page.tsx (nationalRegion object) |
| Regional page copy | src/config/regions.ts (fallbackRegions array) |
| Barry's bio, title, testimonials | src/config/regions.ts (founderProfile object) |
| Quiz questions, hints, option labels, button text | src/config/quizConfig.ts |
| Results page headline, subhead, pricing card text | src/components/ResultsScreen.tsx |
| Contact form heading, hint, button text | src/components/ContactScreen.tsx |
| Which image appears on which quiz step | src/config/quizConfig.ts (images object near top) |

## Quiz Flow

landing -> postcode -> projectType -> gardenSize -> engineering -> siteEducation -> features -> timeline -> finishLevel -> contact -> loading -> results

The flow is defined in quizConfig.ts as the quizOrder array.

## Pricing Logic (calculatePrice.ts)

base_build = max(£25,000 floor, garden_m2 x £300/sqm x finish_multiplier)
project_from = base_build + sum(selected feature add-ons)
Rounded down to nearest £5,000.

Finish multipliers: natural = 1.0, refined = 1.4, premium = 2.0.
Feature add-ons range from £2,000 to £20,000.

Do not change the pricing formula without explicit instruction from the project owner.

## Meta Pixel

Pixel ID: 523719334478681

Events fired:
- PageView on page load
- Lead on form submission (contact screen)
- ViewContent on results page

The pixel is injected in src/app/page.tsx and src/app/[region]/page.tsx.

## GHL Webhook

Configured via the environment variable NEXT_PUBLIC_GHL_WEBHOOK_URL (set in Vercel).
The webhook POST payload is in src/lib/submitLead.ts. It sends all contact details, labelled quiz answers, pricing estimates, region tag, UTM parameters, and fbclid.

Do not change the webhook payload field names without confirming with the GHL account owner, as GHL custom fields are mapped to these names.

## Design System

Colours:
- Forest green (primary): #1E3A2F
- Gold (accent): #C9A76A
- Sage (background): #F5F5F0
- Gold highlight bg: rgba(201,167,106,0.18)
- Gold border: rgba(201,167,106,0.4)

Fonts:
- Headings: Playfair Display (serif)
- Body: Nunito Sans (sans-serif)

Layout: Split-screen on desktop (image left, content right). Single column on mobile with image strip above content.

## Copy Rules

These rules apply to ALL copy on this project. Do not deviate.

- UK English throughout
- No em dashes anywhere. Use commas, full stops, or rewrite the sentence.
- No brochure words: stunning, bespoke, luxury, transform your outdoor space
- No false-contrast stacks or parallel repetition of sentence openers
- No hedging language
- Reading level targeting an average 15-year-old
- All CTA button text in Title Case
- No fabricated testimonials or composite client stories. Every testimonial must be verified.
- Price figures must match the calculatePrice.ts formula. Do not invent prices.

## Barry's Positioning

Barry Randall is the founder and experienced intermediary. He is NOT positioned as a garden designer himself. He reviews every project brief, talks through the homeowner's ideas, and matches them with the right local landscaper. Copy must reflect this consistently.

His verified credentials: over 20 years in the industry, portfolio includes work for Premier League clubs, professional footballers, and other high-profile private clients.

## Current Status

- Homepage: live, national (no specific region)
- Regional pages: /midlands and /cambridgeshire (using fallback config data)
- GHL webhook: coded but URL not yet configured in Vercel
- Airtable: not yet wired up, using fallback region data in regions.ts
- Mobile layout: CTA button sits below the fold, needs fixing (priority)

## Future Plans (Do Not Build Unless Asked)

- Dynamic designer matching on results page based on postcode (replacing single Barry profile)
- Airtable integration for adding regions without code changes
- Directory site on root domain yourlocalgardendesigner.co.uk (separate project)
- Additional regional pages as Barry expands coverage
