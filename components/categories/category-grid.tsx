import { CategoryCard } from "@/components/categories/category-card";
import type { CatalogCategory } from "@/types/catalog";

type CategoryGridProps = {
  categories: CatalogCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
