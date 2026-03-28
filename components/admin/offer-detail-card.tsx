"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge, offerStatusOptions } from "@/components/admin/status-badge";
import type { AdminOffer, AdminOfferStatus } from "@/types/admin";

type OfferDetailCardProps = {
  offer: AdminOffer;
  onStatusChange?: (status: AdminOfferStatus) => void;
};

type OfferShareResponse = {
  success: boolean;
  message?: string;
  recipientEmail?: string;
  whatsappUrl?: string;
  deliveryMode?: "api" | "link";
  pdf?: {
    downloadUrl?: string;
  };
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function OfferDetailCard({ offer, onStatusChange }: OfferDetailCardProps) {
  const [recipientEmail, setRecipientEmail] = useState(offer.clientEmail ?? "");
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [latestPdfLink, setLatestPdfLink] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isPreparingWhatsApp, setIsPreparingWhatsApp] = useState(false);

  useEffect(() => {
    setRecipientEmail(offer.clientEmail ?? "");
  }, [offer.clientEmail]);

  async function sendOffer(channel: "email" | "whatsapp", email?: string) {
    const response = await fetch(`/api/admin/offers/${offer.id}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel,
        recipientEmail: email ?? "",
      }),
    });

    let result: OfferShareResponse | null = null;
    try {
      result = (await response.json()) as OfferShareResponse;
    } catch {
      result = null;
    }

    if (!response.ok || !result?.success) {
      throw new Error(
        result?.message ||
          "Actiunea nu a putut fi finalizata. Verifica datele si incearca din nou.",
      );
    }

    if (result.pdf?.downloadUrl) {
      setLatestPdfLink(result.pdf.downloadUrl);
    }

    return result;
  }

  async function handleSendEmail() {
    const trimmedEmail = recipientEmail.trim();
    if (!trimmedEmail) {
      setShareError("Completeaza emailul clientului pentru a trimite oferta.");
      setShareMessage(null);
      return;
    }

    setIsSendingEmail(true);
    setShareError(null);
    setShareMessage(null);

    try {
      const result = await sendOffer("email", trimmedEmail);
      setShareMessage(
        result.message || `Oferta a fost trimisa pe email la ${result.recipientEmail}.`,
      );
    } catch (error) {
      setShareError(
        error instanceof Error
          ? error.message
          : "Emailul nu a putut fi trimis momentan.",
      );
    } finally {
      setIsSendingEmail(false);
    }
  }

  async function handleSendWhatsApp() {
    setIsPreparingWhatsApp(true);
    setShareError(null);
    setShareMessage(null);

    try {
      const result = await sendOffer("whatsapp");
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setShareMessage(result.message || "Oferta a fost trimisa pe WhatsApp.");
    } catch (error) {
      setShareError(
        error instanceof Error
          ? error.message
          : "Mesajul WhatsApp nu a putut fi pregatit momentan.",
      );
    } finally {
      setIsPreparingWhatsApp(false);
    }
  }

  return (
    <article className="luxury-card space-y-6 p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-4xl">{offer.offerNumber}</h2>
          <p className="mt-1 text-sm text-wood-700">{offer.client}</p>
          <p className="mt-1 text-sm text-wood-700">{offer.clientPhone || "Telefon necompletat"}</p>
          <p className="mt-1 text-sm text-wood-700">{offer.clientEmail || "Email necompletat"}</p>
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
          <h3 className="text-2xl">Trimitere catre client</h3>
          <p className="mt-2 text-sm text-wood-700">
            PDF-ul este generat automat in format profesional la fiecare trimitere.
          </p>

          <div className="mt-3 space-y-1.5">
            <label className="text-sm font-medium text-wood-900" htmlFor="client-email-offer">
              Email destinatar
            </label>
            <input
              id="client-email-offer"
              type="email"
              value={recipientEmail}
              onChange={(event) => setRecipientEmail(event.target.value)}
              placeholder="client@exemplu.ro"
              className="h-11 w-full rounded-xl border border-sand-300 bg-white px-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/api/admin/offers/${offer.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full border border-sand-300 bg-white px-5 text-sm font-medium text-wood-900 transition-colors hover:bg-sand-100"
            >
              Descarca PDF
            </a>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isSendingEmail}
              onClick={handleSendEmail}
            >
              {isSendingEmail ? "Trimitem email..." : "Trimite email (PDF atasat)"}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isPreparingWhatsApp}
              onClick={handleSendWhatsApp}
            >
              {isPreparingWhatsApp
                ? "Pregatim WhatsApp..."
                : "Trimite pe WhatsApp (link PDF)"}
            </Button>
          </div>

          {latestPdfLink ? (
            <p className="mt-3 text-xs text-wood-700">
              Link PDF securizat curent:{" "}
              <a
                href={latestPdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wood-900 underline"
              >
                deschide PDF
              </a>
            </p>
          ) : null}
        </article>
      </div>

      {shareError ? (
        <p className="rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-700">
          {shareError}
        </p>
      ) : null}

      {shareMessage ? (
        <p className="rounded-xl border border-moss-400/45 bg-moss-400/20 px-4 py-3 text-sm text-wood-900">
          {shareMessage}
        </p>
      ) : null}

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
        </div>
      </section>
    </article>
  );
}
