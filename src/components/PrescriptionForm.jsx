import { useState } from 'react'
import HerbPicker, { FORMATS } from './HerbPicker.jsx'

const FORMULATION_TYPES = ['Tincture', 'Fluid extract', 'Dried herb mix', 'Herbal tea', 'Capsules', 'Cream / ointment', 'Lotion']
const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed', 'Weekly']

const emptyPrescription = {
  formulation_type: 'Tincture',
  total_volume_ml: '',
  dosage: '5ml',
  frequency: 'Three times daily',
  duration: '',
  instructions: '',
  practitioner_notes: '',
  status: 'draft',
  issued_date: '',
  review_date: '',
  items: []
}

const inputClass = 'w-full rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs tracking-wide text-moss/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

export default function PrescriptionForm({ client, existing, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => {
    if (!existing) return emptyPrescription
    return {
      ...emptyPrescription,
      ...existing,
      issued_date: existing.issued_date || '',
      review_date: existing.review_date || '',
      items: (existing.prescription_items || []).slice().sort((a, b) => a.sort_order - b.sort_order)
    }
  })

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const addItem = (item) => setForm((f) => ({ ...f, items: [...f.items, item] }))
  const updateItem = (i, key, value) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item))
    }))
  const removeItem = (i) => setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }))

  const totalUsed = form.items.reduce((sum, item) => sum + (parseFloat(item.quantity_ml) || 0), 0)

  const buildPayload = () => ({
    ...form,
    submission_id: client.id,
    client_name: `${client.first_name || ''} ${client.surname || ''}`.trim(),
    client_email: client.email,
    total_volume_ml: form.total_volume_ml === '' ? null : Number(form.total_volume_ml),
    issued_date: form.issued_date || null,
    review_date: form.review_date || null,
    items: form.items.map((item) => ({
      ...item,
      quantity_ml: item.quantity_ml === '' ? null : Number(item.quantity_ml)
    }))
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(buildPayload())
  }

  return (
    <form onSubmit={handleSubmit} className="bg-linen border border-moss/20 rounded-lg p-5 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg text-moss">
            {existing ? `Edit prescription ${existing.reference || ''}` : 'New prescription'}
          </p>
          <span className="font-mono text-xs text-ink/50">
            {client.first_name} {client.surname}
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="flex-shrink-0 h-8 w-8 rounded-full border border-moss/20 text-moss hover:border-ochre hover:text-ochre transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* --- Herbs --- */}
      <div>
        <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">FORMULATION</p>
        <HerbPicker onAdd={addItem} />

        {form.items.length > 0 && (
          <div className="mt-3 space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="bg-cream border border-moss/10 rounded-md p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-ink italic">{item.herb_latin}</p>
                    {item.herb_common && <p className="text-xs text-ink/60">{item.herb_common}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="text-xs text-ochre hover:underline flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 mt-3">
                  <select
                    className={inputClass}
                    value={item.format || 'Tincture'}
                    onChange={(e) => updateItem(i, 'format', e.target.value)}
                  >
                    {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Quantity (ml)"
                    className={inputClass}
                    value={item.quantity_ml ?? ''}
                    onChange={(e) => updateItem(i, 'quantity_ml', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    className={inputClass}
                    value={item.notes || ''}
                    onChange={(e) => updateItem(i, 'notes', e.target.value)}
                  />
                </div>
              </div>
            ))}
            <p className="text-xs font-mono text-ink/60 text-right">
              Total from herbs: {totalUsed}ml
              {form.total_volume_ml && Number(form.total_volume_ml) !== totalUsed && (
                <span className="text-ochre"> · differs from total volume ({form.total_volume_ml}ml)</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* --- Dosage --- */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="FORMULATION TYPE">
          <select className={inputClass} value={form.formulation_type} onChange={(e) => update('formulation_type', e.target.value)}>
            {FORMULATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="TOTAL VOLUME MADE UP (ML)">
          <input type="number" step="any" min="0" className={inputClass} value={form.total_volume_ml ?? ''} onChange={(e) => update('total_volume_ml', e.target.value)} />
        </Field>
        <Field label="DOSE">
          <input type="text" placeholder="e.g. 5ml" className={inputClass} value={form.dosage || ''} onChange={(e) => update('dosage', e.target.value)} />
        </Field>
        <Field label="FREQUENCY">
          <select className={inputClass} value={form.frequency} onChange={(e) => update('frequency', e.target.value)}>
            {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="DURATION">
          <input type="text" placeholder="e.g. 4 weeks" className={inputClass} value={form.duration || ''} onChange={(e) => update('duration', e.target.value)} />
        </Field>
        <Field label="REVIEW DATE">
          <input type="date" className={inputClass} value={form.review_date || ''} onChange={(e) => update('review_date', e.target.value)} />
        </Field>
      </div>

      <Field label="INSTRUCTIONS FOR THE CLIENT">
        <textarea rows={2} placeholder="e.g. Take with a little water before food" className={inputClass} value={form.instructions || ''} onChange={(e) => update('instructions', e.target.value)} />
      </Field>

      <Field label="PRACTITIONER NOTES (PRIVATE — NOT SHOWN TO THE CLIENT)">
        <textarea rows={3} className={inputClass} value={form.practitioner_notes || ''} onChange={(e) => update('practitioner_notes', e.target.value)} />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="STATUS">
          <select className={inputClass} value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="draft">Draft — planning, only visible to you</option>
            <option value="made">Made up — prepared, not yet given out</option>
            <option value="issued">Issued — given to the client, visible to them</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="ISSUED DATE">
          <input type="date" className={inputClass} value={form.issued_date || ''} onChange={(e) => update('issued_date', e.target.value)} />
        </Field>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
        <button type="button" onClick={onCancel} className="text-sm text-moss hover:text-ochre">
          Cancel
        </button>
        <div className="flex flex-wrap gap-3">
          {!existing && (
            <button
              type="button"
              disabled={saving}
              onClick={() => onSave(buildPayload(), { keepOpen: true })}
              className="border border-moss text-moss px-5 py-2.5 rounded text-sm disabled:opacity-50 hover:bg-moss/5 transition-colors"
            >
              Save &amp; start another
            </button>
          )}
          <button type="submit" disabled={saving} className="bg-ochre text-linen px-6 py-2.5 rounded text-sm disabled:opacity-50">
            {saving ? 'Saving…' : existing ? 'Save changes' : 'Save prescription'}
          </button>
        </div>
      </div>
    </form>
  )
}
