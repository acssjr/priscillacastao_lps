export const CONSENT_KEY = "priscilla-tracking-consent";
export type ConsentValue = "accepted" | "rejected";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new CustomEvent<ConsentValue>("tracking-consent-change", { detail: value }));
  } catch {
    // Storage failure intentionally leaves tracking disabled.
  }
}
