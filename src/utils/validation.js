import { COMPUTER_STATUSES, COMPUTER_TYPES } from '../data/constants'

const REQUIRED_FIELDS = {
  assetTag: 'Asset tag',
  brand: 'Brand',
  model: 'Model',
  type: 'Type',
  serialNumber: 'Serial number',
  status: 'Status',
  purchaseDate: 'Purchase date',
  ramGB: 'RAM',
  storageGB: 'Storage',
  price: 'Price',
}

const TEXT_LIMITS = {
  assetTag: 7,
  brand: 40,
  model: 60,
  serialNumber: 40,
  cpu: 60,
  assignedTo: 60,
  department: 40,
  notes: 500,
}

export const ASSET_TAG_PATTERN = /^PC-\d{4}$/

const asText = (value) => String(value ?? '').trim()

/** True for a real calendar date in YYYY-MM-DD form (rejects e.g. 2024-02-31). */
export function isValidISODate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
}

export function todayISO() {
  // en-CA formats dates as YYYY-MM-DD in the user's local time zone.
  return new Date().toLocaleDateString('en-CA')
}

/**
 * Validates a computer form. Returns an object mapping field names to error
 * messages; an empty object means the values are valid.
 * `existing` is the current collection, used to keep asset tags and serial
 * numbers unique. `excludeId` skips the record being edited.
 */
export function validateComputer(values, existing = [], excludeId = null) {
  const errors = {}

  for (const [field, label] of Object.entries(REQUIRED_FIELDS)) {
    if (!asText(values[field])) errors[field] = `${label} is required.`
  }

  for (const [field, max] of Object.entries(TEXT_LIMITS)) {
    if (!errors[field] && asText(values[field]).length > max) {
      errors[field] = `Must be ${max} characters or fewer.`
    }
  }

  const others = existing.filter((c) => c.id !== excludeId)

  const tag = asText(values.assetTag).toUpperCase()
  if (tag && !errors.assetTag) {
    if (!ASSET_TAG_PATTERN.test(tag)) {
      errors.assetTag = 'Asset tag must look like PC-0001.'
    } else if (others.some((c) => c.assetTag.toUpperCase() === tag)) {
      errors.assetTag = 'This asset tag is already used by another computer.'
    }
  }

  const serial = asText(values.serialNumber).toUpperCase()
  if (serial && !errors.serialNumber && others.some((c) => c.serialNumber.toUpperCase() === serial)) {
    errors.serialNumber = 'This serial number is already registered.'
  }

  if (values.type && !errors.type && !COMPUTER_TYPES.includes(values.type)) {
    errors.type = 'Choose a valid type.'
  }
  if (values.status && !errors.status && !COMPUTER_STATUSES.includes(values.status)) {
    errors.status = 'Choose a valid status.'
  }

  for (const [field, label] of [['ramGB', 'RAM'], ['storageGB', 'Storage']]) {
    if (errors[field]) continue
    const n = Number(values[field])
    if (!Number.isInteger(n) || n < 1 || n > 100000) {
      errors[field] = `${label} must be a whole number between 1 and 100000 GB.`
    }
  }

  if (!errors.price) {
    const price = Number(values.price)
    if (!Number.isFinite(price) || price < 0 || price > 10000000) {
      errors.price = 'Price must be a number between 0 and 10,000,000.'
    }
  }

  if (values.purchaseDate && !errors.purchaseDate) {
    if (!isValidISODate(values.purchaseDate)) {
      errors.purchaseDate = 'Enter a valid date.'
    } else if (values.purchaseDate > todayISO()) {
      errors.purchaseDate = 'Purchase date cannot be in the future.'
    }
  }

  if (values.status === 'In Use' && !asText(values.assignedTo) && !errors.assignedTo) {
    errors.assignedTo = 'Assign an employee when the status is "In Use".'
  }

  return errors
}

/** Converts raw form values into a clean computer record. */
export function normalizeComputer(values) {
  return {
    assetTag: asText(values.assetTag).toUpperCase(),
    brand: asText(values.brand),
    model: asText(values.model),
    type: values.type,
    serialNumber: asText(values.serialNumber).toUpperCase(),
    cpu: asText(values.cpu),
    ramGB: Number(values.ramGB),
    storageGB: Number(values.storageGB),
    assignedTo: asText(values.assignedTo),
    department: asText(values.department),
    status: values.status,
    purchaseDate: values.purchaseDate,
    price: Number(values.price),
    notes: asText(values.notes),
  }
}

/** Suggests the next free asset tag, e.g. PC-0013. */
export function nextAssetTag(computers) {
  const max = computers.reduce((highest, c) => {
    const match = /^PC-(\d{4})$/.exec(c.assetTag)
    return match ? Math.max(highest, Number(match[1])) : highest
  }, 0)
  return `PC-${String(max + 1).padStart(4, '0')}`
}
