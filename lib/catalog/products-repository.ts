import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { products as localProducts } from "@/data/products";
import type { CatalogProduct } from "@/types/catalog";

const PRODUCTS_TABLE = "catalog_products";

type DbCatalogProductRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string;
  featured_image: string;
  gallery: string[] | null;
  tags: string[] | null;
  wood_types: string[] | null;
  finishes: string[] | null;
  suitable_for: string[] | null;
  is_featured: boolean | null;
  status: "activ" | "draft" | "arhivat";
};

function hasSupabaseProductConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function mapDbRowToCatalogProduct(row: DbCatalogProductRow): CatalogProduct {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    featuredImage: row.featured_image,
    gallery: row.gallery ?? [],
    tags: row.tags ?? [],
    woodTypes: row.wood_types ?? [],
    finishes: row.finishes ?? [],
    suitableFor: row.suitable_for ?? [],
    isFeatured: Boolean(row.is_featured),
  };
}

async function readProductsFromSupabase() {
  if (!hasSupabaseProductConfig()) {
    return null;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(
      "id, title, slug, category, short_description, full_description, featured_image, gallery, tags, wood_types, finishes, suitable_for, is_featured, status",
    )
    .eq("status", "activ")
    .order("updated_at", { ascending: false });

  if (error || !data) {
    console.error("Nu s-au putut citi produsele publice din Supabase.", error);
    return null;
  }

  if (!data.length) {
    console.warn(
      "Nu s-au incarcat produse publice din Supabase in acest context. Se foloseste fallback local.",
    );
    return null;
  }

  return (data as DbCatalogProductRow[]).map(mapDbRowToCatalogProduct);
}

export async function listCatalogProducts() {
  const remoteProducts = await readProductsFromSupabase();
  return remoteProducts ?? localProducts;
}

export async function getCatalogProductBySlug(slug: string) {
  const catalog = await listCatalogProducts();
  return catalog.find((product) => product.slug === slug) ?? null;
}

export async function listFeaturedCatalogProducts() {
  const catalog = await listCatalogProducts();
  return catalog.filter((product) => product.isFeatured);
}
