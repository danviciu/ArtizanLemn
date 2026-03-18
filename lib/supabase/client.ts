import { createClient } from "@supabase/supabase-js";

function getRequiredPublicEnvVar(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY",
) {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Lipseste variabila de mediu obligatorie: ${name}`);
  }

  return value.trim();
}

export function createSupabaseBrowserClient() {
  const url = getRequiredPublicEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getRequiredPublicEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient(url, anonKey);
}
