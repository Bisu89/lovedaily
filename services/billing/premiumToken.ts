import { sign, verify } from "@/lib/signedToken"
import { isPlanId } from "@/services/billing/plans"
import type { PlanId } from "@/features/billing/types/billing"

export interface PremiumPayload {
  plan: PlanId
  customerId: string
}

/**
 * Encodes plan + Stripe customer id into a tamper-proof cookie value.
 * Returns null if COOKIE_SIGNING_SECRET isn't configured yet.
 */
export function encodePremiumToken(payload: PremiumPayload): string | null {
  return sign(`${payload.plan}|${payload.customerId}`)
}

/** Decodes and verifies a premium cookie value. Returns null if invalid. */
export function decodePremiumToken(
  token: string | undefined | null
): PremiumPayload | null {
  const raw = verify(token)
  if (!raw) return null

  const [plan, customerId] = raw.split("|")
  if (!plan || !customerId || !isPlanId(plan)) return null

  return { plan, customerId }
}
