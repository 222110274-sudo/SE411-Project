import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { useComputers } from '../context/ComputersContext'

/**
 * Shared delete flow: call requestDelete(computer) to open a confirmation
 * dialog; render `dialog` somewhere in the page. onDeleted runs after removal.
 */
export default function useDeleteConfirmation(onDeleted) {
  const { deleteComputer } = useComputers()
  const [pending, setPending] = useState(null)

  const confirm = () => {
    deleteComputer(pending.id)
    onDeleted?.(pending)
    setPending(null)
  }

  const dialog = (
    <ConfirmDialog
      open={pending !== null}
      title="Delete computer?"
      message={
        pending
          ? `${pending.assetTag} (${pending.brand} ${pending.model}) will be permanently removed from the inventory.`
          : ''
      }
      onConfirm={confirm}
      onCancel={() => setPending(null)}
    />
  )

  return { requestDelete: setPending, dialog }
}
