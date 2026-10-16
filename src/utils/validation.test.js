import { describe, expect, it } from 'vitest'
import initialComputers from '../data/initialComputers'
import { isValidISODate, nextAssetTag, normalizeComputer, validateComputer } from './validation'

const valid = {
  assetTag: 'PC-0100',
  brand: 'Dell',
  model: 'XPS 13',
  type: 'Laptop',
  serialNumber: 'NEW-SERIAL-1',
  cpu: 'Intel Core i7',
  ramGB: '16',
  storageGB: '512',
  assignedTo: 'Test User',
  department: 'IT',
  status: 'In Use',
  purchaseDate: '2024-01-01',
  price: '4500',
  notes: '',
}

describe('validateComputer', () => {
  it('accepts a valid computer', () => {
    expect(validateComputer(valid, initialComputers)).toEqual({})
  })

  it('reports every missing required field', () => {
    const errors = validateComputer({ status: '' })
    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining(['assetTag', 'brand', 'model', 'type', 'serialNumber', 'status', 'purchaseDate', 'ramGB', 'storageGB', 'price']),
    )
  })

  it('treats whitespace-only text as missing', () => {
    expect(validateComputer({ ...valid, brand: '   ' }).brand).toMatch(/required/)
  })

  it('rejects a badly formatted asset tag', () => {
    expect(validateComputer({ ...valid, assetTag: 'LAPTOP1' }).assetTag).toMatch(/PC-0001/)
  })

  it('rejects a duplicate asset tag (case-insensitive)', () => {
    expect(validateComputer({ ...valid, assetTag: 'pc-0001' }, initialComputers).assetTag).toMatch(/already used/)
  })

  it('rejects a duplicate serial number', () => {
    const errors = validateComputer({ ...valid, serialNumber: initialComputers[0].serialNumber.toLowerCase() }, initialComputers)
    expect(errors.serialNumber).toMatch(/already registered/)
  })

  it('allows a record to keep its own tag and serial when editing', () => {
    const existing = initialComputers[0]
    const values = { ...existing, ramGB: String(existing.ramGB) }
    expect(validateComputer(values, initialComputers, existing.id)).toEqual({})
  })

  it.each([
    ['ramGB', '0'],
    ['ramGB', '8.5'],
    ['ramGB', '-4'],
    ['storageGB', 'abc'],
  ])('rejects invalid %s value %s', (field, value) => {
    expect(validateComputer({ ...valid, [field]: value })[field]).toMatch(/whole number/)
  })

  it('rejects a negative price', () => {
    expect(validateComputer({ ...valid, price: '-1' }).price).toBeDefined()
  })

  it('rejects a purchase date in the future', () => {
    const nextYear = new Date().getFullYear() + 1
    expect(validateComputer({ ...valid, purchaseDate: `${nextYear}-01-01` }).purchaseDate).toMatch(/future/)
  })

  it('requires an assignee when the status is "In Use"', () => {
    expect(validateComputer({ ...valid, assignedTo: '' }).assignedTo).toMatch(/Assign/)
    expect(validateComputer({ ...valid, assignedTo: '', status: 'Available' }).assignedTo).toBeUndefined()
  })

  it('rejects values that are not in the allowed lists', () => {
    const errors = validateComputer({ ...valid, type: 'Phone', status: 'Lost' })
    expect(errors.type).toBeDefined()
    expect(errors.status).toBeDefined()
  })

  it('enforces maximum text lengths', () => {
    expect(validateComputer({ ...valid, notes: 'x'.repeat(501) }).notes).toMatch(/500/)
  })
})

describe('normalizeComputer', () => {
  it('trims text, upper-cases identifiers and converts numbers', () => {
    const result = normalizeComputer({ ...valid, assetTag: ' pc-0100 ', serialNumber: 'abc-1', brand: ' Dell ' })
    expect(result).toMatchObject({ assetTag: 'PC-0100', serialNumber: 'ABC-1', brand: 'Dell', ramGB: 16, storageGB: 512, price: 4500 })
  })
})

describe('nextAssetTag', () => {
  it('returns the tag after the highest existing one', () => {
    expect(nextAssetTag(initialComputers)).toBe('PC-0013')
  })

  it('starts at PC-0001 for an empty inventory', () => {
    expect(nextAssetTag([])).toBe('PC-0001')
  })
})

describe('isValidISODate', () => {
  it.each(['2024-02-29', '2025-12-31'])('accepts %s', (d) => expect(isValidISODate(d)).toBe(true))
  it.each(['2024-02-31', '2025-02-29', '2025-13-01', '2025-1-1', 'yesterday'])('rejects %s', (d) =>
    expect(isValidISODate(d)).toBe(false),
  )
})
