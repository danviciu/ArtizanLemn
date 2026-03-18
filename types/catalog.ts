export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount?: number;
};

export type CatalogProduct = {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  featuredImage: string;
  gallery: string[];
  tags: string[];
  woodTypes: string[];
  finishes: string[];
  suitableFor: string[];
  isFeatured: boolean;
};

export type CatalogGalleryItem = {
  id: string;
  title: string;
  image: string;
  category: string;
  caption: string;
  featured: boolean;
};
