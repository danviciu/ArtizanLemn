import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import type { AdminOffer } from "@/types/admin";

export const OFFER_PDF_BUCKET = "offer-pdfs";

const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

type UploadOfferPdfOptions = {
  offer: AdminOffer;
  fileName: string;
  pdfBytes: Uint8Array;
  signedUrlTtlSeconds?: number;
};

type UploadedOfferPdf = {
  path: string;
  signedUrl: string;
  signedUrlExpiresInSeconds: number;
};

function sanitizeSegment(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return normalized || "oferta";
}

function isBucketMissingErrorMessage(message?: string) {
  const lowered = message?.toLowerCase() ?? "";
  return (
    lowered.includes("not found") ||
    lowered.includes("does not exist") ||
    lowered.includes("bucket not found")
  );
}

async function ensureOfferPdfBucketExists() {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase.storage.getBucket(OFFER_PDF_BUCKET);

  if (data && !error) {
    return;
  }

  if (error && !isBucketMissingErrorMessage(error.message)) {
    throw new Error(`Nu am putut verifica bucket-ul ${OFFER_PDF_BUCKET}: ${error.message}`);
  }

  const { error: createError } = await supabase.storage.createBucket(OFFER_PDF_BUCKET, {
    public: false,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ["application/pdf"],
  });

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    throw new Error(
      `Nu am putut crea bucket-ul ${OFFER_PDF_BUCKET}: ${createError.message}`,
    );
  }
}

function buildOfferPdfPath(offer: AdminOffer, fileName: string) {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
  const safeOfferNumber = sanitizeSegment(offer.offerNumber);
  const token = crypto.randomUUID().slice(0, 8);
  return `${year}/${month}/${safeOfferNumber}/${token}-${fileName}`;
}

export async function uploadOfferPdfAndCreateSignedUrl(
  options: UploadOfferPdfOptions,
): Promise<UploadedOfferPdf> {
  await ensureOfferPdfBucketExists();

  const supabase = createSupabaseServiceRoleClient();
  const signedUrlTtlSeconds =
    options.signedUrlTtlSeconds ?? DEFAULT_SIGNED_URL_TTL_SECONDS;
  const storagePath = buildOfferPdfPath(options.offer, options.fileName);

  const { error: uploadError } = await supabase.storage
    .from(OFFER_PDF_BUCKET)
    .upload(storagePath, Buffer.from(options.pdfBytes), {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Nu am putut urca PDF-ul ofertei in Storage: ${uploadError.message}`);
  }

  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(OFFER_PDF_BUCKET)
    .createSignedUrl(storagePath, signedUrlTtlSeconds, {
      download: options.fileName,
    });

  if (signedUrlError || !signedUrlData?.signedUrl) {
    throw new Error(
      signedUrlError?.message || "Nu am putut genera link-ul securizat pentru PDF.",
    );
  }

  return {
    path: storagePath,
    signedUrl: signedUrlData.signedUrl,
    signedUrlExpiresInSeconds: signedUrlTtlSeconds,
  };
}
