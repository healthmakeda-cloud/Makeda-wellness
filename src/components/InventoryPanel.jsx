import { useState } from 'react'
import HerbPicker, { FORMATS } from './HerbPicker.jsx'

const inputClass = 'w-full rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs tracking-wide text-moss/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function AddStockForm({ onSave, onCancel, saving }) {
  const [herb, setHerb] = useState(null)
  const [form, setForm] = useState({
    format: 'Tincture',
    unit: 'ml',
    low_stock_threshold: '',
    supplier: '',
    notes: '',
    // First delivery, entered at the same time so setting up a new herb
    // is a single step rather than two.
    quantity_received: '',
    batch_number: '',
    purchase_date: new Date().toISOString().slice(0, 10),
    sell_by_date: '',
    cost: ''
  })

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="bg-linen border border-moss/20 rounded-lg p-5 space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-moss">Add a herb to stock</p>
        <button onClick={onCancel} className="h-8 w-8 rounded-full border border-moss/20 text-moss hover:border-ochre hover:text-ochre text-lg leading-none">×</button>
      </div>

      <div>
        <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">1 · WHICH HERB?</p>
        {herb ? (
          <div className="bg-cream border border-moss/10 rounded-md p-3 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink italic">{herb.herb_latin}</p>
              {herb.herb_common && <p className="text-xs text-ink/60">{herb.herb_common}</p>}
            </div>
            <button onClick={() => setHerb(null)} className="text-xs text-ochre hover:underline">Change</button>
          </div>
        ) : (
          <HerbPicker onAdd={(h) => setHerb(h)} />
        )}
      </div>

      <div>
        <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">2 · HOW YOU HOLD IT</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="FORMAT">
            <select className={inputClass} value={form.format} onChange={(e) => update('format', e.target.value)}>
              {FORMATS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
          <Field label="MEASURED IN">
            <select className={inputClass} value={form.unit} onChange={(e) => update('unit', e.target.value)}>
              <option value="ml">ml (liquid)</option>
              <option value="g">g (dried / powder)</option>
            </select>
          </Field>
          <Field label={`ALERT ME BELOW (${form.unit})`}>
            <input type="number" step="any" min="0" placeholder={`e.g. 100`} className={inputClass} value={form.low_stock_threshold} onChange={(e) => update('low_stock_threshold', e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs tracking-wide text-moss/70 mb-1">3 · FIRST DELIVERY</p>
        <p className="text-xs text-ink/50 italic mb-2">Optional — you can record deliveries later instead.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={`QUANTITY RECEIVED (${form.unit})`}>
            <input type="number" step="any" min="0" className={inputClass} value={form.quantity_received} onChange={(e) => update('quantity_received', e.target.value)} />
          </Field>
          <Field label="BATCH NUMBER">
            <input className={inputClass} value={form.batch_number} onChange={(e) => update('batch_number', e.target.value)} />
          </Field>
          <Field label="DATE RECEIVED">
            <input type="date" className={inputClass} value={form.purchase_date} onChange={(e) => update('purchase_date', e.target.value)} />
          </Field>
          <Field label="SELL BY DATE">
            <input type="date" className={inputClass} value={form.sell_by_date} onChange={(e) => update('sell_by_date', e.target.value)} />
          </Field>
          <Field label="SUPPLIER">
            <input className={inputClass} value={form.supplier} onChange={(e) => update('supplier', e.target.value)} />
          </Field>
          <Field label="COST (£)">
            <input type="number" step="any" min="0" className={inputClass} value={form.cost} onChange={(e) => update('cost', e.target.value)} />
          </Field>
        </div>
      </div>

      <Field label="NOTES">
        <input className={inputClass} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
      </Field>

      <div className="flex justify-end">
        <button
          disabled={!herb || saving}
          onClick={() => onSave({
            type: 'stock',
            herb_latin: herb.herb_latin,
            herb_common: herb.herb_common,
            format: form.format,
            unit: form.unit,
            low_stock_threshold: form.low_stock_threshold === '' ? 0 : Number(form.low_stock_threshold),
            supplier: form.supplier,
            notes: form.notes,
            first_batch: form.quantity_received === '' ? null : {
              quantity_received: Number(form.quantity_received),
              batch_number: form.batch_number,
              purchase_date: form.purchase_date || null,
              sell_by_date: form.sell_by_date || null,
              supplier: form.supplier,
              cost: form.cost === '' ? null : Number(form.cost)
            }
          })}
          className="bg-ochre text-linen px-6 py-2.5 rounded text-sm disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Add to stock'}
        </button>
      </div>
    </div>
  )
}

function AddBatchForm({ stock, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    batch_number: '',
    supplier: stock.supplier || '',
    purchase_date: new Date().toISOString().slice(0, 10),
    sell_by_date: '',
    quantity_received: '',
    cost: '',
    notes: ''
  })
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="bg-linen border border-moss/20 rounded-lg p-4 mt-3 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs tracking-wide text-moss/70">NEW DELIVERY — {stock.herb_latin}</p>
        <button onClick={onCancel} className="text-xs text-moss hover:text-ochre">Cancel</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="BATCH NUMBER"><input className={inputClass} value={form.batch_number} onChange={(e) => update('batch_number', e.target.value)} /></Field>
        <Field label="SUPPLIER"><input className={inputClass} value={form.supplier} onChange={(e) => update('supplier', e.target.value)} /></Field>
        <Field label={`QUANTITY RECEIVED (${stock.unit})`}>
          <input type="number" step="any" min="0" className={inputClass} value={form.quantity_received} onChange={(e) => update('quantity_received', e.target.value)} />
        </Field>
        <Field label="COST (£)"><input type="number" step="any" min="0" className={inputClass} value={form.cost} onChange={(e) => update('cost', e.target.value)} /></Field>
        <Field label="PURCHASE DATE"><input type="date" className={inputClass} value={form.purchase_date} onChange={(e) => update('purchase_date', e.target.value)} /></Field>
        <Field label="SELL BY DATE"><input type="date" className={inputClass} value={form.sell_by_date} onChange={(e) => update('sell_by_date', e.target.value)} /></Field>
      </div>

      <div className="flex justify-end">
        <button
          disabled={saving || !form.quantity_received}
          onClick={() => onSave({ type: 'batch', stock_id: stock.id, ...form })}
          className="bg-moss text-linen px-5 py-2 rounded text-sm disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Record delivery'}
        </button>
      </div>
    </div>
  )
}

