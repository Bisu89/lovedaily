import { NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"

import { TEMPLATES } from "@/features/generator/services/templates"
import type {
  GenerateRequest,
  GenerateResponse,
  Language,
  Tone,
} from "@/features/generator/types/generate"
import { AiServiceError, generateText } from "@/services/ai/openai.service"
import { buildPrompt } from "@/services/ai/prompt-builder"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export const runtime = "nodejs"

const TEMPLATE_IDS = TEMPLATES.map((template) => template.id)
const TONES: Tone[] = ["romantic", "funny", "formal", "emotional", "sweet"]
const LANGUAGES: Language[] = ["es", "en"]

class ValidationError extends Error {}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateRequest(body: unknown): GenerateRequest {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Invalid request.")
  }

  const { templateId, relationship, occasion, tone, language, details, email } =
    body as Record<string, unknown>

  if (
    typeof templateId !== "string" ||
    !TEMPLATE_IDS.includes(templateId as (typeof TEMPLATE_IDS)[number])
  ) {
    throw new ValidationError("Please choose a valid template.")
  }
  if (typeof relationship !== "string" || !relationship.trim()) {
    throw new ValidationError("Please tell us who this is for.")
  }
  if (typeof tone !== "string" || !TONES.includes(tone as Tone)) {
    throw new ValidationError("Please choose a valid tone.")
  }
  if (typeof language !== "string" || !LANGUAGES.includes(language as Language)) {
    throw new ValidationError("Please choose a valid language.")
  }
  if (occasion !== undefined && typeof occasion !== "string") {
    throw new ValidationError("Invalid occasion.")
  }
  if (details !== undefined && typeof details !== "string") {
    throw new ValidationError("Invalid details.")
  }
  if (email !== undefined && typeof email !== "string") {
    throw new ValidationError("Invalid email.")
  }

  return {
    templateId: templateId as GenerateRequest["templateId"],
    relationship,
    occasion: occasion as string | undefined,
    tone: tone as Tone,
    language: language as Language,
    details: details as string | undefined,
    email: email as string | undefined,
  }
}

/** Analytics failure should never break the user-facing generation flow. */
async function recordRequest(
  supabase: SupabaseClient<Database>,
  params: { userId: string; templateId: string; tone: string; language: string; success: boolean }
) {
  try {
    await supabase.from("ai_requests").insert({
      user_id: params.userId,
      template_id: params.templateId,
      tone: params.tone,
      language: params.language,
      success: params.success,
    })
  } catch {
    // Swallow — recording usage must never fail the actual request.
  }
}

export async function POST(request: Request) {
  let generateRequest: GenerateRequest

  try {
    const body = await request.json()
    generateRequest = validateRequest(body)
  } catch (caught) {
    const message =
      caught instanceof ValidationError ? caught.message : "Invalid request."
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // Auth is required once Supabase is configured. Until then, a valid email
  // is required instead — the same "sign in before generating" requirement,
  // just satisfiable without a live Supabase project during local dev.
  const supabase = await getSupabaseServerClient()
  let userId: string | null = null

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to generate a letter." },
        { status: 401 }
      )
    }

    userId = user.id
  } else if (!generateRequest.email || !isValidEmail(generateRequest.email)) {
    return NextResponse.json(
      { error: "Please enter your email to generate a letter." },
      { status: 400 }
    )
  }

  try {
    const prompt = buildPrompt(generateRequest)
    const content = await generateText(prompt)

    const generateResponse: GenerateResponse = {
      id: crypto.randomUUID(),
      templateId: generateRequest.templateId,
      content,
      generatedAt: new Date().toISOString(),
    }

    if (supabase && userId) {
      await recordRequest(supabase, {
        userId,
        templateId: generateRequest.templateId,
        tone: generateRequest.tone,
        language: generateRequest.language,
        success: true,
      })
    }

    return NextResponse.json(generateResponse)
  } catch (caught) {
    if (supabase && userId) {
      await recordRequest(supabase, {
        userId,
        templateId: generateRequest.templateId,
        tone: generateRequest.tone,
        language: generateRequest.language,
        success: false,
      })
    }

    if (caught instanceof AiServiceError) {
      return NextResponse.json({ error: caught.message }, { status: caught.status })
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
