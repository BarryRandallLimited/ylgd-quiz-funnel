"use client";

import QuizLayout from "./QuizLayout";

interface Option {
  value: string;
  label: string;
  description: string;
}

interface SingleSelectScreenProps {
  eyebrow: string;
  question: string;
  hint: string;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  imageUrl: string;
}

export default function SingleSelectScreen({
  eyebrow,
  question,
  hint,
  options,
  onSelect,
  onBack,
  currentStep,
  totalSteps,
  imageUrl,
}: SingleSelectScreenProps) {
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

          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onSelect(option.value)}
                className="w-full text-left rounded-xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm transition-all duration-150 px-4 py-3.5 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                  <span className="text-stone-400 text-sm">
                    {/* Icon placeholder */}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900 text-[15px]">
                    {option.label}
                  </p>
                  <p className="text-sm text-stone-500 leading-snug">
                    {option.description}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-stone-200 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </QuizLayout>
  );
}
