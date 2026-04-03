import type { CatalogCategory, CatalogProduct } from "@/types/catalog";
import { getProductSeoKeywordPhrases } from "@/lib/product-seo";
import { siteConfig } from "@/lib/site";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type ItemListInput = {
  name: string;
  description: string;
  path: string;
  products: CatalogProduct[];
};

export function toAbsoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: toAbsoluteUrl("/apple-touch-icon.png"),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressCountry: "RO",
    },
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: "ro-RO",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function createCategoryItemListJsonLd({
  name,
  description,
  path,
  products,
}: ItemListInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${toAbsoluteUrl(path)}#collection`,
    url: toAbsoluteUrl(path),
    name,
    description,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: toAbsoluteUrl(`/produse/${product.slug}`),
        name: product.title,
      })),
    },
  };
}

export function createCategoryDirectoryJsonLd(categories: CatalogCategory[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/categorii#directory`,
    url: `${siteConfig.url}/categorii`,
    name: "Categorii mobilier din lemn masiv",
    description:
      "Directia completa de categorii Artizan Lemn pentru mobilier premium si proiecte personalizate.",
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: category.name,
        url: toAbsoluteUrl(`/categorii/${category.slug}`),
      })),
    },
  };
}

function buildProductImages(product: CatalogProduct) {
  return Array.from(
    new Set([product.featuredImage, ...product.gallery].filter(Boolean)),
  ).map((image) => toAbsoluteUrl(image));
}

function buildAdditionalProperties(product: CatalogProduct) {
  const fromWoodTypes = product.woodTypes.map((woodType) => ({
    "@type": "PropertyValue",
    name: "Tip lemn",
    value: woodType,
  }));
  const fromFinishes = product.finishes.map((finish) => ({
    "@type": "PropertyValue",
    name: "Finisaj",
    value: finish,
  }));
  const fromSuitableFor = product.suitableFor.map((target) => ({
    "@type": "PropertyValue",
    name: "Recomandat pentru",
    value: target,
  }));

  return [...fromWoodTypes, ...fromFinishes, ...fromSuitableFor];
}

export function createProductJsonLd(
  product: CatalogProduct,
  categoryName?: string | null,
) {
  const keywordPhrases = getProductSeoKeywordPhrases(product);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${toAbsoluteUrl(`/produse/${product.slug}`)}#product`,
    name: product.title,
    description: product.shortDescription,
    url: toAbsoluteUrl(`/produse/${product.slug}`),
    image: buildProductImages(product),
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    category: categoryName ?? product.category,
    keywords: keywordPhrases.join(", "),
    material: product.woodTypes,
    additionalProperty: buildAdditionalProperties(product),
    isRelatedTo: {
      "@type": "Service",
      name: "Mobilier la comanda",
      url: toAbsoluteUrl("/comanda-mobilier"),
    },
  };
}
