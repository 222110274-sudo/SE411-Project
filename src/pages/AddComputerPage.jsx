import { useNavigate } from 'react-router-dom'
import ComputerForm from '../components/ComputerForm'
import { useComputers } from '../context/ComputersContext'
import { EMPTY_COMPUTER } from '../data/constants'
import { nextAssetTag } from '../utils/validation'

export default function AddComputerPage() {
  const { computers, addComputer } = useComputers()
  const navigate = useNavigate()

  const handleSubmit = (computer) => {
    addComputer(computer)
    navigate('/computers', { state: { message: `${computer.assetTag} was added.` } })
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Add computer</h1>
          <p className="muted">Register a new computer in the inventory. Fields marked * are required.</p>
        </div>
      </div>
      <div className="card">
        <ComputerForm
          initialValues={{ ...EMPTY_COMPUTER, assetTag: nextAssetTag(computers) }}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/computers')}
          submitLabel="Add computer"
        />
      </div>
    </section>
  )
}
