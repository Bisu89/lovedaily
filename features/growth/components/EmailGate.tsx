"use client"

import { useState } from "react"

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type GateStatus = "idle" | "loading" | "error"

interface EmailGateProps {
  onUnlocked: (email: string) => void
}

/**
 * Requires an email before the generator can be used — the "Email login"
 * fallback from the growth-first spec, usable without a live Supabase
 * project. Also feeds the same growth list as EmailCapture (/api/subscribe).
 */
export function EmailGate({ onUnlocked }: EmailGateProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<GateStatus>("idle")
  const { track } = useAnalytics()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "generate_gate" }),
      })

      if (!response.ok) {
        setStatus("error")
        return
      }

      track("CTA Clicked", { label: "Email gate", location: "generate" })
      onUnlocked(email)
    } catch {
      setStatus("error")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-3 rounded-lg border bg-muted/30 p-6 text-center"
    >
      <p className="text-sm font-medium">
        Enter your email to start writing — it&apos;s free.
      </p>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Input
          type="email"
          required
          aria-label="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className="h-10 w-64"
        />
        <Button type="submit" disabled={status === "loading"}>
          Continue
        </Button>
      </div>
      {status === "error" ? (
        <p role="alert" className="text-xs text-destructive">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  )
}
