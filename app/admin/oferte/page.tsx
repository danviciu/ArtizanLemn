import type { Metadata } from "next";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { OffersManagement } from "@/components/admin/offers-management";
import { ButtonLink } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/site";
import { listAdminOffers } from "@/lib/admin/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Oferte",
  description: "Management oferte comerciale generate pentru cererile clientilor.",
  path: "/admin/oferte",
});

export default async function AdminOfertePage() {
  const offers = await listAdminOffers();

  return (
    <div className="space-y-6">
      <AdminSectionHeading
        title="Oferte"
        description="Gestioneaza versiunile de oferta, valabilitatea, statusul comercial si pregatirea pentru comanda."
        actions={
          <ButtonLink href="/admin/oferte/adauga" size="sm">
            Adauga oferta
          </ButtonLink>
        }
      />
      <OffersManagement initialOffers={offers} />
    </div>
  );
}
