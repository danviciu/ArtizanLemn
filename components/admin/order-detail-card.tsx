"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge, orderStatusOptions } from "@/components/admin/status-badge";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin";

type OrderDetailCardProps = {
  order: AdminOrder;
  onStatusChange?: (status: AdminOrderStatus) => void;
};

export function OrderDetailCard({ order, onStatusChange }: OrderDetailCardProps) {
  return (
    <article className="luxury-card space-y-6 p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-4xl">{order.proiect}</h2>
          <p className="mt-1 text-sm text-wood-700">{order.client}</p>
          <p className="mt-1 text-xs text-wood-700">
            Creata la {new Date(order.createdAt).toLocaleDateString("ro-RO")}
          </p>
        </div>
        <StatusBadge variant="order" value={order.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="luxury-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-700">Pret agreat</p>
          <p className="mt-1 text-2xl">{order.pretAgreat}</p>
        </article>
        <article className="luxury-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-700">Termen</p>
          <p className="mt-1 text-2xl">{order.termen}</p>
        </article>
        <article className="luxury-card p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-wood-700">Ultima actualizare</p>
          <p className="mt-1 text-2xl">{new Date(order.updatedAt).toLocaleDateString("ro-RO")}</p>
        </article>
      </div>

      <section className="space-y-2">
        <h3 className="text-3xl">Note interne</h3>
        <textarea
          rows={5}
          defaultValue={order.notes || ""}
          placeholder="Note interne despre executie, livrare, discutii client..."
          className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-wood-900 outline-none focus:border-wood-700"
        />
        <p className="text-xs text-wood-700">
          Placeholder local. Persistenta notelor va fi implementata in etapa backend.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-3xl">Actualizare status</h3>
        <div className="flex flex-wrap gap-2">
          {orderStatusOptions.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={status === order.status ? "primary" : "secondary"}
              onClick={() => onStatusChange?.(status)}
            >
              {status.replaceAll("_", " ")}
            </Button>
          ))}
        </div>
      </section>
    </article>
  );
}
