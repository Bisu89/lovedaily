export const PREMIUM_COOKIE_NAME = "ld_premium"
export const USAGE_COOKIE_NAME = "ld_usage"

export const PREMIUM_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
export const USAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 2

export const DAILY_FREE_LIMIT = 3

/** Cookies only work over plain HTTP outside production (local/LAN testing). */
export const COOKIE_IS_SECURE = process.env.NODE_ENV === "production"
