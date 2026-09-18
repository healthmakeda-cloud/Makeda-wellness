import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('intake_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json({ submissions: data })
    return
  }

  if (req.method === 'PUT') {
    const { id, add_note, contact } = req.body || {}
    if (!id) {
      res.status(400).json({ error: 'Missing submission id' })
      return
    }

    // Adding a dated clinical note — appends to the log rather than
    // overwriting, so the history of notes over time is kept.
    if (add_note) {
      const { data: current, error: fetchError } = await supabase
        .from('intake_submissions')
        .select('clinical_notes_log')
        .eq('id', id)
        .single()

      if (fetchError) {
        res.status(500).json({ error: fetchError.message })
        return
      }

      const log = Array.isArray(current?.clinical_notes_log) ? current.clinical_notes_log : []
      const newEntry = { date: new Date().toISOString(), text: add_note }
      const { error } = await supabase
        .from('intake_submissions')
        .update({ clinical_notes_log: [...log, newEntry] })
        .eq('id', id)

      if (error) {
        res.status(500).json({ error: error.message })
        return
      }
      res.status(200).json({ ok: true, notes: [...log, newEntry] })
      return
    }

    // Staff editing a client's basic contact details, including email —
    // which the client themselves cannot change (see migration_018).
    // Keeps their email in sync across messages and prescriptions too,
    // so a change here doesn't silently break their message history or
    // sever access to prescriptions issued under the old address.
    if (contact) {
      const { data: current, error: fetchError } = await supabase
        .from('intake_submissions')
        .select('email')
        .eq('id', id)
        .single()

      if (fetchError) {
        res.status(500).json({ error: fetchError.message })
        return
      }

      const { error } = await supabase
        .from('intake_submissions')
        .update(contact)
        .eq('id', id)

      if (error) {
        res.status(500).json({ error: error.message })
        return
      }

      if (contact.email && current?.email && contact.email !== current.email) {
        await supabase.from('messages').update({ client_email: contact.email }).eq('client_email', current.email)
        await supabase.from('prescriptions').update({ client_email: contact.email }).eq('client_email', current.email)
      }

      res.status(200).json({ ok: true })
      return
    }

    res.status(400).json({ error: 'Nothing to update' })
    return
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url, `https://${req.headers.host}`)
    const id = url.searchParams.get('id')
    if (!id) {
      res.status(400).json({ error: 'Missing submission id' })
      return
    }

    const { error } = await supabase.from('intake_submissions').delete().eq('id', id)
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
