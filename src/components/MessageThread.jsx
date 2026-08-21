import { useState, useRef, useEffect } from 'react'

// Shared between the back office and the Members area. The `viewerRole`
// prop decides whose messages appear on the right and how they're labelled.
export default function MessageThread({ messages, viewerRole, onSend, sending, placeholder }) {
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages.length])

  const handleSend = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onSend(text)
    setDraft('')
  }

  return (
    <div>
      <div className="max-h-96 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-ink/50 italic py-4">
            No messages yet. {viewerRole === 'practitioner' ? 'Start the conversation below.' : 'Send a message below and Makéda will reply here.'}
          </p>
        )}

        {messages.map((m) => {
          const isMine = m.sender === viewerRole
          return (
            <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                isMine
                  ? 'bg-moss text-linen'
                  : 'bg-cream border border-moss/10 text-ink'
              }`}>
                <p className={`font-mono text-[10px] mb-1 ${isMine ? 'text-linen/60' : 'text-ochre'}`}>
                  {m.sender === 'practitioner' ? (m.sender_name || 'Makéda') : 'You'}
                  {' · '}
                  {new Date(m.created_at).toLocaleString(undefined, {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                <p className="text-sm whitespace-pre-wrap">{m.body}</p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <textarea
          rows={2}
          placeholder={placeholder || 'Write a message…'}
          className="flex-1 rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre resize-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend(e)
          }}
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="bg-ochre text-linen px-5 rounded text-sm disabled:opacity-50 flex-shrink-0"
        >
          {sending ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
