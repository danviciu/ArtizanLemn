import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { listCatalogProducts } from "@/lib/catalog/products-repository";
import { toAbsoluteUrl } from "@/lib/seo";

type StaticRouteConfig = {
  path: string;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
};

const staticRoutes: StaticRouteConfig[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/produse", changeFrequency: "daily", priority: 0.95 },
  { path: "/categorii", changeFrequency: "weekly", priority: 0.92 },
  { path: "/galerie", changeFrequency: "weekly", priority: 0.85 },
  { path: "/cum-lucram", changeFrequency: "monthly", priority: 0.8 },
  { path: "/comanda-mobilier", changeFrequency: "weekly", priority: 0.93 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.82 },
  { path: "/termeni-si-conditii", changeFrequency: "yearly", priority: 0.3 },
  { path: "/politica-confidentialitate", changeFrequency: "yearly", priority: 0.3 },
  { path: "/politica-cookies", changeFrequency: "yearly", priority: 0.3 },
];

const sitemapGeneratedAt = new Date();

function parseLastModified(updatedAt?: string) {
  if (!updatedAt) {
    return sitemapGeneratedAt;
  }

  const parsedDate = new Date(updatedAt);
  return Number.isNaN(parsedDate.getTime()) ? sitemapGeneratedAt : parsedDate;
}

function buildProductImages(images: string[]) {
  return Array.from(new Set(images.filter(Boolean))).map((image) =>
    toAbsoluteUrl(image),
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listCatalogProducts();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: toAbsoluteUrl(route.path),
    lastModified: sitemapGeneratedAt,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: toAbsoluteUrl(`/categorii/${category.slug}`),
    lastModified: sitemapGeneratedAt,
    changeFrequency: "weekly",
    priority: 0.9,
    images: buildProductImages([category.image]),
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: toAbsoluteUrl(`/produse/${product.slug}`),
    lastModified: parseLastModified(product.updatedAt),
    changeFrequency: product.isFeatured ? "weekly" : "monthly",
    priority: product.isFeatured ? 0.88 : 0.82,
    images: buildProductImages([product.featuredImage, ...product.gallery]),
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
