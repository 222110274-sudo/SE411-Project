/* oxlint-disable react/only-export-components -- provider and its hook belong together */
import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import initialComputers from '../data/initialComputers'
import { ACTIONS, computersReducer } from './computersReducer'

const ComputersContext = createContext(null)

export function ComputersProvider({ children, initialData = initialComputers }) {
  const [computers, dispatch] = useReducer(computersReducer, initialData)

  const addComputer = useCallback((computer) => dispatch({ type: ACTIONS.ADD, payload: computer }), [])
  const updateComputer = useCallback((id, changes) => dispatch({ type: ACTIONS.UPDATE, id, payload: changes }), [])
  const deleteComputer = useCallback((id) => dispatch({ type: ACTIONS.DELETE, id }), [])

  const value = useMemo(
    () => ({
      computers,
      addComputer,
      updateComputer,
      deleteComputer,
      getComputer: (id) => computers.find((c) => c.id === Number(id)),
    }),
    [computers, addComputer, updateComputer, deleteComputer],
  )

  return <ComputersContext.Provider value={value}>{children}</ComputersContext.Provider>
}

export function useComputers() {
  const context = useContext(ComputersContext)
  if (!context) throw new Error('useComputers must be used inside <ComputersProvider>')
  return context
}
