import {
  CARD_INK,
  CARD_INK_SOFT,
  TONE_PALETTES,
  fitCardMessage,
  toneFor,
  type CardMessageTier,
} from "@/features/sharing/services/cardTokens"

const TIER_TEXT_SIZE: Record<CardMessageTier, string> = {
  lg: "text-[5.2cqw]",
  md: "text-[4.3cqw]",
  sm: "text-[3.5cqw]",
  xs: "text-[3cqw]",
}

interface LoveCardPreviewProps {
  content: string
  relationship?: string | null
  templateId: string
}

/** The in-app card shown after generating and on /message/[id]. Uses the
 *  same tone palette and message-fitting rules as the downloadable PNG
 *  (loveCardImage.tsx) so what's on screen matches what gets shared —
 *  sized in container-query units (cqw) so it scales cleanly at any
 *  width without a second set of breakpoints. */
export function LoveCardPreview({ content, relationship, templateId }: LoveCardPreviewProps) {
  const palette = TONE_PALETTES[toneFor(templateId)]
  const { text, tier } = fitCardMessage(content)

  return (
    <div
      className="@container relative flex aspect-[1080/1350] w-full flex-col overflow-hidden rounded-[7%] p-[9%] shadow-xl ring-1 ring-black/5"
      style={{
        backgroundImage: `radial-gradient(120% 90% at 15% 0%, ${palette.to} 0%, transparent 55%), linear-gradient(160deg, ${palette.from}, #ffffff 65%)`,
      }}
    >
      <div
        className="flex items-center gap-[1.3cqw] text-[3.1cqw] font-bold"
        style={{ color: CARD_INK }}
      >
        <span aria-hidden="true">❤️</span>
        LoveDaily
      </div>

      {relationship ? (
        <div
          className="mt-auto text-[2.4cqw] font-bold tracking-[0.14em] uppercase"
          style={{ color: palette.accent }}
        >
          For {relationship}
        </div>
      ) : (
        <div className="mt-auto" />
      )}

      <p
        className={`mt-[1.8%] font-serif leading-snug text-balance italic ${TIER_TEXT_SIZE[tier]}`}
        style={{ color: CARD_INK }}
      >
        &ldquo;{text}&rdquo;
      </p>

      <div
        className="mt-[5%] mb-[3.7%] h-px w-[6%]"
        style={{ backgroundColor: "rgba(43,18,20,0.16)" }}
      />

      <div className="text-[2cqw]" style={{ color: CARD_INK_SOFT }}>
        Generated with LoveDaily.app ❤️
      </div>
    </div>
  )
}
