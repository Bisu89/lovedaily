import { getSupabaseAdminClient } from "@/lib/supabase/admin"

export interface EmailSubscription {
  email: string
  source: string
}

/**
 * Persists to Supabase (email_subscribers table) when configured; falls
 * back to a console log otherwise so local dev without a project still
 * works. `email` is unique — re-submitting the same address updates
 * nothing rather than creating a duplicate row.
 *
 * Swap this out for a real ESP (Mailchimp, ConvertKit, Resend audiences...)
 * later — every call site only ever calls subscribeEmail(), so nothing
 * else changes.
 */
export async function subscribeEmail(subscription: EmailSubscription): Promise<void> {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    console.log("[subscriber]", subscription)
    return
  }

  await supabase
    .from("email_subscribers")
    .upsert(
      { email: subscription.email, source: subscription.source },
      { onConflict: "email", ignoreDuplicates: true }
    )
}
