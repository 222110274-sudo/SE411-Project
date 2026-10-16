import { useNavigate, useParams } from 'react-router-dom'
import ComputerForm from '../components/ComputerForm'
import { useComputers } from '../context/ComputersContext'
import NotFoundPage from './NotFoundPage'

export default function EditComputerPage() {
  const { id } = useParams()
  const { getComputer, updateComputer } = useComputers()
  const navigate = useNavigate()
  const computer = getComputer(id)

  if (!computer) return <NotFoundPage message="This computer does not exist or was deleted." />

  const handleSubmit = (changes) => {
    updateComputer(computer.id, changes)
    navigate('/computers', { state: { message: `${changes.assetTag} was updated.` } })
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Edit {computer.assetTag}</h1>
          <p className="muted">{computer.brand} {computer.model}</p>
        </div>
      </div>
      <div className="card">
        <ComputerForm
          initialValues={computer}
          excludeId={computer.id}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/computers/${computer.id}`)}
          submitLabel="Save changes"
        />
      </div>
    </section>
  )
}
