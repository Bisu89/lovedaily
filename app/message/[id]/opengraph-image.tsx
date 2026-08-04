import { getSharedMessage } from "@/features/sharing/services/shareMessage.service"
import { CARD_SIZE, renderLoveCardImage } from "@/features/sharing/services/loveCardImage"

export const alt = "A message from LoveDaily"
export const size = CARD_SIZE
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const message = await getSharedMessage(id)

  return renderLoveCardImage({
    content: message?.content ?? "This message is no longer available.",
    relationship: message?.relationship,
    templateId: message?.templateId ?? "love-letter",
  })
}
