import Image from "next/image";
import Link from "next/link";
import type { CatalogCategory, CatalogProduct } from "@/types/catalog";

type ProductCardProps = {
  product: CatalogProduct;
  category?: CatalogCategory;
};

export function ProductCard({ product, category }: ProductCardProps) {
  return (
    <article className="group luxury-card h-full overflow-hidden">
      <Link href={`/produse/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.featuredImage}
            alt={`${product.title} - piesa realizata in atelier Artizan Lemn`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-4 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-wood-700">
          {category?.name ?? "Piesa personalizata"}
        </p>
        <h3 className="text-3xl">{product.title}</h3>
        <p className="text-sm text-wood-700">{product.shortDescription}</p>

        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-sand-300 bg-sand-100 px-3 py-1 text-xs font-medium text-wood-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/produse/${product.slug}`}
          className="inline-flex text-sm font-semibold text-wood-900 transition-colors hover:text-moss-600"
        >
          Descopera
        </Link>
      </div>
    </article>
  );
}
