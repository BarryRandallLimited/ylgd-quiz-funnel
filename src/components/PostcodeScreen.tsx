"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import QuizLayout from "./QuizLayout";

/**
 * Postcode input screen with UK postcode / Irish Eircode format validation.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";

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

          {/* Postcode input */}
          <div className="relative mb-2">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(42,42,34,0.4)" }}>
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
              className="w-full pl-10 pr-4 py-3.5 rounded-md border text-[16px] focus:outline-none transition-colors"
              style={{
                backgroundColor: PAPER,
                color: INK,
                borderColor: error ? "#9A3B2F" : "rgba(42,42,34,0.25)",
              }}
            />
          </div>

          {error && (
            <p className="text-sm mb-3" style={{ color: "#9A3B2F" }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={value.trim().length === 0}
            className="w-full py-4 rounded-md uppercase font-semibold text-base transition-all duration-150 active:scale-[0.98] mt-2"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "0.06em",
              backgroundColor: value.trim().length > 0 ? GREEN : "rgba(42,42,34,0.15)",
              color: value.trim().length > 0 ? "#ffffff" : "rgba(42,42,34,0.4)",
              cursor: value.trim().length > 0 ? "pointer" : "not-allowed",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}
