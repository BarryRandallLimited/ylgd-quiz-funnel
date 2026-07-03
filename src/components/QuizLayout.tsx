"use client";

import { Leaf, ChevronLeft } from "lucide-react";

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
          style={{ backgroundColor: "#1E3A2F" }}
        >
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-white/80 hover:text-white transition-colors text-sm font-semibold"
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Brand mark */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#C9A76A" }}
            >
              <Leaf size={14} className="text-white" />
            </div>
            <span
              className="font-semibold text-sm tracking-tight text-white font-display"
            >
              Your Local Garden Designer
            </span>
          </div>

          {/* Step counter */}
          {showProgress && currentStep && totalSteps ? (
            <span className="text-white/60 text-sm font-semibold tabular-nums">
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
        <div className="flex-1 flex flex-col" style={{ backgroundColor: "#F5F5F0" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
