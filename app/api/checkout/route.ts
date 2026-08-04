import { NextResponse } from "next/server"

import { isPlanId } from "@/services/billing/plans"
import {
  BillingServiceError,
  createCheckoutSession,
} from "@/services/billing/stripe.service"

export const runtime = "nodejs"

export async function POST(request: Request) {
  let plan: string

  try {
    const body = await request.json()
    plan = typeof body?.plan === "string" ? body.plan : ""
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  if (!isPlanId(plan)) {
    return NextResponse.json(
      { error: "Please choose a valid plan." },
      { status: 400 }
    )
  }

  try {
    const origin = new URL(request.url).origin
    const url = await createCheckoutSession(plan, origin)
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
