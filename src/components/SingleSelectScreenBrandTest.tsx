"use client";

import QuizLayoutBrandTest from "./QuizLayoutBrandTest";

/**
 * Brand-test sibling of SingleSelectScreen.tsx. Same props/logic/copy,
 * restyled with the ink/paper/green brand guide.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";

interface Option {
  value: string;
  label: string;
  description: string;
}

interface SingleSelectScreenBrandTestProps {
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

export default function SingleSelectScreenBrandTest({
  eyebrow,
  question,
  hint,
  options,
  onSelect,
  onBack,
  currentStep,
  totalSteps,
  imageUrl,
}: SingleSelectScreenBrandTestProps) {
  return (
    <QuizLayoutBrandTest
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
            {eyebrow}
          </p>

          <h2
            className="uppercase leading-[1.12] mb-3 text-balance text-[1.45rem]"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em", color: INK }}
          >
            {question}
          </h2>

          {hint && (
            <p className="text-[16px] leading-relaxed mb-5 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
              {hint}
            </p>
          )}

          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onSelect(option.value)}
                className="w-full text-left rounded-md border transition-all duration-150 px-4 py-3.5 flex items-center gap-3"
                style={{ borderColor: "rgba(42,42,34,0.2)", backgroundColor: PAPER }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(42,42,34,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(42,42,34,0.2)")}
              >
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(42,42,34,0.05)" }}
                >
                  <span className="text-sm" style={{ color: "rgba(42,42,34,0.4)" }}>
                    {/* Icon placeholder */}
                  </span>
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
                  className="w-5 h-5 rounded-full border-2 shrink-0"
                  style={{ borderColor: "rgba(42,42,34,0.25)" }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </QuizLayoutBrandTest>
  );
}
