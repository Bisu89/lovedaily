"use client"

import { useCallback, useEffect, useState } from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { AuthUser } from "@/features/auth/types/auth"

function toAuthUser(supabaseUser: {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: (supabaseUser.user_metadata?.full_name as string | undefined) ?? null,
    avatarUrl: (supabaseUser.user_metadata?.avatar_url as string | undefined) ?? null,
  }
}

/**
 * Current signed-in user, kept in sync with Supabase auth state changes
 * (sign in, sign out, token refresh). Returns user: null when signed out
 * or when auth isn't configured yet.
 */
export function useUser() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(true)
      return
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? toAuthUser(data.user) : null)
      setLoaded(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? toAuthUser(session.user) : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return
    await supabase.auth.signOut()
    window.location.href = "/"
  }, [])

  return { user, loaded, isSignedIn: user !== null, signOut }
}
