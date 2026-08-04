import Link from "next/link"
import { Heart, Send, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      >
        <div className="aspect-1155/678 w-6xl bg-linear-to-tr from-primary/30 to-primary/5 opacity-40" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-32 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Sparkles className="size-4" aria-hidden="true" />
            AI-powered relationship content
          </span>

          <h1
            id="hero-heading"
            className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Everything you need to express love beautifully.
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground text-balance sm:text-xl">
            Generate heartfelt letters, messages and relationship ideas in
            seconds with AI.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 px-8 text-base"
              nativeButton={false}
              render={
                <Link
                  href="/generate"
                  data-analytics-event="CTA Clicked"
                  data-analytics-props='{"label":"Start Free","location":"hero"}'
                >
                  Start Free
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              nativeButton={false}
              render={
                <a
                  href="#tools"
                  data-analytics-event="CTA Clicked"
                  data-analytics-props='{"label":"See Examples","location":"hero"}'
                >
                  See Examples
                </a>
              }
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-md">
          <div className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Heart className="size-4 text-primary" aria-hidden="true" />
              Love Letter · Anniversary
            </div>
            <p className="mt-6 font-serif text-lg leading-relaxed text-balance italic">
              &ldquo;My love, every sunrise reminds me that choosing you is
              the easiest, most beautiful decision I make each day. Three
              years in, and you still feel like the best part of my
              story.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
              <Send className="size-4" aria-hidden="true" />
              Generated in 8 seconds
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
