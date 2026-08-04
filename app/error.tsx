"use client"

import { useEffect } from "react"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <Heart className="size-10 text-primary" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Something went wrong.
        </h1>
        <p className="max-w-md text-muted-foreground">
          We hit a snag on our end. Please try again — your words are worth
          the wait.
        </p>
      </div>
      <Button size="lg" onClick={reset}>
        Try Again
      </Button>
    </main>
  )
}
