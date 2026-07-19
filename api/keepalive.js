import { createClient } from '@supabase/supabase-js'

// Called on a schedule by Vercel Cron (see vercel.json). Its only job is to
// make one small read against Supabase so the project registers as active
// and never triggers the free-tier 7-day inactivity pause.
export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { error } = await supabase.from('intake_submissions').select('id').limit(1)

  if (error) {
    res.status(500).json({ ok: false, error: error.message })
    return
  }
  res.status(200).json({ ok: true, pinged_at: new Date().toISOString() })
}
