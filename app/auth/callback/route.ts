import { NextResponse } from "next/server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/generate"

  if (code) {
    const supabase = await getSupabaseServerClient()
    if (supabase) {
      const { data } = await supabase.auth.exchangeCodeForSession(code)

      if (data.user) {
        // Vercel sets this header automatically at the edge — no external
        // geolocation lookup needed. Absent when running locally.
        const country = request.headers.get("x-vercel-ip-country")

        await supabase
          .from("profiles")
          .update({
            last_login_at: new Date().toISOString(),
            ...(country ? { country } : {}),
          })
          .eq("id", data.user.id)
      }
    }
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
