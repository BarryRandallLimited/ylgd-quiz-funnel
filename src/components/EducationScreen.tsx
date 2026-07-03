"use client";

import { Sparkles } from "lucide-react";
import QuizLayout from "./QuizLayout";

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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5">
            <Sparkles size={14} className="text-stone-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Planning note
            </span>
          </div>
        </div>

        <p
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: "#C9A76A" }}
        >
          {eyebrow}
        </p>

        <h2 className="text-[1.65rem] leading-[1.08] font-bold text-stone-950 mb-3 text-balance font-display">
          {title}
        </h2>

        <p className="text-[16px] text-stone-600 leading-relaxed mb-6 text-pretty">
          {body}
        </p>

        {/* Numbered points */}
        <div className="rounded-2xl bg-white shadow-sm border border-stone-100 p-5 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
            Before the next question
          </p>
          <div className="space-y-4">
            {points.map((point, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ backgroundColor: "#1E3A2F" }}
                >
                  {i + 1}
                </div>
                <p className="text-[15px] text-stone-700 leading-relaxed pt-0.5">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onNext}
          className="w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] text-white"
          style={{ backgroundColor: "#1E3A2F" }}
        >
          {buttonText} →
        </button>
      </div>
    </QuizLayout>
  );
}
