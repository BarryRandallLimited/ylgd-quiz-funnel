"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import QuizLayout from "./QuizLayout";

interface PostcodeScreenProps {
  eyebrow: string;
  question: string;
  hint: string;
  placeholder: string;
  onSubmit: (postcode: string) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  imageUrl: string;
}

/**
 * UK postcode format validation.
 * Accepts formats like: SW1A 1AA, EC1A 1BB, W1A 0AX, M1 1AE, B33 8TH, CR2 6XH, DN55 1PT
 * Case-insensitive, allows optional space in the middle.
 */
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

/**
 * Irish Eircode format validation.
 * A 3-character routing key followed by a 4-character unique identifier.
 * Both halves use only digits 0-9 and the letters A C D E F H K N P R T V W X Y
 * (the official Eircode character set excludes I, O, U and other easily confused letters).
 * Optional space between the two halves, e.g. D02 AF30, T12X0Y0.
 */
const EIRCODE_REGEX = /^[ACDEFHKNPRTVWXY0-9]{3}\s?[ACDEFHKNPRTVWXY0-9]{4}$/i;

function isValidUKPostcode(value: string): boolean {
  return UK_POSTCODE_REGEX.test(value.trim());
}

function isValidEircode(value: string): boolean {
  return EIRCODE_REGEX.test(value.trim());
}

function isValidLocationCode(value: string): boolean {
  return isValidUKPostcode(value) || isValidEircode(value);
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
  const [error, setError] = useState("");

  function handleSubmit() {
    const trimmed = value.trim().toUpperCase();
    if (trimmed.length === 0) return;

    if (!isValidLocationCode(trimmed)) {
      setError("Please enter a valid UK postcode or Irish Eircode.");
      return;
    }

    setError("");
    onSubmit(trimmed);
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

          {/* Postcode input */}
          <div className="relative mb-2">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <MapPin size={18} />
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={placeholder}
              autoComplete="postal-code"
              className={`w-full pl-10 pr-4 py-3.5 rounded-xl border bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none transition-colors ${
                error
                  ? "border-red-400 focus:border-red-400"
                  : "border-stone-200 focus:border-stone-400"
              }`}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={value.trim().length === 0}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] mt-2 ${
              value.trim().length > 0
                ? "text-white"
                : "text-stone-400 cursor-not-allowed"
            }`}
            style={{
              backgroundColor: value.trim().length > 0 ? "#1E3A2F" : "#e5e5e0",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}
