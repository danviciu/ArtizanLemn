import type { Metadata } from "next";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { BlogManagement } from "@/components/admin/blog-management";
import { ButtonLink } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/site";
import { listAdminBlogPosts } from "@/lib/admin/repository";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Blog",
  description: "Administrare articole blog si continut SEO.",
  path: "/admin/blog",
});

export default async function AdminBlogPage() {
  const posts = await listAdminBlogPosts();

  return (
    <div className="space-y-6">
      <AdminSectionHeading
        title="Blog"
        description="Gestioneaza articolele, statusul editorial si metadatele SEO."
        actions={
          <ButtonLink href="/admin/blog/adauga" size="sm">
            Adauga articol
          </ButtonLink>
        }
      />

      <BlogManagement posts={posts} />
    </div>
  );
}
