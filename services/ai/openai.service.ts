import OpenAI, {
  APIConnectionError,
  APIConnectionTimeoutError,
  RateLimitError,
} from "openai"

import type { AiPrompt } from "@/services/ai/prompt-builder"

const DEFAULT_MODEL = "gpt-4o-mini"
const REQUEST_TIMEOUT_MS = 30_000

export class AiServiceError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "AiServiceError"
  }
}

let client: OpenAI | null = null

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new AiServiceError(
      "The AI service isn't configured yet. Please try again later.",
      500
    )
  }

  client ??= new OpenAI({ timeout: REQUEST_TIMEOUT_MS })

  return client
}

/**
 * Calls OpenAI's Responses API and returns the generated text.
 * Callers depend only on this function's signature — swapping models,
 * providers, or SDK versions never touches the route or the UI.
 */
export async function generateText(prompt: AiPrompt): Promise<string> {
  try {
    const response = await getClient().responses.create({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      instructions: prompt.instructions,
      input: prompt.input,
    })

    const text = response.output_text?.trim()
    if (!text) {
      throw new AiServiceError(
        "We couldn't write your letter this time. Please try again.",
        502
      )
    }

    return text
  } catch (caught) {
    if (caught instanceof AiServiceError) {
      throw caught
    }

    if (caught instanceof RateLimitError) {
      throw new AiServiceError(
        "We're getting a lot of requests right now. Please try again in a moment.",
        429
      )
    }

    if (caught instanceof APIConnectionTimeoutError) {
      throw new AiServiceError(
        "This is taking longer than expected. Please try again.",
        504
      )
    }

    if (caught instanceof APIConnectionError) {
      throw new AiServiceError(
        "We couldn't reach our AI service. Please check your connection and try again.",
        503
      )
    }

    throw new AiServiceError(
      "Something went wrong while writing your letter. Please try again.",
      502
    )
  }
}
