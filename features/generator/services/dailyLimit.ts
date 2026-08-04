import { sign, verify } from "@/lib/signedToken"

/** Applies to both a signed-in user (counted via ai_requests) and an
 *  anonymous/email-gated visitor (counted via the signed cookie below).
 *  Generous enough to never bother a genuine user, tight enough to make
 *  scripted abuse costly. */
export const DAILY_GENERATION_LIMIT = 10

export const ANONYMOUS_USAGE_COOKIE = "ld_gen_count"

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Encodes today's count into a tamper-proof cookie value. Returns null if
 *  COOKIE_SIGNING_SECRET isn't configured — callers should then skip
 *  setting the cookie and rely on the request simply passing through. */
export function encodeAnonymousUsage(count: number): string | null {
  return sign(`${todayKey()}|${count}`)
}

/** Decodes an anonymous-usage cookie and returns today's count. Returns 0
 *  if the cookie is missing, tampered with, or from a previous day. */
export function decodeAnonymousUsage(token: string | undefined | null): number {
  const raw = verify(token)
  if (!raw) return 0

  const [date, count] = raw.split("|")
  if (date !== todayKey()) return 0

  const parsed = Number(count)
  return Number.isFinite(parsed) ? parsed : 0
}

export function startOfTodayIso(): string {
  return `${todayKey()}T00:00:00.000Z`
}
