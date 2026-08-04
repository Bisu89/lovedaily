"use client"

import { useEffect } from "react"

import { useAnalytics } from "@/features/analytics/hooks/useAnalytics"
import type {
  AnalyticsEvent,
  AnalyticsProperties,
} from "@/features/analytics/services/analytics.service"

/**
 * Fires an analytics event once when the component mounts. Used for
 * page/section "viewed" or "opened" events.
 */
export function usePageView(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties
): void {
  const { track } = useAnalytics()

  // Intentionally fires once on mount only, regardless of prop identity.
  useEffect(() => {
    track(event, properties)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
