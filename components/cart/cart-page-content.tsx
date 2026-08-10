"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatRon } from "@/data/product-pricing";

function CartTotals({
  subtotalFixed,
  hasOnRequestItems,
}: {
  subtotalFixed: number;
  hasOnRequestItems: boolean;
}) {
  return (
    <article className="luxury-card h-fit space-y-4 p-6 md:p-7">
      <h2 className="text-4xl">Sumar comanda</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-wood-700">Subtotal produse cu pret fix</span>
          <span className="font-semibold text-wood-900">
            {formatRon(subtotalFixed)} RON
          </span>
        </div>
      </div>

      {hasOnRequestItems ? (
        <p className="rounded-xl border border-sand-300/80 bg-sand-100/70 px-4 py-3 text-xs text-wood-800">
          Cosul include produse cu pret &quot;La cerere&quot;. Pretul final pentru acestea va
          fi confirmat dupa discutia tehnica.
        </p>
      ) : null}

      <div className="space-y-2 pt-2">
        <Link
          href="/finalizare-comanda"
          className="inline-flex h-12 w-full items-center justify-center rounded-full border border-wood-900 bg-wood-900 px-6 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800"
        >
          Finalizare comanda
        </Link>
        <Link
          href="/produse"
          className="inline-flex h-11 w-full items-center justify-center rounded-full border border-sand-300 bg-white px-6 text-sm font-semibold text-wood-900 transition-colors hover:bg-sand-100"
        >
          Continua cumparaturile
        </Link>
      </div>
    </article>
  );
}

export function CartPageContent() {
  const {
    items,
    isReady,
    subtotalFixed,
    hasOnRequestItems,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (!isReady) {
    return (
      <section className="section-space">
        <div className="mx-auto w-full max-w-[1220px] px-6 md:px-10">
          <p className="text-sm text-wood-700">Se incarca cosul...</p>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="section-space">
        <div className="mx-auto w-full max-w-[1220px] px-6 md:px-10">
          <div className="luxury-card space-y-4 p-8">
            <h2 className="text-4xl">Cosul este gol</h2>
            <p className="text-sm text-wood-700">
              Adauga produse din catalog, apoi continua catre finalizarea comenzii.
            </p>
            <Link
              href="/produse"
              className="inline-flex h-11 items-center justify-center rounded-full border border-wood-900 bg-wood-900 px-6 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800"
            >
              Vezi produsele
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-space">
      <div className="mx-auto grid w-full max-w-[1220px] gap-6 px-6 md:px-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => {
            const lineTotal =
              item.unitPrice !== null ? item.unitPrice * item.quantity : null;

            return (
              <article
                key={item.lineId}
                className="luxury-card grid gap-4 p-4 sm:grid-cols-[150px_1fr]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-sand-300/70 bg-sand-100/60">
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 150px"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-3xl text-wood-900">{item.title}</h3>
                      {item.sizeLabel ? (
                        <p className="text-xs text-wood-700">Dimensiune: {item.sizeLabel}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.lineId)}
                      className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
                    >
                      Elimina
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-full border border-sand-300 bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                        className="h-9 w-9 text-sm text-wood-900 transition-colors hover:bg-sand-100"
                        aria-label={`Scade cantitatea pentru ${item.title}`}
                      >
                        -
                      </button>
                      <span className="min-w-10 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                        className="h-9 w-9 text-sm text-wood-900 transition-colors hover:bg-sand-100"
                        aria-label={`Creste cantitatea pentru ${item.title}`}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-wood-700">
                        {item.unitPrice !== null
                          ? `${formatRon(item.unitPrice)} RON / buc`
                          : "Pret: La cerere"}
                      </p>
                      <p className="text-lg font-semibold text-wood-900">
                        {lineTotal !== null ? `${formatRon(lineTotal)} RON` : "La cerere"}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex h-10 items-center justify-center rounded-full border border-sand-300 bg-white px-5 text-sm font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Goleste cosul
          </button>
        </div>

        <CartTotals subtotalFixed={subtotalFixed} hasOnRequestItems={hasOnRequestItems} />
      </div>
    </section>
  );
}
