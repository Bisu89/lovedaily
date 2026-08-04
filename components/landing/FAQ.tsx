"use client"

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import { SectionHeading } from "@/components/landing/SectionHeading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Is LoveDaily really free to use?",
    answer:
      "Yes. LoveDaily is completely free to use — no credit card required.",
  },
  {
    question: "Can LoveDaily write in Spanish?",
    answer:
      "Yes. LoveDaily writes naturally in Spanish, matching the tone and warmth you'd use with your partner.",
  },
  {
    question: "Can I edit or regenerate a message?",
    answer:
      "Yes. If a message isn't quite right, you can regenerate it as many times as you like until it feels like you.",
  },
]

export function FAQ() {
  const { track } = useAnalytics()

  return (
    <section aria-labelledby="faq-heading" className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading headingId="faq-heading" eyebrow="FAQ" title="Frequently asked questions" />

        <Accordion
          className="mt-12"
          onValueChange={(value) => {
            const question = value[0]
            if (question) {
              track("FAQ Expanded", { question })
            }
          }}
        >
          {faqs.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger className="text-base">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
