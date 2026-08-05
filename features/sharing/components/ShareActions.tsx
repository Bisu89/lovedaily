"use client"

import { useEffect, useState } from "react"
import { Camera, Check, Download, Link as LinkIcon, MessageCircle, Share2 } from "lucide-react"

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import { Button } from "@/components/ui/button"
import {
  buildFacebookUrl,
  buildWhatsAppUrl,
  canUseWebShare,
  copyToClipboard,
  shareOrDownloadImage,
  webShare,
} from "@/features/sharing/services/socialShare"

const COPIED_RESET_MS = 1800

interface ShareActionsProps {
  content: string
  /** Full public URL for this message, or null if it couldn't be saved
   *  (e.g. Supabase isn't configured) — Facebook/Copy Link need a real
   *  link to point at, so those are hidden without one. */
  shareUrl: string | null
  imageUrl: string | null
}

type CopyState = "idle" | "copied" | "failed"

export function ShareActions({ content, shareUrl, imageUrl }: ShareActionsProps) {
  const { track } = useAnalytics()
  const [copyState, setCopyState] = useState<CopyState>("idle")
  const [linkCopyState, setLinkCopyState] = useState<CopyState>("idle")
  const [hasWebShare, setHasWebShare] = useState(false)

  useEffect(() => {
    // navigator.share is only known post-mount (SSR has no navigator).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasWebShare(canUseWebShare())
  }, [])

  async function handleCopyText() {
    track("CTA Clicked", { label: "Copy Text", location: "share-actions" })
    const succeeded = await copyToClipboard(content)
    setCopyState(succeeded ? "copied" : "failed")
    if (succeeded) setTimeout(() => setCopyState("idle"), COPIED_RESET_MS)
  }

  async function handleCopyLink() {
    if (!shareUrl) return
    track("CTA Clicked", { label: "Copy Link", location: "share-actions" })
    const succeeded = await copyToClipboard(shareUrl)
    setLinkCopyState(succeeded ? "copied" : "failed")
    if (succeeded) setTimeout(() => setLinkCopyState("idle"), COPIED_RESET_MS)
  }

  async function handleSaveCard() {
    if (!imageUrl) return
    track("CTA Clicked", { label: "Save Card", location: "share-actions" })
    await shareOrDownloadImage(imageUrl, "lovedaily-card.png", {
      title: "LoveDaily",
      text: content,
    })
  }

  /** Instagram has no web share API of its own — the only way a website
   *  can get an image in front of its Story composer is handing the OS
   *  share sheet the actual image file, where Instagram can pick it up
   *  (supported iOS/Android). Falls back to a plain download otherwise,
   *  ready to attach manually. */
  async function handleInstagram() {
    if (!imageUrl) return
    track("CTA Clicked", { label: "Instagram", location: "share-actions" })
    await shareOrDownloadImage(imageUrl, "lovedaily-card.png", {
      title: "LoveDaily",
      text: content,
    })
  }

  function handleWhatsApp() {
    track("CTA Clicked", { label: "WhatsApp", location: "share-actions" })
    const text = shareUrl ? `${content}\n\n${shareUrl}` : content
    window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer")
  }

  function handleFacebook() {
    if (!shareUrl) return
    track("CTA Clicked", { label: "Facebook", location: "share-actions" })
    window.open(buildFacebookUrl(shareUrl), "_blank", "noopener,noreferrer")
  }

  async function handleShare() {
    track("CTA Clicked", { label: "Share", location: "share-actions" })
    await webShare({ title: "LoveDaily", text: content, url: shareUrl ?? undefined })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="default" size="lg" className="h-12 text-base" onClick={() => void handleCopyText()}>
          {copyState === "copied" ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <span aria-hidden="true">📋</span>
          )}
          {copyState === "copied" ? "Copied!" : "Copy Text"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-12 text-base"
          disabled={!imageUrl}
          onClick={() => void handleSaveCard()}
        >
          <Download className="size-4" aria-hidden="true" />
          Save Card
        </Button>
      </div>

      {copyState === "failed" ? (
        <p role="alert" className="text-center text-xs text-destructive">
          Couldn&apos;t copy. Please select and copy the text manually.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="h-11 text-sm text-[#25b556] hover:text-[#25b556]"
          onClick={handleWhatsApp}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp
        </Button>
        <Button
          variant="outline"
          className="h-11 text-sm text-[#1877f2] hover:text-[#1877f2]"
          disabled={!shareUrl}
          onClick={handleFacebook}
        >
          Facebook
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className={`h-11 text-sm text-[#d6448a] hover:text-[#d6448a] ${hasWebShare ? "" : "col-span-2"}`}
          disabled={!imageUrl}
          onClick={() => void handleInstagram()}
        >
          <Camera className="size-4" aria-hidden="true" />
          Instagram
        </Button>
        {hasWebShare ? (
          <Button variant="outline" className="h-11 text-sm" onClick={() => void handleShare()}>
            <Share2 className="size-4" aria-hidden="true" />
            More
          </Button>
        ) : null}
      </div>

      {shareUrl ? (
        <Button variant="ghost" className="h-10 text-sm text-muted-foreground" onClick={() => void handleCopyLink()}>
          <LinkIcon className="size-3.5" aria-hidden="true" />
          {linkCopyState === "copied" ? "Link copied!" : "Copy Link"}
        </Button>
      ) : null}
    </div>
  )
}
