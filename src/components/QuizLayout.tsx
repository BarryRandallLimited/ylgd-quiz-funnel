"use client";

import { ChevronLeft } from "lucide-react";

/**
 * Split-screen shell for the quiz: full-height image on the left (desktop),
 * header bar with back button/brand mark/step counter, and the content area
 * for the active screen.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";

interface QuizLayoutProps {
  children: React.ReactNode;
  imageUrl: string;
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
  showProgress?: boolean;
}

export default function QuizLayout({
  children,
  imageUrl,
  currentStep,
  totalSteps,
  onBack,
  showProgress = true,
}: QuizLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Left column: full-height image (desktop only) */}
      <div className="hidden md:block md:w-1/2 sticky top-0 h-screen overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>

      {/* Right column */}
      <div className="flex flex-col md:w-1/2 md:min-h-screen">
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ backgroundColor: INK }}
        >
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 transition-colors text-sm font-semibold"
                style={{ color: "rgba(244,239,228,0.8)" }}
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Brand mark */}
          <div className="flex items-center gap-2">
            <img
              src="/images/brand/ylgd-mark-primary.svg"
              alt="Your Local Garden Designer"
              className="h-9 w-auto rounded-sm"
            />
          </div>

          {/* Step counter */}
          {showProgress && currentStep && totalSteps ? (
            <span
              className="text-sm font-semibold tabular-nums"
              style={{ color: "rgba(244,239,228,0.6)" }}
            >
              {currentStep} / {totalSteps}
            </span>
          ) : (
            <div className="w-12" />
          )}
        </div>

        {/* Mobile image */}
        <div className="md:hidden w-full max-h-[35vh] overflow-hidden">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: PAPER }}>
          {children}
        </div>
      </div>
    </div>
  );
}
