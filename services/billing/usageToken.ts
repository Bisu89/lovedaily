import { sign, verify } from "@/lib/signedToken"

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Encodes today's generation count into a tamper-proof cookie value.
 * Returns null if COOKIE_SIGNING_SECRET isn't configured yet.
 */
export function encodeUsageToken(count: number): string | null {
  return sign(`${todayKey()}|${count}`)
}

/**
 * Decodes a usage cookie value and returns today's count. Returns 0 if the
 * cookie is missing, invalid, or from a previous day.
 */
export function decodeUsageToken(token: string | undefined | null): number {
  const raw = verify(token)
  if (!raw) return 0

  const [date, count] = raw.split("|")
  if (date !== todayKey()) return 0

  const parsed = Number(count)
  return Number.isFinite(parsed) ? parsed : 0
}
