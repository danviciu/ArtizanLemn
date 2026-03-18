"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StatusBadge, inquiryStatusOptions } from "@/components/admin/status-badge";
import type { AdminInquiry, AdminInquiryStatus } from "@/types/admin";

type InquiryDetailCardProps = {
  inquiry: AdminInquiry;
  onStatusChange?: (status: AdminInquiryStatus) => void;
  onTransformToOrder?: () => void;
};

export function InquiryDetailCard({
  inquiry,
  onStatusChange,
  onTransformToOrder,
}: InquiryDetailCardProps) {
  return (
    <article className="luxury-card space-y-7 p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-4xl">{inquiry.titluProiect}</h2>
          <p className="mt-1 text-sm text-wood-700">
            {inquiry.nume} · {inquiry.telefon} · {inquiry.email}
          </p>
          <p className="mt-1 text-xs text-wood-700">
            Inregistrata la {new Date(inquiry.createdAt).toLocaleString("ro-RO")}
          </p>
        </div>
        <StatusBadge variant="inquiry" value={inquiry.status} />
      </div>

      <section className="space-y-2">
        <h3 className="text-3xl">Descriere detaliata</h3>
        <p className="text-sm text-wood-700">{inquiry.descriereDetaliata}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="luxury-card p-4">
          <h4 className="text-2xl">Date transmise</h4>
          <ul className="mt-3 space-y-2 text-sm text-wood-700">
            <li>
              <strong className="text-wood-900">Dimensiuni:</strong>{" "}
              {inquiry.dimensiuniAproximative || "Nespecificat"}
            </li>
            <li>
              <strong className="text-wood-900">Spatiu:</strong>{" "}
              {inquiry.spatiulFolosire || "Nespecificat"}
            </li>
            <li>
              <strong className="text-wood-900">Buget:</strong>{" "}
              {inquiry.bugetOrientativ || "Nespecificat"}
            </li>
            <li>
              <strong className="text-wood-900">Termen dorit:</strong>{" "}
              {inquiry.termenDorit || "Nespecificat"}
            </li>
            <li>
              <strong className="text-wood-900">Observatii:</strong>{" "}
              {inquiry.observatiiSuplimentare || "Nespecificat"}
            </li>
          </ul>
        </div>

        <div className="luxury-card p-4">
          <h4 className="text-2xl">Note interne</h4>
          <textarea
            rows={5}
            defaultValue={inquiry.adminNotes || ""}
            placeholder="Adauga observatii interne pentru echipa..."
            className="mt-3 w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm text-wood-900 outline-none focus:border-wood-700"
          />
          <p className="mt-2 text-xs text-wood-700">
            Placeholder local. Persistenta notelor va fi adaugata ulterior.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-3xl">Atasamente</h3>
        {inquiry.attachments.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {inquiry.attachments.map((attachment) => (
              <article
                key={attachment.id}
                className="overflow-hidden rounded-2xl border border-sand-300 bg-white"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={attachment.url}
                    alt={attachment.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="truncate px-3 py-2 text-xs text-wood-700">{attachment.name}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-wood-700">Nu exista atasamente pentru aceasta cerere.</p>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-3xl">Actiuni status</h3>
        <div className="flex flex-wrap gap-2">
          {inquiryStatusOptions.map((status) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={status === inquiry.status ? "primary" : "secondary"}
              onClick={() => onStatusChange?.(status)}
            >
              {status.replaceAll("_", " ")}
            </Button>
          ))}
          <Button type="button" size="sm" variant="ghost" onClick={onTransformToOrder}>
            Transforma in comanda
          </Button>
        </div>
      </section>
    </article>
  );
}
