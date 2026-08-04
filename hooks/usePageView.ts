"use client"

import { useEffect } from "react"

import { useAnalytics } from "@/hooks/useAnalytics"
import type { AnalyticsEvent, AnalyticsProperties } from "@/lib/analytics"

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
