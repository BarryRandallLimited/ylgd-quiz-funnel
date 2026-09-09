"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  QuizAnswers,
  SelectedFeatures,
  ContactDetails,
  PriceResult,
  RegionData,
} from "@/lib/types";
import { calculatePrice } from "@/lib/calculatePrice";
import { submitLead } from "@/lib/submitLead";
import { pixelLead, pixelViewContent, generateEventId } from "@/lib/pixel";
import { quizSteps, quizOrder, TOTAL_STEPS } from "@/config/quizConfig";

import LandingScreenBrandTest from "./LandingScreenBrandTest";
import PostcodeScreenBrandTest from "./PostcodeScreenBrandTest";
import SingleSelectScreenBrandTest from "./SingleSelectScreenBrandTest";
import FeaturesScreenBrandTest from "./FeaturesScreenBrandTest";
import EducationScreenBrandTest from "./EducationScreenBrandTest";
import ContactScreenBrandTest from "./ContactScreenBrandTest";
import ResultsScreenBrandTest from "./ResultsScreenBrandTest";

/**
 * Brand-test sibling of QuizApp.tsx. Identical orchestration logic (state
 * machine, calculatePrice/submitLead/pixel calls) - only the rendered screen
 * components are swapped for their *BrandTest variants, and the inline
 * loading screen JSX is restyled with the ink/paper/green brand guide.
 */

const INK = "#2A2A22";
const GREEN = "#2F5D3A";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

type Screen = "landing" | (typeof quizOrder)[number] | "loading" | "results";

const INITIAL_ANSWERS: QuizAnswers = {
  postcode: "",
  projectType: null,
  gardenSize: null,
  engineering: null,
  features: {
    patio: false,
    pergola: false,
    pool: false,
    waterFeature: false,
    outdoorKitchen: false,
    lighting: false,
    planting: false,
  },
  timeline: null,
  finishLevel: null,
};

// Sample answers for debug preview
const DEBUG_ANSWERS: QuizAnswers = {
  postcode: "LE1 1AA",
  projectType: "full_redesign",
  gardenSize: "large",
  engineering: "none",
  features: {
    patio: true,
    pergola: true,
    pool: false,
    waterFeature: false,
    outdoorKitchen: true,
    lighting: true,
    planting: true,
  },
  timeline: "planned",
  finishLevel: "refined",
};

interface QuizAppBrandTestProps {
  region: RegionData;
}

