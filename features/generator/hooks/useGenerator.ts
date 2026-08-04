"use client"

import { useCallback, useState } from "react"

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import {
  generatorService,
  GenerationFailedError,
} from "@/features/generator/services/generator.service"
import { TEMPLATES } from "@/features/generator/services/templates"
import type { GenerateResponse, Language, Tone } from "@/features/generator/types/generate"
import type { RelationshipTemplateId } from "@/features/generator/types/template"

export interface GeneratorFormValues {
  relationship: string
  occasion: string
  tone: Tone
  language: Language
  details: string
}

export interface GeneratorFormErrors {
  relationship?: string
  language?: string
}

const INITIAL_TEMPLATE_ID: RelationshipTemplateId = TEMPLATES[0].id

const INITIAL_VALUES: GeneratorFormValues = {
  relationship: "",
  occasion: "",
  tone: "romantic",
  language: "es",
  details: "",
}

export type GeneratorStatus = "idle" | "loading" | "success" | "error"

export function useGenerator() {
  const [templateId, setTemplateId] = useState<RelationshipTemplateId>(
    INITIAL_TEMPLATE_ID
  )
  const [values, setValues] = useState<GeneratorFormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<GeneratorFormErrors>({})
  const [status, setStatus] = useState<GeneratorStatus>("idle")
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const { track } = useAnalytics()

  const updateField = useCallback(
    <K extends keyof GeneratorFormValues>(field: K, value: GeneratorFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const validate = useCallback((): boolean => {
    const nextErrors: GeneratorFormErrors = {}
    if (!values.relationship.trim()) {
      nextErrors.relationship = "Please select who this is for."
    }
    if (!values.language) {
      nextErrors.language = "Please select a language."
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [values])

  const generate = useCallback(async (email?: string) => {
    if (!validate()) return

    setStatus("loading")
    setError(null)
    setErrorCode(null)
    try {
      const response = await generatorService.generateMessage({
        templateId,
        relationship: values.relationship,
        occasion: values.occasion || undefined,
        tone: values.tone,
        language: values.language,
        details: values.details || undefined,
        email,
      })
      setResult(response)
      setStatus("success")
      track("Generation Success", { templateId })
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again."
      setError(message)
      setErrorCode(caught instanceof GenerationFailedError ? (caught.code ?? null) : null)
      setStatus("error")
      track("Generation Failed", { templateId, reason: message })
    }
  }, [templateId, values, validate, track])

  const reset = useCallback(() => {
    setTemplateId(INITIAL_TEMPLATE_ID)
    setValues(INITIAL_VALUES)
    setErrors({})
    setStatus("idle")
    setResult(null)
    setError(null)
    setErrorCode(null)
  }, [])

  return {
    templateId,
    setTemplateId,
    values,
    updateField,
    errors,
    status,
    result,
    error,
    errorCode,
    generate,
    reset,
  }
}
