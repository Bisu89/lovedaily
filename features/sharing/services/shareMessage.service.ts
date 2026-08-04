import { getSupabaseAdminClient } from "@/lib/supabase/admin"

export interface ShareMessageInput {
  content: string
  templateId: string
  relationship?: string
  tone?: string
  language?: string
  userId?: string | null
}

/**
 * Persists a generated message so it can have its own public share page
 * (/message/[id]) and social preview image. Best-effort: returns null if
 * Supabase isn't configured or the write fails — a missing share link
 * should never break the generation flow itself.
 */
export async function shareMessage(input: ShareMessageInput): Promise<string | null> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from("shared_messages")
      .insert({
        content: input.content,
        template_id: input.templateId,
        relationship: input.relationship,
        tone: input.tone,
        language: input.language,
        user_id: input.userId ?? null,
      })
      .select("id")
      .single()

    if (error || !data) return null
    return data.id
  } catch {
    return null
  }
}

export interface SharedMessage {
  id: string
  content: string
  templateId: string
  relationship: string | null
  createdAt: string
}

/** Looks up a shared message by its public id. Returns null if it doesn't
 *  exist or Supabase isn't configured. Server-only — reads via the
 *  service-role client since shared_messages has no public RLS policy. */
export async function getSharedMessage(id: string): Promise<SharedMessage | null> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return null

  const { data } = await supabase
    .from("shared_messages")
    .select("id, content, template_id, relationship, created_at")
    .eq("id", id)
    .maybeSingle()

  if (!data) return null

  return {
    id: data.id,
    content: data.content,
    templateId: data.template_id,
    relationship: data.relationship,
    createdAt: data.created_at,
  }
}
