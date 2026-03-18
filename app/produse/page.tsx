import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/empty-state";
import { PageIntro } from "@/components/ui/page-intro";
import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { FilterBar } from "@/components/products/filter-bar";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { categories } from "@/data/categories";
import { products as localProducts } from "@/data/products";
import { listCatalogProducts } from "@/lib/catalog/products-repository";
import { createPageMetadata } from "@/lib/site";

type ProdusePageProps = {
  searchParams: Promise<{
    categorie?: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Produse si piese realizate in atelier",
  description:
    "Descopera selectia Artizan Lemn de piese premium din lemn masiv, create la comanda si adaptabile fiecarui proiect.",
  path: "/produse",
  image: localProducts[0]?.featuredImage,
});

export default async function ProdusePage({ searchParams }: ProdusePageProps) {
  const products = await listCatalogProducts();
  const params = await searchParams;
  const requestedCategory = params.categorie;
  const hasValidCategory = categories.some(
    (category) => category.slug === requestedCategory,
  );
  const activeCategory = hasValidCategory ? requestedCategory! : "toate";

  const filteredProducts =
    activeCategory === "toate"
      ? products
      : products.filter((product) => product.category === activeCategory);

  return (
    <>
      <SectionWrapper
        className="border-b border-sand-300/70"
        containerClassName="space-y-8"
      >
        <PageIntro
          eyebrow="Portofoliu de atelier"
          title="Produse si piese realizate in atelier"
          description="Descopera o selectie de modele si lucrari care reflecta stilul, materialele si atentia noastra pentru detaliu. Fiecare piesa poate fi adaptata in functie de spatiu, preferinte si proiect."
        />
        <p className="text-sm text-wood-700">
          Catalog real din atelier: {products.length} piese organizate in{" "}
          {categories.length} categorii.
        </p>
        <FilterBar categories={categories} activeCategory={activeCategory} />
      </SectionWrapper>

      <SectionWrapper containerClassName="space-y-10">
        {filteredProducts.length ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <EmptyState
            title="Nu am gasit produse in aceasta categorie"
            description="Selecteaza o alta categorie sau trimite-ne direct ideea ta pentru un proiect personalizat."
            actionHref="/comanda-mobilier"
            actionLabel="Trimite cererea ta"
          />
        )}
      </SectionWrapper>

      <SectionWrapper tone="muted">
        <div className="luxury-card border-wood-900/15 bg-wood-950 p-8 text-sand-50 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sand-100">
            Proiect personalizat
          </p>
          <h2 className="mt-3 text-4xl text-sand-50 md:text-5xl">
            Ai o idee de piesa care nu apare aici?
          </h2>
          <p className="mt-4 max-w-3xl text-sm text-sand-100/90 md:text-base">
            Portofoliul este orientativ. Putem dezvolta orice directie in functie
            de spatiul tau si de nivelul de detaliu dorit.
          </p>
          <PrimaryButtonLink href="/comanda-mobilier" className="mt-7">
            Solicita oferta
          </PrimaryButtonLink>
        </div>
      </SectionWrapper>
    </>
  );
}
