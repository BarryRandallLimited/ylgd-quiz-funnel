import type { Metadata } from "next";
import QuizAppBrandTest from "@/components/QuizAppBrandTest";
import type { RegionData } from "@/lib/types";

/**
 * Experimental sibling of the live quiz at "/" (src/app/page.tsx), restyled
 * with the actual brand guide (monochrome ink/paper, framed wordmark,
 * geometric sans, sparing green accent) instead of this project's existing
 * forest/gold system. Mirrors the pattern already validated at
 * /magazine/brand-test. Not linked anywhere; kept at its own URL so it can
 * be compared against the live quiz before deciding whether to adopt it.
 * Not indexed. Deliberately omits the Meta Pixel script that the live
 * homepage includes, since this internal-only preview should not fire real
 * ad-tracking events.
 */

const nationalRegion: RegionData = {
  slug: "national",
  regionName: "the UK",
  badgeText: "Approved Landscapers Across The UK, Ireland And Spain",
  heroHeadline: "Tell Us About Your Garden And We'll Match You With The Right Landscaper",
  heroSubheadline: "A curated network of landscapers, approved for quality and matched to your project, your style, and your timeline. Plus an initial estimate to help you plan.",
  countyList: "",
  locationPlaceholder: "e.g. LE1 1AA",
  heroImageUrl: "/images/private-family-resort.jpeg",
};

export const metadata: Metadata = {
  title: "Quiz Brand Test (Internal Preview)",
  robots: { index: false },
};

export default function QuizBrandTestPage() {
  return <QuizAppBrandTest region={nationalRegion} />;
}
