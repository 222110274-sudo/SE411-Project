import { Link, useNavigate, useParams } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { useComputers } from '../context/ComputersContext'
import useDeleteConfirmation from '../hooks/useDeleteConfirmation'
import { formatDate, formatPrice, formatStorage } from '../utils/format'
import NotFoundPage from './NotFoundPage'

export default function ComputerDetailsPage() {
  const { id } = useParams()
  const { getComputer } = useComputers()
  const navigate = useNavigate()
  const computer = getComputer(id)
  const { requestDelete, dialog } = useDeleteConfirmation((c) =>
    navigate('/computers', { state: { message: `${c.assetTag} was deleted.` } }),
  )

  if (!computer) return <NotFoundPage message="This computer does not exist or was deleted." />

  const details = [
    ['Asset tag', computer.assetTag],
    ['Serial number', computer.serialNumber],
    ['Brand', computer.brand],
    ['Model', computer.model],
    ['Type', computer.type],
    ['Processor', computer.cpu || '—'],
    ['RAM', `${computer.ramGB} GB`],
    ['Storage', formatStorage(computer.storageGB)],
    ['Assigned to', computer.assignedTo || 'Unassigned'],
    ['Department', computer.department || '—'],
    ['Purchase date', formatDate(computer.purchaseDate)],
    ['Price', formatPrice(computer.price)],
  ]

  return (
    <section>
      <Link to="/computers" className="back-link">← Back to computers</Link>
      <div className="page-header">
        <div>
          <h1>
            {computer.brand} {computer.model}
          </h1>
          <p className="muted">
            {computer.assetTag} · <StatusBadge status={computer.status} />
          </p>
        </div>
        <div className="header-actions">
          <Link to={`/computers/${computer.id}/edit`} className="btn btn-secondary">Edit</Link>
          <button type="button" className="btn btn-danger" onClick={() => requestDelete(computer)}>
            Delete
          </button>
        </div>
      </div>

      <div className="card">
        <dl className="details">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {computer.notes && (
          <div className="notes">
            <h2>Notes</h2>
            <p>{computer.notes}</p>
          </div>
        )}
      </div>
      {dialog}
    </section>
  )
}
