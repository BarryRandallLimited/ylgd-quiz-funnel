"use client";

import { useState } from "react";
import QuizLayout from "./QuizLayout";
import type { ContactDetails } from "@/lib/types";

interface ContactScreenProps {
  onSubmit: (contact: ContactDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  imageUrl: string;
  isSubmitting: boolean;
}

export default function ContactScreen({
  onSubmit,
  onBack,
  currentStep,
  totalSteps,
  imageUrl,
  isSubmitting,
}: ContactScreenProps) {
  const [form, setForm] = useState<ContactDetails>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const isValid =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    form.phone.trim().length >= 7 &&
    form.email.includes("@");

  function handleSubmit() {
    if (isValid && !isSubmitting) {
      onSubmit(form);
    }
  }

  function updateField(field: keyof ContactDetails, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
            Last step
          </p>

          <h2 className="text-[1.65rem] leading-[1.08] font-bold text-stone-950 mb-3 text-balance font-display">
            Where do we send your estimate?
          </h2>

          <p className="text-[16px] text-stone-600 leading-relaxed mb-5 text-pretty">
            We'll show your planning range on the next screen and your matched
            landscapers. No spam, ever.
          </p>

          <div className="space-y-4 mb-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                Mobile number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
              />
            </div>
          </div>

          <p className="text-xs text-stone-500 mb-4 leading-snug">
            By submitting, you agree to be contacted by Your Local Garden
            Designer about your project. We don't sell your data.
          </p>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] ${
              isValid && !isSubmitting
                ? "text-stone-900"
                : "text-stone-400 cursor-not-allowed"
            }`}
            style={{
              backgroundColor:
                isValid && !isSubmitting ? "#C9A76A" : "#e5e5e0",
            }}
          >
            {isSubmitting ? "Submitting..." : "Show Me My Estimate →"}
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}
