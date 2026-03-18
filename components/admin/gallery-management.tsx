"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import type { AdminGalleryProject } from "@/types/admin";

type GalleryManagementProps = {
  initialProjects: AdminGalleryProject[];
};

export function GalleryManagement({ initialProjects }: GalleryManagementProps) {
  const [projects, setProjects] = useState(initialProjects);

  function toggleFeatured(id: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? { ...project, featured: !project.featured } : project,
      ),
    );
  }

  const columns: DataTableColumn<AdminGalleryProject>[] = [
    {
      key: "imagine",
      header: "Coperta",
      render: (item) => (
        <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-sand-300">
          <Image src={item.coverImage} alt={item.title} fill className="object-cover" />
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
      render: (item) => <p>{item.category}</p>,
    },
    {
      key: "featured",
      header: "Featured",
      render: (item) => (
        <button
          type="button"
          onClick={() => toggleFeatured(item.id)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            item.featured
              ? "border-wood-900 bg-wood-900 text-sand-50"
              : "border-sand-300 bg-white text-wood-700"
          }`}
        >
          {item.featured ? "Da" : "Nu"}
        </button>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge variant="gallery" value={item.status} />,
    },
    {
      key: "actiuni",
      header: "Actiuni",
      render: (item) => (
        <div className="flex flex-wrap gap-1.5">
          <Link
            href={`/admin/galerie/${item.id}/editeaza`}
            className="rounded-full border border-sand-300 px-3 py-1 text-xs font-medium text-wood-700 transition-colors hover:bg-sand-100"
          >
            Editeaza
          </Link>
          <Link
            href="/galerie"
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

  return <DataTable columns={columns} data={projects} rowKey={(item) => item.id} />;
}
