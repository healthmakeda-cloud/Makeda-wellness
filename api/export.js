import { createClient } from '@supabase/supabase-js'

const columns = [
  'created_at', 'first_name', 'surname', 'dob', 'sex', 'address', 'postcode',
  'email', 'mobile', 'landline',
  'gp_name', 'gp_tel', 'gp_address', 'gp_postcode', 'gp_contact_consent',
  'description_of_ailment', 'existing_or_new',
  'medications_selected', 'medications_other', 'surgeries_last_3_months',
  'services_interested',
  'respiratory_notes',
  'cardiovascular_notes', 'cardiovascular_flags',
  'genitourinary_notes', 'genitourinary_flags',
  'gastrointestinal_notes', 'gastrointestinal_flags',
  'dermatological_notes',
  'musculoskeletal_notes', 'musculoskeletal_flags', 'nervous_system_notes',
  'stress_level', 'happiness_level', 'peacefulness_level',
  'women_painful_periods', 'women_last_period_date', 'women_vaginal_discharge',
  'women_thrush', 'women_pregnant', 'women_complicated_pregnancy',
  'menopause_status', 'menopause_symptoms',
  'men_prostate_problems', 'men_testicular_pain', 'men_erectile_difficulties',
  'men_low_libido', 'men_fertility_concerns',
  'bowel_daily', 'bowel_number_per_day', 'bowel_difficulty', 'bowel_consistency', 'bowel_flatulence',
  'diet_vegetarian_vegan', 'diet_food_cravings', 'diet_food_cravings_detail',
  'diet_daily_fluid_intake', 'diet_eating_disorder',
  'consent_given', 'ch_consent_given', 'signature', 'signed_date', 'status'
]

function csvCell(value) {
  if (value === null || value === undefined) return ''
  const str = Array.isArray(value) ? value.join('; ') : String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

  // Optional filters passed from the back office (condition / sex), so the
  // export matches whatever the practitioner is currently looking at.
  const url = new URL(req.url, `https://${req.headers.host}`)
  const condition = url.searchParams.get('condition')
  const sex = url.searchParams.get('sex')

  let query = supabase.from('intake_submissions').select('*')
  if (sex === 'F' || sex === 'M') query = query.eq('sex', sex)
  if (condition === 'flagged') {
    query = query.eq('status', 'flagged')
  } else if (condition && columns.includes(condition)) {
    query = query.not(condition, 'is', null).neq(condition, '')
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  const rows = [columns.join(',')]
  for (const record of data) {
    rows.push(columns.map((c) => csvCell(record[c])).join(','))
  }

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="makeda-intake-submissions-${new Date().toISOString().slice(0, 10)}.csv"`)
  res.status(200).send(rows.join('\n'))
}
