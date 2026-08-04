import Link from "next/link"
import { Check } from "lucide-react"

import { SectionHeading } from "@/components/landing/SectionHeading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try LoveDaily with no commitment.",
    features: ["3 AI generations per day", "Copy text instantly", "Basic templates"],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Premium",
    price: "$9",
    period: "/month",
    description: "Unlimited words, whenever inspiration strikes.",
    features: [
      "Unlimited generations",
      "Download as PDF",
      "Save your history",
      "Premium templates",
      "Faster AI responses",
    ],
    cta: "Go Premium",
    featured: true,
  },
]

export function PricingPreview() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-muted/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          headingId="pricing-heading"
          eyebrow="Pricing"
          title="Start free. Upgrade when you're ready."
          description="A lifetime plan is also available for $49 — everything in Premium, forever, with future updates included."
        />

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.featured
                  ? "p-2 ring-2 ring-primary"
                  : "p-2"
              }
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.featured ? (
                    <Badge className="bg-primary text-primary-foreground">
                      Most popular
                    </Badge>
                  ) : null}
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <p className="mt-2">
                  <span className="text-3xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    {plan.period}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.featured ? "default" : "outline"}
                  nativeButton={false}
                  render={
                    <Link
                      href="/generate"
                      data-analytics-event={
                        plan.featured ? "Premium Clicked" : "CTA Clicked"
                      }
                      data-analytics-props={JSON.stringify({
                        label: plan.cta,
                        location: "pricing",
                      })}
                    >
                      {plan.cta}
                    </Link>
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
