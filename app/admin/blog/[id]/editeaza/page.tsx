import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { BlogForm } from "@/components/admin/blog-form";
import { createPageMetadata } from "@/lib/site";
import { getAdminBlogById } from "@/lib/admin/repository";

type AdminEditBlogPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AdminEditBlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getAdminBlogById(id);

  return createPageMetadata({
    title: post ? `Editeaza ${post.title}` : "Editeaza articol",
    description: "Actualizare articol din panoul intern.",
    path: `/admin/blog/${id}/editeaza`,
  });
}

export default async function AdminEditBlogPage({
  params,
}: AdminEditBlogPageProps) {
  const { id } = await params;
  const post = await getAdminBlogById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1 text-sm text-wood-700 transition-colors hover:text-wood-950"
      >
        <ChevronLeft size={16} />
        Inapoi la blog
      </Link>

      <AdminSectionHeading
        title={`Editeaza: ${post.title}`}
        description="Actualizeaza continutul si statusul editorial."
      />

      <BlogForm mode="edit" initialData={post} />
    </div>
  );
}
