import { ProductCard } from "@/components/products/product-card";
import { categoryMap } from "@/data/categories";
import type { CatalogProduct } from "@/types/catalog";

type ProductGridProps = {
  products: CatalogProduct[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          category={categoryMap[product.category]}
        />
      ))}
    </div>
  );
}
