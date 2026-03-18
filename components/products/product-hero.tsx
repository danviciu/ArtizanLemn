import { categoryMap } from "@/data/categories";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import type { CatalogProduct } from "@/types/catalog";

type ProductHeroProps = {
  product: CatalogProduct;
};

export function ProductHero({ product }: ProductHeroProps) {
  const category = categoryMap[product.category];

  return (
    <section className="relative isolate overflow-hidden border-b border-sand-300/70 bg-gradient-to-r from-sand-100/65 via-sand-50 to-sand-50 py-16 md:py-20">
      <div className="mx-auto grid w-full max-w-[1220px] gap-8 px-6 md:px-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductImageGallery
          images={product.gallery.length ? product.gallery : [product.featuredImage]}
          title={product.title}
          priority
        />

        <div className="space-y-5">
          <p className="product-eyebrow">{category?.name ?? "Piesa personalizata"}</p>
          <h1 className="product-title text-5xl md:text-6xl">{product.title}</h1>
          <p className="product-body text-base md:text-lg">{product.shortDescription}</p>
          <p className="product-body-soft text-sm">
            Acesta este un model reprezentativ. Dimensiunile, esenta lemnului si
            finisajele se pot adapta in functie de proiectul tau.
          </p>
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="product-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
