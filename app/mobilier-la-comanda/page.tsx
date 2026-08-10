import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Comanda mobilier din lemn masiv pe proiect",
  description:
    "Solicita o oferta pentru mobilier din lemn masiv realizat pe proiect: raspuns rapid, configurare pe dimensiuni reale si finisaje premium.",
  path: "/mobilier-la-comanda",
  image: "/images/hero/hero-main-table.png",
  keywords: [
    "comanda mobilier lemn masiv",
    "mobilier din lemn masiv",
    "mobilier premium",
    "proiecte personalizate",
  ],
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Acasa", path: "/" },
  { name: "Mobilier la comanda", path: "/mobilier-la-comanda" },
]);

const benefits = [
  "Raspuns in 1-2 zile lucratoare pentru cererile complete.",
  "Executie pe dimensiunile reale ale spatiului tau.",
  "Lemn masiv selectat si finisaje premium.",
  "Dialog direct cu atelierul, de la brief la solutia finala.",
];

const focusCategories = [
  { label: "Paturi", href: "/categorii/paturi" },
  { label: "Mese", href: "/categorii/mese" },
  { label: "Biblioteci", href: "/categorii/biblioteci" },
  { label: "Dulapuri de baie", href: "/categorii/dulapuri-de-baie" },
  { label: "Riflaje", href: "/categorii/riflaje" },
  { label: "Piese personalizate", href: "/categorii/piese-personalizate" },
];

export default async function MobilierLaComandaPage() {
  const products = await listCatalogProducts();
  const featured = products.filter((item) => item.isFeatured).slice(0, 6);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <PageHero
        eyebrow="Landing Search"
        title="Mobilier la comanda din lemn masiv, realizat premium"
        description="Artizan Lemn transforma idei, schite si inspiratie in piese personalizate, adaptate pe dimensiunile reale ale spatiului tau."
        image="/images/hero/hero-main-table.png"
      />

      <SectionWrapper className="border-b border-sand-300/70" containerClassName="space-y-6">
        <Breadcrumbs items={[{ label: "Acasa", href: "/" }, { label: "Mobilier la comanda" }]} />
        <h2 className="text-5xl">Ce obtii cand lucrezi cu Artizan Lemn</h2>
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
            data-track-location="landing_mobilier"
          >
            Solicita oferta
          </PrimaryButtonLink>
          <SecondaryButtonLink
            href="/galerie"
            data-track-event="cta_click"
            data-track-label="Vezi lucrarile"
            data-track-location="landing_mobilier"
          >
            Vezi lucrarile
          </SecondaryButtonLink>
        </div>
        <QuickContactActions trackingLocation="landing_mobilier" />
      </SectionWrapper>

      <SectionWrapper containerClassName="space-y-8">
        <h2 className="text-5xl">Categorii populare pentru proiecte la comanda</h2>
        <div className="flex flex-wrap gap-2">
          {focusCategories.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs font-medium text-wood-800 transition-colors hover:border-wood-900/30 hover:bg-sand-100"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper tone="muted" containerClassName="space-y-8">
        <div className="space-y-2">
          <p className="editorial-kicker">Exemple reale</p>
          <h2 className="text-5xl">Lucrari reprezentative din atelier</h2>
        </div>
        <ProductGrid products={featured.length ? featured : products.slice(0, 6)} />
      </SectionWrapper>
    </>
  );
}
