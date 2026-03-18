import type { Metadata } from "next";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { OrdersManagement } from "@/components/admin/orders-management";
import { createPageMetadata } from "@/lib/site";
import { listAdminOrders } from "@/lib/admin/repository";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Comenzi",
  description: "Gestionare comenzi, status executie si note interne.",
  path: "/admin/comenzi",
});

export default async function AdminComenziPage() {
  const orders = await listAdminOrders();

  return (
    <div className="space-y-6">
      <AdminSectionHeading
        title="Comenzi"
        description="Monitorizeaza fluxul de executie: confirmare, proiectare, atelier, livrare."
      />
      <OrdersManagement initialOrders={orders} />
    </div>
  );
}
