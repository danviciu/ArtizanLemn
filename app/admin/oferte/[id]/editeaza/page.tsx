import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { OfferForm } from "@/components/admin/offer-form";
import { createPageMetadata } from "@/lib/site";
import { getAdminOfferById } from "@/lib/admin/repository";

type AdminOfertaEditPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminOfertaEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const offer = await getAdminOfferById(id);

  return createPageMetadata({
    title: offer ? `Editeaza oferta ${offer.offerNumber}` : "Editeaza oferta",
    description: "Formular intern pentru editare oferta comerciala.",
    path: `/admin/oferte/${id}/editeaza`,
  });
}

export default async function AdminOfertaEditPage({ params }: AdminOfertaEditPageProps) {
  const { id } = await params;
  const offer = await getAdminOfferById(id);

  if (!offer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/oferte/${id}`}
        className="inline-flex items-center gap-1 text-sm text-wood-700 transition-colors hover:text-wood-950"
      >
        <ChevronLeft size={16} />
        Inapoi la detaliu oferta
      </Link>

      <AdminSectionHeading
        title="Editeaza oferta"
        description="Modifica datele comerciale, termenii si statusul ofertei."
      />

      <OfferForm mode="edit" initialData={offer} />
    </div>
  );
}
