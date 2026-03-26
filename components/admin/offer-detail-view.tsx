"use client";

import { useState } from "react";
import { OfferDetailCard } from "@/components/admin/offer-detail-card";
import type { AdminOffer, AdminOfferStatus } from "@/types/admin";

type OfferDetailViewProps = {
  offer: AdminOffer;
};

export function OfferDetailView({ offer }: OfferDetailViewProps) {
  const [currentOffer, setCurrentOffer] = useState(offer);
  const [message, setMessage] = useState("");

  function handleStatusChange(status: AdminOfferStatus) {
    setCurrentOffer((prev) => ({
      ...prev,
      status,
      updatedAt: new Date().toISOString(),
    }));
    setMessage(`Status oferta actualizat local: ${status}.`);
  }

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-xl border border-moss-400/45 bg-moss-400/20 px-4 py-3 text-sm text-wood-900">
          {message}
        </p>
      ) : null}

      <OfferDetailCard offer={currentOffer} onStatusChange={handleStatusChange} />
    </div>
  );
}
