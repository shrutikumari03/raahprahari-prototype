
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/env";

/** Thrown when the browser build lacks public Supabase configuration. */
export class SupabaseConfigError extends Error {
  constructor(missing: string[]) {
    super(
      `Supabase is not configured. Missing environment variable(s): ${missing.join(", ")}. ` +
        "Set them in .env.local and restart the dev server."
    );
    this.name = "SupabaseConfigError";
  }
}

let client: SupabaseClient | null = null;

/** True when public Supabase configuration is present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl.trim() && env.supabaseAnonKey.trim());
}

/**
 * Returns the browser Supabase client.
 * Only the public URL and anon key are used.
 * Role checks must still be enforced by the backend (RLS).
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) return client;

  if (typeof window === "undefined") {
    throw new Error("The Supabase browser client is unavailable during SSR.");
  }

  const url = env.supabaseUrl.trim();
  const anonKey = env.supabaseAnonKey.trim();

  const missing = [
    !url && "VITE_SUPABASE_URL",
    !anonKey && "VITE_SUPABASE_ANON_KEY",
  ].filter((name): name is string => Boolean(name));

  if (!url || !anonKey) {
    throw new SupabaseConfigError(missing);
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Email links carry a one-time `code`; /auth/callback exchanges it
      // explicitly, so the client must not also consume it on load.
      flowType: "pkce",
      detectSessionInUrl: false,
    },
  });

  return client;
}
