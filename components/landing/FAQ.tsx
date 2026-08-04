"use client"

import { useAnalytics } from "@/hooks/useAnalytics"
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
      "Yes. Every account gets 3 free AI generations per day with no credit card required. Upgrade to Premium whenever you want unlimited messages.",
  },
  {
    question: "Can LoveDaily write in Spanish?",
    answer:
      "Yes. LoveDaily writes naturally in Spanish, matching the tone and warmth you'd use with your partner.",
  },
  {
    question: "What do I get with Premium?",
    answer:
      "Premium unlocks unlimited generations, PDF downloads, saved history and premium templates for $9/month, or $49 as a one-time lifetime payment.",
  },
  {
    question: "Can I edit or regenerate a message?",
    answer:
      "Yes. If a message isn't quite right, you can regenerate it as many times as you like until it feels like you.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. Premium is billed monthly and you can cancel anytime — you'll keep access until the end of your billing period.",
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
