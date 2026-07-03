/**
 * regions.ts - Regional data configuration.
 *
 * In production, this data comes from Airtable.
 * These defaults serve as fallbacks and local dev data.
 */

import type { RegionData } from "@/lib/types";

export const fallbackRegions: RegionData[] = [
  {
    slug: "midlands",
    regionName: "East and West Midlands",
    badgeText: "Serving the East and West Midlands",
    heroHeadline:
      "Tell us about your garden and we'll match you with the right landscaper.",
    heroSubheadline:
      "A curated group of Midlands landscapers. The right match for your project, your style, and your timeline.",
    countyList:
      "For homeowners in Leicestershire, Warwickshire, Northamptonshire and Nottinghamshire.",
    locationPlaceholder: "e.g. Leicester, Warwick, NN1 1AA",
    heroImageUrl: "/images/garden-hero-night.jpg",
  },
  {
    slug: "cambridgeshire",
    regionName: "Cambridgeshire",
    badgeText: "Serving Cambridgeshire",
    heroHeadline:
      "Tell us about your garden and we'll match you with the right landscaper.",
    heroSubheadline:
      "A curated group of Cambridgeshire landscapers. The right match for your project, your style, and your timeline.",
    countyList: "For homeowners in Cambridgeshire.",
    locationPlaceholder: "e.g. Cambridge, Ely, CB1 1AA",
    heroImageUrl: "/images/garden-hero-night.jpg",
  },
];

/**
 * Barry Randall's profile for the results page.
 * Update these details when real assets are supplied.
 */
export const founderProfile = {
  name: "Barry Randall",
  firstName: "Barry",
  title: "Founder, Your Local Garden Designer",
  bio: "Barry has been designing gardens and managing landscaping projects across the UK for over twenty years. He knows which landscapers deliver and which ones don't, because he's worked alongside them.\n\nWhen you book a call, Barry reviews your quiz answers, talks through your ideas, and matches you with the right landscaper for your project, your area, and your budget. He stays involved through the design stage to make sure what gets built is what you actually asked for.",
  headshot: "/images/barry-randall.png",
  coverageArea: "Nationwide",
  projectImages: [
    {
      src: "/images/portfolio-01.jpg",
      caption: "Evening patio with festoon lighting",
    },
    {
      src: "/images/portfolio-02.jpg",
      caption: "Pergola and lawn",
    },
    {
      src: "/images/portfolio-03.jpg",
      caption: "Covered outdoor room and dining area",
    },
    {
      src: "/images/portfolio-04.jpg",
      caption: "Contemporary garden with shade sail",
    },
    {
      src: "/images/portfolio-05.jpg",
      caption: "Raised deck with glass balustrade",
    },
  ],
  testimonials: [
    {
      name: "Jeyda T.",
      text: "Without a doubt the best company I had ever experienced. They have gone above and beyond to make sure our project went to plan. The design was fantastic and they helped make changes to get everything in budget. Everything was so well run from deliveries and timescales. The team have all been exceptional, polite and friendly and could never do enough to help.",
    },
    {
      name: "Leanne S.",
      text: "They somehow managed to turn our terrible explanation into a perfect design that suited the space exactly. The team who came to do the work were not only efficient but genuinely lovely to have around. We had the back garden done in March this year, and we now use it every single day, come rain or shine.",
    },
    {
      name: "Kate H.",
      text: "We started with a very typical new build garden. What we have now is something completely different. It's beautiful, low maintenance and actually designed to be lived in and enjoyed by the whole family. They made us feel looked after from start to finish and that's rare these days. Would I recommend them? 1000%.",
    },
  ],
};
