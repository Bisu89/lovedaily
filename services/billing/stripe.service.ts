import Stripe from "stripe"

import type { PlanId } from "@/features/billing/types/billing"
import { PLANS } from "@/services/billing/plans"

export class BillingServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "BillingServiceError"
  }
}

export interface PremiumLookupResult {
  plan: PlanId
  customerId: string
}

let client: Stripe | null = null

export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new BillingServiceError(
      "Billing isn't configured yet. Please try again later.",
      500
    )
  }

  client ??= new Stripe(process.env.STRIPE_SECRET_KEY)

  return client
}

function extractCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
): string | null {
  if (!customer) return null
  return typeof customer === "string" ? customer : customer.id
}

/**
 * Creates a Stripe-hosted Checkout Session and returns its URL. Callers only
 * ever depend on this function's signature — swapping billing providers
 * later never touches the route or the UI.
 */
export async function createCheckoutSession(
  plan: PlanId,
  origin: string
): Promise<string> {
  const config = PLANS[plan]
  const priceId = process.env[config.priceEnvVar]

  if (!priceId) {
    throw new BillingServiceError(
      "Billing isn't configured yet. Please try again later.",
      500
    )
  }

  let session: Stripe.Checkout.Session

  try {
    session = await getStripeClient().checkout.sessions.create({
      mode: config.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/generate?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/generate?checkout=cancelled`,
      locale: "es",
      // Subscriptions always get a Customer automatically. One-time
      // "payment" mode sessions don't by default — force it so lifetime
      // purchases can later be looked up by email (see
      // verifyPremiumByEmail below).
      ...(config.mode === "payment" ? { customer_creation: "always" as const } : {}),
    })
  } catch (caught) {
    if (caught instanceof BillingServiceError) throw caught
    throw new BillingServiceError(
      "We couldn't start checkout. Please try again.",
      502
    )
  }

  if (!session.url) {
    throw new BillingServiceError(
      "We couldn't start checkout. Please try again.",
      502
    )
  }

  return session.url
}

/**
 * Confirms a Checkout Session directly with Stripe (not just trusting the
 * redirect query string) and reports which plan was paid for, plus the
 * Stripe customer id (needed later to open the billing portal). This is
 * what lets the UI unlock Premium instantly, without waiting on the webhook.
 */
export async function verifyCheckoutSession(
  sessionId: string
): Promise<PremiumLookupResult | null> {
  let session: Stripe.Checkout.Session

  try {
    session = await getStripeClient().checkout.sessions.retrieve(sessionId)
  } catch {
    return null
  }

  if (session.payment_status !== "paid") {
    return null
  }

  const customerId = extractCustomerId(session.customer)
  if (!customerId) return null

  return {
    plan: session.mode === "subscription" ? "monthly" : "lifetime",
    customerId,
  }
}

const ACTIVE_SUBSCRIPTION_STATUSES: Stripe.Subscription.Status[] = [
  "active",
  "trialing",
]

/**
 * Looks up whether an email address belongs to a Stripe Customer with a
 * currently-valid Premium purchase (an active/trialing subscription, or any
 * past one-time Lifetime payment). Used to restore Premium on a new device
 * without needing accounts — Stripe itself is the identity source of truth.
 */
export async function verifyPremiumByEmail(
  email: string
): Promise<PremiumLookupResult | null> {
  const client = getStripeClient()

  const customers = await client.customers.list({ email, limit: 1 })
  const customer = customers.data[0]
  if (!customer) return null

  const sessions = await client.checkout.sessions.list({
    customer: customer.id,
    limit: 20,
  })

  for (const session of sessions.data) {
    if (session.payment_status !== "paid") continue

    if (session.mode === "payment") {
      return { plan: "lifetime", customerId: customer.id }
    }

    if (session.mode === "subscription" && session.subscription) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id

      const subscription = await client.subscriptions.retrieve(subscriptionId)

      if (ACTIVE_SUBSCRIPTION_STATUSES.includes(subscription.status)) {
        return { plan: "monthly", customerId: customer.id }
      }
    }
  }

  return null
}

/**
 * Creates a Stripe Billing Portal session so a Premium customer can manage
 * or cancel their subscription without us building any of that UI.
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  try {
    const session = await getStripeClient().billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return session.url
  } catch (caught) {
    if (caught instanceof BillingServiceError) throw caught
    throw new BillingServiceError(
      "We couldn't open the billing portal. Please try again.",
      502
    )
  }
}
