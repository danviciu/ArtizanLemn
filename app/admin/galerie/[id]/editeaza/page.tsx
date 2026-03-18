import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { GalleryForm } from "@/components/admin/gallery-form";
import { createPageMetadata } from "@/lib/site";
import { getAdminGalleryById } from "@/lib/admin/repository";

type AdminEditGalleryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminEditGalleryPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getAdminGalleryById(id);

  return createPageMetadata({
    title: project ? `Editeaza ${project.title}` : "Editeaza proiect galerie",
    description: "Formular intern pentru actualizare proiect galerie.",
    path: `/admin/galerie/${id}/editeaza`,
  });
}

export default async function AdminEditGalleryPage({
  params,
}: AdminEditGalleryPageProps) {
  const { id } = await params;
  const project = await getAdminGalleryById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/galerie"
        className="inline-flex items-center gap-1 text-sm text-wood-700 transition-colors hover:text-wood-950"
      >
        <ChevronLeft size={16} />
        Inapoi la galerie
      </Link>

      <AdminSectionHeading
        title={`Editeaza: ${project.title}`}
        description="Actualizeaza datele proiectului in fluxul intern."
      />

      <GalleryForm mode="edit" initialData={project} />
    </div>
  );
}
