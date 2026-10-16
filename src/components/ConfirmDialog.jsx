import { useEffect, useRef } from 'react'

/** Accessible confirmation modal built on the native <dialog> element. */
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    // jsdom (tests) does not implement showModal, so fall back to the open attribute.
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal()
      else dialog.setAttribute('open', '')
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      aria-labelledby="confirm-title"
      onCancel={(e) => {
        e.preventDefault()
        onCancel()
      }}
    >
      {open && (
        <>
          <h2 id="confirm-title">{title}</h2>
          <p>{message}</p>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel} autoFocus>
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </>
      )}
    </dialog>
  )
}
