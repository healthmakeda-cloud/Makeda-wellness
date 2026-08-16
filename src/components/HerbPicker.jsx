import { useState, useMemo } from 'react'
import { herbList } from '../data/herbList.js'

const FORMATS = ['Tincture', 'Fluid extract', 'Dried', 'Powder', 'Tea', 'Cream / ointment']

export default function HerbPicker({ onAdd }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return herbList
      .filter((h) => h.latin.toLowerCase().includes(q) || h.common.toLowerCase().includes(q))
      .slice(0, 8)
  }, [search])

  const addHerb = (herb) => {
    onAdd({
      herb_latin: herb.latin,
      herb_common: herb.common,
      format: 'Tincture',
      quantity_ml: '',
      notes: ''
    })
    setSearch('')
    setOpen(false)
  }

  const addCustom = () => {
    const name = search.trim()
    if (!name) return
    onAdd({
      herb_latin: name,
      herb_common: '',
      format: 'Tincture',
      quantity_ml: '',
      notes: ''
    })
    setSearch('')
    setOpen(false)
  }

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search herbs by Latin or common name…"
        className="w-full rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
      />

      {open && search.trim() && (
        <div className="absolute z-20 mt-1 w-full bg-linen border border-moss/20 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {matches.map((h) => (
            <button
              key={h.latin}
              type="button"
              onClick={() => addHerb(h)}
              className="w-full text-left px-3 py-2 hover:bg-cream border-b border-moss/5 last:border-0"
            >
              <span className="text-sm text-ink italic">{h.latin}</span>
              {h.common && <span className="text-sm text-ink/60"> — {h.common}</span>}
            </button>
          ))}
          <button
            type="button"
            onClick={addCustom}
            className="w-full text-left px-3 py-2 hover:bg-cream text-sm text-ochre"
          >
            + Add "{search.trim()}" as a new herb
          </button>
        </div>
      )}
    </div>
  )
}

export { FORMATS }
