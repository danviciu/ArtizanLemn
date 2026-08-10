import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { FilterBar } from "@/components/products/filter-bar";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { categories, categoryMap } from "@/data/categories";
import { listCatalogProducts } from "@/lib/catalog/products-repository";
import {
  createBreadcrumbJsonLd,
  createCategoryItemListJsonLd,
} from "@/lib/seo";
import { createPageMetadata } from "@/lib/site";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

type CategoryConversionContent = {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  benefits: string[];
};

const categoryConversionContent: Record<string, CategoryConversionContent> = {
  paturi: {
    metaTitle: "Paturi din lemn masiv la comanda",
    metaDescription:
      "Paturi din lemn masiv realizate la comanda, adaptate pe dimensiunea camerei si stilul dormitorului tau.",
    intro:
      "Realizam paturi din lemn masiv cu structura stabila, proportii echilibrate si finisaje premium, calibrate pe spatiul tau.",
    benefits: [
      "Configurare pe dimensiunile reale ale dormitorului",
      "Lemn masiv selectat in functie de utilizare",
      "Finisaje premium si detalii executate in atelier",
      "Dialog direct pentru ajustari si personalizare",
    ],
  },
  mese: {
    metaTitle: "Mese din lemn la comanda",
    metaDescription:
      "Mese din lemn masiv si blaturi la comanda pentru dining sau lucru, executate premium in atelierul Artizan Lemn.",
    intro:
      "Mesele din lemn masiv sunt realizate la comanda, cu proportii potrivite pentru dining, living sau zone de lucru intens.",
    benefits: [
      "Dimensiuni adaptate pe spatiul si numarul de utilizatori",
      "Esente si finisaje calibrate pe stilul interiorului",
      "Structura gandita pentru stabilitate si rezistenta",
      "Varianta personalizata pentru proiecte rezidentiale sau horeca",
    ],
  },
  biblioteci: {
    metaTitle: "Biblioteci din lemn la comanda",
    metaDescription:
      "Biblioteci si rafturi din lemn masiv la comanda, cu compartimentare eficienta si integrare premium in amenajare.",
    intro:
      "Bibliotecile din lemn sunt proiectate pentru organizare clara si integrare naturala in spatiul tau, fara compromis de calitate.",
    benefits: [
      "Compartimentare adaptata pe obiectele si volumele tale",
      "Configuratii pentru living, birou sau zone mixte",
      "Lemn masiv cu finisaj premium, usor de intretinut",
      "Montaj gandit pentru flux si ergonomie",
    ],
  },
  "dulapuri-de-baie": {
    metaTitle: "Dulapuri de baie din lemn la comanda",
    metaDescription:
      "Dulapuri de baie din lemn la comanda, tratate pentru umiditate si adaptate perfect pe cotele reale ale baii.",
    intro:
      "Dulapurile de baie sunt realizate pe comanda, cu tratamente pentru umiditate si optimizare eficienta a fiecarui centimetru util.",
    benefits: [
      "Executie pe cotele reale ale baii",
      "Materiale si protectii potrivite pentru umiditate",
      "Depozitare functionala, cu aspect premium",
      "Integrare eleganta in proiecte clasice sau moderne",
    ],
  },
  riflaje: {
    metaTitle: "Riflaje din lemn la comanda",
    metaDescription:
      "Riflaje din lemn la comanda pentru delimitare vizuala, accent arhitectural si atmosfera premium in interior.",
    intro:
      "Riflajele din lemn aduc ritm si profunzime in spatiu, fiind executate pe dimensiuni reale pentru proiecte rezidentiale sau comerciale.",
    benefits: [
      "Proportii adaptate pe inaltime si latime perete",
      "Executie premium pentru accent arhitectural clar",
      "Montaj curat si integrare in stilul interiorului",
      "Optiuni personalizate de esenta si finisaj",
    ],
  },
  "piese-personalizate": {
    metaTitle: "Piese personalizate din lemn la comanda",
    metaDescription:
      "Piese personalizate din lemn masiv realizate la comanda, pentru proiecte unicat si cerinte speciale de design.",
    intro:
      "Pentru proiectele care nu se incadreaza in modele standard, realizam piese personalizate din lemn masiv, discutate direct cu atelierul.",
    benefits: [
      "Concept unicat pornit de la ideea ta",
      "Consultare directa pentru fezabilitate si proportii",
      "Selectie premium de materiale si finisaje",
      "Executie orientata pe detaliu, cu validare pe etape",
    ],
  },
};

