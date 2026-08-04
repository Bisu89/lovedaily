import Link from "next/link"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <Heart className="size-10 text-primary" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          This page wandered off.
        </h1>
        <p className="max-w-md text-muted-foreground">
          We couldn&apos;t find what you were looking for — but there&apos;s
          always a beautiful letter waiting to be written.
        </p>
      </div>
      <Button
        size="lg"
        nativeButton={false}
        render={<Link href="/">Back to LoveDaily</Link>}
      />
    </main>
  )
}
