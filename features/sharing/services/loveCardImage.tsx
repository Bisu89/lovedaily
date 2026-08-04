import { ImageResponse } from "next/og"

import {
  CARD_INK,
  CARD_INK_SOFT,
  TONE_PALETTES,
  fitCardMessage,
  toneFor,
  type CardMessageTier,
} from "@/features/sharing/services/cardTokens"

export const CARD_SIZE = { width: 1080, height: 1350 }

const TIER_FONT_SIZE: Record<CardMessageTier, number> = {
  lg: 72,
  md: 60,
  sm: 50,
  xs: 42,
}

async function loadPlayfairItalic(text: string): Promise<ArrayBuffer | null> {
  try {
    const params = new URLSearchParams({
      family: "Playfair Display:ital,wght@1,500",
      text,
    })
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?${params.toString()}`)
    ).text()

    const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)
    if (!match) return null

    const fontResponse = await fetch(match[1])
    if (!fontResponse.ok) return null
    return await fontResponse.arrayBuffer()
  } catch {
    return null
  }
}

interface LoveCardProps {
  content: string
  relationship?: string | null
  templateId: string
}

/** Renders the Love Card as a PNG — shared by the /message/[id] social
 *  preview image and the "Save Card" download route, so both always look
 *  identical. Satori (next/og's renderer) only supports flexbox + inline
 *  styles, so this can't reuse the in-app LoveCardPreview's JSX directly;
 *  they share their color tokens instead (cardTokens.ts). */
export async function renderLoveCardImage({
  content,
  relationship,
  templateId,
}: LoveCardProps): Promise<ImageResponse> {
  const palette = TONE_PALETTES[toneFor(templateId)]
  const { text, tier } = fitCardMessage(content)
  const fontSize = TIER_FONT_SIZE[tier]
  const fontData = await loadPlayfairItalic(text)

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage: `radial-gradient(120% 90% at 15% 0%, ${palette.to} 0%, transparent 55%), linear-gradient(160deg, ${palette.from}, #ffffff 65%)`,
          padding: "96px 92px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 96,
            left: 92,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ fontSize: 40 }}>❤️</span>
          <span style={{ fontSize: 34, fontWeight: 700, color: CARD_INK }}>LoveDaily</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {relationship ? (
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: palette.accent,
              }}
            >
              For {relationship}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              marginTop: relationship ? 28 : 0,
              fontSize,
              lineHeight: 1.42,
              color: CARD_INK,
              fontFamily: fontData ? "Playfair Display" : "serif",
              fontStyle: "italic",
            }}
          >
            &ldquo;{text}&rdquo;
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: 64,
            height: 2,
            backgroundColor: "rgba(43,18,20,0.16)",
            marginBottom: 40,
          }}
        />

        <div style={{ display: "flex", fontSize: 24, color: CARD_INK_SOFT }}>
          Generated with LoveDaily.app ❤️
        </div>
      </div>
    ),
    {
      ...CARD_SIZE,
      fonts: fontData
        ? [{ name: "Playfair Display", data: fontData, weight: 500, style: "italic" }]
        : undefined,
    }
  )
}
