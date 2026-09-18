import { useState, useEffect } from 'react'
import RootMark from '../components/RootMark.jsx'
import RootDivider from '../components/RootDivider.jsx'
import MessageThread from '../components/MessageThread.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function Members() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [messages, setMessages] = useState([])
  const [msgSending, setMsgSending] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ firstName: '', surname: '', mobile: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')

  useEffect(() => {
    if (!supabase) {
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session && supabase) {
      supabase
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
        })

      supabase
        .from('prescriptions')
        .select('*, prescription_items(*)')
        .order('created_at', { ascending: false })
        .then(({ data }) => setPrescriptions(data || []))

      supabase
        .from('intake_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setSubmissions(data || [])
          if (data && data[0]) {
            setProfileForm({
              firstName: data[0].first_name || '',
              surname: data[0].surname || '',
              mobile: data[0].mobile || ''
            })
          }
        })
    }
  }, [session])

  const handleSendLink = async (e) => {
    e.preventDefault()
    setError('')
    if (!supabase) {
      setError('Sign-in is not available yet — the site is not connected to a database.')
      return
    }
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/members' }
    })
    if (otpError) {
      setError('Something went wrong sending the link. Please try again.')
      return
    }
    setLinkSent(true)
  }

  const handleSendMessage = async (body) => {
    if (!supabase || !session) return
    setMsgSending(true)
    const { error } = await supabase.from('messages').insert({
      submission_id: submissions[0]?.id || null,
      client_email: session.user.email,
      sender: 'client',
      sender_name: submissions[0]?.first_name || null,
      body,
      read_by_client: true
    })
    setMsgSending(false)
    if (!error) {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
      setMessages(data || [])
    }
  }

  const handleSaveProfile = async () => {
    if (!supabase || !latest) return
    setProfileSaving(true)
    setProfileError('')
    const { error } = await supabase
      .from('intake_submissions')
      .update({
        first_name: profileForm.firstName,
        surname: profileForm.surname,
        mobile: profileForm.mobile
      })
      .eq('id', latest.id)
    setProfileSaving(false)
    if (error) {
      setProfileError('Could not save your details. Please try again.')
      return
    }
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === latest.id
          ? { ...s, first_name: profileForm.firstName, surname: profileForm.surname, mobile: profileForm.mobile }
          : s
      )
    )
    setEditingProfile(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setSubmissions([])
    setMessages([])
    setPrescriptions([])
  }

  if (checking) {
    return <div className="max-w-md mx-auto px-6 py-24 text-center text-ink/50 text-sm">Loading…</div>
  }

  if (!session) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24">
        <RootMark className="h-14 w-14 mx-auto mb-6 opacity-70" />
        <p className="font-mono text-xs tracking-widest text-ochre mb-4 text-center">MEMBERS</p>
        <h1 className="font-display text-2xl text-moss mb-3 text-center">Sign in</h1>
        <p className="text-sm text-ink/60 mb-8 text-center">
          Use the same email you gave on your health journey form. We'll send a one-time link — no password needed.
        </p>

        {linkSent ? (
          <p className="text-sm text-moss bg-cream border border-moss/10 rounded-lg p-4 text-center">
            Check your email for a sign-in link. You can close this page.
          </p>
        ) : (
          <form onSubmit={handleSendLink} className="space-y-4">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-md border border-moss/20 bg-cream px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-sm text-ochre">{error}</p>}
            <button type="submit" className="bg-moss text-linen px-6 py-3 rounded text-sm w-full">
              Send sign-in link
            </button>
          </form>
        )}
      </div>
    )
  }

  const latest = submissions[0]

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-xs tracking-widest text-ochre mb-2">MEMBERS</p>
          <h1 className="font-display text-2xl text-moss">Hello, {latest?.first_name || 'there'}</h1>
        </div>
        <button onClick={handleSignOut} className="text-sm text-moss/70 hover:text-moss">Sign out</button>
      </div>

      {latest ? (
        <div className="bg-cream border border-moss/10 rounded-lg p-5 space-y-2 text-sm text-ink/80">
          <div className="flex items-center justify-between">
            <p className="font-mono text-xs text-ochre">YOUR DETAILS</p>
            {!editingProfile && (
              <button onClick={() => setEditingProfile(true)} className="text-xs text-moss hover:text-ochre">
                Edit
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="space-y-3 pt-1">
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-mono text-[10px] text-moss/60">FIRST NAME</span>
                  <input
                    className="w-full mt-1 rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] text-moss/60">SURNAME</span>
                  <input
                    className="w-full mt-1 rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
                    value={profileForm.surname}
                    onChange={(e) => setProfileForm((f) => ({ ...f, surname: e.target.value }))}
                  />
                </label>
              </div>
              <label className="block">
                <span className="font-mono text-[10px] text-moss/60">MOBILE</span>
                <input
                  className="w-full mt-1 rounded-md border border-moss/20 bg-linen px-3 py-2 text-sm text-ink outline-none focus:border-ochre"
                  value={profileForm.mobile}
                  onChange={(e) => setProfileForm((f) => ({ ...f, mobile: e.target.value }))}
                />
              </label>
              <p className="text-xs text-ink/50 italic">
                To change the email address on your account, please message Makéda below rather than editing it here —
                it's tied to how you sign in.
              </p>
              {profileError && <p className="text-xs text-ochre">{profileError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                  className="bg-moss text-linen px-4 py-2 rounded text-xs disabled:opacity-50"
                >
                  {profileSaving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => setEditingProfile(false)} className="text-xs text-moss/70 hover:text-moss">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p>{latest.first_name} {latest.surname}</p>
              <p>{latest.email}</p>
              <p>{latest.mobile || 'No mobile number on file'}</p>
            </>
          )}
        </div>
      ) : (
        <p className="text-sm text-ink/60">
          No health journey form found for this email yet. If you've just submitted one, check that you used the same
          email address.
        </p>
      )}

      <RootDivider />

      {latest && (
        <div className="bg-cream border border-moss/10 rounded-lg p-5 space-y-2 text-sm text-ink/80">
          <p className="font-mono text-xs text-ochre">YOUR HEALTH JOURNEY</p>
          <p>Submitted {new Date(latest.created_at).toLocaleDateString()}</p>
          <p>Reason for visit: {latest.description_of_ailment || '—'}</p>
          <p>Consent on file: {latest.consent_given ? 'Yes' : 'Not yet completed'}</p>
        </div>
      )}

      <div className="mt-8">
        <p className="font-mono text-xs tracking-widest text-ochre mb-3">YOUR PRESCRIPTIONS</p>
        {prescriptions.length === 0 ? (
          <p className="text-sm text-ink/60">
            No prescriptions yet. Once Makéda has prepared your formulation, it will appear here.
          </p>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-cream border border-moss/10 rounded-lg p-5">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <p className="font-display text-moss">{rx.formulation_type}</p>
                  <span className="font-mono text-xs text-ink/50">{rx.reference}</span>
                </div>
                <p className="text-sm text-ink/80">
                  Take <strong>{rx.dosage}</strong> {String(rx.frequency || '').toLowerCase()}
                  {rx.duration ? ` for ${rx.duration}` : ''}.
                </p>
                {rx.instructions && <p className="text-sm text-ink/70 mt-2">{rx.instructions}</p>}

                {(rx.prescription_items || []).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-moss/10">
                    <p className="font-mono text-[10px] tracking-wide text-moss/50 mb-1">CONTAINS</p>
                    <p className="text-xs text-ink/70">
                      {(rx.prescription_items || [])
                        .slice()
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((i) => i.herb_common || i.herb_latin)
                        .join(', ')}
                    </p>
                  </div>
                )}

                {rx.review_date && (
                  <p className="text-xs text-ochre mt-3">Review date: {rx.review_date}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <p className="font-mono text-xs tracking-widest text-ochre mb-3">
          MESSAGES
          {messages.filter((m) => m.sender === 'practitioner' && !m.read_by_client).length > 0 && (
            <span className="ml-2 bg-ochre text-linen px-2 py-0.5 rounded-full text-[10px]">
              {messages.filter((m) => m.sender === 'practitioner' && !m.read_by_client).length} new
            </span>
          )}
        </p>
        <div className="bg-cream border border-moss/10 rounded-lg p-5">
          <MessageThread
            messages={messages}
            viewerRole="client"
            sending={msgSending}
            onSend={handleSendMessage}
            placeholder="Ask Makéda a question…"
          />
        </div>
      </div>
    </div>
  )
}
