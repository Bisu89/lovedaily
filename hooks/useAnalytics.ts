"use client"

import { useCallback } from "react"

import { track, type AnalyticsEvent, type AnalyticsProperties } from "@/lib/analytics"

export function useAnalytics() {
  const trackEvent = useCallback(
    (event: AnalyticsEvent, properties?: AnalyticsProperties) => {
      track(event, properties)
    },
    []
  )

  return { track: trackEvent }
}
