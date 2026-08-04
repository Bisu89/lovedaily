import { Button } from "@/components/ui/button"

const COFFEE_URL = process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL

/**
 * Friendly, optional support ask — never a paywall. Renders nothing if
 * no Buy Me a Coffee link is configured.
 */
export function SupportButton() {
  if (!COFFEE_URL) return null

  return (
    <Button
      variant="outline"
      nativeButton={false}
      render={
        <a
          href={COFFEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics-event="CTA Clicked"
          data-analytics-props='{"label":"Support this project","location":"result"}'
        >
          ❤️ Support this project
        </a>
      }
    />
  )
}