export default function InventoryPanel({ stock, onSave, onUpdate, onDelete, saving }) {
  const [addingStock, setAddingStock] = useState(false)
  const [batchFor, setBatchFor] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter] = useState('all')

  const today = new Date().toISOString().slice(0, 10)

  const lowCount = stock.filter((s) => s.is_low).length
  const expiringCount = stock.filter((s) => s.expiring_soon_count > 0).length

  const visible = stock.filter((s) => {
    if (filter === 'low') return s.is_low
    if (filter === 'expiring') return s.expiring_soon_count > 0
    return true
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {[
            { k: 'all', l: `All (${stock.length})` },
            { k: 'low', l: `Low stock (${lowCount})` },
            { k: 'expiring', l: `Expiring soon (${expiringCount})` }
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                filter === f.k ? 'bg-ochre text-linen' : 'bg-linen border border-moss/20 text-ink/70 hover:border-ochre'
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAddingStock(true)}
          className="text-xs bg-moss text-linen px-3 py-1.5 rounded hover:bg-ink transition-colors"
        >
          + Add herb to stock
        </button>
      </div>

      {addingStock && (
        <div className="mb-4">
          <AddStockForm
            saving={saving}
            onCancel={() => setAddingStock(false)}
            onSave={async (payload) => { await onSave(payload); setAddingStock(false) }}
          />
        </div>
      )}

      {visible.length === 0 && (
        <p className="text-sm text-ink/60">
          {stock.length === 0 ? 'No herbs in stock yet. Add one to get started.' : 'Nothing matches this filter.'}
        </p>
      )}

      <div className="space-y-3">
        {visible.map((s) => {
          const batches = (s.herb_batches || [])
            .slice()
            .sort((a, b) => (a.sell_by_date || '9999').localeCompare(b.sell_by_date || '9999'))
          return (
            <div key={s.id} className="bg-cream border border-moss/10 rounded-lg">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-3"
                onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              >
                <div>
                  <p className="text-sm text-ink italic">{s.herb_latin}</p>
                  <p className="text-xs text-ink/60">
                    {s.herb_common ? `${s.herb_common} · ` : ''}{s.format}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {s.expired_count > 0 && (
                    <span className="font-mono text-[10px] bg-ochre/15 text-ochre px-2 py-0.5 rounded">
                      {s.expired_count} expired
                    </span>
                  )}
                  {s.is_low && (
                    <span className="font-mono text-[10px] bg-ochre/15 text-ochre px-2 py-0.5 rounded">low</span>
                  )}
                  <span className={`font-mono text-sm ${s.is_low ? 'text-ochre' : 'text-sage'}`}>
                    {s.total_remaining}{s.unit}
                  </span>
                </div>
              </button>

              {expanded === s.id && (
                <div className="px-5 pb-5 border-t border-moss/10 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="text-xs text-ink/60">
                      Alert below <span className="text-ochre">{s.low_stock_threshold}{s.unit}</span>
                      {s.supplier ? ` · ${s.supplier}` : ''}
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setBatchFor(s)} className="text-xs text-moss hover:text-ochre">
                        + Record delivery
                      </button>
                      <button onClick={() => onDelete('stock', s.id)} className="text-xs text-ochre/70 hover:text-ochre">
                        Remove herb
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Field label={`CHANGE LOW STOCK ALERT (${s.unit})`}>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          defaultValue={s.low_stock_threshold}
                          className={inputClass}
                          onBlur={(e) => {
                            const v = Number(e.target.value)
                            if (v !== Number(s.low_stock_threshold)) {
                              onUpdate({ type: 'stock', id: s.id, low_stock_threshold: v, supplier: s.supplier, notes: s.notes, unit: s.unit })
                            }
                          }}
                        />
                      </div>
                    </Field>
                  </div>

                  {batchFor?.id === s.id && (
                    <AddBatchForm
                      stock={s}
                      saving={saving}
                      onCancel={() => setBatchFor(null)}
                      onSave={async (payload) => { await onSave(payload); setBatchFor(null) }}
                    />
                  )}

                  <p className="font-mono text-xs tracking-wide text-moss/60 mt-4 mb-2">BATCHES</p>
                  {batches.length === 0 && <p className="text-sm text-ink/50 italic">No deliveries recorded yet.</p>}
                  <div className="space-y-2">
                    {batches.map((b) => {
                      const isExpired = b.sell_by_date && b.sell_by_date < today
                      return (
                        <div key={b.id} className="bg-linen border border-moss/10 rounded-md p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm text-ink">
                                Batch {b.batch_number || '—'}
                                <span className="text-ink/50"> · {b.quantity_remaining}{s.unit} of {b.quantity_received}{s.unit} left</span>
                              </p>
                              <p className="text-xs text-ink/60">
                                {b.purchase_date ? `In ${b.purchase_date}` : ''}
                                {b.sell_by_date ? ` · Sell by ${b.sell_by_date}` : ''}
                                {b.supplier ? ` · ${b.supplier}` : ''}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              {isExpired && (
                                <span className="font-mono text-[10px] bg-ochre/15 text-ochre px-2 py-0.5 rounded">expired</span>
                              )}
                              {b.status === 'finished' && (
                                <span className="font-mono text-[10px] bg-moss/10 text-moss/50 px-2 py-0.5 rounded">finished</span>
                              )}
                              <button onClick={() => onDelete('batch', b.id)} className="text-xs text-ochre/70 hover:text-ochre">
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-moss/10">
                            <label className="block">
                              <span className="font-mono text-[10px] text-moss/50">CORRECT REMAINING QUANTITY</span>
                              <input
                                type="number"
                                step="any"
                                min="0"
                                defaultValue={b.quantity_remaining}
                                className={`${inputClass} mt-1`}
                                onBlur={(e) => {
                                  const v = Number(e.target.value)
                                  if (v !== Number(b.quantity_remaining)) {
                                    onUpdate({
                                      type: 'batch',
                                      id: b.id,
                                      quantity_remaining: v,
                                      batch_number: b.batch_number,
                                      sell_by_date: b.sell_by_date,
                                      status: v <= 0 ? 'finished' : 'active',
                                      notes: b.notes,
                                      adjustment_reason: 'Manual correction in back office'
                                    })
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
