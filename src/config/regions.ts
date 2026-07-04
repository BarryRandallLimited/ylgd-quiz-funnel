import type { RegionData } from "@/lib/types";

export const fallbackRegions: RegionData[] = [
  {
    slug: "midlands",
    regionName: "East and West Midlands",
    badgeText: "Vetted Landscapers Across England, Ireland And Spain",
    heroHeadline: "Tell us about your garden and we'll match you with the right landscaper.",
    heroSubheadline: "A curated network of landscapers, vetted for quality and matched to your project, your style, and your timeline. Plus an initial estimate to help you plan.",
    countyList: "For homeowners in Leicestershire, Warwickshire, Northamptonshire and Nottinghamshire.",
    locationPlaceholder: "e.g. LE1 1AA",
    heroImageUrl: "/images/private-family-resort.jpeg",
  },
  {
    slug: "cambridgeshire",
    regionName: "Cambridgeshire",
    badgeText: "Vetted Landscapers Across England, Ireland And Spain",
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
  bio: "Barry has been designing gardens and managing landscaping projects across the UK for over twenty years. He knows which landscapers deliver and which ones don't, because he's worked alongside them. His portfolio includes work for Premier League clubs, professional footballers, and other high-profile private clients.\n\nWhen you book a call, Barry reviews your quiz answers, talks through your ideas, and matches you with the right landscaper for your project, your area, and your budget. He stays involved through the design stage to make sure what gets built is what you actually asked for.",
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
