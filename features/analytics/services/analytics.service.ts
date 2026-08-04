export type AnalyticsEvent =
  | "Landing Viewed"
  | "Generator Opened"
  | "Template Selected"
  | "Generate Clicked"
  | "Generation Success"
  | "Generation Failed"
  | "Copy Clicked"
  | "Generate Again"
  | "Premium Clicked"
  | "Purchase Completed"
  | "FAQ Expanded"
  | "CTA Clicked"

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>

export interface AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void
}

class ConsoleAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    console.log(`[analytics] ${event}`, properties ?? {})
  }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

/**
 * Maps our internal event names to Meta's standard event names where a
 * sensible one exists. Standard events (vs. arbitrary custom ones) are what
 * Facebook's ad delivery algorithm optimizes around, so only the funnel
 * milestones that actually matter for ad spend are mapped here.
 */
const FACEBOOK_EVENT_MAP: Partial<Record<AnalyticsEvent, string>> = {
  "Generator Opened": "ViewContent",
  "Generate Clicked": "Lead",
  "Premium Clicked": "InitiateCheckout",
  "Purchase Completed": "Purchase",
}

class FacebookPixelProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    if (typeof window === "undefined" || !window.fbq) return

    const facebookEvent = FACEBOOK_EVENT_MAP[event]
    if (!facebookEvent) return

    window.fbq("track", facebookEvent, properties)
  }
}

/**
 * Persists events to Supabase (feature_events table) via our own API route,
 * so the admin dashboard and future product analytics have real history —
 * not just what's visible in the console right now. Best-effort: a failed
 * write here should never surface as a user-facing error.
 */
class SupabaseAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
    if (typeof window === "undefined") return

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties }),
      keepalive: true,
    }).catch(() => {})
  }
}

/**
 * Active providers. To send events to a real vendor, implement
 * AnalyticsProvider (e.g. a GoogleAnalyticsProvider, PostHogProvider, or
 * MixpanelProvider) and add an instance to this array. Every call site in
 * the app only ever calls track() below, so nothing else changes.
 */
const providers: AnalyticsProvider[] = [new SupabaseAnalyticsProvider()]

if (process.env.NODE_ENV === "development") {
  providers.push(new ConsoleAnalyticsProvider())
}

if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
  providers.push(new FacebookPixelProvider())
}

export function track(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties
): void {
  const enrichedProperties: AnalyticsProperties = {
    ...properties,
    timestamp: new Date().toISOString(),
  }

  for (const provider of providers) {
    provider.track(event, enrichedProperties)
  }
}
