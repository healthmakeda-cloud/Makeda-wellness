import { useNavigate } from 'react-router-dom'

// Used identically across every page that needs one, so it always sits in
// the same spot — full-width, aligned to the page edge under the nav —
// regardless of how narrow that page's own content column is.
export default function BackButton() {
  const navigate = useNavigate()
  return (
    <div className="max-w-6xl mx-auto px-6 pt-6">
      <button
        onClick={() => navigate(-1)}
        className="font-mono text-xs tracking-widest text-ochre hover:text-moss transition-colors"
      >
        ← BACK
      </button>
    </div>
  )
}
