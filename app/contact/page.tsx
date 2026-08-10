import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { QuickContactActions } from "@/components/ui/quick-contact-actions";
import { companyDetails } from "@/data/navigation";
import { createBreadcrumbJsonLd } from "@/lib/seo";
import { createPageMetadata, siteConfig } from "@/lib/site";
import {
  createGoogleMapsEmbedLink,
  siteContactConfig,
} from "@/lib/site-config";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Artizan Lemn",
  description:
    "Contacteaza Artizan Lemn pentru mobilier la comanda din lemn masiv. Telefon, email, adresa atelier si program.",
  path: "/contact",
  image: "/images/galerie/intrare-fereastra.png",
  keywords: [
    "contact artizan lemn",
    "mobilier la comanda brasov",
    "mobilier din lemn masiv",
    "atelier lemn prejmer",
    "oferta mobilier personalizat",
  ],
});

const mapsEmbedSrc = createGoogleMapsEmbedLink();
const googleMapsHref = siteConfig.googleBusinessProfileUrl;
const coordinateText = `${siteContactConfig.location.latitude}, ${siteContactConfig.location.longitude}`;
const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Acasa", path: "/" },
  { name: "Contact", path: "/contact" },
]);

const contactRows = [
  { label: "Telefon", value: companyDetails.phones[0], href: `tel:${companyDetails.phones[0]}` },
  { label: "Email", value: companyDetails.email, href: `mailto:${companyDetails.email}` },
  { label: "Adresa", value: companyDetails.city },
  { label: "Program atelier", value: companyDetails.schedule },
  { label: "Program apeluri", value: companyDetails.phoneSchedule },
];

const externalButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-full border border-sand-300 bg-white px-5 py-2.5 text-sm font-medium tracking-wide text-wood-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sand-100 hover:border-sand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-700 focus-visible:ring-offset-2";
const phoneAvailabilityNote =
  "(Sambata si Duminica nu preluam apeluri, lasati mesaj pe WhatsApp.)";

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />

      <PageHero
        eyebrow="Contact"
        title="Date de contact si disponibilitate"
        description="Suntem disponibili pentru proiecte de mobilier la comanda din lemn masiv si revenim rapid cu pasii potriviti pentru proiectul tau."
        image="/images/galerie/terasa-eleganta.png"
      />

      <section className="section-space pb-10 md:pb-14">
        <Container className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="space-y-5">
            <article className="luxury-card p-6">
              <h2 className="text-3xl">Date de contact</h2>
              <ul className="mt-4 space-y-3">
                {contactRows.map((row) => (
                  <li key={row.label}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wood-700">
                      {row.label}
                    </p>
                    {row.href ? (
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-wood-900">
                        <a
                          href={row.href}
                          className="transition-colors hover:text-moss-600"
                        >
                          {row.value}
                        </a>
                        {row.label.startsWith("Telefon") ? (
                          <span className="text-xs text-wood-700">
                            {phoneAvailabilityNote}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-wood-900">{row.value}</p>
                    )}
                  </li>
                ))}
              </ul>

              <QuickContactActions
                className="mt-5"
                callLabel="Suna in program"
                whatsappLabel="Scrie pe WhatsApp"
                emailLabel="Trimite email"
                whatsappMessage="Buna! As dori sa discutam un proiect de mobilier la comanda."
                trackingLocation="contact_page"
              />
            </article>

            <article className="luxury-card p-6">
              <h2 className="text-3xl">Disponibilitate</h2>
              <p className="mt-3 text-sm text-wood-700">
                Preluam proiecte de mobilier premium din lemn masiv: paturi,
                mese, biblioteci, dulapuri de baie, riflaje si piese complet
                personalizate, in functie de cerintele spatiului.
              </p>
            </article>
          </aside>

          <ContactForm />
        </Container>
      </section>

      <section className="pb-16 md:pb-24">
        <Container className="space-y-6">
          <div className="space-y-2">
            <p className="editorial-kicker">Locatie atelier</p>
            <h2 className="text-5xl">Ne gasesti aici</h2>
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
                  data-track-event="contact_click"
                  data-track-label="Deschide in Google Maps"
                  data-track-location="contact_page"
                  data-track-type="maps"
                >
                  Deschide in Google Maps
                </a>
                <a
                  href={`mailto:${companyDetails.email}`}
                  className={externalButtonClass}
                  data-track-event="contact_click"
                  data-track-label="Trimite email"
                  data-track-location="contact_page"
                  data-track-type="email"
                >
                  Trimite email
                </a>
              </div>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
