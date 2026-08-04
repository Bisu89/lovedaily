"use client"

import { useCallback, useState } from "react"

import type { PlanId } from "@/features/billing/types/billing"

export type RecoverAccessStatus = "idle" | "loading" | "success" | "not-found" | "error"

export function useRecoverAccess() {
  const [status, setStatus] = useState<RecoverAccessStatus>("idle")

  const recover = useCallback(async (email: string): Promise<PlanId | null> => {
    setStatus("loading")

    let response: Response

    try {
      response = await fetch("/api/billing/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    } catch {
      setStatus("error")
      return null
    }

    const body = (await response.json().catch(() => null)) as
      | { plan?: PlanId }
      | null

    if (!response.ok || !body?.plan) {
      setStatus(response.status === 404 ? "not-found" : "error")
      return null
    }

    setStatus("success")
    return body.plan
  }, [])

  return { status, recover }
}
