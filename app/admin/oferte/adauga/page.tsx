import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { OfferForm } from "@/components/admin/offer-form";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Adauga oferta",
  description: "Formular intern pentru creare oferta comerciala.",
  path: "/admin/oferte/adauga",
});

export default function AdminAdaugaOfertaPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/oferte"
        className="inline-flex items-center gap-1 text-sm text-wood-700 transition-colors hover:text-wood-950"
      >
        <ChevronLeft size={16} />
        Inapoi la oferte
      </Link>

      <AdminSectionHeading
        title="Adauga oferta"
        description="Completeaza datele comerciale de baza si genereaza o noua oferta pentru client."
      />

      <OfferForm mode="create" />
    </div>
  );
}
