import { createHmac, timingSafeEqual } from "node:crypto"

function getSecret(): string {
  const secret = process.env.COOKIE_SIGNING_SECRET
  if (!secret) {
    throw new Error("COOKIE_SIGNING_SECRET is not set")
  }
  return secret
}

/**
 * Signs a value so it can be stored in a cookie without being forgeable by
 * the client. Server-only (uses node:crypto) — never import this from a
 * Client Component. Returns null if COOKIE_SIGNING_SECRET isn't configured
 * yet, so callers can degrade gracefully instead of crashing the request.
 */
export function sign(value: string): string | null {
  try {
    const signature = createHmac("sha256", getSecret()).update(value).digest("hex")
    return `${value}.${signature}`
  } catch {
    return null
  }
}

/**
 * Verifies a signed value and returns the original value, or null if it's
 * missing, malformed, or tampered with.
 */
export function verify(signedValue: string | undefined | null): string | null {
  if (!signedValue) return null

  const separatorIndex = signedValue.lastIndexOf(".")
  if (separatorIndex === -1) return null

  const value = signedValue.slice(0, separatorIndex)
  const signature = signedValue.slice(separatorIndex + 1)

  let expected: string
  try {
    expected = createHmac("sha256", getSecret()).update(value).digest("hex")
  } catch {
    return null
  }

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (signatureBuffer.length !== expectedBuffer.length) return null
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null

  return value
}
