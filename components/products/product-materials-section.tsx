import type { CatalogProduct } from "@/types/catalog";

type ProductMaterialsSectionProps = {
  product: CatalogProduct;
};

export function ProductMaterialsSection({ product }: ProductMaterialsSectionProps) {
  return (
    <section className="section-space border-y border-sand-300/65 bg-sand-100/45">
      <div className="mx-auto grid w-full max-w-[1220px] gap-6 px-6 md:px-10 lg:grid-cols-3">
        <article className="luxury-card p-6">
          <h2 className="text-3xl text-wood-900">Materiale si finisaje</h2>
          <p className="product-body mt-3 text-sm">
            Selectia finala se stabileste impreuna, dupa stilul interiorului si
            nivelul de utilizare al piesei.
          </p>
        </article>

        <article className="luxury-card p-6">
          <h3 className="text-3xl text-wood-900">Esente de lemn</h3>
          <ul className="product-body mt-3 list-disc space-y-2 pl-5 text-sm">
            {product.woodTypes.map((woodType) => (
              <li key={woodType}>{woodType}</li>
            ))}
          </ul>
        </article>

        <article className="luxury-card p-6">
          <h3 className="text-3xl text-wood-900">Finisaje disponibile</h3>
          <ul className="product-body mt-3 list-disc space-y-2 pl-5 text-sm">
            {product.finishes.map((finish) => (
              <li key={finish}>{finish}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
