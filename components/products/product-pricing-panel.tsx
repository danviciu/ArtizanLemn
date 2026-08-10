import Link from "next/link";
import type { CatalogProduct } from "@/types/catalog";

type ProductPricingPanelProps = {
  product: CatalogProduct;
};

export function ProductPricingPanel({ product }: ProductPricingPanelProps) {
  return (
    <aside className="luxury-card border-wood-900/15 bg-sand-50/90 p-6 text-wood-900 md:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-wood-700/80">
        Oferta personalizata
      </p>

      <p className="mt-3 text-3xl font-semibold leading-tight text-wood-950 md:text-4xl">
        Configuram fiecare piesa dupa proiect
      </p>

      <p className="mt-2 text-sm text-wood-700/85">
        Trimite-ne dimensiunile, esenta dorita si cateva detalii despre spatiu.
        Revenim cu o oferta adaptata modelului {product.title}.
      </p>

      <Link
        href={`/comanda-mobilier#formular-comanda`}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl border border-wood-900 bg-wood-900 px-5 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800"
        data-track-event="cta_click"
        data-track-label="Solicita oferta"
        data-track-location="product_offer_panel"
      >
        Solicita oferta personalizata
      </Link>

      <Link
        href="/contact"
        className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-wood-900/20 bg-white px-5 text-sm font-semibold text-wood-800 transition-colors hover:bg-sand-100"
      >
        Discuta cu atelierul
      </Link>
    </aside>
  );
}
