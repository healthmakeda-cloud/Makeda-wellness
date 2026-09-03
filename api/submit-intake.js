import { createClient } from '@supabase/supabase-js'

// Used only by the in-clinic form (Makéda filling in a form for a client
// during a consultation). Because she's authenticated by the admin
// password, not by being that client, this must never go through the
// public client-side insert path — it needs its own row regardless of
// whatever Supabase session happens to be active in her browser.
//
// This bypasses RLS entirely via the service role key, which is safe
// specifically because it's gated by the admin password below.

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase.from('intake_submissions').insert(req.body || {})

  if (error) {
    console.error('In-clinic intake submission failed:', error)
    res.status(500).json({ error: error.message })
    return
  }

  res.status(200).json({ ok: true })
}
