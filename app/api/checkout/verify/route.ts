import { NextResponse } from "next/server"

import {
  BillingServiceError,
  verifyCheckoutSession,
} from "@/services/billing/stripe.service"
import {
  COOKIE_IS_SECURE,
  PREMIUM_COOKIE_MAX_AGE_SECONDS,
  PREMIUM_COOKIE_NAME,
} from "@/services/billing/cookies"
import { encodePremiumToken } from "@/services/billing/premiumToken"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session id." }, { status: 400 })
  }

  try {
    const result = await verifyCheckoutSession(sessionId)

    if (!result) {
      return NextResponse.json(
        { error: "Payment not confirmed." },
        { status: 402 }
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
