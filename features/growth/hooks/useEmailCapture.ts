"use client"

import { useCallback, useState } from "react"

export type EmailCaptureStatus = "idle" | "loading" | "success" | "error"

export function useEmailCapture() {
  const [status, setStatus] = useState<EmailCaptureStatus>("idle")

  const submit = useCallback(async (email: string, source: string) => {
    setStatus("loading")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      })

      if (!response.ok) {
        setStatus("error")
        return
      }

      setStatus("success")
    } catch {
      setStatus("error")
    }
  }, [])

  return { status, submit }
}
