import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const supabase = getSupabase()

  // ---- List all stock with batches ----
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('herb_stock')
      .select('*, herb_batches(*)')
      .order('herb_latin', { ascending: true })

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }

    // Compute the total remaining per herb and flag anything low or expiring
    const today = new Date().toISOString().slice(0, 10)
    const enriched = (data || []).map((stock) => {
      const batches = (stock.herb_batches || []).filter((b) => b.status === 'active')
      const totalRemaining = batches.reduce((sum, b) => sum + Number(b.quantity_remaining || 0), 0)
      const expiringSoon = batches.filter((b) => b.sell_by_date && b.sell_by_date <= addDays(today, 60))
      const expired = batches.filter((b) => b.sell_by_date && b.sell_by_date < today)
      return {
        ...stock,
        total_remaining: totalRemaining,
        is_low: Number(stock.low_stock_threshold || 0) > 0 && totalRemaining <= Number(stock.low_stock_threshold),
        expiring_soon_count: expiringSoon.length,
        expired_count: expired.length
      }
    })

    res.status(200).json({ stock: enriched })
    return
  }

  // ---- Create a herb stock entry, or add a batch to one ----
  if (req.method === 'POST') {
    const { type, ...body } = req.body || {}

    if (type === 'stock') {
      const { first_batch, ...stockFields } = body

      const { data, error } = await supabase
        .from('herb_stock')
        .insert({
          herb_latin: stockFields.herb_latin,
          herb_common: stockFields.herb_common,
          format: stockFields.format,
          unit: stockFields.unit || 'ml',
          low_stock_threshold: stockFields.low_stock_threshold || 0,
          supplier: stockFields.supplier,
          notes: stockFields.notes
        })
        .select()
        .single()

      if (error) {
        res.status(500).json({ error: error.message })
        return
      }

      // If a first delivery was entered on the same form, record it now so
      // setting up a new herb is a single step.
      if (first_batch && Number(first_batch.quantity_received) > 0) {
        const qty = Number(first_batch.quantity_received)
        const { data: batch } = await supabase
          .from('herb_batches')
          .insert({
            stock_id: data.id,
            batch_number: first_batch.batch_number,
            supplier: first_batch.supplier,
            purchase_date: first_batch.purchase_date || null,
            sell_by_date: first_batch.sell_by_date || null,
            quantity_received: qty,
            quantity_remaining: qty,
            cost: first_batch.cost ?? null
          })
          .select()
          .single()

        if (batch) {
          await supabase.from('stock_movements').insert({
            stock_id: data.id,
            batch_id: batch.id,
            quantity_change: qty,
            movement_type: 'delivery',
            notes: first_batch.batch_number ? `Batch ${first_batch.batch_number}` : 'Opening stock'
          })
        }
      }

      res.status(200).json({ stock: data })
      return
    }

    if (type === 'batch') {
      const qty = Number(body.quantity_received || 0)
      const { data, error } = await supabase
        .from('herb_batches')
        .insert({
          stock_id: body.stock_id,
          batch_number: body.batch_number,
          supplier: body.supplier,
          purchase_date: body.purchase_date || null,
          sell_by_date: body.sell_by_date || null,
          quantity_received: qty,
          quantity_remaining: qty,
          cost: body.cost === '' || body.cost === undefined ? null : Number(body.cost),
          notes: body.notes
        })
        .select()
        .single()

      if (error) {
        res.status(500).json({ error: error.message })
        return
      }

      await supabase.from('stock_movements').insert({
        stock_id: body.stock_id,
        batch_id: data.id,
        quantity_change: qty,
        movement_type: 'delivery',
        notes: body.batch_number ? `Batch ${body.batch_number}` : 'Delivery received'
      })

      res.status(200).json({ batch: data })
      return
    }

    res.status(400).json({ error: 'Unknown type' })
    return
  }

  // ---- Update stock settings or adjust a batch quantity ----
  if (req.method === 'PUT') {
    const { type, id, ...body } = req.body || {}

    if (type === 'stock') {
      const { error } = await supabase
        .from('herb_stock')
        .update({
          low_stock_threshold: body.low_stock_threshold,
          supplier: body.supplier,
          notes: body.notes,
          unit: body.unit
        })
        .eq('id', id)

      if (error) {
        res.status(500).json({ error: error.message })
        return
      }
      res.status(200).json({ ok: true })
      return
    }

    if (type === 'batch') {
      // Manual correction — log the difference so the audit trail stays honest
      const { data: current } = await supabase
        .from('herb_batches')
        .select('quantity_remaining, stock_id')
        .eq('id', id)
        .single()

      const newQty = Number(body.quantity_remaining)
      const diff = newQty - Number(current?.quantity_remaining || 0)

      const { error } = await supabase
        .from('herb_batches')
        .update({
          quantity_remaining: newQty,
          batch_number: body.batch_number,
          sell_by_date: body.sell_by_date || null,
          status: body.status || 'active',
          notes: body.notes
        })
        .eq('id', id)

      if (error) {
        res.status(500).json({ error: error.message })
        return
      }

      if (diff !== 0) {
        await supabase.from('stock_movements').insert({
          stock_id: current?.stock_id,
          batch_id: id,
          quantity_change: diff,
          movement_type: 'adjustment',
          notes: body.adjustment_reason || 'Manual adjustment'
        })
      }

      res.status(200).json({ ok: true })
      return
    }

    res.status(400).json({ error: 'Unknown type' })
    return
  }

  // ---- Delete ----
  if (req.method === 'DELETE') {
    const url = new URL(req.url, `https://${req.headers.host}`)
    const type = url.searchParams.get('type')
    const id = url.searchParams.get('id')
    const table = type === 'batch' ? 'herb_batches' : 'herb_stock'

    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
