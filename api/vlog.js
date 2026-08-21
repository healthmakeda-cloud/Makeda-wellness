import { createClient } from '@supabase/supabase-js'

function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('vlog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ posts: data })
    return
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    let slug = slugify(body.title)

    // Ensure the slug is unique by appending a counter if needed
    const { data: existing } = await supabase.from('vlog_posts').select('slug')
    const taken = new Set((existing || []).map((p) => p.slug))
    if (taken.has(slug)) {
      let n = 2
      while (taken.has(`${slug}-${n}`)) n++
      slug = `${slug}-${n}`
    }

    const { data, error } = await supabase
      .from('vlog_posts')
      .insert({ ...body, slug })
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ post: data })
    return
  }

  if (req.method === 'PUT') {
    const { id, ...fields } = req.body || {}
    const { error } = await supabase
      .from('vlog_posts')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ ok: true })
    return
  }

  if (req.method === 'DELETE') {
    const url = new URL(req.url, `https://${req.headers.host}`)
    const id = url.searchParams.get('id')
    const { error } = await supabase.from('vlog_posts').delete().eq('id', id)
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
