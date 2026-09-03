/**
 * Phone number handling: country code selection, E.164 normalization, and a
 * sense-check against implausible input (too few/many digits, all-zeros,
 * sequential digits, etc).
 *
 * Scope: postcode/Eircode validation (see PostcodeScreen.tsx) only covers UK
 * and Ireland, but the badge copy also claims Spain as a coverage area, so
 * Spain is included here even though there's no matching postcode format
 * check yet. Add more here if the business starts taking leads from
 * elsewhere.
 */

export interface CountryCodeOption {
  /** Dial code digits only, no "+". e.g. "44" */
  dialCode: string;
  label: string;
  flag: string;
}

export const COUNTRY_CODE_OPTIONS: CountryCodeOption[] = [
  { dialCode: "44", label: "UK", flag: "\u{1F1EC}\u{1F1E7}" },
  { dialCode: "353", label: "Ireland", flag: "\u{1F1EE}\u{1F1EA}" },
  { dialCode: "34", label: "Spain", flag: "\u{1F1EA}\u{1F1F8}" },
];

export const DEFAULT_COUNTRY_DIAL_CODE = "44";

const ASCENDING_DIGITS = "01234567890123456789";
const DESCENDING_DIGITS = "98765432109876543210";

/**
 * Per-country rules for the national significant number (NSN) - the part of
 * the number left after the country code and any trunk prefix are removed.
 *
 * min/max: UK numbers (mobile and landline) are always exactly 10 digits
 * once the trunk zero is stripped, so a UK entry missing 1-2 digits used to
 * slip through under the old shared 8-10 range. Ireland genuinely varies
 * (Dublin landlines can be 8, mobiles are 9), so it keeps a range. Spain is
 * always exactly 9.
 *
 * hasTrunkZero: UK and Ireland numbers are dialled nationally with a
 * leading 0 that isn't part of the number (07911 123456 -> 7911123456).
 * Spanish numbers don't have this - they're dialled in full, so a leading
 * 0 (if one ever appeared) would actually be part of the number and must
 * not be stripped.
 *
 * Unknown dial codes (e.g. a country added to COUNTRY_CODE_OPTIONS without
 * a matching rule here) fall back to the old generic 8-10/hasTrunkZero
 * behaviour rather than rejecting everything outright.
 */
interface CountryDigitRule {
  min: number;
  max: number;
  hasTrunkZero: boolean;
}

const COUNTRY_DIGIT_RULES: Record<string, CountryDigitRule> = {
  "44": { min: 10, max: 10, hasTrunkZero: true }, // UK
  "353": { min: 8, max: 9, hasTrunkZero: true }, // Ireland
  "34": { min: 9, max: 9, hasTrunkZero: false }, // Spain
};

const DEFAULT_DIGIT_RULE: CountryDigitRule = { min: 8, max: 10, hasTrunkZero: true };

function digitRuleFor(dialCode: string): CountryDigitRule {
  return COUNTRY_DIGIT_RULES[dialCode] ?? DEFAULT_DIGIT_RULE;
}

export function getDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Strips a country's dial code from the front of a digit string, if present
 * and if what's left still looks long enough to be a national number. Covers
 * the case where someone pastes a full international number into the
 * national-number field despite having a country already selected.
 */
function stripDialCodeIfPresent(digits: string, dialCode: string): string {
  if (digits.startsWith(dialCode) && digits.length > dialCode.length + 6) {
    return digits.slice(dialCode.length);
  }
  return digits;
}

/**
 * Reduces raw input down to the "national significant number": digits only,
 * no country code, no leading trunk zero (where the selected country uses
 * one - see hasTrunkZero above). This is the canonical form both the
 * sense-check and the E.164 builder work from.
 */
export function toNationalSignificantNumber(rawValue: string, dialCode: string): string {
  let digits = getDigits(rawValue);
  digits = stripDialCodeIfPresent(digits, dialCode);
  if (digitRuleFor(dialCode).hasTrunkZero && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * Builds a full E.164 number ("+" + country code + national significant
 * number, digits only) from a selected dial code and whatever the user
 * typed. This is the format GHL and Airtable should both store.
 */
export function toE164(rawValue: string, dialCode: string): string {
  const nsn = toNationalSignificantNumber(rawValue, dialCode);
  return `+${dialCode}${nsn}`;
}

/**
 * Phone sense-check. Runs against the national significant number (country
 * code and leading trunk zero already stripped) so a legitimate country
 * code never counts toward the digit-count or repeated-digit checks.
 */
export function isPlausiblePhoneNumber(rawValue: string, dialCode: string): boolean {
  const nsn = toNationalSignificantNumber(rawValue, dialCode);
  const rule = digitRuleFor(dialCode);

  if (nsn.length < rule.min || nsn.length > rule.max) {
    return false;
  }

  // Every digit the same, e.g. 0000000000
  if (/^(\d)\1+$/.test(nsn)) {
    return false;
  }

  // A long run of the same digit anywhere, e.g. 7000000000
  if (/(\d)\1{5,}/.test(nsn)) {
    return false;
  }

  // Simple ascending or descending runs, e.g. 1234567890 or 9876543210
  if (ASCENDING_DIGITS.includes(nsn) || DESCENDING_DIGITS.includes(nsn)) {
    return false;
  }

  return true;
}

/**
 * Defensive server-side normalizer. ContactScreen already sends a fully
 * formed E.164 string, so under normal operation this is a no-op. It exists
 * as a last line of defence in submit-lead's API route in case a phone
 * number ever arrives from a path that skipped client-side normalization
 * (e.g. a future alternate entry point) - assumes UK if there's no
 * recognizable "+" prefix already.
 */
export function normalizeAnyToE164(value: string, fallbackDialCode: string = DEFAULT_COUNTRY_DIAL_CODE): string {
  const trimmed = value.trim();
  if (trimmed.startsWith("+")) {
    return `+${getDigits(trimmed)}`;
  }
  return toE164(trimmed, fallbackDialCode);
}
