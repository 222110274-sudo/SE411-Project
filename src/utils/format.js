import { COMPUTER_STATUSES } from '../data/constants'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 })

export const formatPrice = (value) => currency.format(value)

export function formatStorage(gb) {
  return gb >= 1024 && gb % 1024 === 0 ? `${gb / 1024} TB` : `${gb} GB`
}

export function formatDate(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Class name suffix for a status badge, e.g. "In Repair" -> "in-repair". */
export const statusSlug = (status) => status.toLowerCase().replace(/\s+/g, '-')

export function computeStats(computers) {
  const byStatus = Object.fromEntries(COMPUTER_STATUSES.map((s) => [s, 0]))
  let totalValue = 0
  for (const c of computers) {
    byStatus[c.status] = (byStatus[c.status] ?? 0) + 1
    if (c.status !== 'Retired') totalValue += c.price
  }
  return { total: computers.length, byStatus, totalValue }
}
