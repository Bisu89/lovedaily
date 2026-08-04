export type PlanId = "monthly" | "lifetime"

export interface CheckoutRequest {
  plan: PlanId
}

export interface CheckoutSessionResponse {
  url: string
}

export interface VerifySessionResponse {
  plan: PlanId
}
