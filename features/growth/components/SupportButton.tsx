const COFFEE_URL = process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL

interface SupportButtonProps {
  /** Where this instance is rendered — tags the analytics event so the
   *  admin dashboard can tell which placement gets more clicks. */
  location: "header" | "generate-header" | "footer" | "result" | "limit-reached"
}

/**
 * Friendly, optional support ask — never a paywall. Renders nothing if
 * no Ko-fi link is configured. Uses Ko-fi's own official badge image
 * (not a custom-styled button) so it's instantly recognizable, and is
 * deliberately placed in several high-visibility spots (both page
 * headers, the footer, and the result page).
 */
export function SupportButton({ location }: SupportButtonProps) {
  if (!COFFEE_URL) return null

  return (
    <a
      href={COFFEE_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-analytics-event="CTA Clicked"
      data-analytics-props={JSON.stringify({
        label: "Support this project",
        location,
      })}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- official
          third-party Ko-fi badge asset, not a local image to optimize */}
      <img
        height={36}
        style={{ height: 36, border: 0 }}
        src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
        alt="Buy Me a Coffee at ko-fi.com"
      />
    </a>
  )
}
