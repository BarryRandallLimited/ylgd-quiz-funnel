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
import { checkEmail } from "@/lib/email";

/**
 * Contact details screen: name, phone, and email form with validation
 * before handing off to the price calculation and lead submission.
 */

const INK = "#2A2A22";
const PAPER = "#F4EFE4";
const GREEN = "#2F5D3A";

const DISPLAY_FONT = "'Century Gothic','Futura','URW Geometric','Jost',sans-serif";
const BODY_FONT = "'Inter','Montserrat',sans-serif";

interface ContactScreenProps {
  onSubmit: (contact: ContactDetails) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
  imageUrl: string;
  isSubmitting: boolean;
  /** Pre-selects a country in the dial code dropdown for this region (e.g. Ireland for /cavan). Defaults to DEFAULT_COUNTRY_DIAL_CODE (UK). */
  defaultCountryDialCode?: string;
}

export default function ContactScreen({
  onSubmit,
  onBack,
  currentStep,
  totalSteps,
  imageUrl,
  isSubmitting,
  defaultCountryDialCode,
}: ContactScreenProps) {
  const [form, setForm] = useState<ContactDetails>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [countryDialCode, setCountryDialCode] = useState(
    defaultCountryDialCode ?? DEFAULT_COUNTRY_DIAL_CODE
  );
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);

  const phoneValid = isPlausiblePhoneNumber(form.phone, countryDialCode);
  const phoneError =
    phoneTouched && form.phone.trim().length > 0 && !phoneValid
      ? "That doesn't look like a valid phone number. Double-check the digits."
      : "";

  const emailCheck = form.email.trim().length > 0 ? checkEmail(form.email) : { valid: false };
  const emailError =
    emailTouched && form.email.trim().length > 0 && !emailCheck.valid
      ? emailCheck.reason ?? "That doesn't look like a valid email address."
      : "";
  const emailSuggestion =
    !suggestionDismissed && emailCheck.valid ? emailCheck.suggestion : undefined;

  const isValid =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    phoneValid &&
    emailCheck.valid;

  function handleSubmit() {
    if (isSubmitting) return;

    if (!isValid) {
      // Surface the phone/email errors even if the user never blurred those
      // fields (e.g. they tabbed straight to the button) - clicking submit
      // always reveals why it isn't going through, not just a greyed-out
      // button.
      setPhoneTouched(true);
      setEmailTouched(true);
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
        <div className="rounded-md border p-5 md:p-6" style={{ borderColor: INK, backgroundColor: PAPER }}>
          <p
            className="text-xs font-semibold uppercase mb-2"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.14em", color: GREEN }}
          >
            Last step
          </p>

          <h2
            className="uppercase leading-[1.12] mb-3 text-balance text-[1.45rem]"
            style={{ fontFamily: DISPLAY_FONT, letterSpacing: "0.02em", color: INK }}
          >
            Where do we send your results?
          </h2>

          <p className="text-[16px] leading-relaxed mb-5 text-pretty" style={{ color: "rgba(42,42,34,0.75)" }}>
            We'll show your matched designer and initial estimate on the next screen. No spam, ever.
          </p>

          <div className="space-y-4 mb-5" style={{ fontFamily: BODY_FONT }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: INK }}>First name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full px-3.5 py-3 rounded-md border text-[16px] focus:outline-none transition-colors"
                  style={{ borderColor: "rgba(42,42,34,0.25)", backgroundColor: PAPER, color: INK }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1" style={{ color: INK }}>Last name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="w-full px-3.5 py-3 rounded-md border text-[16px] focus:outline-none transition-colors"
                  style={{ borderColor: "rgba(42,42,34,0.25)", backgroundColor: PAPER, color: INK }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: INK }}>Mobile number</label>
              <div className="flex gap-2">
                <select
                  value={countryDialCode}
                  onChange={(e) => {
                    setCountryDialCode(e.target.value);
                    if (phoneTouched) setPhoneTouched(false);
                  }}
                  aria-label="Country code"
                  className="shrink-0 px-2 py-3 rounded-md border text-[16px] focus:outline-none transition-colors"
                  style={{ borderColor: "rgba(42,42,34,0.25)", backgroundColor: PAPER, color: INK }}
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
                  className="w-full px-3.5 py-3 rounded-md border text-[16px] focus:outline-none transition-colors"
                  style={{
                    backgroundColor: PAPER,
                    color: INK,
                    borderColor: phoneError ? "#9A3B2F" : "rgba(42,42,34,0.25)",
                  }}
                />
              </div>
              {phoneError && (
                <p className="text-sm mt-1" style={{ color: "#9A3B2F" }}>{phoneError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: INK }}>Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  updateField("email", e.target.value);
                  setSuggestionDismissed(false);
                }}
                onBlur={() => setEmailTouched(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-3.5 py-3 rounded-md border text-[16px] focus:outline-none transition-colors"
                style={{
                  backgroundColor: PAPER,
                  color: INK,
                  borderColor: emailError ? "#9A3B2F" : "rgba(42,42,34,0.25)",
                }}
              />
              {emailError && (
                <p className="text-sm mt-1" style={{ color: "#9A3B2F" }}>{emailError}</p>
              )}
              {!emailError && emailSuggestion && (
                <p className="text-sm mt-1" style={{ color: "#8A6A2F" }}>
                  Did you mean{" "}
                  <button
                    type="button"
                    onClick={() => {
                      updateField("email", emailSuggestion);
                      setSuggestionDismissed(true);
                    }}
                    className="underline font-semibold"
                  >
                    {emailSuggestion}
                  </button>
                  ?
                </p>
              )}
            </div>
          </div>

          <p className="text-xs mb-4 leading-snug" style={{ color: "rgba(42,42,34,0.55)", fontFamily: BODY_FONT }}>
            By submitting, you agree to be contacted by Your Local Garden Designer about your project. We don't sell your data.
          </p>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            aria-disabled={!isValid}
            className="w-full py-4 rounded-md uppercase font-semibold text-base transition-all duration-150 active:scale-[0.98]"
            style={{
              fontFamily: DISPLAY_FONT,
              letterSpacing: "0.06em",
              backgroundColor: isValid && !isSubmitting ? GREEN : "rgba(42,42,34,0.15)",
              color: isValid && !isSubmitting ? "#ffffff" : "rgba(42,42,34,0.4)",
              cursor: isValid && !isSubmitting ? "pointer" : "not-allowed",
            }}
          >
            {isSubmitting ? "Submitting..." : "Show Me My Results →"}
          </button>
        </div>
      </div>
    </QuizLayout>
  );
}
