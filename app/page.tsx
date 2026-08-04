import Link from "next/link"
import { Heart } from "lucide-react"

import { PageViewTracker } from "@/components/analytics/PageViewTracker"
import { Benefits } from "@/components/landing/Benefits"
import { CTA } from "@/components/landing/CTA"
import { FAQ } from "@/components/landing/FAQ"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { PricingPreview } from "@/components/landing/PricingPreview"
import { Tools } from "@/components/landing/Tools"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <PageViewTracker event="Landing Viewed" />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#hero-heading" className="flex items-center gap-2 font-semibold">
            <Heart className="size-5 text-primary" aria-hidden="true" />
            LoveDaily
          </a>
          <Button
            nativeButton={false}
            render={
              <Link
                href="/generate"
                data-analytics-event="CTA Clicked"
                data-analytics-props='{"label":"Start Free","location":"header"}'
              >
                Start Free
              </Link>
            }
          />
        </div>
      </header>

      <main>
        <Hero />
        <Benefits />
        <Tools />
        <HowItWorks />
        <PricingPreview />
        <FAQ />
        <CTA />
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} LoveDaily. Made for couples in Colombia.
        </div>
      </footer>
    </>
  )
}
