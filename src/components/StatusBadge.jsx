import { statusSlug } from '../utils/format'

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${statusSlug(status)}`}>{status}</span>
}
