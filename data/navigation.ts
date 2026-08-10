import type { NavItem } from "@/types/content";

export const mainNavigation: NavItem[] = [
  { label: "Acasa", href: "/" },
  { label: "Produse", href: "/produse" },
  { label: "Categorii", href: "/categorii" },
  { label: "Galerie", href: "/galerie" },
  { label: "Cum lucram", href: "/cum-lucram" },
  { label: "Comanda mobilier", href: "/comanda-mobilier" },
  { label: "Contact", href: "/contact" },
];

export const companyDetails = {
  phone: "0751414637",
  phones: ["0751414637"] as const,
  email: "contact@artizanlemn.ro",
  city: "Strada 1, Prejmer, Bra\u0219ov",
  schedule: "Luni - Vineri, 09:00 - 18:00",
  phoneSchedule:
    "Apeluri telefonice: Luni - Vineri, 09:00 - 18:00. Sambata - Duminica: inchis.",
} as const;

export type SocialLink = {
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [];
