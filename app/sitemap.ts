import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { listCatalogProducts } from "@/lib/catalog/products-repository";

const routes = [
  "/",
  "/produse",
  "/categorii",
  "/galerie",
  "/cum-lucram",
  "/comanda-mobilier",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listCatalogProducts();

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/produse/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...productEntries];
}
