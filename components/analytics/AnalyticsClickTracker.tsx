"use client"

import { useEffect } from "react"

import { track, type AnalyticsEvent, type AnalyticsProperties } from "@/lib/analytics"

const EVENT_ATTR = "data-analytics-event"
const PROPS_ATTR = "data-analytics-props"

/**
 * Mounted once in the root layout. Lets plain Server Components declare
 * clickable analytics events via data attributes instead of importing any
 * analytics code:
 *
 *   <a data-analytics-event="CTA Clicked" data-analytics-props='{"label":"Start Free"}'>
 *
 * Stateful/dynamic events (Template Selected, Copy Clicked, Generation
 * Success, etc.) still go through useAnalytics() directly where the
 * properties depend on runtime state.
 */
export function AnalyticsClickTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return

      const trigger = event.target.closest(`[${EVENT_ATTR}]`)
      if (!trigger) return

      const eventName = trigger.getAttribute(EVENT_ATTR) as AnalyticsEvent | null
      if (!eventName) return

      const rawProperties = trigger.getAttribute(PROPS_ATTR)
      let properties: AnalyticsProperties | undefined

      if (rawProperties) {
        try {
          properties = JSON.parse(rawProperties) as AnalyticsProperties
        } catch {
          properties = undefined
        }
      }

      track(eventName, properties)
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return null
}
