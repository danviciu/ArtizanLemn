export const marketingAttributionFormFields = [
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
  "gclid",
  "wbraid",
  "gbraid",
  "fbclid",
  "msclkid",
  "attributionLandingPage",
  "attributionReferrer",
  "attributionCapturedAt",
  "attributionLastSeenAt",
] as const;

export type MarketingAttributionField = (typeof marketingAttributionFormFields)[number];

export type MarketingAttributionData = Partial<
  Record<MarketingAttributionField, string>
>;
