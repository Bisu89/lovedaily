"use client"

import { usePageView } from "@/hooks/usePageView"
import type { AnalyticsEvent, AnalyticsProperties } from "@/lib/analytics"

interface PageViewTrackerProps {
  event: AnalyticsEvent
  properties?: AnalyticsProperties
}

/**
 * Renders nothing. Drop into a Server Component page to fire a page-view
 * event on mount without converting the whole page to a Client Component.
 */
export function PageViewTracker({ event, properties }: PageViewTrackerProps) {
  usePageView(event, properties)
  return null
}
