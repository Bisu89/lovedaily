import Link from "next/link"

import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section id="final-cta" aria-labelledby="cta-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-primary px-6 py-16 text-center sm:px-16">
          <h2
            id="cta-heading"
            className="max-w-xl text-3xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-4xl"
          >
            Your next message is one click away.
          </h2>
          <p className="max-w-md text-lg text-balance text-primary-foreground/80">
            Join LoveDaily today and never struggle to find the right words
            again.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-base"
            nativeButton={false}
            render={
              <Link
                href="/generate"
                data-analytics-event="CTA Clicked"
                data-analytics-props='{"label":"Start Free","location":"final-cta"}'
              >
                Start Free
              </Link>
            }
          />
        </div>
      </div>
    </section>
  )
}
