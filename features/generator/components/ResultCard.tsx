"use client"

import { useState } from "react"
import { Check, Heart } from "lucide-react"

import { PremiumUpsell } from "@/features/billing/components/PremiumUpsell"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { GenerateResponse } from "@/features/generator/types/generate"

const COPIED_RESET_MS = 1800

/**
 * navigator.clipboard only exists in secure contexts (HTTPS or localhost),
 * so plain-HTTP LAN testing needs the legacy execCommand fallback too.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to the legacy method below
    }
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  let succeeded = false
  try {
    succeeded = document.execCommand("copy")
  } catch {
    succeeded = false
  }
  document.body.removeChild(textarea)

  return succeeded
}

function LetterDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <Heart className="size-4 text-primary" fill="currentColor" />
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

interface ResultCardProps {
  result: GenerateResponse
  relationship: string
  onRegenerate: () => void
  isRegenerating: boolean
  errorMessage?: string | null
  onCopy?: () => void
  showPremiumUpsell: boolean
}

export function ResultCard({
  result,
  relationship,
  onRegenerate,
  isRegenerating,
  errorMessage,
  onCopy,
  showPremiumUpsell,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  async function handleCopy() {
    onCopy?.()
    const succeeded = await copyToClipboard(result.content)
    if (succeeded) {
      setCopyFailed(false)
      setCopied(true)
      setTimeout(() => setCopied(false), COPIED_RESET_MS)
    } else {
      setCopyFailed(true)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-6 rounded-3xl bg-linear-to-b from-accent/40 to-card p-2 ring-1 ring-foreground/10">
        <CardContent className="flex flex-col gap-6 py-6 sm:py-8">
          <p className="text-center text-xs font-semibold tracking-wide text-primary uppercase">
            A letter for your {relationship}
          </p>

          <LetterDivider />

          <p className="font-serif text-lg leading-relaxed text-balance whitespace-pre-line italic sm:text-xl">
            {result.content}
          </p>

          <LetterDivider />

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={handleCopy} size="lg" className="h-12 text-base">
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <span aria-hidden="true">❤️</span>
              )}
              {copied ? "Copied!" : "Copy My Letter"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 text-base"
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              <span aria-hidden="true">✨</span>
              Improve My Letter
            </Button>
          </div>

          {copyFailed ? (
            <p role="alert" className="text-center text-sm text-destructive">
              We couldn&apos;t copy your letter. Please select and copy the
              text manually.
            </p>
          ) : null}

          {errorMessage ? (
            <p role="alert" className="text-center text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {showPremiumUpsell ? (
        <PremiumUpsell
          title={
            relationship
              ? `Want ${relationship} to feel this every day?`
              : "Make this moment unforgettable"
          }
          description="Unlock Premium and give every letter the finishing touch it deserves."
          location="result"
          recommendedPlan="monthly"
        />
      ) : null}
    </div>
  )
}
