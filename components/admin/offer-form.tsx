"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import type { AdminOfferPayload } from "@/lib/validation/adminOfferSchema";
import type { AdminOffer } from "@/types/admin";
import { Button } from "@/components/ui/button";

const inputClassName =
  "h-11 w-full rounded-xl border border-sand-300 bg-white px-3 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";
const textareaClassName =
  "w-full rounded-xl border border-sand-300 bg-white px-3 py-2.5 text-sm text-wood-900 outline-none transition-colors placeholder:text-wood-700/65 focus:border-wood-700";

const offerStatuses = ["draft", "trimisa", "acceptata", "respinsa", "expirata"] as const;

type OfferFormProps = {
  initialData?: AdminOffer | null;
  mode?: "create" | "edit";
};

type OfferMutationResponse = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  offer?: { id: string };
};

function parseDecimal(rawValue: string) {
  const normalized = rawValue.replace(",", ".").trim();
  if (!normalized) {
    return 0;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseInteger(rawValue: string) {
  const normalized = rawValue.trim();
  if (!normalized) {
    return 0;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function resolveCategoryDefault(rawValue?: string | null) {
  if (!rawValue) {
    return "";
  }

  const found = categories.find((category) => category.slug === rawValue);
  return found ? found.slug : "";
}

export function OfferForm({ initialData, mode = "create" }: OfferFormProps) {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [subtotalValue, setSubtotalValue] = useState(
    initialData ? initialData.subtotal.toString() : "0",
  );
  const [discountValue, setDiscountValue] = useState(
    initialData ? initialData.discountValue.toString() : "0",
  );
  const [tvaValue, setTvaValue] = useState(initialData ? initialData.tvaValue.toString() : "0");

  const calculatedTotal = useMemo(() => {
    const subtotal = parseDecimal(subtotalValue);
    const discount = parseDecimal(discountValue);
    const tva = parseDecimal(tvaValue);

    if (!Number.isFinite(subtotal) || !Number.isFinite(discount) || !Number.isFinite(tva)) {
      return 0;
    }

    return Math.max(0, Math.round((subtotal - discount + tva) * 100) / 100);
  }, [discountValue, subtotalValue, tvaValue]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setIsSuccess(false);
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);

    const parsedSubtotal = parseDecimal(subtotalValue);
    const parsedDiscount = parseDecimal(discountValue);
    const parsedTva = parseDecimal(tvaValue);
    const parsedVersion = parseInteger(String(formData.get("version") ?? "1"));
    const parsedExecutionDays = parseInteger(
      String(formData.get("estimatedExecutionDays") ?? "0"),
    );
    const parsedWarrantyMonths = parseInteger(String(formData.get("warrantyMonths") ?? "0"));

    if (
      !Number.isFinite(parsedSubtotal) ||
      !Number.isFinite(parsedDiscount) ||
      !Number.isFinite(parsedTva) ||
      !Number.isFinite(parsedVersion) ||
      !Number.isFinite(parsedExecutionDays) ||
      !Number.isFinite(parsedWarrantyMonths)
    ) {
      setErrorMessage("Valorile numerice sunt invalide. Verifica campurile de pret si termen.");
      setIsSaving(false);
      return;
    }

    const payload: AdminOfferPayload = {
      inquiryId: String(formData.get("inquiryId") ?? ""),
      offerNumber: String(formData.get("offerNumber") ?? ""),
      version: parsedVersion,
      client: String(formData.get("client") ?? ""),
      clientPhone: String(formData.get("clientPhone") ?? ""),
      clientEmail: String(formData.get("clientEmail") ?? ""),
      projectTitle: String(formData.get("projectTitle") ?? ""),
      categorySlug: String(formData.get("categorySlug") ?? ""),
      currency: String(formData.get("currency") ?? "RON") as AdminOfferPayload["currency"],
      subtotal: parsedSubtotal,
      discountValue: parsedDiscount,
      tvaValue: parsedTva,
      validUntil: String(formData.get("validUntil") ?? ""),
      estimatedExecutionDays: parsedExecutionDays,
      status: String(formData.get("status") ?? "draft") as AdminOfferPayload["status"],
      paymentTerms: String(formData.get("paymentTerms") ?? ""),
      warrantyMonths: parsedWarrantyMonths,
      internalNotes: String(formData.get("internalNotes") ?? ""),
    };

    const endpoint =
      mode === "create" ? "/api/admin/offers" : `/api/admin/offers/${initialData?.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result: OfferMutationResponse | null = null;
      try {
        result = (await response.json()) as OfferMutationResponse;
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        const fieldMessage = result?.fieldErrors
          ? Object.values(result.fieldErrors).flat()[0]
          : null;

        setErrorMessage(
          fieldMessage ||
            result?.message ||
            "Oferta nu a putut fi salvata momentan. Te rugam sa incerci din nou.",
        );
        return;
      }

      setIsSuccess(true);

      if (mode === "create" && result.offer?.id) {
        router.replace(`/admin/oferte/${result.offer.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setErrorMessage(
        "Oferta nu a putut fi salvata momentan. Verifica conexiunea si incearca din nou.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-card space-y-6 p-6 md:p-7">
      <div className="space-y-1.5">
        <h2 className="text-4xl">{mode === "create" ? "Adauga oferta" : "Editeaza oferta"}</h2>
        <p className="text-sm text-wood-700">
          {mode === "create"
            ? "Creeaza oferta comerciala pe baza cererii clientului. Daca lasi numarul ofertei gol, se genereaza automat."
            : "Actualizeaza datele ofertei si salveaza modificarile direct in Supabase."}
        </p>
      </div>

      {errorMessage ? (
        <p className="rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">ID cerere (optional)</span>
          <input
            defaultValue={initialData?.inquiryId ?? ""}
            name="inquiryId"
            className={inputClassName}
            placeholder="UUID cerere din /admin/cereri"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Numar oferta</span>
          <input
            defaultValue={initialData?.offerNumber ?? ""}
            name="offerNumber"
            className={inputClassName}
            placeholder="Ex: AL-2026-0008"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Client</span>
          <input
            defaultValue={initialData?.client ?? ""}
            name="client"
            required
            className={inputClassName}
            placeholder="Ex: Andrei Popescu"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Telefon client</span>
          <input
            defaultValue={initialData?.clientPhone ?? ""}
            name="clientPhone"
            required
            className={inputClassName}
            placeholder="Ex: +40 7xx xxx xxx"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Email client</span>
          <input
            type="email"
            defaultValue={initialData?.clientEmail ?? ""}
            name="clientEmail"
            className={inputClassName}
            placeholder="Ex: client@exemplu.ro"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Titlu proiect</span>
          <input
            defaultValue={initialData?.projectTitle ?? ""}
            name="projectTitle"
            required
            className={inputClassName}
            placeholder="Ex: Masa dining stejar + banca"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Categorie</span>
          <select
            name="categorySlug"
            defaultValue={resolveCategoryDefault(initialData?.categorySlug)}
            className={inputClassName}
          >
            <option value="">Neselectata</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Status</span>
          <select
            name="status"
            defaultValue={initialData?.status ?? "draft"}
            className={inputClassName}
          >
            {offerStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Versiune</span>
          <input
            type="number"
            min={1}
            max={99}
            step={1}
            defaultValue={initialData?.version ?? 1}
            name="version"
            required
            className={inputClassName}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Moneda</span>
          <select
            name="currency"
            defaultValue={initialData?.currency ?? "RON"}
            className={inputClassName}
          >
            <option value="RON">RON</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Subtotal</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={subtotalValue}
            onChange={(event) => setSubtotalValue(event.target.value)}
            className={inputClassName}
            placeholder="0.00"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Discount</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={discountValue}
            onChange={(event) => setDiscountValue(event.target.value)}
            className={inputClassName}
            placeholder="0.00"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">TVA</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={tvaValue}
            onChange={(event) => setTvaValue(event.target.value)}
            className={inputClassName}
            placeholder="0.00"
          />
        </label>
      </div>

      <div className="rounded-xl border border-moss-400/35 bg-moss-400/15 px-4 py-3">
        <p className="text-sm text-wood-900">
          Total calculat automat: <strong>{calculatedTotal.toLocaleString("ro-RO")}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Valabila pana la</span>
          <input
            type="date"
            name="validUntil"
            defaultValue={initialData?.validUntil ?? ""}
            required
            className={inputClassName}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Termen executie (zile)</span>
          <input
            type="number"
            min={0}
            step={1}
            name="estimatedExecutionDays"
            defaultValue={initialData?.estimatedExecutionDays ?? 0}
            className={inputClassName}
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium text-wood-900">Garantie (luni)</span>
          <input
            type="number"
            min={0}
            max={120}
            step={1}
            name="warrantyMonths"
            defaultValue={initialData?.warrantyMonths ?? 24}
            className={inputClassName}
          />
        </label>
      </div>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Conditii de plata</span>
        <textarea
          name="paymentTerms"
          rows={3}
          defaultValue={initialData?.paymentTerms ?? ""}
          className={textareaClassName}
          placeholder="Ex: 40% avans, 40% in atelier, 20% la montaj"
        />
      </label>

      <label className="space-y-1.5">
        <span className="text-sm font-medium text-wood-900">Note interne</span>
        <textarea
          name="internalNotes"
          rows={4}
          defaultValue={initialData?.internalNotes ?? ""}
          className={textareaClassName}
          placeholder="Observatii interne despre revizie, negociere sau clarificari."
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Salvam..." : mode === "create" ? "Creeaza oferta" : "Salveaza modificari"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/oferte")}>
          Inapoi la lista
        </Button>
      </div>

      {isSuccess ? (
        <p className="rounded-xl border border-moss-400/40 bg-moss-400/15 px-4 py-3 text-sm text-wood-900">
          {mode === "create"
            ? "Oferta a fost creata cu succes."
            : "Modificarile ofertei au fost salvate cu succes."}
        </p>
      ) : null}
    </form>
  );
}
