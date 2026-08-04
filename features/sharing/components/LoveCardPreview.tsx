import {
  CARD_INK,
  CARD_INK_SOFT,
  TONE_PALETTES,
  fitCardMessage,
  toneFor,
  type CardMessageTier,
} from "@/features/sharing/services/cardTokens"

// Fixed sizes rather than container-query (cqw) units — both places this
// renders cap the card at the same ~380–450px width (max-w-md), so a
// fluid unit isn't needed, and it sidesteps relying on cqw support.
const TIER_TEXT_SIZE: Record<CardMessageTier, string> = {
  lg: "text-3xl sm:text-4xl",
  md: "text-2xl sm:text-3xl",
  sm: "text-xl sm:text-2xl",
  xs: "text-lg sm:text-xl",
}

interface LoveCardPreviewProps {
  content: string
  relationship?: string | null
  templateId: string
}

/** The in-app card shown after generating and on /message/[id]. Uses the
 *  same tone palette and message-fitting rules as the downloadable PNG
 *  (loveCardImage.tsx) so what's on screen matches what gets shared. The
 *  logo is pinned to the top corner (out of flow) and the message block
 *  is vertically centered in the remaining space, so short and long
 *  messages both sit naturally instead of leaving a large gap under the
 *  logo. */
export function LoveCardPreview({ content, relationship, templateId }: LoveCardPreviewProps) {
  const palette = TONE_PALETTES[toneFor(templateId)]
  const { text, tier } = fitCardMessage(content)

  return (
    <div
      className="relative flex aspect-1080/1350 w-full flex-col overflow-hidden rounded-3xl p-[9%] text-left shadow-xl ring-1 ring-black/5"
      style={{
        backgroundImage: `radial-gradient(120% 90% at 15% 0%, ${palette.to} 0%, transparent 55%), linear-gradient(160deg, ${palette.from}, #ffffff 65%)`,
      }}
    >
      <div
        className="absolute top-[9%] left-[9%] flex items-center gap-2 text-base font-bold sm:text-lg"
        style={{ color: CARD_INK }}
      >
        <span aria-hidden="true">❤️</span>
        LoveDaily
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {relationship ? (
          <div
            className="text-xs font-bold tracking-[0.14em] uppercase sm:text-sm"
            style={{ color: palette.accent }}
          >
            For {relationship}
          </div>
        ) : null}

        <p
          className={`font-serif leading-snug text-balance italic ${relationship ? "mt-3" : ""} ${TIER_TEXT_SIZE[tier]}`}
          style={{ color: CARD_INK }}
        >
          &ldquo;{text}&rdquo;
        </p>
      </div>

      <div
        className="mb-[3.7%] h-px w-[6%]"
        style={{ backgroundColor: "rgba(43,18,20,0.16)" }}
      />

      <div className="text-xs" style={{ color: CARD_INK_SOFT }}>
        Generated with LoveDaily.app ❤️
      </div>
    </div>
  )
}
