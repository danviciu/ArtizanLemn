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
  title: "Mese din lemn la comanda",
  description:
    "Mese din lemn masiv realizate la comanda pentru dining sau lucru, adaptate pe dimensiunile spatiului tau.",
  path: "/mese-din-lemn",
  image: "/images/produse/masa-coman/imagine-01-ansamblu.webp",
  keywords: [
    "mese din lemn",
    "masa lemn masiv la comanda",
    "masa dining din lemn",
    "mobilier premium la comanda",
  ],
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Acasa", path: "/" },
  { name: "Mese din lemn", path: "/mese-din-lemn" },
]);

const benefits = [
  "Dimensiuni optimizate pentru numarul real de locuri.",
  "Blat si structura configurate pentru utilizare zilnica.",
  "Finisaje premium adaptate stilului interiorului.",
  "Posibilitate de extindere si personalizare dupa proiect.",
];

export default async function MeseDinLemnPage() {
  const products = await listCatalogProducts();
  const tables = products.filter((item) => item.category === "mese");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Landing Search - Mese"
        title="Mese din lemn masiv realizate la comanda"
        description="Realizam mese premium din lemn pentru dining si lucru, cu proportii corecte, finisaje elegante si executie personalizata."
        image="/images/produse/masa-coman/imagine-01-ansamblu.webp"
      />

      <SectionWrapper className="border-b border-sand-300/70" containerClassName="space-y-6">
        <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Mese din lemn" }]} />
        <h2 className="text-5xl">Avantaje pentru mese la comanda</h2>
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
            data-track-location="landing_mese"
          >
            Solicita oferta
          </PrimaryButtonLink>
          <SecondaryButtonLink
            href="/comanda-mobilier#formular-comanda"
            data-track-event="cta_click"
            data-track-label="Trimite dimensiunile tale"
            data-track-location="landing_mese"
          >
            Trimite dimensiunile tale
          </SecondaryButtonLink>
        </div>
        <QuickContactActions trackingLocation="landing_mese" />
      </SectionWrapper>

      <SectionWrapper containerClassName="space-y-8">
        <div className="space-y-2">
          <p className="editorial-kicker">Exemple de mese</p>
          <h2 className="text-5xl">Modele realizate in atelier</h2>
        </div>
        <ProductGrid products={tables} />
      </SectionWrapper>
    </>
  );
}
