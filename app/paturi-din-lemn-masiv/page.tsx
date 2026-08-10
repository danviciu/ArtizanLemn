import type { Metadata } from "next";
import { ProductGrid } from "@/components/products/product-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PageHero } from "@/components/ui/page-hero";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { QuickContactActions } from "@/components/ui/quick-contact-actions";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { listCatalogProducts } from "@/lib/catalog/products-repository";
import { createBreadcrumbJsonLd } from "@/lib/seo";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Comanda pat din lemn masiv pe dimensiuni",
  description:
    "Configureaza un pat din lemn masiv pe dimensiunile dormitorului tau si primeste o oferta personalizata de la atelierul Artizan Lemn.",
  path: "/paturi-din-lemn-masiv",
  image: "/images/produse/pat-bogdan/imagine-01-ansamblu.webp",
  keywords: [
    "paturi din lemn masiv",
    "pat lemn la comanda",
    "mobilier dormitor lemn",
    "mobilier premium la comanda",
  ],
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Acasa", path: "/" },
  { name: "Paturi din lemn masiv", path: "/paturi-din-lemn-masiv" },
]);

const benefits = [
  "Structuri stabile pentru utilizare zilnica si durabilitate in timp.",
  "Dimensiuni adaptate pe camera si tipul de saltea.",
  "Finisaje premium potrivite cu amenajarea dormitorului.",
  "Poti porni de la un model existent sau de la o idee proprie.",
];

export default async function PaturiDinLemnMasivPage() {
  const products = await listCatalogProducts();
  const beds = products.filter((item) => item.category === "paturi");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Landing Search - Paturi"
        title="Paturi din lemn masiv realizate la comanda"
        description="Executam paturi premium din lemn masiv, pe dimensiuni reale si cu finisaje adaptate stilului dormitorului tau."
        image="/images/produse/pat-bogdan/imagine-01-ansamblu.webp"
      />

      <SectionWrapper className="border-b border-sand-300/70" containerClassName="space-y-6">
        <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Paturi din lemn masiv" }]} />
        <h2 className="text-5xl">Avantaje pentru paturi la comanda</h2>
        <ul className="grid gap-2 text-sm text-wood-700 md:grid-cols-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="rounded-xl border border-sand-300/80 bg-white px-4 py-3">
              {benefit}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <PrimaryButtonLink
            href="/comanda-mobilier#formular-comanda"
            data-track-event="cta_click"
            data-track-label="Solicita oferta"
            data-track-location="landing_paturi"
          >
            Solicita oferta
          </PrimaryButtonLink>
          <SecondaryButtonLink
            href="/comanda-mobilier#formular-comanda"
            data-track-event="cta_click"
            data-track-label="Trimite dimensiunile tale"
            data-track-location="landing_paturi"
          >
            Trimite dimensiunile tale
          </SecondaryButtonLink>
        </div>
        <QuickContactActions trackingLocation="landing_paturi" />
      </SectionWrapper>

      <SectionWrapper containerClassName="space-y-8">
        <div className="space-y-2">
          <p className="editorial-kicker">Exemple de paturi</p>
          <h2 className="text-5xl">Modele realizate in atelier</h2>
        </div>
        <ProductGrid products={beds} />
      </SectionWrapper>
    </>
  );
}
