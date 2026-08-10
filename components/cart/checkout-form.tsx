"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { formatRon } from "@/data/product-pricing";
import type {
  CheckoutDeliveryMethod,
  CheckoutPaymentMethod,
  CheckoutCreateOrderPayload,
} from "@/types/shop";

const fieldClassName =
  "w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";

type SuccessState = {
  orderNumber: string;
  orderId: string;
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, isReady, subtotalFixed, hasOnRequestItems, clearCart } = useCart();

  const [deliveryMethod, setDeliveryMethod] =
    useState<CheckoutDeliveryMethod>("curier");
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("transfer_bancar");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);

  const canSubmit = isReady && items.length > 0 && !isSubmitting;
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const acceptTerms = formData.get("acceptTerms") === "on";

    const payload: CheckoutCreateOrderPayload = {
      customerName: String(formData.get("customerName") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      county: String(formData.get("county") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
      deliveryMethod,
      paymentMethod,
      acceptTerms,
      items: items.map((item) => ({
        slug: item.slug,
        quantity: item.quantity,
        sizeOptionId: item.sizeOptionId,
      })),
    };

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as
        | {
            success?: boolean;
            message?: string;
            orderNumber?: string;
            orderId?: string;
          }
        | null;

      if (!response.ok || !body?.success || !body.orderNumber || !body.orderId) {
        setErrorMessage(
          body?.message ??
            "Comanda nu a putut fi trimisa momentan. Te rugam sa incerci din nou.",
        );
        return;
      }

      clearCart();
      setSuccessState({ orderNumber: body.orderNumber, orderId: body.orderId });
      form.reset();
      setDeliveryMethod("curier");
      setPaymentMethod("transfer_bancar");
    } catch {
      setErrorMessage(
        "Comanda nu a putut fi trimisa momentan. Te rugam sa incerci din nou.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isReady) {
    return (
      <section className="section-space">
        <div className="mx-auto w-full max-w-[1220px] px-6 md:px-10">
          <p className="text-sm text-wood-700">Se incarca datele cosului...</p>
        </div>
      </section>
    );
  }

  if (successState) {
    return (
      <section className="section-space">
        <div className="mx-auto w-full max-w-[1220px] px-6 md:px-10">
          <div className="luxury-card space-y-5 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-wood-700">
              Comanda trimisa
            </p>
            <h1 className="text-5xl">Multumim! Comanda a fost inregistrata.</h1>
            <p className="text-sm text-wood-700">
              Numar comanda: <strong>{successState.orderNumber}</strong>. Revenim catre
              tine pentru confirmare telefonica si detalii de livrare.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/produse"
                className="inline-flex h-11 items-center justify-center rounded-full border border-wood-900 bg-wood-900 px-6 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800"
              >
                Continua cumparaturile
              </Link>
              <button
                type="button"
                onClick={() => router.push("/cos")}
                className="inline-flex h-11 items-center justify-center rounded-full border border-sand-300 bg-white px-6 text-sm font-semibold text-wood-900 transition-colors hover:bg-sand-100"
              >
                Inapoi la cos
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="section-space">
        <div className="mx-auto w-full max-w-[1220px] px-6 md:px-10">
          <div className="luxury-card space-y-4 p-8">
            <h1 className="text-5xl">Nu ai produse in cos</h1>
            <p className="text-sm text-wood-700">
              Adauga mai intai produse in cos, apoi poti finaliza comanda.
            </p>
            <Link
              href="/cos"
              className="inline-flex h-11 items-center justify-center rounded-full border border-wood-900 bg-wood-900 px-6 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800"
            >
              Vezi cosul
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-space">
      <div className="mx-auto grid w-full max-w-[1220px] gap-6 px-6 md:px-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="luxury-card space-y-6 p-6 md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-wood-700">
              Finalizare comanda
            </p>
            <h1 className="mt-2 text-5xl">Date pentru livrare si contact</h1>
          </div>

          {errorMessage ? (
            <p className="rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-wood-900">Nume complet</span>
              <input className={fieldClassName} name="customerName" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-wood-900">Telefon</span>
              <input className={fieldClassName} name="phone" type="tel" minLength={8} required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-wood-900">Email</span>
              <input className={fieldClassName} name="email" type="email" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-wood-900">Judet</span>
              <input className={fieldClassName} name="county" required />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-wood-900">Localitate</span>
              <input className={fieldClassName} name="city" required />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-wood-900">Adresa livrare</span>
              <input className={fieldClassName} name="address" required />
            </label>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-wood-900">Metoda livrare</legend>
            <label className="flex items-center gap-2 text-sm text-wood-800">
              <input
                type="radio"
                name="deliveryMethod"
                value="curier"
                checked={deliveryMethod === "curier"}
                onChange={() => setDeliveryMethod("curier")}
              />
              Curier
            </label>
            <label className="flex items-center gap-2 text-sm text-wood-800">
              <input
                type="radio"
                name="deliveryMethod"
                value="ridicare_personala"
                checked={deliveryMethod === "ridicare_personala"}
                onChange={() => setDeliveryMethod("ridicare_personala")}
              />
              Ridicare personala
            </label>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-wood-900">Metoda plata</legend>
            <label className="flex items-center gap-2 text-sm text-wood-800">
              <input
                type="radio"
                name="paymentMethod"
                value="transfer_bancar"
                checked={paymentMethod === "transfer_bancar"}
                onChange={() => setPaymentMethod("transfer_bancar")}
              />
              Transfer bancar
            </label>
            <label className="flex items-center gap-2 text-sm text-wood-800">
              <input
                type="radio"
                name="paymentMethod"
                value="ramburs"
                checked={paymentMethod === "ramburs"}
                onChange={() => setPaymentMethod("ramburs")}
              />
              Numerar / ramburs
            </label>
          </fieldset>

          <label className="space-y-2">
            <span className="text-sm font-medium text-wood-900">Observatii</span>
            <textarea
              className={`${fieldClassName} min-h-28 resize-y`}
              name="notes"
              placeholder="Detalii suplimentare despre livrare sau configuratie."
            />
          </label>

          <label className="flex items-start gap-2 text-sm text-wood-800">
            <input type="checkbox" name="acceptTerms" required className="mt-1" />
            Confirm ca datele introduse sunt corecte si sunt de acord sa fiu contactat
            pentru confirmarea comenzii.
          </label>

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-wood-900 bg-wood-900 px-6 text-sm font-semibold text-sand-50 transition-colors hover:bg-wood-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Trimitem comanda..." : "Finalizeaza comanda"}
          </button>
        </form>

        <aside className="luxury-card h-fit space-y-4 p-6 md:p-7">
          <h2 className="text-4xl">Recapitulare</h2>
          <p className="text-sm text-wood-700">
            {itemCount} produse in comanda
          </p>

          <div className="space-y-3">
            {items.map((item) => {
              const lineTotal =
                item.unitPrice !== null ? item.unitPrice * item.quantity : null;

              return (
                <article
                  key={item.lineId}
                  className="grid grid-cols-[64px_1fr] gap-3 rounded-xl border border-sand-300/80 bg-white p-3"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={item.featuredImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-wood-900">{item.title}</p>
                    {item.sizeLabel ? (
                      <p className="text-xs text-wood-700">Dimensiune: {item.sizeLabel}</p>
                    ) : null}
                    <p className="text-xs text-wood-700">Cantitate: {item.quantity}</p>
                    <p className="text-xs font-semibold text-wood-900">
                      {lineTotal !== null ? `${formatRon(lineTotal)} RON` : "La cerere"}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="rounded-xl border border-sand-300/80 bg-sand-100/70 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-wood-700">Subtotal produse cu pret fix</span>
              <span className="font-semibold text-wood-900">
                {formatRon(subtotalFixed)} RON
              </span>
            </div>
            {hasOnRequestItems ? (
              <p className="mt-2 text-xs text-wood-700">
                Exista produse &quot;La cerere&quot;. Pretul final se confirma dupa analiza.
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
