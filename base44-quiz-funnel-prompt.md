# Base44 build prompt — garden design quote quiz

Paste everything below into Base44 to build the app.

---

Build a mobile-first lead-qualification quiz app called "Garden Design Quote Quiz." A visitor answers a short series of questions about their garden project, sees an instant price estimate, and submits their contact details to book a free consultation. 90% of traffic will be on mobile, so every screen must work cleanly on a phone first.

## Flow and screens

One question per screen, in this exact order, with a progress indicator (e.g. "Step 3 of 9") and a back button on every screen except the first:

1. **Landing** — hero headline, one-line subheadline, a single "Start" call-to-action button. No quiz content yet.
2. **Postcode** — "What Is Your Postcode?" Single text input, hint: "Enter your postcode so we can match you with designers in your area." Accept UK postcode format loosely (don't over-validate; just check it looks like a plausible postcode prefix, don't reject on minor formatting).
3. **Project type** (single select, advances immediately on tap) — "What Kind Of Project Is This?" Hint: "This helps us understand what you're working with and find designers who specialise in exactly this type of work."
   - New build garden — "Starting from scratch. The garden is a blank canvas or builder's finish"
   - Garden renovation — "Refreshing or improving an existing garden that needs a new direction"
   - Garden extension or addition — "Adding a new zone, feature or outdoor living area to an existing garden"
   - Full redesign — "Starting again with a completely new layout and design"
4. **Garden size** (single select) — "How Large Is The Outdoor Space?" Hint: "A rough size is fine."
   - Small — "Up to 100m², about a large living room or small courtyard" (use 75m² as the calculation value)
   - Medium — "100–250m², about a tennis court, typical detached house garden" (175m²)
   - Large — "250–500m², about a quarter of a football pitch, multiple zones" (375m²)
   - Extra large — "500–1,000m², about half a football pitch, a substantial plot" (750m²)
   - Estate — "1,000m² or more, a full football pitch or larger, rural property or estate grounds" (1500m²)
5. **Site challenges** (single select) — "Are There Any Slope, Drainage Or Access Challenges On The Plot?"
   - Mostly flat and easy to access
   - Slope or level changes
   - Drainage or waterlogging
   - Slope plus drainage issues
6. **Education interstitial** — no question, just a persuasive full-screen message to set expectations before pricing. Headline: "The Gardens That Look The Best In Year Five Are The Ones That Were Planned Properly In Year One." Three short supporting bullet points about proper drainage and soil prep, designing around how the space will actually be used, and planning to a finish date rather than a start date. Single continue button: "Choose Your Outdoor Features."
7. **Features** (multi-select, needs an explicit Continue button since more than one can be picked) — "Which Features Are On The Wish List?" Each option has a one-line description:
   - Patio or terrace
   - Pergola or shade structure
   - Pool or hot tub area
   - Water feature
   - Outdoor kitchen
   - Lighting scheme
   - Planting and borders
8. **Timeline** (single select) — "When Would You Like The Garden To Be Finished?"
   - Within the next 3 months
   - In the next 3 to 9 months
   - I'm still in the research stage
9. **Finish level** (single select) — "Which Best Describes The Finish You're Picturing?"
   - Natural and simple
   - Refined and detailed
   - No expense spared
