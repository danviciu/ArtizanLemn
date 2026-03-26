import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { OfferDetailView } from "@/components/admin/offer-detail-view";
import { createPageMetadata } from "@/lib/site";
import { getAdminOfferById } from "@/lib/admin/repository";

type AdminOfertaDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminOfertaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const offer = await getAdminOfferById(id);

  return createPageMetadata({
    title: offer ? `Oferta ${offer.offerNumber}` : "Detaliu oferta",
    description: "Vizualizare detaliata oferta comerciala.",
    path: `/admin/oferte/${id}`,
  });
}

export default async function AdminOfertaDetailPage({
  params,
}: AdminOfertaDetailPageProps) {
  const { id } = await params;
  const offer = await getAdminOfferById(id);

  if (!offer) {
    notFound();
  }

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
        title="Detaliu oferta"
        description="Vizualizare completa a valorii comerciale, termenelor si statusului ofertei."
      />

      <OfferDetailView offer={offer} />
    </div>
  );
}
