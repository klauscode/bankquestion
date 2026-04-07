"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/lib/supabase/config";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  const { url, publishableKey } = getSupabaseConfig();
  client = createBrowserClient(url, publishableKey);

  return client;
}
