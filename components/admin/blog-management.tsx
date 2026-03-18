import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import type { AdminBlogPost } from "@/types/admin";

type BlogManagementProps = {
  posts: AdminBlogPost[];
};

export function BlogManagement({ posts }: BlogManagementProps) {
  const columns: DataTableColumn<AdminBlogPost>[] = [
    {
      key: "titlu",
      header: "Titlu",
      render: (item) => (
        <div>
          <p className="font-medium text-wood-900">{item.title}</p>
          <p className="text-xs text-wood-700">{item.slug}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge variant="blog" value={item.status} />,
    },
    {
      key: "data",
      header: "Data",
      render: (item) => (
        <p className="text-xs text-wood-700">
          {item.publishedAt || "-"} · upd. {item.updatedAt}
        </p>
      ),
    },
    {
      key: "actiuni",
      header: "Actiuni",
      render: (item) => (
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={`/admin/blog/${item.id}/editeaza`}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Editeaza
          </Link>
          <button
            type="button"
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Vezi
          </button>
          <button
            type="button"
            className="rounded-full border border-rose-700/25 px-3 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50"
          >
            Sterge
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={posts} rowKey={(item) => item.id} />;
}
