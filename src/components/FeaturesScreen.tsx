"use client";

import { Check } from "lucide-react";
import QuizLayout from "./QuizLayout";
import { quizSteps } from "@/config/quizConfig";
import type { SelectedFeatures } from "@/lib/types";

/**
 * Multi-select checkmark toggle screen for the features quiz step.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";

interface FeaturesScreenProps {
  features: SelectedFeatures;
  onToggle: (key: keyof SelectedFeatures) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  imageUrl: string;
}

export default function FeaturesScreen({
  features,
  onToggle,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  imageUrl,
}: FeaturesScreenProps) {
  const step = quizSteps.features;
  const options = step.options ?? [];
  const anySelected = Object.values(features).some(Boolean);

  return (
    <QuizLayout
      imageUrl={imageUrl}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={onBack}
    >
      <div className="px-5 py-6 md:px-10 md:py-8 max-w-lg mx-auto md:mx-0 w-full">
        <div className="rounded-md border p-5 md:p-6" style={{ borderColor: INK, backgroundColor: PAPER }}>
          <p
            className="text-xs font-semibold uppercase mb-2"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.14em", color: GREEN }}
          >
            {step.eyebrow}
          </p>

          <h2
            className="uppercase leading-[1.12] mb-3 text-balance text-[1.45rem]"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em", color: INK }}
          >
            {step.question}
          </h2>

          <p className="text-[16px] leading-relaxed mb-5 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
            {step.hint}
          </p>

          <div className="space-y-3 mb-5">
            {options.map((option) => {
              const isSelected =
                features[option.value as keyof SelectedFeatures] ?? false;
              return (
                <button
                  key={option.value}
                  onClick={() =>
                    onToggle(option.value as keyof SelectedFeatures)
                  }
                  className="w-full text-left rounded-md border transition-all duration-150 px-4 py-3.5 flex items-center gap-3"
                  style={{
                    borderColor: isSelected ? GREEN : "rgba(42,42,34,0.2)",
                    backgroundColor: isSelected ? "rgba(47,93,58,0.06)" : PAPER,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(42,42,34,0.05)" }}
                  >
                    <span className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px]" style={{ color: INK }}>
                      {option.label}
                    </p>
                    <p className="text-sm leading-snug" style={{ color: "rgba(42,42,34,0.6)" }}>
                      {option.description}
                    </p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all"
                    style={{
                      borderColor: isSelected ? GREEN : "rgba(42,42,34,0.2)",
                      backgroundColor: isSelected ? GREEN : "transparent",
                    }}
                  >
                    {isSelected && (
                      <Check size={12} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={onNext}
            disabled={!anySelected}
            className="w-full py-4 rounded-md uppercase font-semibold text-base transition-all duration-150 active:scale-[0.98]"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "0.06em",
              backgroundColor: anySelected ? GREEN : "rgba(42,42,34,0.15)",
              color: anySelected ? "#ffffff" : "rgba(42,42,34,0.4)",
              cursor: anySelected ? "pointer" : "not-allowed",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}
