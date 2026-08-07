import { useState, useMemo } from 'react'
import { medicineCategories } from '../data/medicineList.js'

export default function MedicineSelector({ selected, onToggle, otherText, onOtherChange, otherChecked, onOtherCheckedChange }) {
  const [search, setSearch] = useState('')

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return medicineCategories
    return medicineCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.toLowerCase().includes(q))
      }))
      .filter((cat) => cat.items.length > 0)
  }, [search])

  return (
    <div className="border border-moss/20 rounded-md bg-cream p-4">
      <input
        type="text"
        placeholder="Search medicines…"
        className="w-full rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-72 overflow-y-auto space-y-4 pr-1">
        {filteredCategories.length === 0 && (
          <p className="text-sm text-ink/50 italic">No matches — try the "Other" option below.</p>
        )}
        {filteredCategories.map((cat) => (
          <div key={cat.category}>
            <p className="font-mono text-xs tracking-wide text-moss/60 mb-1.5">{cat.category.toUpperCase()}</p>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1">
              {cat.items.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    checked={selected.includes(item)}
                    onChange={() => onToggle(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-moss/10">
        <label className="flex items-center gap-2 text-sm text-ink/80 mb-2">
          <input type="checkbox" checked={otherChecked} onChange={(e) => onOtherCheckedChange(e.target.checked)} />
          Other — not listed above
        </label>
        {otherChecked && (
          <textarea
            rows={2}
            placeholder="Please list any other medicines, including name and how often you take them"
            className="w-full rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
            value={otherText}
            onChange={(e) => onOtherChange(e.target.value)}
          />
        )}
      </div>

      {selected.length > 0 && (
        <p className="mt-3 text-xs text-ink/50">
          Selected: {selected.join(', ')}
        </p>
      )}
    </div>
  )
}
