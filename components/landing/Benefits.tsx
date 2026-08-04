import { Languages, MessagesSquare, Sparkles, Zap } from "lucide-react"

import { SectionHeading } from "@/components/landing/SectionHeading"

const benefits = [
  {
    icon: Zap,
    title: "Ready in seconds",
    description:
      "Stop staring at a blank page. Get a heartfelt message the moment you need it, not hours later.",
  },
  {
    icon: MessagesSquare,
    title: "Made for real relationships",
    description:
      "Choose the relationship, occasion and tone so every message sounds like it came from you.",
  },
  {
    icon: Sparkles,
    title: "Every occasion covered",
    description:
      "Letters, good morning texts, apologies, birthdays and anniversaries — one tool for it all.",
  },
  {
    icon: Languages,
    title: "Fluent in Spanish",
    description:
      "Write naturally in Spanish with the warmth and expressions that feel right for your partner.",
  },
]

export function Benefits() {
  return (
    <section aria-labelledby="benefits-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          headingId="benefits-heading"
          eyebrow="Why LoveDaily"
          title="You already feel it. Now say it beautifully."
          description="LoveDaily turns what you feel into words worth sending, so nothing gets lost between your heart and your message."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-start gap-4">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent">
                <Icon className="size-5 text-accent-foreground" aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
