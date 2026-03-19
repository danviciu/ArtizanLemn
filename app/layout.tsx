import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { cookies } from "next/headers";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import {
  COOKIE_CONSENT_COOKIE_NAME,
  isCookieConsentDecision,
} from "@/lib/cookie-consent";
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
      <body
        className={`${manrope.variable} ${cormorant.variable} bg-sand-50 text-wood-950 antialiased`}
      >
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsAppButton />
        <CookieConsentBanner initialDecision={initialConsentDecision} />
      </body>
    </html>
  );
}
