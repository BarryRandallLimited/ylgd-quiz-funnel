"use client";

import { useState } from "react";
import QuizLayout from "./QuizLayout";
import type { ContactDetails } from "@/lib/types";
import {
  COUNTRY_CODE_OPTIONS,
  DEFAULT_COUNTRY_DIAL_CODE,
  isPlausiblePhoneNumber,
  toE164,
} from "@/lib/phone";

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
  const [countryDialCode, setCountryDialCode] = useState(DEFAULT_COUNTRY_DIAL_CODE);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneValid = isPlausiblePhoneNumber(form.phone, countryDialCode);
  const phoneError =
    phoneTouched && form.phone.trim().length > 0 && !phoneValid
      ? "That doesn't look like a valid phone number. Double-check the digits."
      : "";

  const isValid =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    phoneValid &&
    form.email.includes("@");

  function handleSubmit() {
    if (isSubmitting) return;

    if (!isValid) {
      // Surface the phone error even if the user never blurred that field
      // (e.g. they tabbed straight to the button) - clicking submit always
      // reveals why it isn't going through, not just a greyed-out button.
      setPhoneTouched(true);
      return;
    }

    // Normalize to E.164 (e.g. "07911 123456" + UK -> "+447911123456") here
    // at the point of submission, so every downstream consumer (Airtable,
    // the GHL webhook) receives the same clean format.
    onSubmit({ ...form, phone: toE164(form.phone, countryDialCode) });
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
            Where do we send your results?
          </h2>

          <p className="text-[16px] text-stone-600 leading-relaxed mb-5 text-pretty">
            We'll show your matched designer and initial estimate on the next screen. No spam, ever.
          </p>

          <div className="space-y-4 mb-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Mobile number</label>
              <div className="flex gap-2">
                <select
                  value={countryDialCode}
                  onChange={(e) => {
                    setCountryDialCode(e.target.value);
                    if (phoneTouched) setPhoneTouched(false);
                  }}
                  aria-label="Country code"
                  className="shrink-0 px-2 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-[16px] focus:outline-none focus:border-stone-400 transition-colors"
                >
                  {COUNTRY_CODE_OPTIONS.map((option) => (
                    <option key={option.dialCode} value={option.dialCode}>
                      {option.flag} +{option.dialCode}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  onBlur={() => setPhoneTouched(true)}
                  placeholder="07911 123456"
                  className={`w-full px-3.5 py-3 rounded-xl border bg-white text-stone-900 text-[16px] placeholder:text-stone-400 focus:outline-none transition-colors ${
                    phoneError
                      ? "border-red-400 focus:border-red-400"
                      : "border-stone-200 focus:border-stone-400"
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Email address</label>
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
            By submitting, you agree to be contacted by Your Local Garden Designer about your project. We don't sell your data.
          </p>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            aria-disabled={!isValid}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-150 active:scale-[0.98] ${
              isValid && !isSubmitting ? "text-stone-900" : "text-stone-400 cursor-not-allowed"
            }`}
            style={{ backgroundColor: isValid && !isSubmitting ? "#C9A76A" : "#e5e5e0" }}
          >
            {isSubmitting ? "Submitting..." : "Show Me My Results →"}
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}
