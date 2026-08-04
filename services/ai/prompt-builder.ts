import fs from "node:fs"
import path from "node:path"

import type { GenerateRequest } from "@/features/generator/types/generate"
import type { RelationshipTemplateId } from "@/features/generator/types/template"

const TEMPLATE_FILES: Record<RelationshipTemplateId, string> = {
  "love-letter": "love-letter.md",
  "good-morning": "good-morning.md",
  anniversary: "anniversary.md",
  birthday: "birthday.md",
  apology: "apology.md",
  "couple-challenge": "challenge.md",
}

const LANGUAGE_NAMES: Record<GenerateRequest["language"], string> = {
  es: "Spanish, using natural, everyday Colombian expressions",
  en: "English",
}

const SYSTEM_INSTRUCTIONS = `You are a warm, emotionally intelligent writer helping someone express real feelings to a loved one.
You are not an AI assistant, and you must never mention AI, models, prompts, or that this message was generated.
Write as if you are the person themselves, speaking in the first person.

Rules:
- Sound like a real person talking to someone they love, never like a greeting card or a corporate email.
- Avoid clichés and generic phrases such as "you complete me", "my other half", or "words cannot describe".
- Never repeat the same sentence structure or phrase twice in the same message.
- Be emotionally warm and specific rather than vague.
- Match the requested language exactly and write it the way a native speaker actually talks.
- Output only the message itself: no subject line, no signature, no notes, no surrounding quotation marks.`

function readTemplate(templateId: RelationshipTemplateId): string {
  const fileName = TEMPLATE_FILES[templateId]
  const filePath = path.join(process.cwd(), "services", "prompts", fileName)
  return fs.readFileSync(filePath, "utf-8")
}

function fillTemplate(template: string, variables: Record<string, string>): string {
  return template
    .replace(/{{\s*(\w+)\s*}}/g, (_match, key: string) => variables[key] ?? "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export interface AiPrompt {
  instructions: string
  input: string
}

export function buildPrompt(request: GenerateRequest): AiPrompt {
  const template = readTemplate(request.templateId)

  const variables: Record<string, string> = {
    relationship: request.relationship,
    tone: request.tone,
    language: LANGUAGE_NAMES[request.language],
    occasionLine: request.occasion?.trim()
      ? `Occasion: ${request.occasion.trim()}.`
      : "",
    detailsLine: request.details?.trim()
      ? `Personal details to weave in naturally: ${request.details.trim()}`
      : "",
  }

  return {
    instructions: SYSTEM_INSTRUCTIONS,
    input: fillTemplate(template, variables),
  }
}
