import type { Metadata } from "next"

import { GeneratePageClient } from "@/features/generator/components/GeneratePageClient"

export const metadata: Metadata = {
  title: "Generate a Letter — LoveDaily",
  description:
    "Create a heartfelt letter, message, or relationship idea in seconds with AI.",
}

export default function GeneratePage() {
  return <GeneratePageClient />
}
