export type AdminNavItem = {
  label: string;
  href: string;
};

export const adminNavigation: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Produse", href: "/admin/produse" },
  { label: "Cereri", href: "/admin/cereri" },
  { label: "Oferte", href: "/admin/oferte" },
  { label: "Comenzi", href: "/admin/comenzi" },
  { label: "Galerie", href: "/admin/galerie" },
  { label: "Blog", href: "/admin/blog" },
];
