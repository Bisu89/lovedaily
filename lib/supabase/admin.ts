import { createClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"

let adminClient: SupabaseClient<Database> | null = null

/**
 * Service-role client — bypasses Row Level Security. Server-only, never
 * import this into a Client Component or leak SUPABASE_SERVICE_ROLE_KEY to
 * the browser. Used for admin-dashboard queries that read across all users.
 */
export function getSupabaseAdminClient(): SupabaseClient<Database> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return null

  adminClient ??= createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  return adminClient
}
