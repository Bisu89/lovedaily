import type { PlanId } from "@/features/billing/types/billing"

export type CheckoutMode = "subscription" | "payment"

export interface PlanConfig {
  id: PlanId
  label: string
  priceDisplay: string
  priceValue: number
  currency: string
  mode: CheckoutMode
  priceEnvVar: string
}

export const PLANS: Record<PlanId, PlanConfig> = {
  monthly: {
    id: "monthly",
    label: "Premium Monthly",
    priceDisplay: "$9/month",
    priceValue: 9,
    currency: "USD",
    mode: "subscription",
    priceEnvVar: "STRIPE_PRICE_MONTHLY",
  },
  lifetime: {
    id: "lifetime",
    label: "Lifetime",
    priceDisplay: "$49 one-time",
    priceValue: 49,
    currency: "USD",
    mode: "payment",
    priceEnvVar: "STRIPE_PRICE_LIFETIME",
  },
}

export function isPlanId(value: string): value is PlanId {
  return value === "monthly" || value === "lifetime"
}
