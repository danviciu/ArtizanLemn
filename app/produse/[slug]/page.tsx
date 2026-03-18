import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCTA } from "@/components/products/product-cta";
import { ProductDetailsSection } from "@/components/products/product-details-section";
import { ProductHero } from "@/components/products/product-hero";
import { ProductMaterialsSection } from "@/components/products/product-materials-section";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import {
  getCatalogProductBySlug,
  listCatalogProducts,
} from "@/lib/catalog/products-repository";
import { createPageMetadata } from "@/lib/site";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return createPageMetadata({
      title: "Produs",
      description: "Pagina produs Artizan Lemn.",
      path: "/produse",
    });
  }

  return createPageMetadata({
    title: product.title,
    description: product.shortDescription,
    path: `/produse/${product.slug}`,
    image: product.featuredImage,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await listCatalogProducts();
  const product = products.find((item) => item.slug === slug) ?? null;

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (candidate) =>
        candidate.category === product.category && candidate.slug !== product.slug,
    )
    .slice(0, 3);

  return (
    <>
      <ProductHero product={product} />
      <ProductDetailsSection product={product} />
      <ProductMaterialsSection product={product} />

      <SectionWrapper containerClassName="space-y-8">
        <div className="space-y-3">
          <p className="product-eyebrow">Galerie imagini</p>
          <h2 className="product-title text-5xl">Detalii vizuale ale modelului</h2>
          <p className="product-body max-w-3xl text-sm md:text-base">
            Imaginile de mai jos sunt orientative si fac parte dintr-un model
            reprezentativ. Fiecare proiect poate fi adaptat dupa spatiu si stil.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.gallery.map((image, index) => (
            <a
              key={`${product.id}-${image}`}
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-sand-300/75 bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image}
                  alt={`${product.title} - imagine ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </a>
          ))}
        </div>
        <p className="product-body-soft text-xs">
          Fiecare imagine poate fi deschisa in tab nou, la rezolutie mare.
        </p>
      </SectionWrapper>

      {relatedProducts.length ? (
        <SectionWrapper tone="muted" containerClassName="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="product-eyebrow">Piese similare</p>
              <h2 className="product-title text-5xl">In aceeasi directie de proiect</h2>
            </div>
            <Link
              href={`/produse?categorie=${product.category}`}
              className="text-sm font-semibold text-wood-900 transition-colors hover:text-moss-600"
            >
              Vezi toate piesele din categorie
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </SectionWrapper>
      ) : null}

      <ProductCTA product={product} />
    </>
  );
}
