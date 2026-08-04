"use client"

import { useCallback, useState } from "react"

export function useBillingPortal() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openPortal = useCallback(async () => {
    setIsRedirecting(true)
    setError(null)

    let response: Response

    try {
      response = await fetch("/api/billing/portal", { method: "POST" })
    } catch {
      setError("We couldn't reach our servers. Please try again.")
      setIsRedirecting(false)
      return
    }

    const body = (await response.json().catch(() => null)) as
      | { url?: string; error?: string }
      | null

    if (!response.ok || !body?.url) {
      setError(body?.error ?? "We couldn't open the billing portal.")
      setIsRedirecting(false)
      return
    }

    window.location.href = body.url
  }, [])

  return { openPortal, isRedirecting, error }
}
