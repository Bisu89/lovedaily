import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Heart } from "lucide-react"

import { getSharedMessage } from "@/features/sharing/services/shareMessage.service"
import { LoveCardPreview } from "@/features/sharing/components/LoveCardPreview"
import { ShareActions } from "@/features/sharing/components/ShareActions"
import { PageViewTracker } from "@/features/analytics/components/PageViewTracker"
import { TEMPLATES } from "@/features/generator/services/templates"
import { Button } from "@/components/ui/button"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"

function templateTitle(templateId: string): string {
  return TEMPLATES.find((template) => template.id === templateId)?.title ?? "A message"
}

interface MessagePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MessagePageProps): Promise<Metadata> {
  const { id } = await params
  const message = await getSharedMessage(id)

  if (!message) {
    return { title: "Message Not Found — LoveDaily" }
  }

  const title = message.relationship
    ? `A ${templateTitle(message.templateId)} for ${message.relationship} — LoveDaily`
    : `${templateTitle(message.templateId)} — LoveDaily`
  const description = message.content.length > 160
    ? `${message.content.slice(0, 157)}…`
    : message.content
  const pageUrl = `${siteUrl}/message/${id}`
  const imageUrl = `${pageUrl}/opengraph-image`

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    // Shared links should render a rich preview and be followable back to
    // LoveDaily, but hundreds of near-duplicate AI-generated pages have no
    // business competing for search rankings — only "/" is meant for SEO.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "LoveDaily",
      type: "website",
      images: [{ url: imageUrl, width: 1080, height: 1350 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function MessagePage({ params }: MessagePageProps) {
  const { id } = await params
  const message = await getSharedMessage(id)

  if (!message) {
    notFound()
  }

  const pageUrl = `${siteUrl}/message/${id}`
  const imageUrl = `${siteUrl}/api/share-image/${id}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: message.relationship
      ? `A ${templateTitle(message.templateId)} for ${message.relationship}`
      : templateTitle(message.templateId),
    text: message.content,
    dateCreated: message.createdAt,
    url: pageUrl,
    isPartOf: { "@type": "WebSite", name: "LoveDaily", url: siteUrl },
  }

  return (
    <main className="mx-auto flex min-h-[90vh] max-w-md flex-col items-center gap-8 px-4 py-12 text-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageViewTracker event="Message Viewed" properties={{ templateId: message.templateId }} />

      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Heart className="size-6 text-primary" aria-hidden="true" />
        LoveDaily
      </Link>

      <LoveCardPreview
        content={message.content}
        relationship={message.relationship}
        templateId={message.templateId}
      />

      <ShareActions content={message.content} shareUrl={pageUrl} imageUrl={imageUrl} />

      <div className="flex flex-col items-center gap-2 pt-4">
        <p className="text-sm text-muted-foreground">Want to write one of your own?</p>
        <Button
          size="lg"
          nativeButton={false}
          render={
            <Link
              href="/generate"
              data-analytics-event="CTA Clicked"
              data-analytics-props='{"label":"Write your own","location":"shared-message-page"}'
            >
              ✨ Write your own
            </Link>
          }
        />
      </div>
    </main>
  )
}
