"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import QuizLayout from "./QuizLayout";

interface PostcodeScreenProps {
  eyebrow: string;
  question: string;
  hint: string;
  placeholder: string;
  onSubmit: (location: string) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  imageUrl: string;
}

export default function PostcodeScreen({
  eyebrow,
  question,
  hint,
  placeholder,
  onSubmit,
  onBack,
  currentStep,
  totalSteps,
  imageUrl,
}: PostcodeScreenProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSubmit(trimmed);
    }
  }

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
            {eyebrow}
          </p>

          <h2 className="text-[1.65rem] leading-[1.08] font-bold text-stone-950 mb-3 text-balance font-display">
            {question}
          </h2>

          {hint && (
            <p className="text-[16px] text-stone-600 leading-relaxed mb-5 text-pretty">
              {hint}
            </p>
          )}

          {/* Location input */}
          <div className="relative mb-4">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <MapPin size={18} />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={placeholder}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={value.trim().length === 0}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] ${
              value.trim().length > 0
                ? "text-white"
                : "text-stone-400 cursor-not-allowed"
            }`}
            style={{
              backgroundColor:
                value.trim().length > 0 ? "#1E3A2F" : "#e5e5e0",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}
