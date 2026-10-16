import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import ComputerTable from '../components/ComputerTable'
import { useComputers } from '../context/ComputersContext'
import { COMPUTER_STATUSES, COMPUTER_TYPES } from '../data/constants'
import useDeleteConfirmation from '../hooks/useDeleteConfirmation'
import { SORT_OPTIONS, filterComputers, sortComputers } from '../utils/search'

const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback)

export default function ComputersPage() {
  const { computers } = useComputers()
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  // A success message passed by the add/edit pages. It is copied into state and
  // then removed from history, so a page reload does not show it again.
  const [message, setMessage] = useState(location.state?.message ?? '')

  useEffect(() => {
    if (location.state?.message) {
      navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null })
    }
  }, [location, navigate])

  // Filters live in the URL so they survive navigation and can be linked to.
  // Unknown values (e.g. a hand-edited URL) fall back to the defaults.
  const query = params.get('q') ?? ''
  const status = pick(params.get('status'), COMPUTER_STATUSES, 'All')
  const type = pick(params.get('type'), COMPUTER_TYPES, 'All')
  const sortBy = pick(params.get('sort'), Object.keys(SORT_OPTIONS), 'assetTag')

  const setParam = (key, value, defaultValue) => {
    const next = new URLSearchParams(params)
    if (value === defaultValue) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(
    () => sortComputers(filterComputers(computers, { query, status, type }), sortBy),
    [computers, query, status, type, sortBy],
  )

  const { requestDelete, dialog } = useDeleteConfirmation((c) => setMessage(`${c.assetTag} was deleted.`))

  const hasFilters = query || status !== 'All' || type !== 'All'

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Computers</h1>
          <p className="muted">Search, view, edit and delete company computers.</p>
        </div>
        <Link to="/computers/new" className="btn btn-primary">+ Add computer</Link>
      </div>

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      <div className="toolbar" role="search">
        <div className="field grow">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Asset tag, brand, model, serial, employee, department…"
            value={query}
            onChange={(e) => setParam('q', e.target.value, '')}
          />
        </div>
        <div className="field">
          <label htmlFor="filter-status">Status</label>
          <select id="filter-status" value={status} onChange={(e) => setParam('status', e.target.value, 'All')}>
            <option value="All">All statuses</option>
            {COMPUTER_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-type">Type</label>
          <select id="filter-type" value={type} onChange={(e) => setParam('type', e.target.value, 'All')}>
            <option value="All">All types</option>
            {COMPUTER_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sortBy} onChange={(e) => setParam('sort', e.target.value, 'assetTag')}>
            {Object.entries(SORT_OPTIONS).map(([key, option]) => (
              <option key={key} value={key}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-bar">
        <p className="muted" aria-live="polite">
          Showing {results.length} of {computers.length} computers
        </p>
        {hasFilters && (
          <button type="button" className="btn btn-small btn-ghost" onClick={() => setParams({}, { replace: true })}>
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ComputerTable computers={results} onDelete={requestDelete} />
      ) : (
        <div className="empty card">
          <p><strong>No computers found.</strong></p>
          <p className="muted">
            {computers.length === 0 ? 'The inventory is empty. Add the first computer.' : 'Try a different search or clear the filters.'}
          </p>
        </div>
      )}

      {dialog}
    </section>
  )
}
