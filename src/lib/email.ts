/**
 * Email sense-check: catches obviously-fake or mistyped addresses at the
 * point of entry, before they ever reach Airtable/GHL. This is not full
 * deliverability validation (that needs an actual mail-server check) - it's
 * a cheap client-side filter for the two failure modes that show up most in
 * quiz-funnel leads:
 *
 *  1. Placeholder/junk input someone types just to get past the form
 *     (test@test.com, asd123@asd.com, keyboard-mash locals, etc).
 *  2. Genuine typos on common UK email providers (gmail.co, hotmial.com,
 *     outlok.com) - these are real people who fat-fingered a real address,
 *     so we suggest the fix rather than just rejecting.
 */

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Exact local-part (before the @) matches that are almost never a real
// person's address on a lead form.
const PLACEHOLDER_LOCAL_PARTS = new Set([
  "test", "testing", "asdf", "asd", "qwerty", "abc", "abc123", "xxx", "xxxx",
  "none", "na", "n/a", "noemail", "fake", "example", "foo", "bar", "foobar",
  "sample", "admin", "user", "email", "temp", "spam", "blah", "xyz", "aaa",
  "zzz", "dummy", "placeholder", "nomail", "noreply", "root", "void", "asdasd",
]);

// Exact domain matches that are placeholder/example domains, not real
// mailboxes.
const PLACEHOLDER_DOMAINS = new Set([
  "test.com", "example.com", "email.com", "test.co.uk", "example.co.uk",
  "domain.com", "yourdomain.com", "website.com", "company.com", "asdf.com",
  "fake.com", "none.com", "foo.com", "sample.com", "test.co",
]);

const KEYBOARD_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"];

// Common UK-relevant providers, used as the reference set for typo
// detection. Deliberately includes both .com and .co.uk where a provider
// commonly serves both, so a genuine yahoo.co.uk address is never flagged.
const KNOWN_PROVIDERS = [
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.uk",
  "hotmail.com", "hotmail.co.uk",
  "outlook.com", "outlook.co.uk",
  "icloud.com", "me.com",
  "live.com", "live.co.uk",
  "btinternet.com", "sky.com", "virginmedia.com",
  "aol.com", "msn.com", "ntlworld.com", "talktalk.net",
];

/** True if the local part is just a run of one repeated character, e.g. "aaaaaaa". */
function isRepeatedChar(localPart: string): boolean {
  return /^(.)\1{2,}$/.test(localPart);
}

/**
 * True if the local part (letters only, case-insensitive) is a contiguous
 * run lifted straight off a keyboard row - "asdf", "qwerty", "zxcvb" - or a
 * short chunk of one repeated ("asdasd", "qweqwe"). Requires at least 3
 * letters so short real names/initials never trip it.
 */
function isKeyboardMash(localPart: string): boolean {
  const letters = localPart.toLowerCase().replace(/[^a-z]/g, "");
  if (letters.length < 3) return false;

  if (KEYBOARD_ROWS.some((row) => row.includes(letters))) return true;

  // Repetition of a short chunk, e.g. "asdasd" -> "asd" x2, "qweqweqwe".
  const repeatMatch = letters.match(/^(.{2,4})\1+$/);
  if (repeatMatch && KEYBOARD_ROWS.some((row) => row.includes(repeatMatch[1]))) {
    return true;
  }

  return false;
}

/** Iterative Levenshtein edit distance between two lowercase strings. */
function editDistance(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/**
 * If the domain is a close-but-not-exact match to a known provider (edit
 * distance 1-2), returns the likely intended domain. Returns undefined for
 * exact matches (nothing to suggest) and for domains too different from any
 * known provider to guess confidently (it's probably just a real, less
 * common domain, not a typo).
 */
export function suggestDomainCorrection(domain: string): string | undefined {
  const lower = domain.toLowerCase();
  if (KNOWN_PROVIDERS.includes(lower)) return undefined;

  let best: { provider: string; distance: number } | undefined;
  for (const provider of KNOWN_PROVIDERS) {
    // Skip comparing across obviously different lengths - keeps this fast
    // and avoids weird cross-provider "corrections".
    if (Math.abs(provider.length - lower.length) > 3) continue;
    const distance = editDistance(lower, provider);
    if (!best || distance < best.distance) {
      best = { provider, distance };
    }
  }

  if (best && best.distance > 0 && best.distance <= 2) {
    return best.provider;
  }
  return undefined;
}

export interface EmailCheckResult {
  valid: boolean;
  /** Set when the address is rejected outright (bad shape or placeholder junk). */
  reason?: string;
  /** Set when the address is well-formed but looks like a typo of a known provider. */
  suggestion?: string;
}

/**
 * Full sense-check: shape, placeholder junk, keyboard-mash, then typo
 * suggestion. Placeholder/junk addresses fail outright (valid: false).
 * Likely typos pass as valid (we don't want to hard-block a real lead over
 * a guess) but carry a suggestion so the UI can nudge the user to confirm.
 */
export function checkEmail(rawValue: string): EmailCheckResult {
  const value = rawValue.trim();

  if (!EMAIL_SHAPE.test(value)) {
    return { valid: false, reason: "That doesn't look like a complete email address." };
  }

  const [localPartRaw, domainRaw] = value.split("@");
  const localPart = localPartRaw.toLowerCase();
  const domain = domainRaw.toLowerCase();

  if (PLACEHOLDER_LOCAL_PARTS.has(localPart)) {
    return { valid: false, reason: "That looks like a placeholder address - please use your real email." };
  }

  if (PLACEHOLDER_DOMAINS.has(domain)) {
    return { valid: false, reason: "That looks like a placeholder address - please use your real email." };
  }

  if (isRepeatedChar(localPart) || isKeyboardMash(localPart)) {
    return { valid: false, reason: "That doesn't look like a real email address. Double-check it." };
  }

  const suggestion = suggestDomainCorrection(domain);
  if (suggestion) {
    return { valid: true, suggestion: `${localPartRaw}@${suggestion}` };
  }

  return { valid: true };
}
