"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import { usePageView } from "@/features/analytics/hooks/usePageView"
import { useUser } from "@/features/auth/hooks/useUser"
import { SupportButton } from "@/features/growth/components/SupportButton"
import { EmailCapture } from "@/features/growth/components/EmailCapture"
import { EmailGate } from "@/features/growth/components/EmailGate"
import { ErrorState } from "@/features/generator/components/ErrorState"
import { GenerateButton } from "@/features/generator/components/GenerateButton"
import { LoadingState } from "@/features/generator/components/LoadingState"
import { RelationshipForm } from "@/features/generator/components/RelationshipForm"
import { ResultCard } from "@/features/generator/components/ResultCard"
import { TemplateSelector } from "@/features/generator/components/TemplateSelector"
import { useGenerator, type GeneratorStatus } from "@/features/generator/hooks/useGenerator"
import { TEMPLATES } from "@/features/generator/services/templates"

export function GeneratePageClient() {
  const {
    templateId,
    setTemplateId,
    values,
    updateField,
    errors,
    status,
    result,
    error,
    generate,
    reset,
  } = useGenerator()

  const resultRef = useRef<HTMLDivElement>(null)
  const previousStatusRef = useRef<GeneratorStatus>("idle")
  const { track } = useAnalytics()
  const { user, signOut } = useUser()
  const [visitorEmail, setVisitorEmail] = useState<string | null>(null)
  const effectiveEmail = user?.email ?? visitorEmail

  usePageView("Generator Opened")

  useEffect(() => {
    const stored = window.localStorage.getItem("lovedaily_email")
    if (stored) {
      // Reading localStorage isn't possible during SSR, so this can only be
      // known post-mount — hence the synchronous setState here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisitorEmail(stored)
    }
  }, [])

  function handleEmailUnlocked(email: string) {
    window.localStorage.setItem("lovedaily_email", email)
    setVisitorEmail(email)
  }

  useEffect(() => {
    previousStatusRef.current = status

    if (status === "success" || status === "error") {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [status])

  function handleSelectTemplate(id: typeof templateId) {
    track("Template Selected", { templateId: id })
    setTemplateId(id)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    track("Generate Clicked", {
      templateId,
      tone: values.tone,
      language: values.language,
    })
    void generate(effectiveEmail ?? undefined)
  }

  function handleRegenerate() {
    track("Generate Again", { templateId })
    void generate(effectiveEmail ?? undefined)
  }

  function handleCopy() {
    track("Copy Clicked", { templateId })
  }

  const isLoading = status === "loading"

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to LoveDaily
          </Link>

          <div className="flex items-center gap-3">
            <SupportButton location="generate-header" />
            {user ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="hidden sm:inline">{user.email}</span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Write something they&apos;ll never forget.
          </h1>
          <p className="text-muted-foreground">
            Choose a moment, add a little heart, and we&apos;ll help you find
            the words.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">What would you like to create?</h2>
        <TemplateSelector
          templates={TEMPLATES}
          selectedId={templateId}
          onSelect={handleSelectTemplate}
        />
      </div>

      {effectiveEmail ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
          <h2 className="text-lg font-semibold">Now, make it personal</h2>
          <RelationshipForm values={values} errors={errors} onChange={updateField} />
          <div className="flex justify-center">
            <GenerateButton isLoading={isLoading} />
          </div>
        </form>
      ) : (
        <EmailGate onUnlocked={handleEmailUnlocked} />
      )}

      {isLoading || result || status === "error" ? (
        <div ref={resultRef}>
          {isLoading ? (
            <LoadingState />
          ) : result ? (
            <ResultCard
              result={result}
              relationship={values.relationship}
              onRegenerate={handleRegenerate}
              isRegenerating={isLoading}
              errorMessage={status === "error" ? error : null}
              onCopy={handleCopy}
              showPremiumUpsell={false}
            />
          ) : status === "error" && error ? (
            <ErrorState
              message={error}
              onRetry={() => void generate(effectiveEmail ?? undefined)}
            />
          ) : null}
        </div>
      ) : null}

      {result ? (
        <div className="flex flex-col items-center gap-3">
          {/* Skip re-asking: an anonymous visitor already gave their email
              to the EmailGate above before generating. */}
          {!visitorEmail ? <EmailCapture source="result" email={user?.email} /> : null}
          <SupportButton location="result" />
        </div>
      ) : null}

      {status === "success" || status === "error" ? (
        <button
          type="button"
          onClick={reset}
          className="text-center text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
        >
          ← Start over and write to someone else
        </button>
      ) : null}
    </main>
  )
}
