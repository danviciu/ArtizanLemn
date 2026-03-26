import type { Metadata } from "next";
import Link from "next/link";
import { AdminSectionHeading } from "@/components/admin/admin-section-heading";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { createPageMetadata } from "@/lib/site";
import {
  listAdminGalleryProjects,
  listAdminInquiries,
  listAdminOffers,
  listAdminOrders,
  listAdminProducts,
} from "@/lib/admin/repository";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Dashboard",
  description: "Panou intern pentru administrare continut si fluxuri de lucru Artizan Lemn.",
  path: "/admin",
});

const quickLinks = [
  { label: "Gestionare produse", href: "/admin/produse" },
  { label: "Cereri clienti", href: "/admin/cereri" },
  { label: "Oferte comerciale", href: "/admin/oferte" },
  { label: "Comenzi active", href: "/admin/comenzi" },
  { label: "Proiecte galerie", href: "/admin/galerie" },
  { label: "Articole blog", href: "/admin/blog" },
];

export default async function AdminDashboardPage() {
  const [inquiries, offers, orders, products, gallery] = await Promise.all([
    listAdminInquiries(),
    listAdminOffers(),
    listAdminOrders(),
    listAdminProducts(),
    listAdminGalleryProjects(),
  ]);

  const newInquiriesCount = inquiries.filter((item) => item.status === "nou").length;
  const activeOrdersCount = orders.filter((item) =>
    ["confirmata", "in_proiectare", "in_executie", "finisare", "pregatita_de_livrare"].includes(
      item.status,
    ),
  ).length;
  const activeOffersCount = offers.filter((item) =>
    ["draft", "trimisa"].includes(item.status),
  ).length;

  const recentInquiries = [...inquiries]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);
  const recentOrders = [...orders]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <AdminSectionHeading
        title="Dashboard"
        description="Centru intern pentru monitorizarea cererilor, comenzilor si continutului editorial."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Cereri noi" value={newInquiriesCount} hint="Necesita analiza initiala" />
        <StatCard label="Oferte active" value={activeOffersCount} hint="Draft sau trimise clientilor" />
        <StatCard label="Comenzi active" value={activeOrdersCount} hint="In lucru in atelier" />
        <StatCard label="Produse" value={products.length} hint="Elemente in portofoliu admin" />
        <StatCard label="Proiecte galerie" value={gallery.length} hint="Vizibile + draft" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="luxury-card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-3xl">Cereri recente</h2>
            <Link
              href="/admin/cereri"
              className="text-sm font-medium text-wood-700 transition-colors hover:text-wood-950"
            >
              Vezi toate
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {recentInquiries.map((item) => (
              <li key={item.id} className="rounded-xl border border-sand-300 bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-wood-900">{item.nume}</p>
                    <p className="text-sm text-wood-700">{item.titluProiect}</p>
                    <p className="text-xs text-wood-700/85">
                      {new Date(item.createdAt).toLocaleDateString("ro-RO")}
                    </p>
                  </div>
                  <StatusBadge variant="inquiry" value={item.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="luxury-card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-3xl">Comenzi recente</h2>
            <Link
              href="/admin/comenzi"
              className="text-sm font-medium text-wood-700 transition-colors hover:text-wood-950"
            >
              Vezi toate
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {recentOrders.map((item) => (
              <li key={item.id} className="rounded-xl border border-sand-300 bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-wood-900">{item.client}</p>
                    <p className="text-sm text-wood-700">{item.proiect}</p>
                    <p className="text-xs text-wood-700/85">Termen: {item.termen}</p>
                  </div>
                  <StatusBadge variant="order" value={item.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="luxury-card p-5">
        <h2 className="text-3xl">Link-uri rapide</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-sand-300 bg-white px-4 py-2 text-sm font-medium text-wood-700 transition-colors hover:bg-sand-100 hover:text-wood-950"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
