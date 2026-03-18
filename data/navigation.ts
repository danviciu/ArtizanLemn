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
  phone: "40755573522",
  phones: ["40755573522", "0766546274"] as const,
  email: "contact@artizanlemn.ro",
  city: "Strada 1, Prejmer, Brasov",
  schedule: "Luni - Vineri, 09:00 - 18:00",
} as const;

export type SocialLink = {
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [];
