import {
  Cake,
  CalendarHeart,
  HeartCrack,
  Mail,
  Puzzle,
  Sunrise,
} from "lucide-react"

import { SectionHeading } from "@/components/landing/SectionHeading"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const tools = [
  {
    icon: Mail,
    title: "Love Letter",
    description:
      "A heartfelt letter that puts your feelings into words, written the way you'd say them.",
  },
  {
    icon: Sunrise,
    title: "Good Morning Message",
    description:
      "Start their day with a warm, genuine text that makes them smile before they're out of bed.",
  },
  {
    icon: CalendarHeart,
    title: "Anniversary Wishes",
    description:
      "Celebrate another year together with words that match how much it means to you.",
  },
  {
    icon: Cake,
    title: "Birthday Wishes",
    description:
      "A birthday message that feels personal, not copy-pasted from a card aisle.",
  },
  {
    icon: HeartCrack,
    title: "Apology Letter",
    description:
      "Say sorry the right way — sincere, clear and without the awkward silences.",
  },
  {
    icon: Puzzle,
    title: "Couple Challenge",
    description:
      "Fun prompts and questions to help you two grow closer, one conversation at a time.",
  },
]

export function Tools() {
  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="bg-muted/40 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          headingId="tools-heading"
          eyebrow="AI Tools"
          title="One AI, six ways to say I love you."
          description="Pick a tool, add a few details, and get a message ready to send in seconds."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-2">
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent">
                  <Icon className="size-5 text-accent-foreground" aria-hidden="true" />
                </span>
                <CardTitle className="mt-4 text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
