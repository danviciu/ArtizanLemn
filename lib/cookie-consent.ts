export const GOOGLE_TAG_ID = "G-4B20CNG3DJ";
export const COOKIE_CONSENT_STORAGE_KEY = "artizan_cookie_consent_v1";
export const COOKIE_CONSENT_COOKIE_NAME = "artizan_cookie_consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "artizan:open-cookie-settings";

export type CookieConsentDecision = "accepted" | "rejected";

export function isCookieConsentDecision(
  value: string | null,
): value is CookieConsentDecision {
  return value === "accepted" || value === "rejected";
}