10. **Contact details** — "Where Do We Send Your Results?" Hint: "We'll show your matched designer and initial estimate on the next screen. No spam, ever." Fields: first name, last name, mobile number (with country code, default to UK, validate it's a real phone number format), email (validate format, and if you can, flag obvious typos like "gmial.com"). Submit button disabled until all fields are valid.
11. **Results** — see the dedicated section below.

Persist all answers and any partially completed contact fields in local/session storage so a visitor who refreshes or navigates away mid-quiz on mobile doesn't lose progress. Clear the saved draft only once the lead has been successfully submitted.

## Pricing calculation

Calculate this client-side the instant the visitor reaches the results screen. Do not ask the visitor for their budget anywhere in the quiz; the price is derived entirely from the answers above.

```
ratePerSqm = 300              (currency: GBP, £)
floor = 25,000
adjustment = 0.75              (applied to soften every raw figure below)

gardenSizeM2 = { small: 75, medium: 175, large: 375, xlarge: 750, estate: 1500 }
finishMultiplier = { natural: 1.0, refined: 1.4, premium: 2.0 }

rawBase = gardenSizeM2 × ratePerSqm × finishMultiplier × adjustment
baseBuild = max(floor × adjustment, rawBase)

featureAddOn (each × adjustment, these are the pre-adjustment values):
  patio: £5,000
  pergola: £2,000
  pool: £20,000
  waterFeature: £4,000
  outdoorKitchen: £3,000
  lighting: £2,000
  planting: £3,000

projectFrom = roundDownToNearest5000(baseBuild + sum of adjusted add-ons for every selected feature)

low  = roundDownToNearest5000(projectFrom × 0.85)
high = roundDownToNearest5000(projectFrom × 1.30)
```

Show `projectFrom` as the headline "starts from" figure, not a range, with a short disclaimer underneath that it is an estimate and not a fixed quote. Never display a single number without that disclaimer next to it.

## Results screen

Build this as a single scrolling page, generously spaced (roughly double the vertical gap between these sections compared to the gap between elements within one section — this page carries a lot of information and must not feel cramped, especially on mobile):

1. Checkmark icon, thank-you headline ("Thank You For Your Enquiry, We've Received All Your Answers"), one-line "here's what happens next."
2. A short personal letter (3–5 short paragraphs) framed as coming from the business founder, explaining that every enquiry is reviewed personally, not a call centre or algorithm, ending with a name, title, and photo. Do not invent statistics or credentials; leave these as placeholders for the client to fill in with verified numbers.
3. "Your initial estimate" — the `projectFrom` figure in large type on a dark card, with the estimate disclaimer.
4. A short reassurance paragraph explaining that two similar gardens can cost very differently depending on finish and specification, and that the visitor is in control of where on that scale they land.
5. An inline embedded scheduling/booking calendar (leave a placeholder integration here for a booking tool such as Calendly or GoHighLevel, since the exact widget URL will be supplied later). Place it here, after the price and letter but before the testimonials below, not right at the top and not only at the very bottom.
6. 2–3 video testimonials (placeholder embeds).
7. 3–5 short written reviews with names and a 5-star rating each. Use clearly-marked placeholder text; do not fabricate real-sounding testimonials, ratings, or client names.

Add a `/results-preview` (or equivalent) route that renders this same results screen with dummy data for review purposes, and make sure that route never submits a lead, never calls the CRM integration, and never fires a conversion event.

## Lead delivery

Treat a completed quiz submission as a lead record, not just a form post:

1. On contact-form submit, validate again on the backend, then write a lead record to the app's database first, before attempting anything else. Store: the visitor's contact details, every quiz answer, the calculated price fields, a timestamp, and a delivery-status field starting at "Pending."
2. After that record exists, attempt to forward the lead to an external CRM through an integration/webhook (the specific CRM will be configured later, so build this as a clearly separated step that's easy to point at a real webhook URL afterwards). Give this its own dedicated webhook configuration, separate from any other lead source this app might ever add, so a problem with one never masquerades as a problem with the other.
3. Update the lead record's delivery-status field to "Sent" or "Failed" (with an error message) based on the outcome of step 2. A `200` response from the webhook is not proof the receiving system mapped every field correctly, just that it accepted the request.
4. Show the visitor the results screen as soon as step 1 succeeds. Never make the visitor wait on, or fail because of, the CRM forward in step 2.
5. Before relying on any backend database or integration for real paid-traffic volume, check whether it has a request-quota or rate limit on its plan, and size that plan for expected volume. A quota silently being exceeded looks identical to a broken integration from the outside.

## Tracking

On first page load, capture `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `fbclid` from the URL, plus the Facebook browser cookie (`_fbp`) if present, and hold onto the first value seen for each throughout the session even if the visitor navigates within the app. Include all of these in the lead record and in the CRM forward payload.

Add a placeholder for a Meta Pixel integration: fire a `PageView` event on load, a `Lead` event only after a lead record has been successfully created (not before, and not on the results-preview route), and a `ViewContent` event when the results screen renders. Use one stable event ID per submission if the platform supports sending both a browser-side and server-side copy of the same event, so they can be deduplicated.

## Design notes

Keep it simple and readable: dark or black text on a light background, or light text on a dark background, never grey body text. Default body copy to a comfortably large size on mobile (around 18px). One clear, high-contrast call-to-action button per screen. Use a restrained accent colour for eyebrows, small bullets, and buttons only, and double check that colour is still readable if it's ever placed on a dark background, not just on the light one. Rounded corners should be subtle (small radius), not heavily pill-shaped. No fabricated statistics, testimonials, or reviews anywhere; use obvious placeholder copy wherever real content isn't available yet, so it's easy to find and replace later.
