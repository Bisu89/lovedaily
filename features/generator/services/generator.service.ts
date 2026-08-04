import type { GenerateRequest, GenerateResponse } from "@/features/generator/types/generate"

const GENERATE_ENDPOINT = "/api/generate"

export class GenerationFailedError extends Error {
  constructor(message = "We couldn't write your letter this time. Please try again.") {
    super(message)
    this.name = "GenerationFailedError"
  }
}

export interface GeneratorService {
  generateMessage(request: GenerateRequest): Promise<GenerateResponse>
}

/**
 * Calls the /api/generate route, which is the only thing allowed to talk
 * to the AI service. The browser never contacts OpenAI directly.
 */
class ApiGeneratorService implements GeneratorService {
  async generateMessage(request: GenerateRequest): Promise<GenerateResponse> {
    let response: Response

    try {
      response = await fetch(GENERATE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })
    } catch {
      throw new GenerationFailedError(
        "We couldn't reach our servers. Please check your connection and try again."
      )
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { error?: string }
        | null
      throw new GenerationFailedError(body?.error || undefined)
    }

    return (await response.json()) as GenerateResponse
  }
}

export const generatorService: GeneratorService = new ApiGeneratorService()
