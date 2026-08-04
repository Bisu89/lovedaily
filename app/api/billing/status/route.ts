import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import {
  DAILY_FREE_LIMIT,
  PREMIUM_COOKIE_NAME,
  USAGE_COOKIE_NAME,
} from "@/services/billing/cookies"
import { decodePremiumToken } from "@/services/billing/premiumToken"
import { decodeUsageToken } from "@/services/billing/usageToken"

export const runtime = "nodejs"

export interface BillingStatusResponse {
  isPremium: boolean
  plan: "monthly" | "lifetime" | null
  remaining: number | null
  dailyLimit: number
}

export async function GET() {
  const cookieStore = await cookies()

  const premium = decodePremiumToken(cookieStore.get(PREMIUM_COOKIE_NAME)?.value)

  if (premium) {
    const body: BillingStatusResponse = {
      isPremium: true,
      plan: premium.plan,
      remaining: null,
      dailyLimit: DAILY_FREE_LIMIT,
    }
    return NextResponse.json(body)
  }

  const usedToday = decodeUsageToken(cookieStore.get(USAGE_COOKIE_NAME)?.value)

  const body: BillingStatusResponse = {
    isPremium: false,
    plan: null,
    remaining: Math.max(0, DAILY_FREE_LIMIT - usedToday),
    dailyLimit: DAILY_FREE_LIMIT,
  }

  return NextResponse.json(body)
}
