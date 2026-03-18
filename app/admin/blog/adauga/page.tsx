import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { BlogForm } from "@/components/admin/blog-form";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Adauga articol",
  description: "Formular intern pentru adaugare articol blog.",
  path: "/admin/blog/adauga",
});

export default function AdminBlogAddPage() {
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
        title="Adauga articol"
        description="Seteaza continutul principal, excerptul si metadata SEO."
      />

      <BlogForm mode="create" />
    </div>
  );
}
