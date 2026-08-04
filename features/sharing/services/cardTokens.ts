/** Shared between LoveCardPreview (in-app HTML) and loveCardImage (Satori
 *  PNG render) so the downloaded/shared card always matches what's shown
 *  in the app — one source of truth for the palette instead of two. */
export const TONE_PALETTES = {
  rose: { from: "#fff3f2", to: "#ffd9dd", accent: "#b3123a" },
  gold: { from: "#fff8ec", to: "#ffe1ad", accent: "#a3660b" },
  plum: { from: "#fdf1f7", to: "#f2cfe4", accent: "#93266d" },
} as const

export type Tone = keyof typeof TONE_PALETTES

/** Keeps every template feeling distinct without inventing a whole new
 *  palette per template — reuses these 3 validated tones. */
export const TEMPLATE_TONE: Record<string, Tone> = {
  "love-letter": "rose",
  anniversary: "rose",
  "good-morning": "gold",
  birthday: "gold",
  apology: "plum",
  "couple-challenge": "plum",
}

export const CARD_INK = "#2b1214"
export const CARD_INK_SOFT = "#8a5c5f"

export function toneFor(templateId: string): Tone {
  return TEMPLATE_TONE[templateId] ?? "rose"
}

export type CardMessageTier = "lg" | "md" | "sm" | "xs"

/** Longer messages get a smaller tier (and are trimmed) so the card never
 *  overflows its fixed portrait frame — abstract tiers, not pixel values,
 *  since the in-app preview (relative units) and the 1080×1350 PNG
 *  (absolute px) each map a tier to their own size. Used by both so what
 *  you see is exactly what gets shared. */
export function fitCardMessage(content: string): { text: string; tier: CardMessageTier } {
  if (content.length <= 160) return { text: content, tier: "lg" }
  if (content.length <= 280) return { text: content, tier: "md" }
  if (content.length <= 420) return { text: content, tier: "sm" }
  return { text: `${content.slice(0, 417).trimEnd()}…`, tier: "xs" }
}
