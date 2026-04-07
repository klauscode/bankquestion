import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig, getSupabaseServiceRoleKey } from "@/lib/supabase/config";

export function createAdminClient() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
