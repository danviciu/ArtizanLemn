"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchInput } from "@/components/admin/search-input";
import { StatusBadge, offerStatusOptions } from "@/components/admin/status-badge";
import type { AdminOffer, AdminOfferStatus } from "@/types/admin";

type OffersManagementProps = {
  initialOffers: AdminOffer[];
};

type OfferShareResponse = {
  success: boolean;
  message?: string;
  recipientEmail?: string;
  whatsappUrl?: string;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function OffersManagement({ initialOffers }: OffersManagementProps) {
  const [offers, setOffers] = useState(initialOffers);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<"toate" | AdminOfferStatus>("toate");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<{
    id: string;
    type: "email" | "whatsapp";
  } | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return offers.filter((offer) => {
      const statusMatch = activeStatus === "toate" || offer.status === activeStatus;
      const searchMatch =
        !term ||
        offer.offerNumber.toLowerCase().includes(term) ||
        offer.client.toLowerCase().includes(term) ||
        offer.clientPhone.toLowerCase().includes(term) ||
        (offer.clientEmail ?? "").toLowerCase().includes(term) ||
        offer.projectTitle.toLowerCase().includes(term);

      return statusMatch && searchMatch;
    });
  }, [activeStatus, offers, search]);

  const tabOptions = useMemo(
    () => [
      { value: "toate", label: "Toate", count: offers.length },
      ...offerStatusOptions.map((status) => ({
        value: status,
        label: status,
        count: offers.filter((item) => item.status === status).length,
      })),
    ],
    [offers],
  );

  function updateStatus(id: string, status: AdminOfferStatus) {
    setOffers((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  async function shareOffer(
    offerId: string,
    payload: { channel: "email" | "whatsapp"; recipientEmail?: string },
  ) {
    const response = await fetch(`/api/admin/offers/${offerId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
          "Trimiterea ofertei a esuat. Incearca din nou in cateva secunde.",
      );
    }

    return result;
  }

  async function handleSendEmail(item: AdminOffer) {
    const defaultEmail = item.clientEmail?.trim() ?? "";
    const destinationEmail =
      defaultEmail ||
      window.prompt(
        `Introdu emailul pentru oferta ${item.offerNumber}:`,
        defaultEmail,
      )?.trim() ||
      "";

    if (!destinationEmail) {
      setFeedbackError("Completeaza emailul clientului in oferta pentru trimitere.");
      setFeedbackMessage(null);
      return;
    }

    setActiveAction({ id: item.id, type: "email" });
    setFeedbackError(null);
    setFeedbackMessage(null);

    try {
      const result = await shareOffer(item.id, {
        channel: "email",
        recipientEmail: destinationEmail,
      });

      setFeedbackMessage(
        result.message || `Oferta ${item.offerNumber} a fost trimisa pe email.`,
      );

      setOffers((current) =>
        current.map((offer) =>
          offer.id === item.id
            ? {
                ...offer,
                clientEmail: destinationEmail,
              }
            : offer,
        ),
      );
    } catch (error) {
      setFeedbackError(
        error instanceof Error ? error.message : "Emailul nu a putut fi trimis.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  async function handleSendWhatsApp(item: AdminOffer) {
    setActiveAction({ id: item.id, type: "whatsapp" });
    setFeedbackError(null);
    setFeedbackMessage(null);

    try {
      const result = await shareOffer(item.id, {
        channel: "whatsapp",
      });

      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setFeedbackMessage(
        result.message || `Mesajul WhatsApp pentru oferta ${item.offerNumber} a fost pregatit.`,
      );
    } catch (error) {
      setFeedbackError(
        error instanceof Error
          ? error.message
          : "WhatsApp nu a putut fi pregatit momentan.",
      );
    } finally {
      setActiveAction(null);
    }
  }

  const columns: DataTableColumn<AdminOffer>[] = [
    {
      key: "numar",
      header: "Oferta",
      render: (item) => (
        <div>
          <p className="font-medium text-wood-900">{item.offerNumber}</p>
          <p className="text-xs text-wood-700">v{item.version}</p>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client / proiect",
      render: (item) => (
        <div>
          <p className="font-medium text-wood-900">{item.client}</p>
          <p className="text-xs text-wood-700">{item.clientPhone}</p>
          <p className="text-xs text-wood-700">{item.clientEmail || "Email necompletat"}</p>
          <p className="text-wood-700">{item.projectTitle}</p>
        </div>
      ),
    },
    {
      key: "valoare",
      header: "Total",
      render: (item) => <p>{formatCurrency(item.total, item.currency)}</p>,
    },
    {
      key: "valabilitate",
      header: "Valabila pana",
      render: (item) => <p className="text-xs text-wood-700">{item.validUntil}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge variant="offer" value={item.status} />,
    },
    {
      key: "actiuni",
      header: "Actiuni",
      render: (item) => {
        const isEmailSending =
          activeAction?.id === item.id && activeAction.type === "email";
        const isWhatsAppSending =
          activeAction?.id === item.id && activeAction.type === "whatsapp";

        return (
          <div className="flex flex-wrap gap-1.5">
            <Link
              href={`/admin/oferte/${item.id}`}
              className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
            >
              Vezi detalii
            </Link>
            <Link
              href={`/admin/oferte/${item.id}/editeaza`}
              className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
            >
              Editeaza
            </Link>
            <a
              href={`/api/admin/offers/${item.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
            >
              PDF
            </a>
            <button
              type="button"
              disabled={isEmailSending || isWhatsAppSending}
              onClick={() => handleSendEmail(item)}
              className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEmailSending ? "Trimitem email..." : "Trimite email"}
            </button>
            <button
              type="button"
              disabled={isEmailSending || isWhatsAppSending}
              onClick={() => handleSendWhatsApp(item)}
              className="rounded-full border border-[#1f7a59]/45 bg-[#1f7a59]/10 px-3 py-1 text-xs font-medium text-[#164d39] transition-colors hover:bg-[#1f7a59]/18 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isWhatsAppSending ? "Trimitem WhatsApp..." : "Trimite WhatsApp PDF"}
            </button>
            <button
              type="button"
              onClick={() => updateStatus(item.id, "trimisa")}
              className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
            >
              Marcheaza trimisa
            </button>
            <button
              type="button"
              onClick={() => updateStatus(item.id, "acceptata")}
              className="rounded-full border border-wood-900/30 px-3 py-1 text-xs font-medium text-wood-900 transition-colors hover:bg-wood-900/10"
            >
              Marcheaza acceptata
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
      {feedbackError ? (
        <p className="rounded-xl border border-red-300/70 bg-red-50 px-4 py-3 text-sm text-red-700">
          {feedbackError}
        </p>
      ) : null}

      {feedbackMessage ? (
        <p className="rounded-xl border border-moss-400/45 bg-moss-400/20 px-4 py-3 text-sm text-wood-900">
          {feedbackMessage}
        </p>
      ) : null}

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cauta dupa numar oferta, client, telefon sau proiect"
        />
        <FilterTabs
          options={tabOptions}
          activeValue={activeStatus}
          onChange={(value) => setActiveStatus(value as "toate" | AdminOfferStatus)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(item) => item.id}
        emptyState={
          <EmptyState
            title="Nu exista oferte pentru filtrul selectat"
            description="Incearca alt status sau elimina termenul de cautare."
          />
        }
      />
    </div>
  );
}
