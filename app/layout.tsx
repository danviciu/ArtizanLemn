import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { cookies } from "next/headers";
import { MarketingAttributionCapture } from "@/components/analytics/marketing-attribution-capture";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import {
  COOKIE_CONSENT_COOKIE_NAME,
  isCookieConsentDecision,
} from "@/lib/cookie-consent";
import {
  createLocalBusinessJsonLd,
  createOrganizationJsonLd,
  createWebsiteJsonLd,
} from "@/lib/seo";
import { defaultMetadata } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

const organizationJsonLd = createOrganizationJsonLd();
const localBusinessJsonLd = createLocalBusinessJsonLd();
const websiteJsonLd = createWebsiteJsonLd();
const conversionTrackingBootstrapScript = `(() => {
  if (window.__artizanTrackingBootstrapped) {
    return;
  }

  window.__artizanTrackingBootstrapped = true;

  const push = (eventName, payload = {}) => {
    const eventPayload = { event: eventName, ...payload };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventPayload);

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }
  };

  window.ArtizanTrack = { push };

  document.addEventListener(
    "click",
    (event) => {
      const origin = event.target;
      if (!(origin instanceof Element)) {
        return;
      }

      const target = origin.closest("[data-track-event]");
      if (!target) {
        return;
      }

      const eventName = target.getAttribute("data-track-event") || "cta_click";
      push(eventName, {
        track_label: target.getAttribute("data-track-label") || undefined,
        track_location: target.getAttribute("data-track-location") || undefined,
        track_type: target.getAttribute("data-track-type") || undefined,
        href: target.getAttribute("href") || undefined,
      });
    },
    { passive: true },
  );
})();`;
const cookieConsentBootstrapScript = `(() => {
  const COOKIE_NAME = "${COOKIE_CONSENT_COOKIE_NAME}";
  const STORAGE_KEY = "artizan_cookie_consent_v1";
  const VALID = { accepted: true, rejected: true };

  const readCookie = () => {
    const entry = document.cookie
      .split("; ")
      .find((item) => item.startsWith(COOKIE_NAME + "="));
    if (!entry) return null;
    const value = entry.split("=")[1];
    return VALID[value] ? value : null;
  };

  try {
    const localValue = localStorage.getItem(STORAGE_KEY);
    const decision = VALID[localValue] ? localValue : readCookie();
    if (decision) {
      document.documentElement.setAttribute("data-cookie-consent", decision);
    }
  } catch {
    const decision = readCookie();
    if (decision) {
      document.documentElement.setAttribute("data-cookie-consent", decision);
    }
  }
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawConsentDecision =
    cookieStore.get(COOKIE_CONSENT_COOKIE_NAME)?.value ?? null;
  const initialConsentDecision = isCookieConsentDecision(rawConsentDecision)
    ? rawConsentDecision
    : null;

  return (
    <html lang="ro">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: conversionTrackingBootstrapScript }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: cookieConsentBootstrapScript }}
        />
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={localBusinessJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </head>
      <body
        className={`${manrope.variable} ${cormorant.variable} bg-sand-50 text-wood-950 antialiased`}
      >
        <MarketingAttributionCapture />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsAppButton />
        <CookieConsentBanner initialDecision={initialConsentDecision} />
      </body>
    </html>
  );
}
