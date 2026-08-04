import { HeartCrack } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-destructive/30 bg-destructive/5 p-12 text-center"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
        <HeartCrack className="size-5 text-destructive" aria-hidden="true" />
      </span>
      <p className="text-base text-foreground">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  )
}
