import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { ProductForm } from "@/components/admin/product-form";
import { createPageMetadata } from "@/lib/site";
import { getAdminProductById } from "@/lib/admin/repository";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: AdminEditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getAdminProductById(id);

  return createPageMetadata({
    title: product ? `Admin Editeaza ${product.title}` : "Admin Editeaza produs",
    description: "Formular intern pentru editare produs.",
    path: `/admin/produse/${id}/editeaza`,
  });
}

export default async function AdminEditProductPage({
  params,
}: AdminEditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

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
        title={`Editeaza: ${product.title}`}
        description="Actualizeaza datele produsului in fluxul intern admin."
      />

      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
