"use client";

import { useState, useCallback } from "react";
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

import LandingScreen from "./LandingScreen";
import PostcodeScreen from "./PostcodeScreen";
import SingleSelectScreen from "./SingleSelectScreen";
import FeaturesScreen from "./FeaturesScreen";
import EducationScreen from "./EducationScreen";
import ContactScreen from "./ContactScreen";
import ResultsScreen from "./ResultsScreen";

type Screen =
  | "landing"
  | (typeof quizOrder)[number]
  | "loading"
  | "results";

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

interface QuizAppProps {
  region: RegionData;
}

export default function QuizApp({ region }: QuizAppProps) {
  const [screen, setScreen] = useState<Screen>("landing");
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_ANSWERS);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goTo = useCallback((s: Screen) => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setScreen(s);
  }, []);

  function goBack() {
    if (screen === "landing") return;
    const orderWithLanding = ["landing", ...quizOrder] as const;
    const idx = orderWithLanding.indexOf(screen as typeof orderWithLanding[number]);
    if (idx > 0) goTo(orderWithLanding[idx - 1] as Screen);
  }

  function getStepNumber(screenName: string): number {
    const idx = quizOrder.indexOf(screenName as typeof quizOrder[number]);
    return idx >= 0 ? idx + 1 : 0;
  }

  function handlePostcode(location: string) {
    setAnswers((a) => ({ ...a, postcode: location }));
    goTo("projectType");
  }

  function handleSingleSelect(
    field: keyof QuizAnswers,
    value: string,
    nextScreen: Screen
  ) {
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

      // Fire browser pixel
      pixelLead({
        value: price.mid,
        contentName: price.summary,
        eventId,
      });

      // Send to GHL
      await submitLead(contact, answers, price, region.slug);

      // Show loading briefly, then results
      goTo("loading");
      setTimeout(() => {
        goTo("results");
        // Fire ViewContent on results
        pixelViewContent({
          contentName: price.summary,
          value: price.mid,
          eventId: generateEventId(),
        });
      }, 2000);
    } catch (err) {
      console.error("[QuizApp] handleContact error:", err);
      goTo("loading");
      setTimeout(() => goTo("results"), 2000);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Loading screen
  if (screen === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-body"
        style={{ backgroundColor: "#1E3A2F" }}
      >
        <div className="text-center w-full max-w-xs px-5">
          <p className="text-white/80 text-lg mb-6">
            Calculating your estimate...
          </p>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: "#C9A76A",
                animation: "loadbar 2s ease-in-out forwards",
              }}
            />
          </div>
          <style>{`
            @keyframes loadbar {
              0% { width: 0%; }
              60% { width: 70%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Results screen
  if (screen === "results" && result) {
    return <ResultsScreen result={result} countyList={region.countyList} />;
  }

  // Landing screen
  if (screen === "landing") {
    return (
      <LandingScreen region={region} onStart={() => goTo("postcode")} />
    );
  }

  // Quiz screens
  const step = quizSteps[screen];
  if (!step) return null;

  switch (screen) {
    case "postcode":
      return (
        <PostcodeScreen
          eyebrow={step.eyebrow}
          question={step.question}
          hint="Enter your town or postcode."
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
        <SingleSelectScreen
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
        <SingleSelectScreen
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
        <SingleSelectScreen
          eyebrow={step.eyebrow}
          question={step.question}
          hint={step.hint}
          options={step.options ?? []}
          selected={answers.engineering}
          onSelect={(v) =>
            handleSingleSelect("engineering", v, "siteEducation")
          }
          onBack={goBack}
          currentStep={getStepNumber("engineering")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
        />
      );

    case "siteEducation":
      return (
        <EducationScreen
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
        <FeaturesScreen
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
        <SingleSelectScreen
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
        <SingleSelectScreen
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
        <ContactScreen
          onSubmit={handleContact}
          onBack={goBack}
          currentStep={getStepNumber("contact")}
          totalSteps={TOTAL_STEPS}
          imageUrl={step.image}
          isSubmitting={isSubmitting}
        />
      );

    default:
      return null;
  }
}
