import type { Metadata } from "next";
import MagazineLandingBrandTest from "@/components/MagazineLandingBrandTest";

/**
 * Experimental sibling of /magazine, restyled with the actual brand guide
 * (monochrome ink/paper, framed wordmark, geometric sans, sparing green
 * accent) instead of this project's existing forest/gold system. Not
 * linked anywhere; kept at its own URL so it can be compared against
 * /magazine before deciding whether to adopt it. Not indexed.
 */

export const metadata: Metadata = {
  title: "Free Monthly Garden Magazine (Brand Test) | Your Local Garden Designer",
  robots: { index: false },
};

export default function MagazineBrandTestPage() {
  return <MagazineLandingBrandTest />;
}
