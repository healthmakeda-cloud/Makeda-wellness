import { useState, useEffect } from 'react'

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('makeda_admin_pw') || '')
  const [authed, setAuthed] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)

  const load = async (pw) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/submissions', { headers: { 'x-admin-password': pw } })
      if (res.status === 401) {
        setError('Incorrect password.')
        setAuthed(false)
        setLoading(false)
        return
      }
      const data = await res.json()
      setSubmissions(data.submissions || [])
      setAuthed(true)
      sessionStorage.setItem('makeda_admin_pw', pw)
    } catch (err) {
      setError('Could not reach the server. Check your connection and try again.')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (password) load(password)
  }, [])

  const handleExport = async () => {
    const res = await fetch('/api/export', { headers: { 'x-admin-password': password } })
    if (!res.ok) {
      setError('Export failed — try refreshing and logging in again.')
      return
    }
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `makeda-intake-submissions-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-ochre mb-4">BACK OFFICE</p>
        <h1 className="font-display text-2xl text-moss mb-6">Staff sign-in</h1>
        <form onSubmit={(e) => { e.preventDefault(); load(password) }} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-moss/20 bg-cream px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-ochre">{error}</p>}
          <button type="submit" disabled={loading} className="bg-moss text-linen px-6 py-3 rounded text-sm w-full disabled:opacity-50">
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs tracking-widest text-ochre mb-2">BACK OFFICE</p>
          <h1 className="font-display text-2xl text-moss">Client intake submissions</h1>
        </div>
        <button onClick={handleExport} className="bg-ochre text-cream px-5 py-2.5 rounded text-sm">
          Export all to CSV
        </button>
      </div>

      {error && <p className="mb-6 text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">{error}</p>}

      <div className="space-y-3">
        {submissions.length === 0 && <p className="text-sm text-ink/60">No submissions yet.</p>}
        {submissions.map((s) => (
          <div key={s.id} className="bg-cream border border-moss/10 rounded-lg">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpenId(openId === s.id ? null : s.id)}
            >
              <div>
                <p className="text-sm text-ink">{s.first_name} {s.surname}</p>
                <p className="font-mono text-xs text-ink/50">{new Date(s.created_at).toLocaleString()}</p>
              </div>
              {s.status === 'flagged' && (
                <span className="font-mono text-xs text-ochre bg-ochre/10 px-2 py-1 rounded">flagged</span>
              )}
            </button>
            {openId === s.id && (
              <div className="px-5 pb-5 text-sm text-ink/80 space-y-2 border-t border-moss/10 pt-4">
                <p><span className="font-mono text-xs text-ochre">EMAIL</span> — {s.email}</p>
                <p><span className="font-mono text-xs text-ochre">MOBILE</span> — {s.mobile}</p>
                <p><span className="font-mono text-xs text-ochre">DOB</span> — {s.dob}</p>
                <p><span className="font-mono text-xs text-ochre">AILMENT</span> — {s.description_of_ailment || '—'}</p>
                <p><span className="font-mono text-xs text-ochre">MEDICATIONS</span> — {s.medications || '—'}</p>
                <p><span className="font-mono text-xs text-ochre">CARDIOVASCULAR FLAGS</span> — {(s.cardiovascular_flags || []).join(', ') || 'None'}</p>
                <p><span className="font-mono text-xs text-ochre">GENITOURINARY FLAGS</span> — {(s.genitourinary_flags || []).join(', ') || 'None'}</p>
                <p><span className="font-mono text-xs text-ochre">GASTROINTESTINAL FLAGS</span> — {(s.gastrointestinal_flags || []).join(', ') || 'None'}</p>
                <p><span className="font-mono text-xs text-ochre">MUSCULOSKELETAL FLAGS</span> — {(s.musculoskeletal_flags || []).join(', ') || 'None'}</p>
                <p><span className="font-mono text-xs text-ochre">COMPLICATED PREGNANCY</span> — {s.women_complicated_pregnancy ? 'Yes' : 'No'}</p>
                <p><span className="font-mono text-xs text-ochre">CONSENT SIGNED</span> — {s.signature || '—'} ({s.signed_date || '—'})</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
