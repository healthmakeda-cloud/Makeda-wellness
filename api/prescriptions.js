import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Generates the next human-friendly reference, e.g. MH-0007
async function nextReference(supabase) {
  const { data } = await supabase
    .from('prescriptions')
    .select('reference')
    .order('created_at', { ascending: false })
    .limit(1)

  const last = data?.[0]?.reference
  const lastNum = last ? parseInt(String(last).replace(/\D/g, ''), 10) : 0
  const next = (Number.isFinite(lastNum) ? lastNum : 0) + 1
  return `MH-${String(next).padStart(4, '0')}`
}

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const supabase = getSupabase()

  // ---- List prescriptions (optionally filtered to one client) ----
  if (req.method === 'GET') {
    const url = new URL(req.url, `https://${req.headers.host}`)
    const submissionId = url.searchParams.get('submission_id')

    let query = supabase
      .from('prescriptions')
      .select('*, prescription_items(*)')
      .order('created_at', { ascending: false })

    if (submissionId) query = query.eq('submission_id', submissionId)

    const { data, error } = await query
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ prescriptions: data })
    return
  }

  // ---- Create a new prescription ----
  if (req.method === 'POST') {
    const { items = [], ...fields } = req.body || {}

    const reference = await nextReference(supabase)
    const { data: created, error: createError } = await supabase
      .from('prescriptions')
      .insert({ ...fields, reference })
      .select()
      .single()

    if (createError) {
      res.status(500).json({ error: createError.message })
      return
    }

    if (items.length > 0) {
      const rows = items.map((item, i) => ({
        prescription_id: created.id,
        herb_latin: item.herb_latin,
        herb_common: item.herb_common,
        format: item.format,
        quantity_ml: item.quantity_ml,
        notes: item.notes,
        sort_order: i
      }))
      const { error: itemsError } = await supabase.from('prescription_items').insert(rows)
      if (itemsError) {
        res.status(500).json({ error: itemsError.message })
        return
      }
    }

    res.status(200).json({ prescription: created })
    return
  }

  // ---- Update an existing prescription (replaces its items wholesale) ----
  if (req.method === 'PUT') {
    const { id, items, ...fields } = req.body || {}
    if (!id) {
      res.status(400).json({ error: 'Missing prescription id' })
      return
    }

    const { error: updateError } = await supabase
      .from('prescriptions')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) {
      res.status(500).json({ error: updateError.message })
      return
    }

    if (Array.isArray(items)) {
      await supabase.from('prescription_items').delete().eq('prescription_id', id)
      if (items.length > 0) {
        const rows = items.map((item, i) => ({
          prescription_id: id,
          herb_latin: item.herb_latin,
          herb_common: item.herb_common,
          format: item.format,
          quantity_ml: item.quantity_ml,
          notes: item.notes,
          sort_order: i
        }))
        const { error: itemsError } = await supabase.from('prescription_items').insert(rows)
        if (itemsError) {
          res.status(500).json({ error: itemsError.message })
          return
        }
      }
    }

    res.status(200).json({ ok: true })
    return
  }

  // ---- Delete ----
  if (req.method === 'DELETE') {
    const url = new URL(req.url, `https://${req.headers.host}`)
    const id = url.searchParams.get('id')
    if (!id) {
      res.status(400).json({ error: 'Missing prescription id' })
      return
    }
    const { error } = await supabase.from('prescriptions').delete().eq('id', id)
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
