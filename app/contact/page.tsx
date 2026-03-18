import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { WhatsAppInlineLink } from "@/components/ui/whatsapp-inline-link";
import { companyDetails } from "@/data/navigation";
import { createPageMetadata } from "@/lib/site";
import {
  createGoogleMapsEmbedLink,
  createGoogleMapsLink,
  siteContactConfig,
} from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contacteaza Artizan Lemn pentru proiecte de mobilier premium din lemn masiv realizate la comanda.",
  path: "/contact",
  image: "/images/galerie/intrare-fereastra.png",
});

const contactPoints = [
  { label: "Telefon", value: companyDetails.phones },
  { label: "Email", value: companyDetails.email },
  { label: "Locatie atelier", value: companyDetails.city },
  { label: "Program", value: companyDetails.schedule },
];

const mapsEmbedSrc = createGoogleMapsEmbedLink();
const googleMapsHref = createGoogleMapsLink();
const coordinateText = `${siteContactConfig.location.latitude}, ${siteContactConfig.location.longitude}`;
const mapKicker = "Loca\u021bie";
const mapTitle = "Ne g\u0103se\u0219ti aici";
const openMapsLabel = "Deschide \u00een Google Maps";

const externalButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-sand-300 bg-white px-5 py-2.5 text-sm font-medium tracking-wide text-wood-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sand-100 hover:border-sand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-700 focus-visible:ring-offset-2";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Discutam despre proiectul tau"
        description="Trimite-ne detaliile initiale si revenim rapid cu urmatorii pasi pentru o oferta personalizata."
        image="/images/galerie/terasa-eleganta.png"
      />

      <section className="section-space pb-10 md:pb-14">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="space-y-5">
            <article className="luxury-card p-6">
              <h2 className="text-3xl">Date de contact</h2>
              <ul className="mt-4 space-y-3">
                {contactPoints.map((point) => (
                  <li key={point.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wood-700">
                      {point.label}
                    </p>
                    {Array.isArray(point.value) ? (
                      <div className="mt-1 space-y-1">
                        {point.value.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone}`}
                            className="block text-sm text-wood-900 transition-colors hover:text-moss-600"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-wood-900">{point.value}</p>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <WhatsAppInlineLink label="Contact rapid pe WhatsApp" />
              </div>
            </article>

            <article className="luxury-card p-6">
              <h2 className="text-3xl">Vizita in atelier</h2>
              <p className="mt-3 text-sm text-wood-700">
                Pentru proiecte complexe recomandam o discutie in atelier, cu
                mostre de materiale si exemple de finisaje.
              </p>
            </article>
          </aside>

          <ContactForm />
        </Container>
      </section>

      <section className="pb-16 md:pb-24">
        <Container className="space-y-6">
          <div className="space-y-2">
            <p className="editorial-kicker">{mapKicker}</p>
            <h2 className="text-5xl">{mapTitle}</h2>
          </div>

          <article className="luxury-card overflow-hidden">
            <div className="aspect-[4/3] w-full md:aspect-[16/7]">
              <iframe
                title="Locatie Artizan Lemn"
                src={mapsEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>

            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wood-700">
                  Coordonate
                </p>
                <p className="mt-1 text-sm text-wood-900">{coordinateText}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={googleMapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Deschide locatia in Google Maps (se deschide intr-un tab nou)"
                  className={externalButtonClass}
                >
                  {openMapsLabel}
                </a>
                <a
                  href={`mailto:${companyDetails.email}`}
                  className={externalButtonClass}
                >
                  Scrie-ne pe email
                </a>
              </div>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
