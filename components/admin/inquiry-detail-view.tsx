"use client";

import { useState } from "react";
import { InquiryDetailCard } from "@/components/admin/inquiry-detail-card";
import type { AdminInquiry, AdminInquiryStatus } from "@/types/admin";

type InquiryDetailViewProps = {
  inquiry: AdminInquiry;
};

export function InquiryDetailView({ inquiry }: InquiryDetailViewProps) {
  const [currentInquiry, setCurrentInquiry] = useState(inquiry);
  const [message, setMessage] = useState("");

  function handleStatusChange(status: AdminInquiryStatus) {
    setCurrentInquiry((prev) => ({ ...prev, status }));
    setMessage(`Status actualizat local: ${status.replaceAll("_", " ")}.`);
  }

  function handleTransformToOrder() {
    setCurrentInquiry((prev) => ({ ...prev, status: "transformata_in_comanda" }));
    setMessage("Cererea a fost marcata local ca transformata in comanda.");
  }

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-xl border border-moss-400/45 bg-moss-400/20 px-4 py-3 text-sm text-wood-900">
          {message}
        </p>
      ) : null}

      <InquiryDetailCard
        inquiry={currentInquiry}
        onStatusChange={handleStatusChange}
        onTransformToOrder={handleTransformToOrder}
      />
    </div>
  );
}
