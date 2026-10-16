export const ACTIONS = {
  ADD: 'ADD_COMPUTER',
  UPDATE: 'UPDATE_COMPUTER',
  DELETE: 'DELETE_COMPUTER',
}

const nextId = (computers) => computers.reduce((max, c) => Math.max(max, c.id), 0) + 1

/** Pure reducer for the in-memory computer collection. */
export function computersReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return [...state, { ...action.payload, id: nextId(state) }]
    case ACTIONS.UPDATE:
      return state.map((c) => (c.id === action.id ? { ...c, ...action.payload, id: c.id } : c))
    case ACTIONS.DELETE:
      return state.filter((c) => c.id !== action.id)
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
