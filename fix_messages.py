import sys

# ---------- Admin.jsx ----------
p = 'src/pages/Admin.jsx'
s = open(p).read()
changed = []

# 1. Add toggle state
old = "  const [openId, setOpenId] = useState(null)"
new = "  const [openId, setOpenId] = useState(null)\n  const [openMessagesId, setOpenMessagesId] = useState(null)"
if new not in s and old in s:
    s = s.replace(old, new, 1)
    changed.append("added openMessagesId state")

# 2. Stop marking messages read just from opening the client row —
#    it should only happen when the Messages panel itself is opened.
old2 = """                  onClick={() => {
                    const opening = openId !== s.id
                    setOpenId(opening ? s.id : null)
                    if (opening && unreadFrom(s.email) > 0) markMessagesRead(s.email)
                  }}"""
new2 = "                  onClick={() => setOpenId(openId === s.id ? null : s.id)}"
if old2 in s:
    s = s.replace(old2, new2, 1)
    changed.append("removed premature read-marking on row open")

# 3. Wrap the Messages section in its own collapsible toggle
old3 = """                    <div className="mt-6 pt-5 border-t border-moss/10">
                      <p className="font-mono text-xs tracking-widest text-moss/60 mb-3">MESSAGES</p>
                      <MessageThread
                        messages={clientMessages(s.email)}
                        viewerRole="practitioner"
                        sending={msgSending}
                        onSend={(body) => handleSendMessage(s, body)}
                        placeholder={`Message ${s.first_name || 'this client'}…`}
                      />
                    </div>"""
new3 = """                    <div className="mt-6 pt-5 border-t border-moss/10">
                      <button
                        onClick={() => {
                          const opening = openMessagesId !== s.id
                          setOpenMessagesId(opening ? s.id : null)
                          if (opening && unreadFrom(s.email) > 0) markMessagesRead(s.email)
                        }}
                        className="w-full flex items-center justify-between mb-3"
                      >
                        <span className="font-mono text-xs tracking-widest text-moss/60">
                          MESSAGES {clientMessages(s.email).length > 0 && `(${clientMessages(s.email).length})`}
                        </span>
                        <span className="flex items-center gap-2">
                          {unreadFrom(s.email) > 0 && (
                            <span className="font-mono text-[10px] text-linen bg-ochre px-2 py-0.5 rounded">
                              {unreadFrom(s.email)} new
                            </span>
                          )}
                          <span className={`text-ochre font-mono text-xs transition-transform ${openMessagesId === s.id ? 'rotate-180' : ''}`}>▾</span>
                        </span>
                      </button>
                      {openMessagesId === s.id && (
                        <MessageThread
                          messages={clientMessages(s.email)}
                          viewerRole="practitioner"
                          sending={msgSending}
                          onSend={(body) => handleSendMessage(s, body)}
                          placeholder={`Message ${s.first_name || 'this client'}…`}
                        />
                      )}
                    </div>"""
if old3 in s:
    s = s.replace(old3, new3, 1)
    changed.append("made Messages section collapsible with its own unread badge")

open(p, 'w').write(s)
print("Admin.jsx:", changed if changed else "NO MATCHES FOUND — paste the file back to me")

# ---------- Members.jsx ----------
p2 = 'src/pages/Members.jsx'
s2 = open(p2).read()
changed2 = []

# Auto-mark practitioner messages as read once the client has actually
# seen them on this page — so the badge never falsely suggests they haven't.
old4 = """      supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .then(({ data }) => setMessages(data || []))"""
new4 = """      supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .then(({ data }) => {
          setMessages(data || [])
          // They're looking at the page right now, so anything from Makéda
          // counts as seen — mark it read so the badge doesn't linger.
          const unread = (data || []).filter((m) => m.sender === 'practitioner' && !m.read_by_client)
          if (unread.length > 0) {
            supabase
              .from('messages')
              .update({ read_by_client: true })
              .eq('client_email', session.user.email)
              .eq('sender', 'practitioner')
              .eq('read_by_client', false)
              .then(() => {
                setMessages((prev) =>
                  prev.map((m) => (m.sender === 'practitioner' ? { ...m, read_by_client: true } : m))
                )
              })
          }
        })"""
if old4 in s2:
    s2 = s2.replace(old4, new4, 1)
    changed2.append("auto-mark messages read when client views the page")

open(p2, 'w').write(s2)
print("Members.jsx:", changed2 if changed2 else "NO MATCHES FOUND — paste the file back to me")
