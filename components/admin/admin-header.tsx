"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

const segmentLabels: Record<string, string> = {
  admin: "Dashboard",
  produse: "Produse",
  adauga: "Adauga",
  editeaza: "Editeaza",
  cereri: "Cereri",
  comenzi: "Comenzi",
  galerie: "Galerie",
  blog: "Blog",
};

export function AdminHeader() {
  const pathname = usePathname();

  const breadcrumb = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment) => segmentLabels[segment] ?? segment).join(" / ");
  }, [pathname]);

  return (
    <header className="luxury-card p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-wood-700">
            Panou intern Artizan Lemn
          </p>
          <p className="mt-2 text-sm text-wood-700">{breadcrumb}</p>
        </div>
        <AdminLogoutButton />
      </div>
    </header>
  );
}
