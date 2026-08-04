import { SectionHeading } from "@/components/landing/SectionHeading"

const steps = [
  {
    number: "01",
    title: "Tell us who it's for",
    description:
      "Pick the relationship, the occasion and the tone you want — romantic, playful or sincere.",
  },
  {
    number: "02",
    title: "AI writes it for you",
    description:
      "In seconds, LoveDaily generates a message that sounds like you, not a template.",
  },
  {
    number: "03",
    title: "Send it or make it perfect",
    description:
      "Copy and share it right away, or regenerate until it feels exactly right.",
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          headingId="how-it-works-heading"
          eyebrow="How it works"
          title="From blank page to sent in under a minute."
        />

        <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map(({ number, title, description }) => (
            <li key={number} className="flex flex-col items-start gap-3">
              <span className="font-mono text-sm font-semibold text-primary">
                {number}
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
