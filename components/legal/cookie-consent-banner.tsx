"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_STORAGE_KEY,
  GOOGLE_TAG_ID,
  OPEN_COOKIE_SETTINGS_EVENT,
  type CookieConsentDecision,
  isCookieConsentDecision,
} from "@/lib/cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function getConsentPayload(analyticsStorage: "granted" | "denied") {
  return {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: analyticsStorage,
  } as const;
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

function persistDecision(decision: CookieConsentDecision) {
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, decision);
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${decision}; Path=/; Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

type CookieConsentBannerProps = {
  initialDecision?: CookieConsentDecision | null;
};

function readStoredDecision(): CookieConsentDecision | null {
  const localValue = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (isCookieConsentDecision(localValue)) {
    return localValue;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_CONSENT_COOKIE_NAME}=`))
    ?.split("=")[1] ?? null;

  return isCookieConsentDecision(cookieValue) ? cookieValue : null;
}

function getInitialDecision(
  initialDecision: CookieConsentDecision | null,
): CookieConsentDecision | null {
  if (initialDecision) {
    return initialDecision;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return readStoredDecision();
}

export function CookieConsentBanner({
  initialDecision = null,
}: CookieConsentBannerProps) {
  const [decision, setDecision] = useState<CookieConsentDecision | null>(() =>
    getInitialDecision(initialDecision),
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const analyticsConfiguredRef = useRef(false);
  const loadAnalytics = decision === "accepted";
  const showBanner = decision === null || isSettingsOpen;

  useEffect(() => {
    ensureGtagStub();
    window.gtag?.("consent", "default", {
      ...getConsentPayload("denied"),
      wait_for_update: 500,
    });
  }, []);

  useEffect(() => {
    if (!decision) {
      return;
    }

    ensureGtagStub();
    window.gtag?.(
      "consent",
      "update",
      getConsentPayload(decision === "accepted" ? "granted" : "denied"),
    );
  }, [decision]);

  useEffect(() => {
    const openCookieSettings = () => {
      setIsSettingsOpen(true);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openCookieSettings);
    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openCookieSettings);
    };
  }, []);

  useEffect(() => {
    if (!loadAnalytics || analyticsConfiguredRef.current) {
      return;
    }

    ensureGtagStub();
    window.gtag?.("js", new Date());
    window.gtag?.("config", GOOGLE_TAG_ID, {
      anonymize_ip: true,
    });
    analyticsConfiguredRef.current = true;
  }, [loadAnalytics]);

  const applyDecision = useCallback((nextDecision: CookieConsentDecision) => {
    ensureGtagStub();
    persistDecision(nextDecision);
    setDecision(nextDecision);
    setIsSettingsOpen(false);

    const analyticsStorage = nextDecision === "accepted" ? "granted" : "denied";
    window.gtag?.("consent", "update", getConsentPayload(analyticsStorage));

    if (nextDecision === "rejected") {
      analyticsConfiguredRef.current = false;
    }
  }, []);

  return (
    <>
      {loadAnalytics ? (
        <Script
          id="ga4-script"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}
          strategy="afterInteractive"
        />
      ) : null}

      {showBanner ? (
        <aside className="fixed inset-x-4 bottom-4 z-[120] mx-auto w-full max-w-3xl rounded-2xl border border-sand-300/80 bg-white/96 p-5 shadow-[0_24px_40px_-30px_rgba(46,31,22,0.9)] backdrop-blur">
          <h2 className="text-2xl">Setari cookies</h2>
          <p className="mt-3 text-sm text-wood-700">
            Folosim cookie-uri strict necesare pentru functionarea site-ului si
            cookie-uri de analiza (Google Analytics) doar cu acordul tau.
            Poti modifica optiunea oricand din footer.
          </p>
          <p className="mt-2 text-xs text-wood-700">
            Detalii in{" "}
            <Link
              href="/politica-cookies"
              className="font-medium text-wood-900 underline underline-offset-2"
            >
              Politica de cookies
            </Link>{" "}
            si{" "}
            <Link
              href="/politica-confidentialitate"
              className="font-medium text-wood-900 underline underline-offset-2"
            >
              Politica de confidentialitate
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => applyDecision("rejected")}
            >
              Refuza analitice
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => applyDecision("accepted")}
            >
              Accepta analitice
            </Button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
