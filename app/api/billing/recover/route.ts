import { NextResponse } from "next/server"

import {
  BillingServiceError,
  verifyPremiumByEmail,
} from "@/services/billing/stripe.service"
import {
  COOKIE_IS_SECURE,
  PREMIUM_COOKIE_MAX_AGE_SECONDS,
  PREMIUM_COOKIE_NAME,
} from "@/services/billing/cookies"
import { encodePremiumToken } from "@/services/billing/premiumToken"

export const runtime = "nodejs"

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  let email: string

  try {
    const body = await request.json()
    email = typeof body?.email === "string" ? body.email.trim() : ""
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 }
    )
  }

  try {
    const result = await verifyPremiumByEmail(email)

    if (!result) {
      return NextResponse.json(
        { error: "We couldn't find an active Premium purchase for that email." },
        { status: 404 }
      )
    }

    const response = NextResponse.json({ plan: result.plan })

    const premiumToken = encodePremiumToken(result)
    if (premiumToken) {
      response.cookies.set(PREMIUM_COOKIE_NAME, premiumToken, {
        httpOnly: true,
        path: "/",
        maxAge: PREMIUM_COOKIE_MAX_AGE_SECONDS,
        sameSite: "lax",
        secure: COOKIE_IS_SECURE,
      })
    }

    return response
  } catch (caught) {
    if (caught instanceof BillingServiceError) {
      return NextResponse.json(
        { error: caught.message },
        { status: caught.status }
      )
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
