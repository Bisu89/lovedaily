import type { RelationshipTemplateId } from "@/features/generator/types/template"

export type Tone = "romantic" | "funny" | "formal" | "emotional" | "sweet"

export type Language = "es" | "en"

export interface GenerateRequest {
  templateId: RelationshipTemplateId
  relationship: string
  occasion?: string
  tone: Tone
  language: Language
  details?: string
  /** Required when the request isn't backed by a signed-in Supabase user. */
  email?: string
}

export interface GenerateResponse {
  id: string
  templateId: RelationshipTemplateId
  content: string
  generatedAt: string
  /** Public share-page id (/message/[shareId]) — null if saving it failed
   *  or Supabase isn't configured. Sharing is best-effort, never blocks
   *  generation. */
  shareId: string | null
}