export async function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryMap[slug];

  if (!category) {
    return createPageMetadata({
      title: "Categorie produse",
      description: "Categoria nu a fost gasita in catalogul Artizan Lemn.",
      path: "/categorii",
    });
  }

  const categoryContent = categoryConversionContent[slug];

  return createPageMetadata({
    title: categoryContent?.metaTitle ?? `${category.name} din lemn masiv la comanda`,
    description:
      categoryContent?.metaDescription ??
      `${category.description} Vezi piese reale din atelier, detalii de executie si variante de personalizare.`,
    path: `/categorii/${category.slug}`,
    image: category.image,
    keywords: [
      "mobilier la comanda",
      "mobilier din lemn masiv",
      `${category.name.toLowerCase()} din lemn`,
      `${category.name.toLowerCase()} la comanda`,
      "proiecte personalizate din lemn",
    ],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categoryMap[slug];

  if (!category) {
    notFound();
  }

  const products = await listCatalogProducts();
  const categoryProducts = products.filter((product) => product.category === slug);
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: "Acasa", path: "/" },
    { name: "Categorii", path: "/categorii" },
    { name: category.name, path: `/categorii/${category.slug}` },
  ]);
  const collectionJsonLd = createCategoryItemListJsonLd({
    name: `${category.name} - piese realizate in atelier`,
    description: category.description,
    path: `/categorii/${category.slug}`,
    products: categoryProducts,
  });
  const categoryContent = categoryConversionContent[slug];
  const introText = categoryContent?.intro ?? category.description;
  const benefits = categoryContent?.benefits ?? [
    "Executie premium in atelier, pe dimensiuni reale.",
    "Materiale si finisaje selectate in functie de proiect.",
    "Dialog direct pentru adaptare si personalizare.",
  ];
  const breadcrumbItems = [
    { label: "Acasa", href: "/" },
    { label: "Categorii", href: "/categorii" },
    { label: category.name },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <SectionWrapper
        className="border-b border-sand-300/70"
        containerClassName="space-y-8"
      >
        <Breadcrumbs items={breadcrumbItems} />
        <PageIntro
          eyebrow="Categorie de produs"
          title={`${category.name} din lemn masiv`}
          description={introText}
        />
        <ul className="grid gap-2 text-sm text-wood-700 md:grid-cols-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="rounded-xl border border-sand-300/80 bg-white px-4 py-2">
              {benefit}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <PrimaryButtonLink href="/comanda-mobilier#formular-comanda">
            Solicita oferta
          </PrimaryButtonLink>
          <SecondaryButtonLink href="/comanda-mobilier#formular-comanda">
            Trimite dimensiunile tale
          </SecondaryButtonLink>
          <SecondaryButtonLink href="/contact">Contact</SecondaryButtonLink>
        </div>
        <p className="text-sm text-wood-700">
          {categoryProducts.length} piese active in aceasta categorie.
        </p>
        <FilterBar categories={categories} activeCategory={category.slug} />
      </SectionWrapper>

      <SectionWrapper containerClassName="space-y-10">
        {categoryProducts.length ? (
          <ProductGrid products={categoryProducts} />
        ) : (
          <EmptyState
            title="Categoria nu are produse publice momentan"
            description="Revino curand sau trimite-ne ideea ta pentru o piesa personalizata."
            actionHref="/comanda-mobilier"
            actionLabel="Solicita oferta"
          />
        )}
      </SectionWrapper>

      <SectionWrapper tone="muted">
        <div className="luxury-card border-wood-900/15 bg-wood-950 p-8 text-sand-50 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sand-100">
            Executie la comanda
          </p>
          <h2 className="mt-3 text-4xl text-sand-50 md:text-5xl">
            Nu ai gasit exact modelul dorit?
          </h2>
          <p className="mt-4 max-w-3xl text-sm text-sand-100/90 md:text-base">
            Fiecare piesa din aceasta categorie poate fi ajustata in functie de
            spatiu, finisaj si detalii tehnice. Lucram pe cotele reale ale
            proiectului tau.
          </p>
          <PrimaryButtonLink href="/comanda-mobilier" className="mt-7">
            Cere oferta personalizata
          </PrimaryButtonLink>
          <SecondaryButtonLink href="/contact" className="mt-3">
            Contact rapid
          </SecondaryButtonLink>
        </div>
      </SectionWrapper>
    </>
  );
}
