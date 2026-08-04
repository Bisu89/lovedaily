export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/** Facebook's sharer only accepts a URL (it pulls title/description/image
 *  from that URL's Open Graph tags) — it does not support pre-filled
 *  arbitrary text, so there's no "message" parameter here. */
export function buildFacebookUrl(url: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
}

export function canUseWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function"
}

/** Triggers the OS-level share sheet (WhatsApp, Messenger, SMS, Mail, IG
 *  Direct, etc. all in one) on mobile. Resolves false if unavailable or
 *  the user cancels, so callers can fall back to per-platform buttons. */
export async function webShare(data: { title: string; text: string; url?: string }): Promise<boolean> {
  if (!canUseWebShare()) return false

  try {
    await navigator.share(data)
    return true
  } catch {
    return false
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function canShareFiles(file: File): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  )
}

/**
 * Fetches the card PNG and either hands it to the OS share sheet (where
 * Instagram, Messenger, Mail etc. can pick it up directly — this is the
 * only way a website can get an image in front of Instagram's Story
 * composer) or, if the browser doesn't support sharing files, just
 * downloads it so the user can attach it manually.
 */
export async function shareOrDownloadImage(
  imageUrl: string,
  filename: string,
  shareData: { title: string; text: string }
): Promise<"shared" | "downloaded" | "failed"> {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    const file = new File([blob], filename, { type: "image/png" })

    if (canShareFiles(file)) {
      try {
        await navigator.share({ ...shareData, files: [file] })
        return "shared"
      } catch {
        // User cancelled the share sheet — not a failure, don't fall
        // through to a surprise download on top of it.
        return "shared"
      }
    }

    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(objectUrl)
    return "downloaded"
  } catch {
    return "failed"
  }
}
