"use client"

import { useCallback, useState } from "react"

import type { PlanId } from "@/features/billing/types/billing"

const CHECKOUT_ENDPOINT = "/api/checkout"

export function useCheckout() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCheckout = useCallback(async (plan: PlanId) => {
    setIsRedirecting(true)
    setError(null)

    let response: Response

    try {
      response = await fetch(CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
    } catch {
      setError(
        "We couldn't reach our servers. Please check your connection and try again."
      )
      setIsRedirecting(false)
      return
    }

    const body = (await response.json().catch(() => null)) as
      | { url?: string; error?: string }
      | null

    if (!response.ok || !body?.url) {
      setError(body?.error ?? "We couldn't start checkout. Please try again.")
      setIsRedirecting(false)
      return
    }

    window.location.href = body.url
  }, [])

  return { startCheckout, isRedirecting, error }
}
