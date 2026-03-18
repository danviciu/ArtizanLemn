import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { GalleryForm } from "@/components/admin/gallery-form";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Adauga proiect galerie",
  description: "Formular intern pentru adaugare proiect galerie.",
  path: "/admin/galerie/adauga",
});

export default function AdminGalerieAddPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/galerie"
        className="inline-flex items-center gap-1 text-sm text-wood-700 transition-colors hover:text-wood-950"
      >
        <ChevronLeft size={16} />
        Inapoi la galerie
      </Link>

      <AdminSectionHeading
        title="Adauga proiect galerie"
        description="Configureaza titlul, povestea si imaginile proiectului."
      />

      <GalleryForm mode="create" />
    </div>
  );
}
