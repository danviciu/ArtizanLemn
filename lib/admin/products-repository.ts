import "server-only";
import { adminProducts } from "@/data/adminProducts";
import { categories } from "@/data/categories";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { AdminProduct } from "@/types/admin";
import type { AdminProductPayload } from "@/lib/validation/adminProductSchema";

const PRODUCTS_TABLE = "catalog_products";

type DbProductRow = {
  id: string;
  created_at: string;
  updated_at: string;
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

const categoryNameToSlug = new Map(
  categories.map((category) => [category.name.toLowerCase(), category.slug]),
);

function hasSupabaseProductConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function normalizeCategoryValue(category: string) {
  const trimmed = category.trim();
  if (!trimmed) {
    return categories[0]?.slug ?? "paturi";
  }

  const bySlug = categories.find((item) => item.slug === trimmed);
  if (bySlug) {
    return bySlug.slug;
  }

  const byName = categoryNameToSlug.get(trimmed.toLowerCase());
  if (byName) {
    return byName;
  }

  return trimmed
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapDbRowToAdminProduct(row: DbProductRow): AdminProduct {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: normalizeCategoryValue(row.category),
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    featuredImage: row.featured_image,
    gallery: row.gallery ?? [],
    tags: row.tags ?? [],
    woodTypes: row.wood_types ?? [],
    finishes: row.finishes ?? [],
    suitableFor: row.suitable_for ?? [],
    isFeatured: Boolean(row.is_featured),
    status: row.status,
    updatedAt: row.updated_at,
  };
}

function mapFallbackProduct(item: AdminProduct): AdminProduct {
  return {
    ...item,
    category: normalizeCategoryValue(item.category),
    isFeatured: Boolean(item.isFeatured),
  };
}

function mapPayloadToDbInput(payload: AdminProductPayload) {
  return {
    title: payload.title,
    slug: payload.slug,
    category: payload.category,
    short_description: payload.shortDescription,
    full_description: payload.fullDescription,
    featured_image: payload.featuredImage,
    gallery: payload.gallery,
    tags: payload.tags,
    wood_types: payload.woodTypes,
    finishes: payload.finishes,
    suitable_for: payload.suitableFor,
    is_featured: payload.isFeatured,
    status: payload.status,
  };
}

function mapDbErrorToMessage(error: unknown, fallbackMessage: string) {
  const maybeError = error as { code?: string; message?: string } | undefined;

  if (maybeError?.code === "23505") {
    return "Slug-ul exista deja. Alege un slug unic pentru produs.";
  }

  if (maybeError?.code === "PGRST116") {
    return "Produsul nu a fost gasit.";
  }

  if (maybeError?.message) {
    return maybeError.message;
  }

  return fallbackMessage;
}

export async function listPersistedAdminProducts() {
  if (!hasSupabaseProductConfig()) {
    return adminProducts.map(mapFallbackProduct);
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(
      "id, created_at, updated_at, title, slug, category, short_description, full_description, featured_image, gallery, tags, wood_types, finishes, suitable_for, is_featured, status",
    )
    .order("updated_at", { ascending: false });

  if (error || !data) {
    console.error("Nu s-a putut citi lista de produse din Supabase.", error);
    return adminProducts.map(mapFallbackProduct);
  }

  if (!data.length) {
    console.warn(
      "Nu s-au incarcat produse admin din Supabase in acest context. Se foloseste fallback local.",
    );
    return adminProducts.map(mapFallbackProduct);
  }

  return (data as DbProductRow[]).map(mapDbRowToAdminProduct);
}

export async function getPersistedAdminProductById(id: string) {
  if (!hasSupabaseProductConfig()) {
    const fallback = adminProducts.find((item) => item.id === id);
    return fallback ? mapFallbackProduct(fallback) : null;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .select(
      "id, created_at, updated_at, title, slug, category, short_description, full_description, featured_image, gallery, tags, wood_types, finishes, suitable_for, is_featured, status",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Nu s-a putut citi produsul ${id} din Supabase.`, error);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapDbRowToAdminProduct(data as DbProductRow);
}

export async function createPersistedAdminProduct(payload: AdminProductPayload) {
  if (!hasSupabaseProductConfig()) {
    throw new Error(
      "Supabase nu este configurat. Seteaza variabilele de mediu pentru a salva produse reale.",
    );
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert(mapPayloadToDbInput(payload))
    .select(
      "id, created_at, updated_at, title, slug, category, short_description, full_description, featured_image, gallery, tags, wood_types, finishes, suitable_for, is_featured, status",
    )
    .single();

  if (error || !data) {
    throw new Error(
      mapDbErrorToMessage(error, "Produsul nu a putut fi creat."),
    );
  }

  return mapDbRowToAdminProduct(data as DbProductRow);
}

export async function updatePersistedAdminProduct(
  id: string,
  payload: AdminProductPayload,
) {
  if (!hasSupabaseProductConfig()) {
    throw new Error(
      "Supabase nu este configurat. Seteaza variabilele de mediu pentru a salva produse reale.",
    );
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .update({
      ...mapPayloadToDbInput(payload),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, created_at, updated_at, title, slug, category, short_description, full_description, featured_image, gallery, tags, wood_types, finishes, suitable_for, is_featured, status",
    )
    .single();

  if (error || !data) {
    throw new Error(
      mapDbErrorToMessage(error, "Produsul nu a putut fi actualizat."),
    );
  }

  return mapDbRowToAdminProduct(data as DbProductRow);
}
