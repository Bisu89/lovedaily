"use client"

import { useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LoginFormProps {
  redirectTo: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const supabase = getSupabaseBrowserClient()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  if (!supabase) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Sign-in isn&apos;t configured yet. Please try again later.
      </p>
    )
  }

  async function handleGoogleSignIn() {
    await supabase!.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })
  }

  async function handleEmailSignIn(event: React.FormEvent) {
    event.preventDefault()
    setStatus("sending")

    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })

    setStatus(error ? "error" : "sent")
  }

  if (status === "sent") {
    return (
      <p className="text-center text-sm text-muted-foreground">
        💌 Check your email — we sent you a link to sign in.
      </p>
    )
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Button size="lg" className="h-12 text-base" onClick={() => void handleGoogleSignIn()}>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
        or
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>

      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-2">
        <Input
          type="email"
          required
          aria-label="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className="h-12"
        />
        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="h-12 text-base"
          disabled={status === "sending"}
        >
          Continue with Email
        </Button>
        {status === "error" ? (
          <p role="alert" className="text-center text-xs text-destructive">
            Something went wrong. Please try again.
          </p>
        ) : null}
      </form>
    </div>
  )
}
