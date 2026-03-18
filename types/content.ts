export type NavItem = {
  label: string;
  href: string;
};

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  href: string;
  featured?: boolean;
};

export type Product = {
  id: string;
  name: string;
  categorySlug: string;
  categoryLabel: string;
  summary: string;
  materials: string;
  tags: string[];
  image: string;
  featured?: boolean;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  featured?: boolean;
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};
