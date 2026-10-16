const SEARCH_FIELDS = ['assetTag', 'brand', 'model', 'serialNumber', 'cpu', 'assignedTo', 'department', 'type', 'status']

/**
 * Filters computers by a free-text query (matched against several fields,
 * case-insensitive) and by exact status / type. 'All' disables a filter.
 */
export function filterComputers(computers, { query = '', status = 'All', type = 'All' } = {}) {
  const q = query.trim().toLowerCase()
  return computers.filter(
    (c) =>
      (status === 'All' || c.status === status) &&
      (type === 'All' || c.type === type) &&
      (!q || SEARCH_FIELDS.some((field) => String(c[field] ?? '').toLowerCase().includes(q))),
  )
}

export const SORT_OPTIONS = {
  assetTag: { label: 'Asset tag (A–Z)', compare: (a, b) => a.assetTag.localeCompare(b.assetTag) },
  newest: { label: 'Newest purchase', compare: (a, b) => b.purchaseDate.localeCompare(a.purchaseDate) },
  oldest: { label: 'Oldest purchase', compare: (a, b) => a.purchaseDate.localeCompare(b.purchaseDate) },
  priceHigh: { label: 'Price (high → low)', compare: (a, b) => b.price - a.price },
  priceLow: { label: 'Price (low → high)', compare: (a, b) => a.price - b.price },
  brand: { label: 'Brand (A–Z)', compare: (a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`) },
}

/** Returns a new sorted array; the input is not modified. */
export function sortComputers(computers, sortBy = 'assetTag') {
  const option = SORT_OPTIONS[sortBy] ?? SORT_OPTIONS.assetTag
  return [...computers].sort(option.compare)
}
