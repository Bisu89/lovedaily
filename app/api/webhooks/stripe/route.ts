import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { getStripeClient } from "@/services/billing/stripe.service"
import { notifyFounder } from "@/services/billing/notifyFounder"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook isn't configured." },
      { status: 500 }
    )
  }

  const rawBody = await request.text()

  let event: Stripe.Event

  try {
    event = await getStripeClient().webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    notifyFounder({
      plan: session.mode === "subscription" ? "monthly" : "lifetime",
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email ?? null,
    })
  }

  return NextResponse.json({ received: true })
}
