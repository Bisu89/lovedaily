import { Heart } from "lucide-react"

export function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-accent/30 p-14 text-center"
    >
      <Heart
        className="size-7 animate-pulse text-primary"
        fill="currentColor"
        aria-hidden="true"
      />
      <p className="font-serif text-lg text-balance text-foreground/80 italic">
        Finding the perfect words for your someone special...
      </p>
    </div>
  )
}
