import Link from "next/link"
import { Heart } from "lucide-react"

import { PageViewTracker } from "@/features/analytics/components/PageViewTracker"
import { Benefits } from "@/components/landing/Benefits"
import { CTA } from "@/components/landing/CTA"
import { FAQ } from "@/components/landing/FAQ"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Tools } from "@/components/landing/Tools"
import { SupportButton } from "@/features/growth/components/SupportButton"
import { Button } from "@/components/ui/button"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "LoveDaily",
  url: siteUrl,
  description:
    "Generate heartfelt letters, messages and relationship ideas in seconds with AI.",
  applicationCategory: "LifestyleApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageViewTracker event="Landing Viewed" />

      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#hero-heading" className="flex items-center gap-2 font-semibold">
            <Heart className="size-5 text-primary" aria-hidden="true" />
            LoveDaily
          </a>
          <div className="flex items-center gap-2">
            <SupportButton location="header" />
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
        </div>
      </header>

      <main>
        <Hero />
        <Benefits />
        <Tools />
        <HowItWorks />
        {/* PricingPreview is intentionally not rendered — no paid plan
            exists yet (growth-first launch). Component is kept in
            components/landing/PricingPreview.tsx for when Premium ships. */}
        <FAQ />
        <CTA />
      </main>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <SupportButton location="footer" />
          <p>© {new Date().getFullYear()} LoveDaily. Made for couples in Colombia.</p>
        </div>
      </footer>
    </>
  )
}
