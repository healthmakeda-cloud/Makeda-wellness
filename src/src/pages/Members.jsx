import { useState, useEffect } from 'react'
import RootMark from '../components/RootMark.jsx'
import RootDivider from '../components/RootDivider.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function Members() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const [error, setError] = useState('')
  const [submissions, setSubmissions] = useState([])

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
        .from('intake_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => setSubmissions(data || []))
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setSubmissions([])
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
          <p className="font-mono text-xs text-ochre">YOUR HEALTH JOURNEY</p>
          <p>Submitted {new Date(latest.created_at).toLocaleDateString()}</p>
          <p>Reason for visit: {latest.description_of_ailment || '—'}</p>
          <p>Consent on file: {latest.consent_given ? 'Yes' : 'Not yet completed'}</p>
        </div>
      ) : (
        <p className="text-sm text-ink/60">
          No health journey form found for this email yet. If you've just submitted one, check that you used the same
          email address.
        </p>
      )}

      <RootDivider />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-linen border border-moss/10 rounded-lg p-5 text-center">
          <p className="font-display text-moss mb-1">Chat with Makéda's AI</p>
          <p className="text-xs text-ink/50">Coming soon</p>
        </div>
        <div className="bg-linen border border-moss/10 rounded-lg p-5 text-center">
          <p className="font-display text-moss mb-1">Updates & prescriptions</p>
          <p className="text-xs text-ink/50">Coming soon</p>
        </div>
      </div>
    </div>
  )
}
