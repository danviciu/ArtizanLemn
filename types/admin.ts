export type AdminProductStatus = "activ" | "draft" | "arhivat";

export type AdminInquiryStatus =
  | "nou"
  | "in_analiza"
  | "contactat"
  | "oferta_trimisa"
  | "acceptata"
  | "respinsa"
  | "transformata_in_comanda";

export type AdminOrderStatus =
  | "confirmata"
  | "in_proiectare"
  | "in_executie"
  | "finisare"
  | "pregatita_de_livrare"
  | "livrata"
  | "finalizata";

export type AdminOfferStatus =
  | "draft"
  | "trimisa"
  | "acceptata"
  | "respinsa"
  | "expirata";

export type AdminGalleryStatus = "draft" | "publicat" | "arhivat";

export type AdminBlogStatus = "draft" | "in_review" | "publicat" | "arhivat";

export type AdminProduct = {
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
  isFeatured?: boolean;
  status: AdminProductStatus;
  updatedAt: string;
};

export type InquiryAttachmentRef = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export type AdminInquiry = {
  id: string;
  nume: string;
  telefon: string;
  email: string;
  titluProiect: string;
  descriereDetaliata: string;
  dimensiuniAproximative?: string;
  spatiulFolosire?: string;
  bugetOrientativ?: string;
  termenDorit?: string;
  observatiiSuplimentare?: string;
  attachments: InquiryAttachmentRef[];
  status: AdminInquiryStatus;
  createdAt: string;
  adminNotes?: string;
};

export type AdminOrder = {
  id: string;
  inquiryId?: string;
  client: string;
  proiect: string;
  pretAgreat: string;
  termen: string;
  status: AdminOrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
};

export type AdminOffer = {
  id: string;
  inquiryId?: string;
  offerNumber: string;
  version: number;
  client: string;
  clientPhone: string;
  clientEmail?: string;
  projectTitle: string;
  categorySlug?: string;
  currency: string;
  subtotal: number;
  discountValue: number;
  tvaValue: number;
  total: number;
  validUntil: string;
  estimatedExecutionDays?: number;
  status: AdminOfferStatus;
  createdAt: string;
  updatedAt: string;
  paymentTerms?: string;
  warrantyMonths?: number;
  internalNotes?: string;
};

export type AdminGalleryProject = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  galleryImages: string[];
  category: string;
  summary: string;
  story: string;
  featured: boolean;
  status: AdminGalleryStatus;
  updatedAt: string;
};

export type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  status: AdminBlogStatus;
  publishedAt: string;
  updatedAt: string;
};
