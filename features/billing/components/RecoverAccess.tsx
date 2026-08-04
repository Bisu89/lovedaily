"use client"

import { useState } from "react"

import { useAnalytics } from "@/hooks/useAnalytics"
import { useRecoverAccess } from "@/features/billing/hooks/useRecoverAccess"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RecoverAccessProps {
  onRecovered: () => void
}

export function RecoverAccess({ onRecovered }: RecoverAccessProps) {
  const [expanded, setExpanded] = useState(false)
  const [email, setEmail] = useState("")
  const { status, recover } = useRecoverAccess()
  const { track } = useAnalytics()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    track("CTA Clicked", { label: "Restore access", location: "recover" })

    const plan = await recover(email)
    if (plan) {
      onRecovered()
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-muted-foreground">
        🎉 Welcome back! Your Premium access has been restored.
      </p>
    )
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Already purchased Premium? Restore access
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
      <p className="text-sm text-muted-foreground">
        Enter the email you used to purchase Premium.
      </p>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Input
          type="email"
          required
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
          Restore Access
        </Button>
      </div>
      {status === "not-found" ? (
        <p role="alert" className="text-xs text-destructive">
          We couldn&apos;t find an active Premium purchase for that email.
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-xs text-destructive">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  )
}
