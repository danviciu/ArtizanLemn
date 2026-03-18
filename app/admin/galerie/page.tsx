import type { Metadata } from "next";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { GalleryManagement } from "@/components/admin/gallery-management";
import { ButtonLink } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/site";
import { listAdminGalleryProjects } from "@/lib/admin/repository";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Galerie",
  description: "Administrare proiecte de galerie si continut vizual.",
  path: "/admin/galerie",
});

export default async function AdminGaleriePage() {
  const projects = await listAdminGalleryProjects();

  return (
    <div className="space-y-6">
      <AdminSectionHeading
        title="Galerie"
        description="Gestioneaza proiectele vizuale, povestile de atelier si setarea featured."
        actions={
          <ButtonLink href="/admin/galerie/adauga" size="sm">
            Adauga proiect
          </ButtonLink>
        }
      />

      <GalleryManagement initialProjects={projects} />
    </div>
  );
}
