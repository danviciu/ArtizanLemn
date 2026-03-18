"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { SearchInput } from "@/components/admin/search-input";
import { StatusBadge, orderStatusOptions } from "@/components/admin/status-badge";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin";

type OrdersManagementProps = {
  initialOrders: AdminOrder[];
};

export function OrdersManagement({ initialOrders }: OrdersManagementProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<"toate" | AdminOrderStatus>("toate");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const statusMatch = activeStatus === "toate" || order.status === activeStatus;
      const searchMatch =
        !term ||
        order.client.toLowerCase().includes(term) ||
        order.proiect.toLowerCase().includes(term);

      return statusMatch && searchMatch;
    });
  }, [activeStatus, orders, search]);

  const tabOptions = useMemo(
    () => [
      { value: "toate", label: "Toate", count: orders.length },
      ...orderStatusOptions.map((status) => ({
        value: status,
        label: status.replaceAll("_", " "),
        count: orders.filter((item) => item.status === status).length,
      })),
    ],
    [orders],
  );

  function updateStatus(id: string, status: AdminOrderStatus) {
    setOrders((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  }

  const columns: DataTableColumn<AdminOrder>[] = [
    {
      key: "client",
      header: "Client",
      render: (item) => <p className="font-medium text-wood-900">{item.client}</p>,
    },
    {
      key: "proiect",
      header: "Proiect",
      render: (item) => <p>{item.proiect}</p>,
    },
    {
      key: "pret",
      header: "Pret agreat",
      render: (item) => <p>{item.pretAgreat}</p>,
    },
    {
      key: "termen",
      header: "Termen",
      render: (item) => <p className="text-xs text-wood-700">{item.termen}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge variant="order" value={item.status} />,
    },
    {
      key: "actiuni",
      header: "Actiuni",
      render: (item) => (
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={`/admin/comenzi/${item.id}`}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Vezi detalii
          </Link>
          <button
            type="button"
            onClick={() => updateStatus(item.id, "in_executie")}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Marcheaza in executie
          </button>
          <button
            type="button"
            onClick={() => updateStatus(item.id, "livrata")}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Marcheaza livrata
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
          placeholder="Cauta dupa client sau proiect"
        />
        <FilterTabs
          options={tabOptions}
          activeValue={activeStatus}
          onChange={(value) => setActiveStatus(value as "toate" | AdminOrderStatus)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(item) => item.id}
        emptyState={
          <EmptyState
            title="Nu exista comenzi in acest status"
            description="Schimba filtrul sau termenul de cautare pentru a vedea rezultate."
          />
        }
      />
    </div>
  );
}
