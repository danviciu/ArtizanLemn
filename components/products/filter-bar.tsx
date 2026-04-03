import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CatalogCategory } from "@/types/catalog";

type FilterBarProps = {
  categories: CatalogCategory[];
  activeCategory: string;
};

export function FilterBar({ categories, activeCategory }: FilterBarProps) {
  const allFilters = [{ slug: "toate", name: "Toate" }, ...categories];

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-2">
        {allFilters.map((item) => {
          const isActive = item.slug === activeCategory;
          const href =
            item.slug === "toate" ? "/produse" : `/categorii/${item.slug}`;

          return (
            <Link
              key={item.slug}
              href={href}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-wood-900 bg-wood-900 text-sand-50"
                  : "border-sand-300 bg-white text-wood-700 hover:border-sand-400 hover:bg-sand-100",
              )}
            >
              {"productCount" in item && typeof item.productCount === "number"
                ? `${item.name} (${item.productCount})`
                : item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
