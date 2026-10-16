import { useRef, useState } from 'react'
import { COMPUTER_STATUSES, COMPUTER_TYPES, DEPARTMENTS } from '../data/constants'
import { useComputers } from '../context/ComputersContext'
import { normalizeComputer, todayISO, validateComputer } from '../utils/validation'

function Field({ name, label, required, error, hint, children }) {
  return (
    <div className={`field${error ? ' has-error' : ''}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="required" aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="hint" id={`${name}-hint`}>{hint}</p>}
      {error && (
        <p className="error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Shared add/edit form. Validates on submit, then re-validates live once the
 * user has tried to submit, so errors disappear as they are fixed.
 */
export default function ComputerForm({ initialValues, onSubmit, onCancel, submitLabel = 'Save', excludeId = null }) {
  const { computers } = useComputers()
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    const next = { ...values, [name]: value }
    setValues(next)
    if (submitted) setErrors(validateComputer(next, computers, excludeId))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    const found = validateComputer(values, computers, excludeId)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      formRef.current?.elements.namedItem(firstInvalid)?.focus()
      return
    }
    onSubmit(normalizeComputer(values))
  }

  const inputProps = (name, extra = {}) => ({
    id: name,
    name,
    value: values[name] ?? '',
    onChange: handleChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    ...extra,
  })

  return (
    <form ref={formRef} className="computer-form" onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend>Identification</legend>
        <div className="grid">
          <Field name="assetTag" label="Asset tag" required error={errors.assetTag} hint="Format: PC-0001">
            <input {...inputProps('assetTag', { placeholder: 'PC-0001', autoComplete: 'off' })} />
          </Field>
          <Field name="serialNumber" label="Serial number" required error={errors.serialNumber}>
            <input {...inputProps('serialNumber', { autoComplete: 'off' })} />
          </Field>
          <Field name="brand" label="Brand" required error={errors.brand}>
            <input {...inputProps('brand', { placeholder: 'e.g. Dell' })} />
          </Field>
          <Field name="model" label="Model" required error={errors.model}>
            <input {...inputProps('model', { placeholder: 'e.g. Latitude 7440' })} />
          </Field>
          <Field name="type" label="Type" required error={errors.type}>
            <select {...inputProps('type')}>
              <option value="">Select a type…</option>
              {COMPUTER_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend>Specifications</legend>
        <div className="grid">
          <Field name="cpu" label="Processor (CPU)" error={errors.cpu}>
            <input {...inputProps('cpu', { placeholder: 'e.g. Intel Core i7-1365U' })} />
          </Field>
          <Field name="ramGB" label="RAM (GB)" required error={errors.ramGB}>
            <input {...inputProps('ramGB', { type: 'number', min: 1, step: 1, inputMode: 'numeric' })} />
          </Field>
          <Field name="storageGB" label="Storage (GB)" required error={errors.storageGB}>
            <input {...inputProps('storageGB', { type: 'number', min: 1, step: 1, inputMode: 'numeric' })} />
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend>Assignment</legend>
        <div className="grid">
          <Field name="status" label="Status" required error={errors.status}>
            <select {...inputProps('status')}>
              {COMPUTER_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field
            name="assignedTo"
            label="Assigned to"
            required={values.status === 'In Use'}
            error={errors.assignedTo}
            hint="Employee or team using this computer"
          >
            <input {...inputProps('assignedTo')} />
          </Field>
          <Field name="department" label="Department" error={errors.department}>
            <select {...inputProps('department')}>
              <option value="">None</option>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset>
        <legend>Purchase</legend>
        <div className="grid">
          <Field name="purchaseDate" label="Purchase date" required error={errors.purchaseDate}>
            <input {...inputProps('purchaseDate', { type: 'date', max: todayISO() })} />
          </Field>
          <Field name="price" label="Price (SAR)" required error={errors.price}>
            <input {...inputProps('price', { type: 'number', min: 0, step: '0.01', inputMode: 'decimal' })} />
          </Field>
        </div>
        <Field name="notes" label="Notes" error={errors.notes}>
          <textarea {...inputProps('notes', { rows: 3 })} />
        </Field>
      </fieldset>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
