import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { legalProfile } from "@/data/legal";
import {
  COOKIE_CONSENT_COOKIE_NAME,
  COOKIE_CONSENT_STORAGE_KEY,
} from "@/lib/cookie-consent";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Politica de cookies",
  description:
    "Detalii despre cookie-urile folosite pe Artizan Lemn si modul de gestionare a consimtamantului.",
  path: "/politica-cookies",
});

const cookieRows = [
  {
    name: COOKIE_CONSENT_COOKIE_NAME,
    type: "Strict necesar",
    purpose: "Retine decizia ta privind cookie-urile (accept/refuz).",
    duration: "12 luni",
  },
  {
    name: COOKIE_CONSENT_STORAGE_KEY,
    type: "Stocare locala",
    purpose: "Retine local preferinta de consimtamant pentru afisarea bannerului.",
    duration: "Pana la stergerea datelor din browser",
  },
  {
    name: "artizan_admin_session",
    type: "Strict necesar",
    purpose:
      "Permite autentificarea in zona administrativa; nu este folosit pentru tracking marketing.",
    duration: "Pana la expirarea sesiunii admin",
  },
  {
    name: "_ga, _ga_*",
    type: "Analitic (optional)",
    purpose: "Masoara traficul si comportamentul in site prin Google Analytics 4.",
    duration: "Pana la 24 luni (setare Google)",
  },
] as const;

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Politica de cookies"
        description="Folosim cookie-uri strict necesare implicit. Cookie-urile analitice sunt activate doar dupa consimtamant."
      />

      <section className="section-space pb-16 md:pb-24">
        <Container className="space-y-6">
          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">1. Ce sunt cookie-urile</h2>
            <p className="text-sm text-wood-700">
              Cookie-urile sunt fisiere mici stocate in browser pentru
              functionarea site-ului, securitate sau analiza trafic.
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">2. Ce folosim pe acest site</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-wood-700">
                <thead>
                  <tr className="border-b border-sand-300/70 text-wood-900">
                    <th className="px-2 py-2 font-semibold">Nume</th>
                    <th className="px-2 py-2 font-semibold">Tip</th>
                    <th className="px-2 py-2 font-semibold">Scop</th>
                    <th className="px-2 py-2 font-semibold">Durata</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieRows.map((cookie) => (
                    <tr key={cookie.name} className="border-b border-sand-300/50">
                      <td className="px-2 py-2 font-mono text-xs">{cookie.name}</td>
                      <td className="px-2 py-2">{cookie.type}</td>
                      <td className="px-2 py-2">{cookie.purpose}</td>
                      <td className="px-2 py-2">{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">3. Consimtamant si retragere</h2>
            <p className="text-sm text-wood-700">
              Cookie-urile analitice (GA4) pornesc doar dupa apasarea butonului
              de accept in banner. Poti reveni oricand asupra optiunii prin
              butonul &quot;Preferinte cookie&quot; din footer.
            </p>
            <p className="text-sm text-wood-700">
              De asemenea, poti sterge cookie-urile direct din setarile
              browserului.
            </p>
          </article>

          <article className="luxury-card space-y-4 p-6 md:p-8">
            <h2 className="text-3xl">4. Contact</h2>
            <p className="text-sm text-wood-700">
              Pentru intrebari despre cookies, ne poti scrie la{" "}
              <a
                href={`mailto:${legalProfile.contactEmail}`}
                className="font-medium text-wood-900 underline underline-offset-2"
              >
                {legalProfile.contactEmail}
              </a>
              .
            </p>
            <p className="text-xs text-wood-700">
              Ultima actualizare: {legalProfile.lastUpdated}
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
