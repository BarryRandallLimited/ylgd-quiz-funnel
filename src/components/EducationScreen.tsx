"use client";

import { Sparkles } from "lucide-react";
import QuizLayout from "./QuizLayout";

/**
 * Planning note interstitial screen shown between quiz steps.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";

interface EducationScreenProps {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  buttonText: string;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  imageUrl: string;
}

export default function EducationScreen({
  eyebrow,
  title,
  body,
  points,
  buttonText,
  onNext,
  onBack,
  currentStep,
  totalSteps,
  imageUrl,
}: EducationScreenProps) {
  return (
    <QuizLayout
      imageUrl={imageUrl}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={onBack}
    >
      <div className="px-5 py-6 md:px-10 md:py-8 max-w-lg mx-auto md:mx-0 w-full">
        {/* Planning note badge */}
        <div className="flex justify-start mb-4">
          <div
            className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5"
            style={{ borderColor: "rgba(42,42,34,0.2)", backgroundColor: PAPER }}
          >
            <Sparkles size={14} style={{ color: "rgba(42,42,34,0.6)" }} />
            <span
              className="text-xs font-semibold uppercase"
              style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.1em", color: "rgba(42,42,34,0.7)" }}
            >
              Planning note
            </span>
          </div>
        </div>

        <p
          className="text-xs font-semibold uppercase mb-2"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.14em", color: GREEN }}
        >
          {eyebrow}
        </p>

        <h2
          className="uppercase leading-[1.12] mb-3 text-balance text-[1.45rem]"
          style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em", color: INK }}
        >
          {title}
        </h2>

        <p className="text-[16px] leading-relaxed mb-6 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
          {body}
        </p>

        {/* Numbered points */}
        <div className="rounded-md border p-5 mb-6" style={{ borderColor: INK, backgroundColor: PAPER }}>
          <p
            className="text-xs font-semibold uppercase mb-4"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.1em", color: "rgba(42,42,34,0.6)" }}
          >
            Before the next question
          </p>
          <div className="space-y-4">
            {points.map((point, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ backgroundColor: INK }}
                >
                  {i + 1}
                </div>
                <p className="text-[15px] leading-relaxed pt-0.5" style={{ color: "rgba(42,42,34,0.85)" }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 rounded-md uppercase font-semibold text-base text-white transition-all duration-150 active:scale-[0.98]"
          style={{ backgroundColor: GREEN, fontFamily: DISPLAY_FONT, letterSpacing: "0.06em" }}
        >
          {buttonText} →
        </button>
      </div>
    </QuizLayout>
  );
}
