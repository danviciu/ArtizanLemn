import "server-only";
import { adminOffers } from "@/data/adminOffers";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { AdminOfferPayload } from "@/lib/validation/adminOfferSchema";
import type { AdminOffer } from "@/types/admin";

const OFFERS_TABLE = "offers";

type DbOfferRow = {
  id: string;
  inquiry_id: string | null;
  offer_number: string;
  version: number | null;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  project_title: string;
  category_slug: string | null;
  currency: string | null;
  subtotal: number | string | null;
  discount_value: number | string | null;
  tva_value: number | string | null;
  total: number | string | null;
  valid_until: string | null;
  estimated_execution_days: number | null;
  status: "draft" | "trimisa" | "acceptata" | "respinsa" | "expirata";
  payment_terms: string | null;
  warranty_months: number | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

function hasSupabaseOfferConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function isMissingOffersTableError(error: unknown) {
  const maybeError = error as { code?: string } | undefined;
  return maybeError?.code === "PGRST205" || maybeError?.code === "PGRST204";
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function buildOfferNumber() {
  const year = new Date().getUTCFullYear();
  const randomToken = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `AL-${year}-${randomToken}`;
}

function mapDbErrorToMessage(error: unknown, fallbackMessage: string) {
  const maybeError = error as { code?: string; message?: string } | undefined;

  if (maybeError?.code === "23505") {
    return "Numarul ofertei exista deja. Alege alt numar de oferta.";
  }

  if (maybeError?.message) {
    return maybeError.message;
  }

  return fallbackMessage;
}

function mapDbRowToAdminOffer(row: DbOfferRow): AdminOffer {
  return {
    id: row.id,
    inquiryId: row.inquiry_id ?? undefined,
    offerNumber: row.offer_number,
    version: row.version ?? 1,
    client: row.client_name,
    clientPhone: row.client_phone ?? "",
    clientEmail: row.client_email ?? undefined,
    projectTitle: row.project_title,
    categorySlug: row.category_slug ?? undefined,
    currency: row.currency ?? "RON",
    subtotal: toNumber(row.subtotal),
    discountValue: toNumber(row.discount_value),
    tvaValue: toNumber(row.tva_value),
    total: toNumber(row.total),
    validUntil: row.valid_until ?? "",
    estimatedExecutionDays: row.estimated_execution_days ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    paymentTerms: row.payment_terms ?? undefined,
    warrantyMonths: row.warranty_months ?? undefined,
    internalNotes: row.internal_notes ?? undefined,
  };
}

function sortByUpdatedAtDesc<T extends { updatedAt: string }>(items: T[]) {
  return [...items].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export async function listPersistedAdminOffers() {
  if (!hasSupabaseOfferConfig()) {
    return sortByUpdatedAtDesc(adminOffers);
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(OFFERS_TABLE)
    .select(
      "id, inquiry_id, offer_number, version, client_name, client_phone, client_email, project_title, category_slug, currency, subtotal, discount_value, tva_value, total, valid_until, estimated_execution_days, status, payment_terms, warranty_months, internal_notes, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  if (error && isMissingOffersTableError(error)) {
    console.warn(
      "Tabela public.offers lipseste in Supabase. Ruleaza docs/supabase-offers-setup.sql. Se foloseste fallback local.",
    );
    return sortByUpdatedAtDesc(adminOffers);
  }

  if (error || !data) {
    console.error("Nu s-a putut citi lista de oferte din Supabase.", error);
    return sortByUpdatedAtDesc(adminOffers);
  }

  if (!data.length) {
    return [];
  }

  return (data as DbOfferRow[]).map(mapDbRowToAdminOffer);
}

export async function getPersistedAdminOfferById(id: string) {
  if (!hasSupabaseOfferConfig()) {
    return adminOffers.find((item) => item.id === id) ?? null;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(OFFERS_TABLE)
    .select(
      "id, inquiry_id, offer_number, version, client_name, client_phone, client_email, project_title, category_slug, currency, subtotal, discount_value, tva_value, total, valid_until, estimated_execution_days, status, payment_terms, warranty_months, internal_notes, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error && isMissingOffersTableError(error)) {
    console.warn(
      "Tabela public.offers lipseste in Supabase. Ruleaza docs/supabase-offers-setup.sql. Se foloseste fallback local.",
    );
    return adminOffers.find((item) => item.id === id) ?? null;
  }

  if (error) {
    console.error(`Nu s-a putut citi oferta ${id} din Supabase.`, error);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapDbRowToAdminOffer(data as DbOfferRow);
}

export async function createPersistedAdminOffer(payload: AdminOfferPayload) {
  if (!hasSupabaseOfferConfig()) {
    throw new Error(
      "Supabase nu este configurat. Completeaza variabilele de mediu si incearca din nou.",
    );
  }

  const subtotal = roundMoney(payload.subtotal);
  const discountValue = roundMoney(payload.discountValue);
  const tvaValue = roundMoney(payload.tvaValue);
  const total = roundMoney(Math.max(0, subtotal - discountValue + tvaValue));
  const offerNumber = payload.offerNumber?.trim() || buildOfferNumber();

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(OFFERS_TABLE)
    .insert({
      inquiry_id: payload.inquiryId || null,
      offer_number: offerNumber,
      version: payload.version,
      client_name: payload.client,
      client_phone: payload.clientPhone,
      client_email: payload.clientEmail || null,
      project_title: payload.projectTitle,
      category_slug: payload.categorySlug || null,
      currency: payload.currency,
      subtotal,
      discount_value: discountValue,
      tva_value: tvaValue,
      total,
      valid_until: payload.validUntil,
      estimated_execution_days:
        payload.estimatedExecutionDays && payload.estimatedExecutionDays > 0
          ? payload.estimatedExecutionDays
          : null,
      payment_terms: payload.paymentTerms || null,
      warranty_months:
        payload.warrantyMonths && payload.warrantyMonths > 0
          ? payload.warrantyMonths
          : null,
      internal_notes: payload.internalNotes || null,
      status: payload.status,
      legal_clauses_snapshot: {},
    })
    .select(
      "id, inquiry_id, offer_number, version, client_name, client_phone, client_email, project_title, category_slug, currency, subtotal, discount_value, tva_value, total, valid_until, estimated_execution_days, status, payment_terms, warranty_months, internal_notes, created_at, updated_at",
    )
    .single();

  if (error && isMissingOffersTableError(error)) {
    throw new Error(
      "Tabela public.offers lipseste in Supabase. Ruleaza docs/supabase-offers-setup.sql si reincearca.",
    );
  }

  if (error || !data) {
    throw new Error(mapDbErrorToMessage(error, "Oferta nu a putut fi creata."));
  }

  return mapDbRowToAdminOffer(data as DbOfferRow);
}

export async function updatePersistedAdminOffer(
  id: string,
  payload: AdminOfferPayload,
) {
  if (!hasSupabaseOfferConfig()) {
    throw new Error(
      "Supabase nu este configurat. Completeaza variabilele de mediu si incearca din nou.",
    );
  }

  const subtotal = roundMoney(payload.subtotal);
  const discountValue = roundMoney(payload.discountValue);
  const tvaValue = roundMoney(payload.tvaValue);
  const total = roundMoney(Math.max(0, subtotal - discountValue + tvaValue));
  const offerNumber = payload.offerNumber?.trim() || buildOfferNumber();

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from(OFFERS_TABLE)
    .update({
      inquiry_id: payload.inquiryId || null,
      offer_number: offerNumber,
      version: payload.version,
      client_name: payload.client,
      client_phone: payload.clientPhone,
      client_email: payload.clientEmail || null,
      project_title: payload.projectTitle,
      category_slug: payload.categorySlug || null,
      currency: payload.currency,
      subtotal,
      discount_value: discountValue,
      tva_value: tvaValue,
      total,
      valid_until: payload.validUntil,
      estimated_execution_days:
        payload.estimatedExecutionDays && payload.estimatedExecutionDays > 0
          ? payload.estimatedExecutionDays
          : null,
      payment_terms: payload.paymentTerms || null,
      warranty_months:
        payload.warrantyMonths && payload.warrantyMonths > 0
          ? payload.warrantyMonths
          : null,
      internal_notes: payload.internalNotes || null,
      status: payload.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(
      "id, inquiry_id, offer_number, version, client_name, client_phone, client_email, project_title, category_slug, currency, subtotal, discount_value, tva_value, total, valid_until, estimated_execution_days, status, payment_terms, warranty_months, internal_notes, created_at, updated_at",
    )
    .single();

  if (error && isMissingOffersTableError(error)) {
    throw new Error(
      "Tabela public.offers lipseste in Supabase. Ruleaza docs/supabase-offers-setup.sql si reincearca.",
    );
  }

  if (error || !data) {
    throw new Error(mapDbErrorToMessage(error, "Oferta nu a putut fi actualizata."));
  }

  return mapDbRowToAdminOffer(data as DbOfferRow);
}
