import { useState, useEffect } from 'react'

function Row({ label, value }) {
  return (
    <p className="text-sm text-ink/80">
      <span className="font-mono text-xs text-ochre">{label}</span> — {value === true ? 'Yes' : value === false ? 'No' : (value || '—')}
    </p>
  )
}

function SectionTitle({ children }) {
  return <p className="font-mono text-xs tracking-widest text-moss/60 mt-5 mb-2 first:mt-0">{children}</p>
}

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('makeda_admin_pw') || '')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('submissions')
  const [submissions, setSubmissions] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)

  const load = async (pw) => {
    setLoading(true)
    setError('')
    try {
      const [subRes, orderRes] = await Promise.all([
        fetch('/api/submissions', { headers: { 'x-admin-password': pw } }),
        fetch('/api/orders', { headers: { 'x-admin-password': pw } })
      ])
      if (subRes.status === 401 || orderRes.status === 401) {
        setError('Incorrect password.')
        setAuthed(false)
        setLoading(false)
        return
      }
      const subData = await subRes.json()
      const orderData = await orderRes.json()
      setSubmissions(subData.submissions || [])
      setOrders(orderData.orders || [])
      setAuthed(true)
      sessionStorage.setItem('makeda_admin_pw', pw)
    } catch (err) {
      setError('Could not reach the server. Check your connection and try again.')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (password) load(password)
  }, [])

  const handleExport = async (kind) => {
    const url = kind === 'orders' ? '/api/export-orders' : '/api/export'
    const res = await fetch(url, { headers: { 'x-admin-password': password } })
    if (!res.ok) {
      setError('Export failed — try refreshing and logging in again.')
      return
    }
    const blob = await res.blob()
    const objUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objUrl
    a.download = `makeda-${kind}-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(objUrl)
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24">
        <p className="font-mono text-xs tracking-widest text-ochre mb-4">BACK OFFICE</p>
        <h1 className="font-display text-2xl text-moss mb-6">Staff sign-in</h1>
        <form onSubmit={(e) => { e.preventDefault(); load(password) }} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-moss/20 bg-cream px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-ochre">{error}</p>}
          <button type="submit" disabled={loading} className="bg-moss text-linen px-6 py-3 rounded text-sm w-full disabled:opacity-50">
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-xs tracking-widest text-ochre">BACK OFFICE</p>
      </div>

      <div className="flex gap-6 border-b border-moss/10 mb-8">
        <button
          onClick={() => setTab('submissions')}
          className={`pb-3 text-sm font-mono ${tab === 'submissions' ? 'text-ochre border-b-2 border-ochre' : 'text-moss/50'}`}
        >
          Intake submissions ({submissions.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`pb-3 text-sm font-mono ${tab === 'orders' ? 'text-ochre border-b-2 border-ochre' : 'text-moss/50'}`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {error && <p className="mb-6 text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">{error}</p>}

      {tab === 'submissions' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => handleExport('submissions')} className="bg-ochre text-cream px-5 py-2.5 rounded text-sm">
              Export all to CSV
            </button>
          </div>
          <div className="space-y-3">
            {submissions.length === 0 && <p className="text-sm text-ink/60">No submissions yet.</p>}
            {submissions.map((s) => (
              <div key={s.id} className="bg-cream border border-moss/10 rounded-lg">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenId(openId === s.id ? null : s.id)}
                >
                  <div>
                    <p className="text-sm text-ink">{s.first_name} {s.surname}</p>
                    <p className="font-mono text-xs text-ink/50">{new Date(s.created_at).toLocaleString()}</p>
                  </div>
                  {s.status === 'flagged' && (
                    <span className="font-mono text-xs text-ochre bg-ochre/10 px-2 py-1 rounded">flagged</span>
                  )}
                </button>

                {openId === s.id && (
                  <div className="px-5 pb-5 space-y-1 border-t border-moss/10 pt-4">
                    <SectionTitle>CONTACT</SectionTitle>
                    <Row label="NAME" value={`${s.first_name || ''} ${s.surname || ''}`} />
                    <Row label="DOB" value={s.dob} />
                    <Row label="SEX" value={s.sex} />
                    <Row label="ADDRESS" value={s.address} />
                    <Row label="POSTCODE" value={s.postcode} />
                    <Row label="EMAIL" value={s.email} />
                    <Row label="MOBILE" value={s.mobile} />
                    <Row label="LANDLINE" value={s.landline} />

                    <SectionTitle>GP</SectionTitle>
                    <Row label="GP NAME" value={s.gp_name} />
                    <Row label="GP TEL" value={s.gp_tel} />
                    <Row label="GP ADDRESS" value={s.gp_address} />
                    <Row label="PERMISSION TO CONTACT GP" value={s.gp_contact_consent} />

                    <SectionTitle>PRESENTING COMPLAINT</SectionTitle>
                    <Row label="DESCRIPTION OF AILMENT" value={s.description_of_ailment} />
                    <Row label="EXISTING OR NEW" value={s.existing_or_new} />
                    <Row label="MEDICATIONS" value={s.medications} />
                    <Row label="SURGERIES (LAST 3 MONTHS)" value={s.surgeries_last_3_months} />

                    <SectionTitle>HEALTH HISTORY BY SYSTEM</SectionTitle>
                    <Row label="RESPIRATORY" value={s.respiratory_notes} />
                    <Row label="CARDIOVASCULAR" value={s.cardiovascular_notes} />
                    <Row label="CARDIOVASCULAR FLAGS" value={(s.cardiovascular_flags || []).join(', ') || 'None'} />
                    <Row label="GENITOURINARY" value={s.genitourinary_notes} />
                    <Row label="GENITOURINARY FLAGS" value={(s.genitourinary_flags || []).join(', ') || 'None'} />
                    <Row label="GASTROINTESTINAL" value={s.gastrointestinal_notes} />
                    <Row label="GASTROINTESTINAL FLAGS" value={(s.gastrointestinal_flags || []).join(', ') || 'None'} />
                    <Row label="DERMATOLOGICAL" value={s.dermatological_notes} />
                    <Row label="MUSCULOSKELETAL" value={s.musculoskeletal_notes} />
                    <Row label="MUSCULOSKELETAL FLAGS" value={(s.musculoskeletal_flags || []).join(', ') || 'None'} />

                    <SectionTitle>WOMEN'S HEALTH & MENOPAUSE</SectionTitle>
                    <Row label="PAINFUL PERIODS" value={s.women_painful_periods} />
                    <Row label="LAST PERIOD DATE" value={s.women_last_period_date} />
                    <Row label="VAGINAL DISCHARGE" value={s.women_vaginal_discharge} />
                    <Row label="THRUSH" value={s.women_thrush} />
                    <Row label="PREGNANT" value={s.women_pregnant} />
                    <Row label="COMPLICATED PREGNANCY" value={s.women_complicated_pregnancy} />
                    <Row label="MENOPAUSE STATUS" value={s.menopause_status} />
                    <Row label="MENOPAUSE SYMPTOMS" value={(s.menopause_symptoms || []).join(', ') || 'None'} />

                    <SectionTitle>BOWEL & DIET</SectionTitle>
                    <Row label="DAILY BOWEL MOVEMENTS" value={s.bowel_daily} />
                    <Row label="NUMBER PER DAY" value={s.bowel_number_per_day} />
                    <Row label="DIFFICULTY PASSING" value={s.bowel_difficulty} />
                    <Row label="CONSISTENCY" value={s.bowel_consistency} />
                    <Row label="FLATULENCE / BLOATING" value={s.bowel_flatulence} />
                    <Row label="VEGETARIAN / VEGAN" value={s.diet_vegetarian_vegan} />
                    <Row label="FOOD CRAVINGS" value={s.diet_food_cravings} />
                    <Row label="CRAVINGS DETAIL" value={s.diet_food_cravings_detail} />
                    <Row label="DAILY FLUID INTAKE" value={s.diet_daily_fluid_intake} />
                    <Row label="HISTORY OF EATING DISORDER" value={s.diet_eating_disorder} />

                    <SectionTitle>CONSENT</SectionTitle>
                    <Row label="CONSENT GIVEN" value={s.consent_given} />
                    <Row label="SIGNATURE" value={s.signature} />
                    <Row label="SIGNED DATE" value={s.signed_date} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => handleExport('orders')} className="bg-ochre text-cream px-5 py-2.5 rounded text-sm">
              Export all to CSV
            </button>
          </div>
          <div className="space-y-3">
            {orders.length === 0 && <p className="text-sm text-ink/60">No orders yet.</p>}
            {orders.map((o) => (
              <div key={o.id} className="bg-cream border border-moss/10 rounded-lg px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink">{o.product_name}</p>
                  <p className="font-mono text-xs text-ink/50">{o.customer_email} · {new Date(o.created_at).toLocaleString()}</p>
                </div>
                <span className="font-mono text-sm text-ochre">£{Number(o.amount_gbp).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
