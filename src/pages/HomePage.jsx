import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { useComputers } from '../context/ComputersContext'
import { COMPUTER_STATUSES } from '../data/constants'
import { computeStats, formatDate, formatPrice, statusSlug } from '../utils/format'
import { sortComputers } from '../utils/search'

export default function HomePage() {
  const { computers } = useComputers()
  const stats = computeStats(computers)
  const recent = sortComputers(computers, 'newest').slice(0, 5)

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Overview of the company&apos;s computer inventory.</p>
        </div>
        <Link to="/computers/new" className="btn btn-primary">+ Add computer</Link>
      </div>

      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Total computers</span>
          <span className="stat-value" data-testid="stat-total">{stats.total}</span>
        </div>
        {COMPUTER_STATUSES.map((status) => (
          <Link
            key={status}
            to={`/computers?status=${encodeURIComponent(status)}`}
            className={`stat-card stat-${statusSlug(status)}`}
          >
            <span className="stat-label">{status}</span>
            <span className="stat-value">{stats.byStatus[status]}</span>
          </Link>
        ))}
        <div className="stat-card">
          <span className="stat-label">Active inventory value</span>
          <span className="stat-value stat-money">{formatPrice(stats.totalValue)}</span>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="card">
          <h2>Status breakdown</h2>
          <div className="status-bar" role="img" aria-label={COMPUTER_STATUSES.map((s) => `${s}: ${stats.byStatus[s]}`).join(', ')}>
            {COMPUTER_STATUSES.filter((s) => stats.byStatus[s] > 0).map((s) => (
              <span
                key={s}
                className={`segment segment-${statusSlug(s)}`}
                style={{ flexGrow: stats.byStatus[s] }}
                title={`${s}: ${stats.byStatus[s]}`}
              />
            ))}
          </div>
          <ul className="legend">
            {COMPUTER_STATUSES.map((s) => (
              <li key={s}>
                <span className={`dot segment-${statusSlug(s)}`} aria-hidden="true" /> {s} ({stats.byStatus[s]})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2>Recently purchased</h2>
          <Link to="/computers">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <p className="muted">No computers yet.</p>
        ) : (
          <ul className="recent-list">
            {recent.map((c) => (
              <li key={c.id}>
                <Link to={`/computers/${c.id}`}>
                  <strong>{c.assetTag}</strong> · {c.brand} {c.model}
                </Link>
                <span className="muted small">{formatDate(c.purchaseDate)}</span>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
