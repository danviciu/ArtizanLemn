type SupabaseConfig = {
  url: string;
  anonKey: string;
};

function getPublicEnvVar(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
) {
  return process.env[name]?.trim() ?? "";
}

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: getPublicEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getPublicEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function hasSupabaseConfig() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

export const supabaseIntegrationReady = hasSupabaseConfig();
