import Image from "next/image";
import Link from "next/link";
import type { CatalogCategory } from "@/types/catalog";

type CategoryCardProps = {
  category: CatalogCategory;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const categoryHref = `/categorii/${category.slug}`;

  return (
    <article className="group luxury-card h-full overflow-hidden">
      <Link href={categoryHref} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image}
            alt={`${category.name} - categorie Artizan Lemn`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-3xl">{category.name}</h2>
          {typeof category.productCount === "number" ? (
            <span className="rounded-full border border-sand-300 bg-sand-100 px-2.5 py-1 text-xs font-medium text-wood-700">
              {category.productCount} piese
            </span>
          ) : null}
        </div>
        <p className="text-sm text-wood-700">{category.description}</p>
        <Link
          href={categoryHref}
          className="inline-flex text-sm font-semibold text-wood-900 transition-colors hover:text-moss-600"
        >
          Vezi produse
        </Link>
      </div>
    </article>
  );
}
