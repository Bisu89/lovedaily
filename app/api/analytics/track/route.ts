import { NextResponse } from "next/server"

import { getSupabaseAdminClient } from "@/lib/supabase/admin"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const adminClient = getSupabaseAdminClient()

  // Analytics persistence is optional — never error the caller over it.
  if (!adminClient) {
    return NextResponse.json({ received: false })
  }

  let event: string
  let properties: Record<string, unknown> | undefined

  try {
    const body = await request.json()
    event = typeof body?.event === "string" ? body.event : ""
    properties = typeof body?.properties === "object" ? body.properties : undefined
  } catch {
    return NextResponse.json({ received: false })
  }

  if (!event) {
    return NextResponse.json({ received: false })
  }

  const supabase = await getSupabaseServerClient()
  const userId = supabase ? (await supabase.auth.getUser()).data.user?.id ?? null : null

  await adminClient.from("feature_events").insert({
    user_id: userId,
    event_name: event,
    properties,
  })

  return NextResponse.json({ received: true })
}
