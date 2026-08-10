"use client";

import type { MarketingAttributionData } from "@/types/marketing";

const STORAGE_KEY = "artizan_marketing_attribution_v1";

const queryParamToFieldMap = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  gclid: "gclid",
  wbraid: "wbraid",
  gbraid: "gbraid",
  fbclid: "fbclid",
  msclkid: "msclkid",
} as const;

type QueryParamKey = keyof typeof queryParamToFieldMap;

function getCurrentPageUrl() {
  return window.location.href;
}

function getCurrentTimestamp() {
  return new Date().toISOString();
}

function parseStoredAttribution() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return parsed as MarketingAttributionData;
  } catch {
    return {};
  }
}

function writeStoredAttribution(value: MarketingAttributionData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore localStorage write failures (private mode, blocked storage).
  }
}

function pickQueryAttribution() {
  const params = new URLSearchParams(window.location.search);
  const values: MarketingAttributionData = {};

  (Object.keys(queryParamToFieldMap) as QueryParamKey[]).forEach((queryKey) => {
    const value = params.get(queryKey);
    if (!value) {
      return;
    }

    const field = queryParamToFieldMap[queryKey];
    values[field] = value.trim();
  });

  return values;
}

export function captureMarketingAttributionFromLocation() {
  if (typeof window === "undefined") {
    return {};
  }

  const stored = parseStoredAttribution();
  const fromQuery = pickQueryAttribution();
  const hasQueryAttribution = Object.keys(fromQuery).length > 0;

  if (!hasQueryAttribution) {
    return stored;
  }

  const now = getCurrentTimestamp();
  const nextValue: MarketingAttributionData = {
    ...stored,
    ...fromQuery,
    attributionLastSeenAt: now,
  };

  if (!nextValue.attributionCapturedAt) {
    nextValue.attributionCapturedAt = now;
  }

  if (!nextValue.attributionLandingPage) {
    nextValue.attributionLandingPage = getCurrentPageUrl();
  }

  if (!nextValue.attributionReferrer && document.referrer) {
    nextValue.attributionReferrer = document.referrer;
  }

  writeStoredAttribution(nextValue);
  return nextValue;
}

export function getStoredMarketingAttribution() {
  if (typeof window === "undefined") {
    return {};
  }

  const captured = captureMarketingAttributionFromLocation();
  if (Object.keys(captured).length > 0) {
    return captured;
  }

  return parseStoredAttribution();
}

export function appendMarketingAttributionToFormData(
  formData: FormData,
  attribution: MarketingAttributionData,
) {
  Object.entries(attribution).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    formData.append(key, value);
  });
}
