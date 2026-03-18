import type { Metadata } from "next";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { InquiriesManagement } from "@/components/admin/inquiries-management";
import { createPageMetadata } from "@/lib/site";
import { listAdminInquiries } from "@/lib/admin/repository";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Cereri",
  description: "Management cereri personalizate clienti.",
  path: "/admin/cereri",
});

export default async function AdminCereriPage() {
  const inquiries = await listAdminInquiries();

  return (
    <div className="space-y-6">
      <AdminSectionHeading
        title="Cereri"
        description="Urmareste, filtreaza si actualizeaza statusul cererilor trimise prin formularul public."
      />
      <InquiriesManagement initialInquiries={inquiries} />
    </div>
  );
}
