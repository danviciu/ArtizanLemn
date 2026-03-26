"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge, offerStatusOptions } from "@/components/admin/status-badge";
import { createWhatsAppLinkToPhone } from "@/lib/site-config";
import type { AdminOffer, AdminOfferStatus } from "@/types/admin";

type OfferDetailCardProps = {
  offer: AdminOffer;
  onStatusChange?: (status: AdminOfferStatus) => void;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function OfferDetailCard({ offer, onStatusChange }: OfferDetailCardProps) {
  const whatsappMessage = [
    `Buna, ${offer.client}!`,
    `Iti trimitem oferta ${offer.offerNumber} pentru proiectul "${offer.projectTitle}".`,
    `Total oferta: ${formatCurrency(offer.total, offer.currency)}.`,
    `Valabilitate: ${offer.validUntil}.`,
    "Daca esti de acord, revenim cu contractul si pasii pentru avans.",
  ].join("\n");

  const whatsappHref = createWhatsAppLinkToPhone(offer.clientPhone, whatsappMessage);

  return (
    <article className="luxury-card space-y-6 p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-4xl">{offer.offerNumber}</h2>
          <p className="mt-1 text-sm text-wood-700">{offer.client}</p>
          <p className="mt-1 text-sm text-wood-700">{offer.clientPhone || "Telefon necompletat"}</p>
          <p className="mt-1 text-sm text-wood-700">{offer.projectTitle}</p>
          <p className="mt-1 text-xs text-wood-700">
            Versiune v{offer.version} - actualizata{" "}
            {new Date(offer.updatedAt).toLocaleDateString("ro-RO")}
          </p>
        </div>
        <StatusBadge variant="offer" value={offer.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="luxury-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-700">Subtotal</p>
          <p className="mt-1 text-2xl">{formatCurrency(offer.subtotal, offer.currency)}</p>
        </article>
        <article className="luxury-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-700">Discount</p>
          <p className="mt-1 text-2xl">{formatCurrency(offer.discountValue, offer.currency)}</p>
        </article>
        <article className="luxury-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-700">TVA</p>
          <p className="mt-1 text-2xl">{formatCurrency(offer.tvaValue, offer.currency)}</p>
        </article>
        <article className="luxury-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-700">Total</p>
          <p className="mt-1 text-2xl">{formatCurrency(offer.total, offer.currency)}</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="luxury-card p-4">
          <h3 className="text-2xl">Conditii comerciale</h3>
          <ul className="mt-3 space-y-2 text-sm text-wood-700">
            <li>
              <strong className="text-wood-900">Valabila pana:</strong> {offer.validUntil}
            </li>
            <li>
              <strong className="text-wood-900">Termen estimat executie:</strong>{" "}
              {offer.estimatedExecutionDays
                ? `${offer.estimatedExecutionDays} zile`
                : "Nespecificat"}
            </li>
            <li>
              <strong className="text-wood-900">Conditii plata:</strong>{" "}
              {offer.paymentTerms || "Nespecificat"}
            </li>
            <li>
              <strong className="text-wood-900">Garantie:</strong>{" "}
              {offer.warrantyMonths ? `${offer.warrantyMonths} luni` : "Nespecificat"}
            </li>
          </ul>
        </article>

        <article className="luxury-card p-4">
          <h3 className="text-2xl">Note interne</h3>
          <textarea
            rows={6}
            defaultValue={offer.internalNotes || ""}
            placeholder="Adauga note interne pentru revizii, negociere sau livrare."
            className="mt-3 w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-wood-900 outline-none focus:border-wood-700"
          />
          <p className="mt-2 text-xs text-wood-700">
            Placeholder local. Persistenta notelor va fi adaugata in etapa backend.
          </p>
        </article>
      </div>

      <section className="space-y-3">
        <h3 className="text-3xl">Actualizare status</h3>
        <div className="flex flex-wrap gap-2">
          {offerStatusOptions.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={status === offer.status ? "primary" : "secondary"}
              onClick={() => onStatusChange?.(status)}
            >
              {status}
            </Button>
          ))}
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#1f7a59]/40 bg-[#1f7a59]/10 px-5 text-sm font-medium text-[#164d39] transition-colors hover:bg-[#1f7a59]/18"
            >
              Trimite pe WhatsApp
            </a>
          ) : null}
        </div>
      </section>
    </article>
  );
}
