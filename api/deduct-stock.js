import { createClient } from '@supabase/supabase-js'

// Deducts every herb in a prescription from stock, taking from the batch
// closest to its sell-by date first so older stock is used before it expires.
// Records a movement per deduction for a full audit trail.

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

  const { prescription_id } = req.body || {}
  if (!prescription_id) {
    res.status(400).json({ error: 'Missing prescription_id' })
    return
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data: rx, error: rxError } = await supabase
    .from('prescriptions')
    .select('*, prescription_items(*)')
    .eq('id', prescription_id)
    .single()

  if (rxError || !rx) {
    res.status(404).json({ error: 'Prescription not found' })
    return
  }

  if (rx.stock_deducted) {
    res.status(400).json({ error: 'Stock has already been deducted for this prescription.' })
    return
  }

  const results = []
  const warnings = []

  for (const item of rx.prescription_items || []) {
    const needed = Number(item.quantity_ml || 0)
    if (needed <= 0) continue

    // Find the matching stock entry for this herb + format
    const { data: stockRows } = await supabase
      .from('herb_stock')
      .select('id, herb_latin, unit')
      .eq('herb_latin', item.herb_latin)
      .eq('format', item.format)
      .limit(1)

    const stock = stockRows?.[0]
    if (!stock) {
      warnings.push(`${item.herb_latin} (${item.format}) is not in your stock list — nothing deducted.`)
      continue
    }

    // Oldest sell-by date first, so ageing stock gets used up first
    const { data: batches } = await supabase
      .from('herb_batches')
      .select('*')
      .eq('stock_id', stock.id)
      .eq('status', 'active')
      .gt('quantity_remaining', 0)
      .order('sell_by_date', { ascending: true, nullsFirst: false })

    let remaining = needed

    for (const batch of batches || []) {
      if (remaining <= 0) break
      const available = Number(batch.quantity_remaining)
      const take = Math.min(available, remaining)
      const newRemaining = available - take

      await supabase
        .from('herb_batches')
        .update({
          quantity_remaining: newRemaining,
          status: newRemaining <= 0 ? 'finished' : 'active'
        })
        .eq('id', batch.id)

      await supabase.from('stock_movements').insert({
        stock_id: stock.id,
        batch_id: batch.id,
        quantity_change: -take,
        movement_type: 'prescription',
        prescription_id: rx.id,
        client_name: rx.client_name,
        notes: `${rx.reference || 'Prescription'} — batch ${batch.batch_number || 'unnumbered'}`
      })

      remaining -= take
      results.push({ herb: item.herb_latin, batch: batch.batch_number, taken: take })
    }

    if (remaining > 0) {
      warnings.push(
        `${item.herb_latin} (${item.format}) — short by ${remaining}${stock.unit}. Deducted what was available.`
      )
    }
  }

  await supabase
    .from('prescriptions')
    .update({ stock_deducted: true })
    .eq('id', prescription_id)

  res.status(200).json({ ok: true, results, warnings })
}
