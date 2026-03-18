"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchInput } from "@/components/admin/search-input";
import { StatusBadge, inquiryStatusOptions } from "@/components/admin/status-badge";
import type { AdminInquiry, AdminInquiryStatus } from "@/types/admin";

type InquiriesManagementProps = {
  initialInquiries: AdminInquiry[];
};

export function InquiriesManagement({ initialInquiries }: InquiriesManagementProps) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<"toate" | AdminInquiryStatus>("toate");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      const statusMatch = activeStatus === "toate" || inquiry.status === activeStatus;
      const searchMatch =
        !term ||
        inquiry.nume.toLowerCase().includes(term) ||
        inquiry.titluProiect.toLowerCase().includes(term) ||
        inquiry.email.toLowerCase().includes(term) ||
        inquiry.telefon.toLowerCase().includes(term);

      return statusMatch && searchMatch;
    });
  }, [activeStatus, inquiries, search]);

  const tabOptions = useMemo(() => {
    const options = [
      { value: "toate", label: "Toate", count: inquiries.length },
      ...inquiryStatusOptions.map((status) => ({
        value: status,
        label: status.replaceAll("_", " "),
        count: inquiries.filter((item) => item.status === status).length,
      })),
    ];

    return options;
  }, [inquiries]);

  function updateStatus(id: string, status: AdminInquiryStatus) {
    setInquiries((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  const columns: DataTableColumn<AdminInquiry>[] = [
    {
      key: "nume",
      header: "Nume",
      render: (item) => <p className="font-medium text-wood-900">{item.nume}</p>,
    },
    {
      key: "proiect",
      header: "Titlu proiect",
      render: (item) => <p className="text-wood-800">{item.titluProiect}</p>,
    },
    {
      key: "contact",
      header: "Contact",
      render: (item) => (
        <div className="space-y-1">
          <p>{item.telefon}</p>
          <p className="text-xs text-wood-700">{item.email}</p>
        </div>
      ),
    },
    {
      key: "data",
      header: "Data",
      render: (item) => (
        <p className="text-xs text-wood-700">
          {new Date(item.createdAt).toLocaleDateString("ro-RO")}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge variant="inquiry" value={item.status} />,
    },
    {
      key: "actiuni",
      header: "Actiuni",
      render: (item) => (
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={`/admin/cereri/${item.id}`}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Vezi detalii
          </Link>
          <button
            type="button"
            onClick={() => updateStatus(item.id, "in_analiza")}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Marcheaza in analiza
          </button>
          <button
            type="button"
            onClick={() => updateStatus(item.id, "oferta_trimisa")}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Marcheaza oferta trimisa
          </button>
          <button
            type="button"
            onClick={() => updateStatus(item.id, "transformata_in_comanda")}
            className="rounded-full border border-wood-900/25 px-3 py-1 text-xs font-medium text-wood-900 transition-colors hover:bg-wood-900/10"
          >
            Transforma in comanda
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cauta dupa nume, proiect, telefon sau email"
        />
        <FilterTabs
          options={tabOptions}
          activeValue={activeStatus}
          onChange={(value) => setActiveStatus(value as "toate" | AdminInquiryStatus)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(item) => item.id}
        emptyState={
          <EmptyState
            title="Nu exista cereri pentru filtrul selectat"
            description="Incearca alt status sau elimina termenul de cautare."
          />
        }
      />
    </div>
  );
}
