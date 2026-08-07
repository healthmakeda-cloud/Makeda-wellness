import { createClient } from '@supabase/supabase-js'

const columns = ['created_at', 'product_name', 'amount_gbp', 'customer_email', 'status', 'stripe_session_id']

function csvCell(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  const rows = [columns.join(',')]
  for (const record of data) {
    rows.push(columns.map((c) => csvCell(record[c])).join(','))
  }

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="makeda-orders-${new Date().toISOString().slice(0, 10)}.csv"`)
  res.status(200).send(rows.join('\n'))
}
