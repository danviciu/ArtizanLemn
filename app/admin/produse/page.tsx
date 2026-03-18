import type { Metadata } from "next";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { ProductsManagement } from "@/components/admin/products-management";
import { ButtonLink } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/site";
import { listAdminProducts } from "@/lib/admin/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Produse",
  description: "Administrare produse si piese de inspiratie din atelier.",
  path: "/admin/produse",
});

export default async function AdminProdusePage() {
  const products = await listAdminProducts();

  return (
    <div className="space-y-6">
      <AdminSectionHeading
        title="Produse"
        description="Gestioneaza piesele de inspiratie, datele tehnice si statusul publicarii."
        actions={
          <ButtonLink href="/admin/produse/adauga" size="sm">
            Adauga produs
          </ButtonLink>
        }
      />

      <ProductsManagement products={products} />
    </div>
  );
}
