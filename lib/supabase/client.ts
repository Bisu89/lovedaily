"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"

let client: SupabaseClient<Database> | null = null

/**
 * Browser Supabase client. Returns null when auth isn't configured yet —
 * callers should treat that as "signed out" rather than crash.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return null

  client ??= createBrowserClient<Database>(url, anonKey)

  return client
}
