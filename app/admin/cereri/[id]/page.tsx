import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { InquiryDetailView } from "@/components/admin/inquiry-detail-view";
import { createPageMetadata } from "@/lib/site";
import { getAdminInquiryById } from "@/lib/admin/repository";

type AdminCerereDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminCerereDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const inquiry = await getAdminInquiryById(id);

  return createPageMetadata({
    title: inquiry ? `Cerere ${inquiry.nume}` : "Detaliu cerere",
    description: "Vizualizare detaliata cerere client.",
    path: `/admin/cereri/${id}`,
  });
}

export default async function AdminCerereDetailPage({
  params,
}: AdminCerereDetailPageProps) {
  const { id } = await params;
  const inquiry = await getAdminInquiryById(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/cereri"
        className="inline-flex items-center gap-1 text-sm text-wood-700 transition-colors hover:text-wood-950"
      >
        <ChevronLeft size={16} />
        Inapoi la cereri
      </Link>

      <AdminSectionHeading
        title="Detaliu cerere"
        description="Vizualizare completa a cererii si actiuni interne de status."
      />

      <InquiryDetailView inquiry={inquiry} />
    </div>
  );
}
