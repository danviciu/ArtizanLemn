"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  FolderKanban,
  Images,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { adminNavigation } from "@/data/adminNavigation";
import { cn } from "@/lib/utils";

const iconByHref: Record<string, React.ComponentType<{ size?: number }>> = {
  "/admin": LayoutDashboard,
  "/admin/produse": Package,
  "/admin/cereri": ClipboardList,
  "/admin/comenzi": FolderKanban,
  "/admin/galerie": Images,
  "/admin/blog": FileText,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="space-y-4">
      <nav className="luxury-card overflow-x-auto p-2 lg:hidden">
        <Link
          href="/"
          className="mb-3 flex items-center gap-3 rounded-2xl border border-sand-300/70 bg-sand-100/65 px-3 py-2.5"
        >
          <BrandLogo size="sm" className="h-10 w-10 rounded-xl" />
          <div className="leading-tight">
            <p className="font-display text-2xl text-wood-950">Artizan Lemn</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-wood-700">
              panou intern
            </p>
          </div>
        </Link>

        <div className="flex min-w-max gap-2">
          {adminNavigation.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-wood-900 text-sand-50"
                    : "bg-white text-wood-700 hover:bg-sand-100",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="luxury-card sticky top-24 hidden p-4 lg:block">
        <Link
          href="/"
          className="mb-4 flex items-center gap-3 rounded-2xl border border-sand-300/70 bg-sand-100/70 p-3"
        >
          <BrandLogo size="sm" className="h-11 w-11 rounded-xl" />
          <div className="leading-tight">
            <p className="font-display text-2xl text-wood-950">Artizan Lemn</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-wood-700">
              panou intern
            </p>
          </div>
        </Link>

        <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-wood-700">
          Administrare
        </p>
        <ul className="mt-3 space-y-1">
          {adminNavigation.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            const Icon = iconByHref[item.href] ?? LayoutDashboard;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-wood-900 text-sand-50"
                      : "text-wood-700 hover:bg-sand-100 hover:text-wood-950",
                  )}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 rounded-2xl border border-sand-300 bg-sand-100/70 p-3">
          <p className="text-xs font-medium text-wood-700">
            Accesul in acest panou este protejat prin autentificare server-side.
          </p>
        </div>
      </nav>
    </aside>
  );
}
