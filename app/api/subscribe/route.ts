import { NextResponse } from "next/server"

import { subscribeEmail } from "@/services/growth/subscribeEmail.service"

export const runtime = "nodejs"

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  let email: string
  let source: string

  try {
    const body = await request.json()
    email = typeof body?.email === "string" ? body.email.trim() : ""
    source = typeof body?.source === "string" ? body.source : "unknown"
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 }
    )
  }

  await subscribeEmail({ email, source })

  return NextResponse.json({ success: true })
}
