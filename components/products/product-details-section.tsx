import type { CatalogProduct } from "@/types/catalog";

type ProductDetailsSectionProps = {
  product: CatalogProduct;
};

export function ProductDetailsSection({ product }: ProductDetailsSectionProps) {
  const descriptionParagraphs = product.fullDescription
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="section-space">
      <div className="mx-auto grid w-full max-w-[1220px] gap-6 px-6 md:px-10 lg:grid-cols-3">
        <article className="luxury-card p-7">
          <h2 className="text-4xl text-wood-900">Prezentare</h2>
          <div className="product-body mt-4 space-y-3 text-sm">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <article className="luxury-card p-7">
          <h2 className="text-4xl text-wood-900">Detalii si executie</h2>
          <p className="product-body mt-4 text-sm">
            In atelier tratam fiecare piesa ca proiect custom: verificam
            proportiile, rezistenta structurii, alinierea imbinarilor si calitatea
            suprafetelor inainte de livrare. Ajustarile finale se fac in functie
            de contextul real de montaj.
          </p>
        </article>

        <article className="luxury-card p-7">
          <h2 className="text-4xl text-wood-900">Potrivit pentru</h2>
          <ul className="product-body mt-4 list-disc space-y-2 pl-5 text-sm">
            {product.suitableFor.map((target) => (
              <li key={target}>{target}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
