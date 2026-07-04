import type { RegionData } from "@/lib/types";

export const fallbackRegions: RegionData[] = [
  {
    slug: "midlands",
    regionName: "East and West Midlands",
    badgeText: "Vetted Landscapers Across The UK, Ireland And Spain",
    heroHeadline: "Tell us about your garden and we'll match you with the right landscaper.",
    heroSubheadline: "A curated network of landscapers, vetted for quality and matched to your project, your style, and your timeline. Plus an initial estimate to help you plan.",
    countyList: "For homeowners in Leicestershire, Warwickshire, Northamptonshire and Nottinghamshire.",
    locationPlaceholder: "e.g. LE1 1AA",
    heroImageUrl: "/images/private-family-resort.jpeg",
  },
  {
    slug: "cambridgeshire",
    regionName: "Cambridgeshire",
    badgeText: "Vetted Landscapers Across The UK, Ireland And Spain",
    heroHeadline: "Tell us about your garden and we'll match you with the right landscaper.",
    heroSubheadline: "A curated network of landscapers, vetted for quality and matched to your project, your style, and your timeline. Plus an initial estimate to help you plan.",
    countyList: "For homeowners in Cambridgeshire.",
    locationPlaceholder: "e.g. CB1 1AA",
    heroImageUrl: "/images/private-family-resort.jpeg",
  },
];

export const founderProfile = {
  name: "Barry Randall",
  firstName: "Barry",
  title: "Founder, Your Local Garden Designer",
  bio: "I built the Your Local Garden Designer network after 33 years serving homeowners in this trade. I know which landscapers deliver and which ones don't because I've worked alongside them.\n\nBetween us, that network has completed over 1,100 gardens, with a portfolio that includes work for Premier League clubs, footballers, musicians and other high-profile private clients.",
  headshot: "/images/barry-randall.png",
  coverageArea: "Nationwide",
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
