import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { OrderDetailView } from "@/components/admin/order-detail-view";
import { createPageMetadata } from "@/lib/site";
import { getAdminOrderById } from "@/lib/admin/repository";

type AdminComandaDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminComandaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  return createPageMetadata({
    title: order ? `Comanda ${order.client}` : "Detaliu comanda",
    description: "Detaliu intern comanda client.",
    path: `/admin/comenzi/${id}`,
  });
}

export default async function AdminComandaDetailPage({
  params,
}: AdminComandaDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/comenzi"
        className="inline-flex items-center gap-1 text-sm text-wood-700 transition-colors hover:text-wood-950"
      >
        <ChevronLeft size={16} />
        Inapoi la comenzi
      </Link>

      <AdminSectionHeading
        title="Detaliu comanda"
        description="Vizualizare interna pentru status, termen, pret agreat si note."
      />

      <OrderDetailView order={order} />
    </div>
  );
}