export default function QuizAppBrandTest({ region }: QuizAppBrandTestProps) {
  const [screen, setScreen] = useState<Screen>("landing");
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug: add #results to URL to jump straight to results page
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#results") {
      const debugPrice = calculatePrice(DEBUG_ANSWERS);
      setAnswers(DEBUG_ANSWERS);
      setResult(debugPrice);
      setScreen("results");
    }
  }, []);

  const goTo = useCallback((s: Screen) => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setScreen(s);
  }, []);

  function goBack() {
    if (screen === "landing") return;
    const orderWithLanding = ["landing", ...quizOrder] as const;
    const idx = orderWithLanding.indexOf(screen as (typeof orderWithLanding)[number]);
    if (idx > 0) goTo(orderWithLanding[idx - 1] as Screen);
  }

  function getStepNumber(screenName: string): number {
    const idx = quizOrder.indexOf(screenName as (typeof quizOrder)[number]);
    return idx >= 0 ? idx + 1 : 0;
  }

  function handlePostcode(postcode: string) {
    setAnswers((a) => ({ ...a, postcode }));
    goTo("projectType");
  }

  function handleSingleSelect(field: keyof QuizAnswers, value: string, nextScreen: Screen) {
    setAnswers((a) => ({ ...a, [field]: value }));
    goTo(nextScreen);
  }

  function handleFeatureToggle(key: keyof SelectedFeatures) {
    setAnswers((a) => ({
      ...a,
      features: { ...a.features, [key]: !a.features[key] },
    }));
  }

  async function handleContact(contact: ContactDetails) {
    setIsSubmitting(true);
    try {
      const price = calculatePrice(answers);
      setResult(price);

      const eventId = generateEventId();
      pixelLead({ value: price.mid, contentName: price.summary, eventId });
      await submitLead(contact, answers, price, region.slug);

      goTo("loading");
      setTimeout(() => {
        goTo("results");
        pixelViewContent({
          contentName: price.summary,
          value: price.mid,
          eventId: generateEventId(),
        });
      }, 2000);
    } catch (err) {
      console.error("[QuizAppBrandTest] handleContact error:", err);
      goTo("loading");
      setTimeout(() => goTo("results"), 2000);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Loading screen with progress bar
  if (screen === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center font-body" style={{ backgroundColor: INK }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
        `}</style>
        <div className="text-center w-full max-w-xs px-5">
          <p className="text-lg mb-6" style={{ color: "rgba(244,239,228,0.8)", fontFamily: BODY_FONT }}>
            Calculating your estimate...
          </p>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(244,239,228,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{ backgroundColor: GREEN, animation: "loadbar 2s ease-in-out forwards" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (screen === "results" && result) {
    return <ResultsScreenBrandTest result={result} countyList={region.countyList} />;
  }

  // Landing screen
  if (screen === "landing") {
    return <LandingScreenBrandTest region={region} onStart={() => goTo("postcode")} />;
  }

  // Quiz screens
  const step = quizSteps[screen];
  if (!step) return null;

  switch (screen) {
    case "postcode":
      return (
        <PostcodeScreenBrandTest
          eyebrow={step.eyebrow}
          question={step.question}
          hint={step.hint}
          placeholder={region.locationPlaceholder}
          onSubmit={handlePostcode}
          onBack={goBack}
          currentStep={getStepNumber("postcode")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "projectType":
      return (
        <SingleSelectScreenBrandTest
          eyebrow={step.eyebrow}
          question={step.question}
          hint={step.hint}
          options={step.options ?? []}
          selected={answers.projectType}
          onSelect={(v) => handleSingleSelect("projectType", v, "gardenSize")}
          onBack={goBack}
          currentStep={getStepNumber("projectType")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "gardenSize":
      return (
        <SingleSelectScreenBrandTest
          eyebrow={step.eyebrow}
          question={step.question}
          hint={step.hint}
          options={step.options ?? []}
          selected={answers.gardenSize}
          onSelect={(v) => handleSingleSelect("gardenSize", v, "engineering")}
          onBack={goBack}
          currentStep={getStepNumber("gardenSize")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "engineering":
      return (
        <SingleSelectScreenBrandTest
          eyebrow={step.eyebrow}
          question={step.question}
          hint={step.hint}
          options={step.options ?? []}
          selected={answers.engineering}
          onSelect={(v) => handleSingleSelect("engineering", v, "siteEducation")}
          onBack={goBack}
          currentStep={getStepNumber("engineering")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "siteEducation":
      return (
        <EducationScreenBrandTest
          eyebrow={step.eyebrow}
          title={step.question}
          body={step.hint}
          points={step.points ?? []}
          buttonText={step.buttonText ?? "Continue"}
          onNext={() => goTo("features")}
          onBack={goBack}
          currentStep={getStepNumber("siteEducation")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "features":
      return (
        <FeaturesScreenBrandTest
          features={answers.features}
          onToggle={handleFeatureToggle}
          onNext={() => goTo("timeline")}
          onBack={goBack}
          currentStep={getStepNumber("features")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "timeline":
      return (
        <SingleSelectScreenBrandTest
          eyebrow={step.eyebrow}
          question={step.question}
          hint={step.hint}
          options={step.options ?? []}
          selected={answers.timeline}
          onSelect={(v) => handleSingleSelect("timeline", v, "finishLevel")}
          onBack={goBack}
          currentStep={getStepNumber("timeline")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "finishLevel":
      return (
        <SingleSelectScreenBrandTest
          eyebrow={step.eyebrow}
          question={step.question}
          hint={step.hint}
          options={step.options ?? []}
          selected={answers.finishLevel}
          onSelect={(v) => handleSingleSelect("finishLevel", v, "contact")}
          onBack={goBack}
          currentStep={getStepNumber("finishLevel")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "contact":
      return (
        <ContactScreenBrandTest
          onSubmit={handleContact}
          onBack={goBack}
          currentStep={getStepNumber("contact")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
          isSubmitting={isSubmitting}
          // Cavan is in the Republic of Ireland, so default the phone
          // dropdown to +353 instead of the sitewide +44 default.
          defaultCountryDialCode={region.slug === "cavan" ? "353" : undefined}
        />
      );

    default:
      return null;
  }
}
