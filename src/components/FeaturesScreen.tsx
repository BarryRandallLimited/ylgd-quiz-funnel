"use client";

import { Check } from "lucide-react";
import QuizLayout from "./QuizLayout";
import { quizSteps } from "@/config/quizConfig";
import type { SelectedFeatures } from "@/lib/types";

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
        <div className="rounded-2xl bg-white shadow-sm border border-stone-100 p-5 md:p-6">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#C9A76A" }}
          >
            {step.eyebrow}
          </p>

          <h2 className="text-[1.65rem] leading-[1.08] font-bold text-stone-950 mb-3 text-balance font-display">
            {step.question}
          </h2>

          <p className="text-[16px] text-stone-600 leading-relaxed mb-5 text-pretty">
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
                  className={`w-full text-left rounded-xl border transition-all duration-150 px-4 py-3.5 flex items-center gap-3 ${
                    isSelected
                      ? "border-[#C9A76A] bg-[#FFFBF1] shadow-sm"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                    <span className="text-stone-400 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 text-[15px]">
                      {option.label}
                    </p>
                    <p className="text-sm text-stone-500 leading-snug">
                      {option.description}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#C9A76A] bg-[#C9A76A]"
                        : "border-stone-200"
                    }`}
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
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] ${
              anySelected
                ? "text-stone-900"
                : "text-stone-400 cursor-not-allowed"
            }`}
            style={{
              backgroundColor: anySelected ? "#C9A76A" : "#e5e5e0",
            }}
          >
            Continue →
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}
