"use client"

import { Sparkles } from "lucide-react"

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import { useCheckout } from "@/features/billing/hooks/useCheckout"
import type { PlanId } from "@/features/billing/types/billing"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const PREMIUM_BENEFITS = [
  "Cards worth printing and keeping forever",
  "Never stare at a blank page again",
  "Never run out of ways to say I love you",
  "The perfect words ready for every anniversary",
  "A new spark every day, without having to think of it yourself",
]

interface PlanButtonConfig {
  plan: PlanId
  emoji: string
  headline: string
  priceNote: string
}

const PLAN_BUTTONS: PlanButtonConfig[] = [
  {
    plan: "monthly",
    emoji: "❤️",
    headline: "Unlock Unlimited Love",
    priceNote: "$9/month · less than a coffee ☕",
  },
  {
    plan: "lifetime",
    emoji: "💍",
    headline: "Get Lifetime Access",
    priceNote: "$49 once, yours forever",
  },
]

interface PremiumUpsellProps {
  title: string
  description: string
  location: string
  recommendedPlan?: PlanId
}

export function PremiumUpsell({
  title,
  description,
  location,
  recommendedPlan,
}: PremiumUpsellProps) {
  const { track } = useAnalytics()
  const { startCheckout, isRedirecting, error } = useCheckout()

  function handleClick(plan: PlanId) {
    track("Premium Clicked", { location, plan })
    void startCheckout(plan)
  }

  return (
    <Card className="gap-4 rounded-3xl border-primary/20 bg-accent/20 p-2">
      <CardContent className="flex flex-col items-center gap-4 py-6 text-center sm:py-8">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent">
          <Sparkles className="size-5 text-primary" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <ul className="flex flex-col gap-2 text-left text-sm">
          {PREMIUM_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2">
              <span aria-hidden="true">✨</span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {PLAN_BUTTONS.map((config) => (
            <div key={config.plan} className="flex flex-col items-center gap-1.5">
              {recommendedPlan === config.plan ? (
                <Badge className="bg-primary text-primary-foreground">
                  Most popular
                </Badge>
              ) : null}
              <Button
                type="button"
                variant={config.plan === "monthly" ? "default" : "outline"}
                size="lg"
                className={cn("h-auto flex-col gap-0.5 px-6 py-2.5 text-base")}
                onClick={() => handleClick(config.plan)}
                disabled={isRedirecting}
              >
                <span>
                  {config.emoji} {config.headline}
                </span>
                <span className="text-xs font-normal opacity-80">
                  {config.priceNote}
                </span>
              </Button>
            </div>
          ))}
        </div>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <Badge variant="outline">Secure checkout via Stripe</Badge>
      </CardContent>
    </Card>
  )
}
