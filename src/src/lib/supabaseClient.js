import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The anon key is public by design (it's shipped in the browser bundle).
// Safety comes entirely from the RLS policy on intake_submissions, which
// only permits INSERT for this key — never SELECT. See supabase/schema.sql.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
