import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  'What should I consider when combining milk thistle with a client on statins?',
  'Herbs traditionally used for sluggish digestion with low-grade anxiety?',
  'Summarise the key points from this client\u2019s history before their follow-up',
  'What cautions apply to liquorice root in someone with high blood pressure?'
]

export default function ResearchPanel({ password, clients }) {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [contextClientId, setContextClientId] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages.length, sending])

  const buildClientContext = () => {
    if (!contextClientId) return null
    const c = clients.find((x) => x.id === contextClientId)
    if (!c) return null
    const lines = [
      `Name: ${c.first_name || ''} ${c.surname || ''}`.trim(),
      c.dob ? `DOB: ${c.dob}` : null,
      c.sex ? `Sex: ${c.sex}` : null,
      c.description_of_ailment ? `Health story: ${c.description_of_ailment}` : null,
      (c.medications_selected || []).length ? `Medications: ${(c.medications_selected || []).join(', ')}` : null,
      c.medications_other ? `Other medications: ${c.medications_other}` : null,
      c.respiratory_notes ? `Respiratory: ${c.respiratory_notes}` : null,
      c.cardiovascular_notes ? `Cardiovascular: ${c.cardiovascular_notes}` : null,
      (c.cardiovascular_flags || []).length ? `Cardiovascular flags: ${(c.cardiovascular_flags || []).join(', ')}` : null,
      c.gastrointestinal_notes ? `Gastrointestinal: ${c.gastrointestinal_notes}` : null,
      (c.gastrointestinal_flags || []).length ? `GI flags: ${(c.gastrointestinal_flags || []).join(', ')}` : null,
      c.genitourinary_notes ? `Genitourinary: ${c.genitourinary_notes}` : null,
      c.musculoskeletal_notes ? `Musculoskeletal: ${c.musculoskeletal_notes}` : null,
      c.dermatological_notes ? `Dermatological: ${c.dermatological_notes}` : null,
      c.nervous_system_notes ? `Nervous system: ${c.nervous_system_notes}` : null,
      c.stress_level ? `Stress ${c.stress_level}/10, happiness ${c.happiness_level}/10, peacefulness ${c.peacefulness_level}/10` : null,
      c.menopause_status ? `Menopause: ${c.menopause_status}` : null,
      (c.menopause_symptoms || []).length ? `Menopause symptoms: ${(c.menopause_symptoms || []).join(', ')}` : null,
      c.women_pregnant ? 'Currently pregnant' : null
    ].filter(Boolean)
    return lines.join('\n')
  }

  const send = async (text) => {
    const content = (text ?? draft).trim()
    if (!content) return

    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setDraft('')
    setSending(true)
    setError('')

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ messages: next, client_context: buildClientContext() })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'The assistant could not respond.')
        setSending(false)
        return
      }
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError('Could not reach the assistant. Check your connection.')
    }
    setSending(false)
  }

  return (
    <div>
      <div className="bg-cream border border-moss/10 rounded-lg px-4 py-3 mb-4 text-sm text-ink/70">
        <span className="font-mono text-xs tracking-wide text-ochre">FOR YOUR USE ONLY — </span>
        A research aid to help you think things through. It doesn't make clinical decisions, and clients
        never see it. Always verify interactions against your NIMH resource.
      </div>

      <div className="mb-4">
        <label className="block">
          <span className="font-mono text-xs tracking-wide text-moss/70">DISCUSS A SPECIFIC CLIENT (OPTIONAL)</span>
          <select
            className="mt-1 w-full rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
            value={contextClientId}
            onChange={(e) => setContextClientId(e.target.value)}
          >
            <option value="">No client selected</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.surname}
              </option>
            ))}
          </select>
        </label>
        {contextClientId && (
          <p className="text-xs text-ink/50 italic mt-1">
            Their health history will be included so you don't have to retype it.
          </p>
        )}
      </div>

      {messages.length === 0 && (
        <div className="mb-4">
          <p className="font-mono text-xs tracking-wide text-moss/60 mb-2">TRY ASKING</p>
          <div className="space-y-1.5">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                onClick={() => send(sug)}
                className="block w-full text-left text-sm text-ink/70 bg-linen border border-moss/10 rounded-md px-3 py-2 hover:border-ochre transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-[28rem] overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
              m.role === 'user' ? 'bg-moss text-linen' : 'bg-cream border border-moss/10 text-ink'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-cream border border-moss/10 rounded-lg px-4 py-2.5">
              <p className="text-sm text-ink/50 italic">Thinking…</p>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && <p className="mb-3 text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">{error}</p>}

      <form onSubmit={(e) => { e.preventDefault(); send() }} className="flex gap-2">
        <textarea
          rows={2}
          placeholder="Ask anything…"
          className="flex-1 rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre resize-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send() }
          }}
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="bg-ochre text-linen px-5 rounded text-sm disabled:opacity-50 flex-shrink-0"
        >
          Ask
        </button>
      </form>

      {messages.length > 0 && (
        <button
          onClick={() => { setMessages([]); setError('') }}
          className="mt-3 text-xs text-moss hover:text-ochre"
        >
          Start a new conversation
        </button>
      )}
    </div>
  )
}
