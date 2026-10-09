import { createClient } from "@supabase/supabase-js";

let authClient;

export function getAuthClient() {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;

  if (!authClient) {
    authClient = createClient(url, publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return authClient;
}
