import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import {
  BillingServiceError,
  createBillingPortalSession,
} from "@/services/billing/stripe.service"
import { PREMIUM_COOKIE_NAME } from "@/services/billing/cookies"
import { decodePremiumToken } from "@/services/billing/premiumToken"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const premium = decodePremiumToken(cookieStore.get(PREMIUM_COOKIE_NAME)?.value)

  if (!premium) {
    return NextResponse.json(
      { error: "No active Premium subscription found." },
      { status: 404 }
    )
  }

  try {
    const origin = new URL(request.url).origin
    const url = await createBillingPortalSession(
      premium.customerId,
      `${origin}/generate`
    )
    return NextResponse.json({ url })
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
