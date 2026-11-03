import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for analytics.
 *
 * Uses the service-role key, which bypasses RLS. This client MUST never be
 * imported from client components or exposed to the browser. It is only used
 * inside API routes (track, stats) and only after authorization checks.
 *
 * Environment variables (server-side only):
 *   SUPABASE_URL              - your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - service-role secret key (never expose to client)
 */

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
