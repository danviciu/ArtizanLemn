import "server-only";

const DEFAULT_NOTIFICATION_EMAILS = ["contact@artizanlemn.ro"];
const DEFAULT_NOTIFICATION_EMAIL_FROM = "Artizan Lemn <onboarding@resend.dev>";
const DEFAULT_PRODUCT_IMAGES_BUCKET = "catalog-images";

function getRequiredEnvVar(name: string) {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Lipseste variabila de mediu obligatorie: ${name}`);
  }

  return value.trim();
}

export function getSupabasePublicEnv() {
  return {
    url: getRequiredEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getRequiredEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getSupabaseServiceRoleKey() {
  return getRequiredEnvVar("SUPABASE_SERVICE_ROLE_KEY");
}

export function getResendApiKey() {
  return getRequiredEnvVar("RESEND_API_KEY");
}

function parseNotificationEmails(rawValue?: string | null) {
  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export function getNotificationEmails() {
  const configuredEmails = parseNotificationEmails(process.env.NOTIFICATION_EMAIL);
  return configuredEmails.length ? configuredEmails : DEFAULT_NOTIFICATION_EMAILS;
}

export function getNotificationEmailFrom() {
  return process.env.NOTIFICATION_EMAIL_FROM?.trim() || DEFAULT_NOTIFICATION_EMAIL_FROM;
}

export function getProductImagesBucketName() {
  const configuredBucket = process.env.PRODUCT_IMAGES_BUCKET?.trim();
  return configuredBucket || DEFAULT_PRODUCT_IMAGES_BUCKET;
}
