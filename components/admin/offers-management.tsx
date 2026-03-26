"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchInput } from "@/components/admin/search-input";
import { StatusBadge, offerStatusOptions } from "@/components/admin/status-badge";
import { createWhatsAppLinkToPhone } from "@/lib/site-config";
import type { AdminOffer, AdminOfferStatus } from "@/types/admin";

type OffersManagementProps = {
  initialOffers: AdminOffer[];
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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return offers.filter((offer) => {
      const statusMatch = activeStatus === "toate" || offer.status === activeStatus;
      const searchMatch =
        !term ||
        offer.offerNumber.toLowerCase().includes(term) ||
        offer.client.toLowerCase().includes(term) ||
        offer.clientPhone.toLowerCase().includes(term) ||
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
        const whatsappMessage = `Buna, ${item.client}! Iti trimitem oferta ${item.offerNumber} pentru "${item.projectTitle}". Total: ${formatCurrency(item.total, item.currency)}. Valabila pana la ${item.validUntil}.`;
        const whatsappHref = createWhatsAppLinkToPhone(item.clientPhone, whatsappMessage);

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
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#1f7a59]/45 bg-[#1f7a59]/10 px-3 py-1 text-xs font-medium text-[#164d39] transition-colors hover:bg-[#1f7a59]/18"
              >
                WhatsApp
              </a>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-5">
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
