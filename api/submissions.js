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
    const { id, clinical_notes } = req.body || {}
    if (!id) {
      res.status(400).json({ error: 'Missing submission id' })
      return
    }

    const { error } = await supabase
      .from('intake_submissions')
      .update({ clinical_notes })
      .eq('id', id)

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
