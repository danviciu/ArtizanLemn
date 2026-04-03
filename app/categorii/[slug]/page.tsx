import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
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

  return createPageMetadata({
    title: `${category.name} din lemn masiv la comanda`,
    description: `${category.description} Vezi piese reale din atelier, detalii de executie si variante de personalizare.`,
    path: `/categorii/${category.slug}`,
    image: category.image,
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

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionJsonLd} />
      <SectionWrapper
        className="border-b border-sand-300/70"
        containerClassName="space-y-8"
      >
        <PageIntro
          eyebrow="Categorie de produs"
          title={`${category.name} din lemn masiv`}
          description={category.description}
        />
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
        </div>
      </SectionWrapper>
    </>
  );
}
