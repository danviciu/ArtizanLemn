import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { ProductForm } from "@/components/admin/product-form";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Adauga produs",
  description: "Formular intern pentru adaugare produs.",
  path: "/admin/produse/adauga",
});

export default function AdminAdaugaProdusPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/produse"
        className="inline-flex items-center gap-1 text-sm text-wood-700 transition-colors hover:text-wood-950"
      >
        <ChevronLeft size={16} />
        Inapoi la produse
      </Link>

      <AdminSectionHeading
        title="Adauga produs"
        description="Completeaza datele de baza pentru o noua piesa din catalog."
      />

      <ProductForm mode="create" />
    </div>
  );
}
