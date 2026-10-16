import { Link } from 'react-router-dom'

export default function NotFoundPage({ message = 'The page you are looking for does not exist.' }) {
  return (
    <section className="card empty">
      <h1>Not found</h1>
      <p className="muted">{message}</p>
      <Link to="/computers" className="btn btn-primary">Go to computers</Link>
    </section>
  )
}
