import "server-only";

const DEFAULT_NOTIFICATION_EMAIL = "contact@artizanlemn.ro";

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

export function getNotificationEmail() {
  return process.env.NOTIFICATION_EMAIL?.trim() || DEFAULT_NOTIFICATION_EMAIL;
}
