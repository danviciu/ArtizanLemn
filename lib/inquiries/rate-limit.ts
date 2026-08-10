import "server-only";
import { createHash } from "node:crypto";
import { getRateLimitIpSalt } from "@/lib/env";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
};

type PersistedRateLimitRow = {
  bucket_key: string;
  request_count: number;
};

const RATE_LIMIT_TABLE_NAME = "inquiry_rate_limits";
const inMemoryFallbackStore = new Map<string, number>();
let hasLoggedPersistentRateLimitFallback = false;

function buildIpHash(clientIp: string) {
  const salt = getRateLimitIpSalt();
  return createHash("sha256").update(`${salt}:${clientIp}`).digest("hex");
}

function buildBucket(clientIp: string, windowMs: number) {
  const now = Date.now();
  const windowSlot = Math.floor(now / windowMs);
  const windowStartIso = new Date(windowSlot * windowMs).toISOString();
  const ipHash = buildIpHash(clientIp);

  return {
    bucketKey: `${ipHash}:${windowSlot}`,
    ipHash,
    windowStartIso,
    nowIso: new Date(now).toISOString(),
    windowSlot,
  };
}

function cleanupInMemoryFallbackStore(currentWindowSlot: number) {
  if (inMemoryFallbackStore.size <= 250) {
    return;
  }

  for (const key of inMemoryFallbackStore.keys()) {
    const keyParts = key.split(":");
    const slot = Number(keyParts[keyParts.length - 1]);
    if (!Number.isFinite(slot) || slot < currentWindowSlot - 2) {
      inMemoryFallbackStore.delete(key);
    }
  }
}

function evaluateInMemoryFallback(
  bucketKey: string,
  currentWindowSlot: number,
  maxRequests: number,
) {
  cleanupInMemoryFallbackStore(currentWindowSlot);
  const currentCount = inMemoryFallbackStore.get(bucketKey) ?? 0;

  if (currentCount >= maxRequests) {
    return true;
  }

  inMemoryFallbackStore.set(bucketKey, currentCount + 1);
  return false;
}

async function evaluatePersistentRateLimit(
  bucket: ReturnType<typeof buildBucket>,
  maxRequests: number,
) {
  const supabase = createSupabaseServiceRoleClient();
  const { data: existing, error: selectError } = await supabase
    .from(RATE_LIMIT_TABLE_NAME)
    .select("bucket_key, request_count")
    .eq("bucket_key", bucket.bucketKey)
    .maybeSingle<PersistedRateLimitRow>();

  if (selectError) {
    throw selectError;
  }

  if (!existing) {
    const { error: insertError } = await supabase.from(RATE_LIMIT_TABLE_NAME).insert({
      bucket_key: bucket.bucketKey,
      ip_hash: bucket.ipHash,
      window_start: bucket.windowStartIso,
      request_count: 1,
      updated_at: bucket.nowIso,
    });

    if (insertError) {
      throw insertError;
    }

    return false;
  }

  if (existing.request_count >= maxRequests) {
    return true;
  }

  const { error: updateError } = await supabase
    .from(RATE_LIMIT_TABLE_NAME)
    .update({
      request_count: existing.request_count + 1,
      updated_at: bucket.nowIso,
    })
    .eq("bucket_key", bucket.bucketKey)
    .eq("request_count", existing.request_count);

  if (updateError) {
    throw updateError;
  }

  return false;
}

export async function isInquiryRequestRateLimited(
  clientIp: string,
  options: RateLimitOptions,
) {
  const bucket = buildBucket(clientIp, options.windowMs);

  try {
    return await evaluatePersistentRateLimit(bucket, options.maxRequests);
  } catch (error) {
    if (!hasLoggedPersistentRateLimitFallback) {
      hasLoggedPersistentRateLimitFallback = true;
      console.error(
        "Rate limit persistent indisponibil, fallback in-memory pentru /api/inquiries.",
        error,
      );
    }
    return evaluateInMemoryFallback(
      bucket.bucketKey,
      bucket.windowSlot,
      options.maxRequests,
    );
  }
}
