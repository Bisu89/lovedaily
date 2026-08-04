"use client"

import { useCallback, useEffect, useState } from "react"

import type { PlanId } from "@/features/billing/types/billing"

export interface BillingStatus {
  isPremium: boolean
  plan: PlanId | null
  remaining: number | null
  dailyLimit: number
}

const INITIAL_STATUS: BillingStatus = {
  isPremium: false,
  plan: null,
  remaining: null,
  dailyLimit: 3,
}

/**
 * Server-verified billing status (Premium plan + remaining free letters).
 * The server is the only thing that can grant Premium or record usage —
 * this hook just asks it what's true. Refresh after any action that could
 * change it (checkout success, recovered access, a completed generation).
 */
export function useBillingStatus() {
  const [status, setStatus] = useState<BillingStatus>(INITIAL_STATUS)
  const [loaded, setLoaded] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/billing/status")
      if (!response.ok) return

      const body = (await response.json()) as BillingStatus
      setStatus(body)
    } catch {
      // Keep the previous status; a transient network error here shouldn't
      // flip the UI into a broken state.
    } finally {
      setLoaded(true)
    }
  }, [])

  // Server state can't be known during the initial render, so this fetches
  // it once on mount — the standard data-fetch-then-setState pattern.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh()
  }, [refresh])

  const canGenerate = status.isPremium || (status.remaining ?? status.dailyLimit) > 0

  return { ...status, loaded, canGenerate, refresh }
}
