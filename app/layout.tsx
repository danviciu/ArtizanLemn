import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CookieConsentBanner } from "@/components/legal/cookie-consent-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { createOrganizationJsonLd, createWebsiteJsonLd } from "@/lib/seo";
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
const websiteJsonLd = createWebsiteJsonLd();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </head>
      <body
        className={`${manrope.variable} ${cormorant.variable} bg-sand-50 text-wood-950 antialiased`}
      >
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsAppButton />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
