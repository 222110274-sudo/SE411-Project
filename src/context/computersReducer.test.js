import { describe, expect, it } from 'vitest'
import { ACTIONS, computersReducer } from './computersReducer'

const state = [
  { id: 1, assetTag: 'PC-0001', brand: 'Dell' },
  { id: 5, assetTag: 'PC-0005', brand: 'HP' },
]

describe('computersReducer', () => {
  it('adds a computer with the next free id', () => {
    const next = computersReducer(state, { type: ACTIONS.ADD, payload: { assetTag: 'PC-0006', brand: 'Asus' } })
    expect(next).toHaveLength(3)
    expect(next[2]).toEqual({ id: 6, assetTag: 'PC-0006', brand: 'Asus' })
    expect(state).toHaveLength(2)
  })

  it('updates only the matching computer and keeps its id', () => {
    const next = computersReducer(state, { type: ACTIONS.UPDATE, id: 5, payload: { brand: 'Lenovo', id: 99 } })
    expect(next[1]).toEqual({ id: 5, assetTag: 'PC-0005', brand: 'Lenovo' })
    expect(next[0]).toBe(state[0])
  })

  it('deletes the matching computer', () => {
    expect(computersReducer(state, { type: ACTIONS.DELETE, id: 1 })).toEqual([state[1]])
  })

  it('throws on an unknown action', () => {
    expect(() => computersReducer(state, { type: 'NOPE' })).toThrow(/Unknown action/)
  })
})
