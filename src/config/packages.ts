/**
 * The four fixed-price service packages sold on the pay. subdomain.
 *
 * Source copy: CONSULTATION.docx, THE GARDEN BLUEPRINT.docx, THE VISION.docx,
 * THE MASTERPIECE.docx (supplied by Barry, 2026-07-21), with "vetted" swapped
 * for "approved" throughout to match the compliance fix already applied to
 * the rest of the site (Meta ad review flagged "vetted" — see badgeText in
 * src/config/regions.ts history).
 *
 * priceGBP is a whole-pound amount. Stripe wants the amount in pence, so the
 * checkout-session route does `priceGBP * 100` — keep this file in pounds,
 * it's what a human editing copy will expect.
 */

export type PackageSlug = "consultation" | "blueprint" | "vision" | "masterpiece";

export interface ServicePackage {
  slug: PackageSlug;
  eyebrow: string;
  name: string;
  tagline: string;
  priceGBP: number;
  investmentLabel: string;
  turnaround: string;
  imageUrl: string;
  features: string[];
  howItWorksBody: string;
  nextSteps: string[];
  mostPopular?: boolean;
}

export const PACKAGES: Record<PackageSlug, ServicePackage> = {
  consultation: {
    slug: "consultation",
    eyebrow: "Step One · The Consultation",
    name: "The Consultation",
    tagline: "On-site consultation and written recommendation",
    priceGBP: 300,
    investmentLabel: "£300 one-off · on-site",
    turnaround: "Once payment is received, we'll get you booked in within 3-5 working days.",
    imageUrl: "/images/packages/consultation.jpg",
    features: [
      "A professional on-site visit to see and understand your space",
      "A proper conversation about your brief and how you want to live in the garden",
      "Expert, honest feedback on what will and won't work",
      "A written recommendation on the right design route for you",
      "Indicative budget guidance for your project, so you can plan",
      "Guidance on the right level of landscaper to build it — owner-operator, project-managed, or full end-to-end",
    ],
    howItWorksBody:
      "Your Local Garden Designer is an independent design and matching service. At the consultation we'll recommend the right design route and give you an honest, indicative budget — then, when your design is ready, we match you with the right YLGD approved landscaper to build it. The build price comes from your matched landscaper, not from us. That independence is the point: your design works for you, not for whoever's holding the trowel.",
    nextSteps: [
      "Confirm above and pay — quick and secure",
      "We book your onsite consultation",
      "You get your written recommendation, indicative budget, and the right design route to take",
    ],
  },
  blueprint: {
    slug: "blueprint",
    eyebrow: "The Garden Blueprint · 2D Concept Design",
    name: "Garden Blueprint",
    tagline: "Your garden, properly designed in 2D",
    priceGBP: 1800,
    investmentLabel: "£1,800 · 2D concept design",
    turnaround: "Once payment is received, we'll be in touch within one working day to get you booked in with our designer.",
    imageUrl: "/images/packages/blueprint.jpg",
    features: [
      "A professional on-site visit to see and understand your space",
      "A measured site survey of your garden",
      "A scaled 2D concept plan — the full layout, drawn to scale",
      "Zoning and layout — exactly where everything goes and why",
      "Clear material and hard landscaping direction",
      "Matched with the right YLGD approved landscaper to build it",
    ],
    howItWorksBody:
      "Your Local Garden Designer is an independent design and matching service. We create your design, then match you with the right YLGD approved landscaper to build it — chosen to suit your project, your standards and your budget. The build price comes from your matched landscaper, not from us. We stay your independent designer throughout, so the plan is built to serve you.",
    nextSteps: [
      "Confirm above and pay — quick and secure",
      "We book your survey and create your Garden Blueprint",
      "We match you with the right YLGD approved landscaper to build it and make the introduction",
    ],
  },
  vision: {
    slug: "vision",
    eyebrow: "The Vision · 3D Design",
    name: "The Vision",
    tagline: "See your garden in full 3D before it's built",
    priceGBP: 3000,
    investmentLabel: "£3,000 · 3D design",
    turnaround: "Once payment is received, we'll be in touch within one working day to get you booked in.",
    imageUrl: "/images/packages/vision.jpg",
    features: [
      "Everything in Blueprint, plus:",
      "A full 3D visualisation of your garden — see it before you build it",
      "Realistic materials, planting and lighting shown in 3D",
      "Walkthrough views from all your key angles",
      "A detailed material, planting, and lighting direction",
      "Matched with the right YLGD approved landscaper to build it",
    ],
    howItWorksBody:
      "Your Local Garden Designer is an independent design and matching service. We create your design, then match you with the right YLGD approved landscaper to build it — chosen to suit your project, your standards and your budget. The build price comes from your matched landscaper, not from us. Seeing it in full 3D removes every doubt before a penny is spent on the build.",
    nextSteps: [
      "Confirm above and pay — quick and secure",
      "We book your survey and create your Vision design in 3D",
      "We match you with the right YLGD approved landscaper to build it and make the introduction",
    ],
    mostPopular: true,
  },
  masterpiece: {
    slug: "masterpiece",
    eyebrow: "The Masterpiece · 3D + Technical Drawings",
    name: "The Masterpiece",
    tagline: "3D design plus full, build-ready technical drawings",
    priceGBP: 6000,
    investmentLabel: "£6,000 · 3D design + technical drawings",
    turnaround: "Once payment is received, we'll be in touch within one working day to get you booked in.",
    imageUrl: "/images/packages/masterpiece.jpg",
    features: [
      "Everything in Vision, plus:",
      "A cinematic 3D fly-through of your finished garden",
      "Full technical and construction drawings — build-ready",
      "Detailed setting-out, levels and drainage plans",
      "A complete materials and planting schedule",
      "A tender-ready pack your matched landscaper can build from",
    ],
    howItWorksBody:
      "Your Local Garden Designer is an independent design and matching service. We create your full technical design, then match you with the right YLGD approved landscaper to build it — chosen to suit your project, your standards and your budget. The build price comes from your matched landscaper, not from us. With every measurement, level and detail drawn, your matched landscaper prices and builds exactly what you signed off — no surprises.",
    nextSteps: [
      "Confirm above and pay — quick and secure",
      "We book your survey and create your Masterpiece pack",
      "We match you with the right YLGD approved landscaper to build it and make the introduction",
    ],
  },
};

export function getPackage(slug: string): ServicePackage | undefined {
  return PACKAGES[slug as PackageSlug];
}

export const PACKAGE_ORDER: PackageSlug[] = ["consultation", "blueprint", "vision", "masterpiece"];
