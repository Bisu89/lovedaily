import { NextResponse } from "next/server"

import { getSharedMessage } from "@/features/sharing/services/shareMessage.service"
import { renderLoveCardImage } from "@/features/sharing/services/loveCardImage"

export const runtime = "nodejs"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params
  const message = await getSharedMessage(id)

  if (!message) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 })
  }

  const image = await renderLoveCardImage({
    content: message.content,
    relationship: message.relationship,
    templateId: message.templateId,
  })

  // Content for a given id never changes, so this can be cached
  // indefinitely — avoids re-rendering the card on every download and
  // every social-crawler hit.
  image.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  image.headers.set("Content-Disposition", `attachment; filename="lovedaily-card.png"`)

  return image
}
