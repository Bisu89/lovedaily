export interface SaleDetails {
  plan: string
  amountTotal: number | null
  currency: string | null
  customerEmail: string | null
}

/**
 * Swap this out for a real email/Slack integration later — the webhook
 * only ever calls notifyFounder(), so nothing else changes.
 */
export function notifyFounder(sale: SaleDetails): void {
  console.log("[sale]", sale)
}
