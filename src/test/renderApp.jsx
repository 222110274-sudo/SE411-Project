import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { ComputersProvider } from '../context/ComputersContext'
import initialComputers from '../data/initialComputers'

/** Renders the full app at `route` with a fresh copy of the data. */
export function renderApp(route = '/', initialData = initialComputers) {
  const user = userEvent.setup()
  const utils = render(
    <MemoryRouter initialEntries={[route]}>
      <ComputersProvider initialData={initialData.map((c) => ({ ...c }))}>
        <App />
      </ComputersProvider>
    </MemoryRouter>,
  )
  return { user, ...utils }
}
