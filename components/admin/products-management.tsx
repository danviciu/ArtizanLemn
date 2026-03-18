import Image from "next/image";
import Link from "next/link";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { categoryMap } from "@/data/categories";
import type { AdminProduct } from "@/types/admin";

type ProductsManagementProps = {
  products: AdminProduct[];
};

export function ProductsManagement({ products }: ProductsManagementProps) {
  const columns: DataTableColumn<AdminProduct>[] = [
    {
      key: "imagine",
      header: "Imagine",
      render: (item) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-sand-300">
          <Image src={item.featuredImage} alt={item.title} fill className="object-cover" />
        </div>
      ),
    },
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
      key: "categorie",
      header: "Categorie",
      render: (item) => <p>{categoryMap[item.category]?.name ?? item.category}</p>,
    },
    {
      key: "etichete",
      header: "Etichete",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-sand-300 bg-sand-100 px-2 py-0.5 text-xs text-wood-700"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge variant="product" value={item.status} />,
    },
    {
      key: "actiuni",
      header: "Actiuni",
      render: (item) => (
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={`/admin/produse/${item.id}/editeaza`}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Editeaza
          </Link>
          <Link
            href={`/produse/${item.slug}`}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Vezi
          </Link>
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

  return <DataTable columns={columns} data={products} rowKey={(item) => item.id} />;
}
