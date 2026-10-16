import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { formatDate, formatPrice } from '../utils/format'

export default function ComputerTable({ computers, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="computer-table">
        <thead>
          <tr>
            <th scope="col">Asset tag</th>
            <th scope="col">Computer</th>
            <th scope="col">Type</th>
            <th scope="col">Assigned to</th>
            <th scope="col">Status</th>
            <th scope="col">Purchased</th>
            <th scope="col" className="num">Price</th>
            <th scope="col"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {computers.map((c) => (
            <tr key={c.id}>
              <td data-label="Asset tag">
                <Link to={`/computers/${c.id}`} className="tag-link">{c.assetTag}</Link>
              </td>
              <td data-label="Computer">
                <div>
                  <strong>{c.brand}</strong> {c.model}
                  <div className="muted small">{c.serialNumber}</div>
                </div>
              </td>
              <td data-label="Type">{c.type}</td>
              <td data-label="Assigned to">
                <div>
                  {c.assignedTo || <span className="muted">Unassigned</span>}
                  {c.department && <div className="muted small">{c.department}</div>}
                </div>
              </td>
              <td data-label="Status"><StatusBadge status={c.status} /></td>
              <td data-label="Purchased" className="nowrap">{formatDate(c.purchaseDate)}</td>
              <td data-label="Price" className="num">{formatPrice(c.price)}</td>
              <td className="row-actions">
                <Link to={`/computers/${c.id}`} className="btn btn-small btn-ghost" aria-label={`View ${c.assetTag}`}>
                  View
                </Link>
                <Link to={`/computers/${c.id}/edit`} className="btn btn-small btn-ghost" aria-label={`Edit ${c.assetTag}`}>
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-small btn-danger-ghost"
                  aria-label={`Delete ${c.assetTag}`}
                  onClick={() => onDelete(c)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
