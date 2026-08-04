"use client"

import { useState } from "react"

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import { useEmailCapture } from "@/features/growth/hooks/useEmailCapture"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EmailCaptureProps {
  source: string
  /** Already-known email (e.g. a signed-in user) — skips re-asking for it. */
  email?: string
}

export function EmailCapture({ source, email: knownEmail }: EmailCaptureProps) {
  const [email, setEmail] = useState("")
  const { status, submit } = useEmailCapture()
  const { track } = useAnalytics()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    track("CTA Clicked", { label: "Email capture", location: source })
    void submit(knownEmail ?? email, source)
  }

  if (status === "success") {
    return (
      <p className="text-sm text-muted-foreground">
        💌 You&apos;re on the list! We&apos;ll send fresh ideas your way.
      </p>
    )
  }

  if (knownEmail) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Want more ideas like this sent to {knownEmail}?
        </p>
        <Button type="submit" variant="outline" size="sm" disabled={status === "loading"}>
          💌 Yes, notify me
        </Button>
        {status === "error" ? (
          <p role="alert" className="text-xs text-destructive">
            Something went wrong. Please try again.
          </p>
        ) : null}
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-2"
    >
      <p className="text-sm text-muted-foreground">
        Want more ideas like this? Get them in your inbox.
      </p>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Input
          type="email"
          required
          aria-label="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className="h-10 max-w-xs"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={status === "loading"}
        >
          ✨ Notify Me
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
