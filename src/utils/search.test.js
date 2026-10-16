import { describe, expect, it } from 'vitest'
import initialComputers from '../data/initialComputers'
import { filterComputers, sortComputers } from './search'

const tags = (list) => list.map((c) => c.assetTag)

describe('filterComputers', () => {
  it('returns everything with no filters', () => {
    expect(filterComputers(initialComputers)).toHaveLength(initialComputers.length)
  })

  it('matches the query case-insensitively across fields', () => {
    expect(tags(filterComputers(initialComputers, { query: 'macbook' }))).toEqual(['PC-0002'])
    expect(tags(filterComputers(initialComputers, { query: 'reem' }))).toEqual(['PC-0002'])
    expect(tags(filterComputers(initialComputers, { query: 'pc-0007' }))).toEqual(['PC-0007'])
  })

  it('ignores surrounding whitespace in the query', () => {
    expect(filterComputers(initialComputers, { query: '  apple  ' })).toHaveLength(2)
  })

  it('filters by status and type together', () => {
    const result = filterComputers(initialComputers, { status: 'In Use', type: 'Laptop' })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((c) => c.status === 'In Use' && c.type === 'Laptop')).toBe(true)
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterComputers(initialComputers, { query: 'does-not-exist' })).toEqual([])
  })
})

describe('sortComputers', () => {
  it('sorts by price without mutating the input', () => {
    const copy = [...initialComputers]
    const sorted = sortComputers(initialComputers, 'priceHigh')
    expect(sorted[0].assetTag).toBe('PC-0007')
    expect(initialComputers).toEqual(copy)
  })

  it('sorts by newest purchase date', () => {
    expect(sortComputers(initialComputers, 'newest')[0].assetTag).toBe('PC-0012')
  })

  it('falls back to asset tag order for an unknown key', () => {
    expect(tags(sortComputers([...initialComputers].reverse(), 'nope'))[0]).toBe('PC-0001')
  })
})
