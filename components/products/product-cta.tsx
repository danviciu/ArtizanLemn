import { PrimaryButtonLink } from "@/components/ui/primary-button";
import { SecondaryButtonLink } from "@/components/ui/secondary-button";
import { WhatsAppInlineLink } from "@/components/ui/whatsapp-inline-link";
import type { CatalogProduct } from "@/types/catalog";

type ProductCTAProps = {
  product: CatalogProduct;
};

export function ProductCTA({ product }: ProductCTAProps) {
  return (
    <section className="section-space">
      <div className="mx-auto w-full max-w-[1220px] px-6 md:px-10">
        <div className="luxury-card border-wood-900/20 bg-wood-950 px-7 py-10 text-sand-50 md:px-10 md:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sand-100">
            Proiect personalizat
          </p>
          <h2 className="mt-3 text-4xl text-sand-50 md:text-5xl">
            Solicita o piesa similara
          </h2>
          <p className="mt-4 max-w-3xl text-sm text-sand-100/90 md:text-base">
            Modelul {product.title} este un punct de pornire. Putem ajusta
            dimensiunile, compartimentarea, esenta si finisajul astfel incat piesa
            finala sa raspunda exact spatiului tau.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <PrimaryButtonLink href="/comanda-mobilier" size="lg">
              Trimite ideea ta
            </PrimaryButtonLink>
            <SecondaryButtonLink
              href="/contact"
              size="lg"
              className="border-sand-50/70 bg-transparent text-sand-50 hover:bg-sand-50/10"
            >
              Discuta proiectul cu noi
            </SecondaryButtonLink>
            <WhatsAppInlineLink
              label="Discuta pe WhatsApp"
              message={`Buna! Ma intereseaza o piesa similara cu ${product.title}. Putem discuta detaliile proiectului?`}
              className="border-sand-50/45 bg-sand-50/10 text-sand-50 hover:bg-sand-50/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
