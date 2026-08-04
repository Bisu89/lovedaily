import Link from "next/link"
import { Heart } from "lucide-react"

import { LoginForm } from "@/features/auth/components/LoginForm"

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams
  const redirectTo = next && next.startsWith("/") ? next : "/generate"

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center gap-8 px-4 text-center">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Heart className="size-6 text-primary" aria-hidden="true" />
        LoveDaily
      </Link>

      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back.
        </h1>
        <p className="text-muted-foreground">
          Sign in to start writing something beautiful.
        </p>
      </div>

      <LoginForm redirectTo={redirectTo} />
    </main>
  )
}
