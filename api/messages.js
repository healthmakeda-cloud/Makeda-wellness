import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // ---- Fetch all messages (grouped client-side by submission) ----
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ messages: data })
    return
  }

  // ---- Send a message as the practitioner ----
  if (req.method === 'POST') {
    const { submission_id, client_email, body } = req.body || {}
    if (!client_email || !body?.trim()) {
      res.status(400).json({ error: 'Missing client email or message body' })
      return
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        submission_id,
        client_email,
        sender: 'practitioner',
        sender_name: 'Makéda',
        body: body.trim(),
        read_by_practitioner: true
      })
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ message: data })
    return
  }

  // ---- Mark a client's messages as read by the practitioner ----
  if (req.method === 'PUT') {
    const { client_email } = req.body || {}
    const { error } = await supabase
      .from('messages')
      .update({ read_by_practitioner: true })
      .eq('client_email', client_email)
      .eq('sender', 'client')

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
