"use client";

import { useState } from "react";
import { OrderDetailCard } from "@/components/admin/order-detail-card";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin";

type OrderDetailViewProps = {
  order: AdminOrder;
};

export function OrderDetailView({ order }: OrderDetailViewProps) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [message, setMessage] = useState("");

  function handleStatusChange(status: AdminOrderStatus) {
    setCurrentOrder((prev) => ({ ...prev, status }));
    setMessage(`Status comanda actualizat local: ${status.replaceAll("_", " ")}.`);
  }

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-xl border border-moss-400/45 bg-moss-400/20 px-4 py-3 text-sm text-wood-900">
          {message}
        </p>
      ) : null}
      <OrderDetailCard order={currentOrder} onStatusChange={handleStatusChange} />
    </div>
  );
}
