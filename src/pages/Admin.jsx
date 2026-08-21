import { useState, useEffect, useMemo } from 'react'
import PrescriptionForm from '../components/PrescriptionForm.jsx'
import InventoryPanel from '../components/InventoryPanel.jsx'
import ClientIntake from './ClientIntake.jsx'
import MessageThread from '../components/MessageThread.jsx'
import VlogPanel from '../components/VlogPanel.jsx'
import ResearchPanel from '../components/ResearchPanel.jsx'

// Only renders when there's an actual answer — keeps the detail view
// condensed instead of a wall of blank fields.
function Row({ label, value }) {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    value === false ||
    (Array.isArray(value) && value.length === 0)
  if (isEmpty) return null

  const display = value === true ? 'Yes' : Array.isArray(value) ? value.join(', ') : value
  return (
    <p className="text-sm text-ink/80">
      <span className="font-mono text-xs text-ochre">{label}</span> — {display}
    </p>
  )
}

// Only renders its heading if at least one child Row produced output.
function Section({ title, children }) {
  const hasContent = Array.isArray(children)
    ? children.some((c) => c !== null && c !== false && c !== undefined)
    : Boolean(children)
  if (!hasContent) return null
  return (
    <>
      <p className="font-mono text-xs tracking-widest text-moss/60 mt-5 mb-2 first:mt-0">{title}</p>
      {children}
    </>
  )
}

const CONDITION_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'flagged', label: 'Flagged only' },
  { key: 'cardiovascular_notes', label: 'Cardiovascular' },
  { key: 'gastrointestinal_notes', label: 'Gastrointestinal' },
  { key: 'respiratory_notes', label: 'Respiratory' },
  { key: 'genitourinary_notes', label: 'Genitourinary' },
  { key: 'dermatological_notes', label: 'Dermatological' },
  { key: 'musculoskeletal_notes', label: 'Musculoskeletal' },
  { key: 'nervous_system_notes', label: 'Nervous system' }
]

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('makeda_admin_pw') || '')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('submissions')
  const [submissions, setSubmissions] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState(null)
  const [conditionFilter, setConditionFilter] = useState('all')
  const [sexFilter, setSexFilter] = useState('all')
  const [prescriptions, setPrescriptions] = useState([])
  const [rxClient, setRxClient] = useState(null)
  const [rxEditing, setRxEditing] = useState(null)
  const [rxSaving, setRxSaving] = useState(false)
  const [rxFormKey, setRxFormKey] = useState(0)
  const [stock, setStock] = useState([])
  const [stockSaving, setStockSaving] = useState(false)
  const [messages, setMessages] = useState([])
  const [msgSending, setMsgSending] = useState(false)
  const [vlogPosts, setVlogPosts] = useState([])
  const [vlogSaving, setVlogSaving] = useState(false)

  const load = async (pw) => {
    setLoading(true)
    setError('')
    try {
      const [subRes, orderRes, rxRes, stockRes, msgRes, vlogRes] = await Promise.all([
        fetch('/api/submissions', { headers: { 'x-admin-password': pw } }),
        fetch('/api/orders', { headers: { 'x-admin-password': pw } }),
        fetch('/api/prescriptions', { headers: { 'x-admin-password': pw } }),
        fetch('/api/inventory', { headers: { 'x-admin-password': pw } }),
        fetch('/api/messages', { headers: { 'x-admin-password': pw } }),
        fetch('/api/vlog', { headers: { 'x-admin-password': pw } })
      ])
      if (subRes.status === 401 || orderRes.status === 401) {
        setError('Incorrect password.')
        setAuthed(false)
        setLoading(false)
        return
      }
      const subData = await subRes.json()
      const orderData = await orderRes.json()
      const rxData = rxRes.ok ? await rxRes.json() : { prescriptions: [] }
      const stockData = stockRes.ok ? await stockRes.json() : { stock: [] }
      const msgData = msgRes.ok ? await msgRes.json() : { messages: [] }
      const vlogData = vlogRes.ok ? await vlogRes.json() : { posts: [] }
      setSubmissions(subData.submissions || [])
      setOrders(orderData.orders || [])
      setPrescriptions(rxData.prescriptions || [])
      setStock(stockData.stock || [])
      setMessages(msgData.messages || [])
      setVlogPosts(vlogData.posts || [])
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

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      if (sexFilter !== 'all' && s.sex !== sexFilter) return false
      if (conditionFilter === 'all') return true
      if (conditionFilter === 'flagged') return s.status === 'flagged'
      const val = s[conditionFilter]
      return val && String(val).trim() !== ''
    })
  }, [submissions, conditionFilter, sexFilter])

  const reloadPrescriptions = async () => {
    const res = await fetch('/api/prescriptions', { headers: { 'x-admin-password': password } })
    if (res.ok) {
      const data = await res.json()
      setPrescriptions(data.prescriptions || [])
    }
  }

  const handleSavePrescription = async (payload, opts = {}) => {
    setRxSaving(true)
    setError('')
    const isEdit = Boolean(rxEditing)
    const res = await fetch('/api/prescriptions', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(isEdit ? { ...payload, id: rxEditing.id } : payload)
    })
    setRxSaving(false)
    if (!res.ok) {
      setError('Could not save the prescription. Please try again.')
      return
    }
    await reloadPrescriptions()
    if (opts.keepOpen) {
      // Remount a blank form for the same client so several formulations
      // can be written back to back without closing and reopening.
      setRxEditing(null)
      setRxFormKey((k) => k + 1)
      return
    }
    setRxClient(null)
    setRxEditing(null)
  }

  const handleDeletePrescription = async (id) => {
    if (!window.confirm('Delete this prescription? This cannot be undone.')) return
    const res = await fetch(`/api/prescriptions?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password }
    })
    if (!res.ok) {
      setError('Could not delete the prescription.')
      return
    }
    await reloadPrescriptions()
  }

  const reloadStock = async () => {
    const res = await fetch('/api/inventory', { headers: { 'x-admin-password': password } })
    if (res.ok) {
      const data = await res.json()
      setStock(data.stock || [])
    }
  }

  const handleStockSave = async (payload) => {
    setStockSaving(true)
    setError('')
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(payload)
    })
    setStockSaving(false)
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      setError(d.error || 'Could not save. That herb and format may already be in your stock list.')
      return
    }
    await reloadStock()
  }

  const handleStockUpdate = async (payload) => {
    setError('')
    const res = await fetch('/api/inventory', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      setError('Could not update stock.')
      return
    }
    await reloadStock()
  }

  const handleStockDelete = async (type, id) => {
    const what = type === 'batch' ? 'this batch' : 'this herb and all its batches'
    if (!window.confirm(`Delete ${what}? This cannot be undone.`)) return
    const res = await fetch(`/api/inventory?type=${type}&id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password }
    })
    if (!res.ok) {
      setError('Could not delete.')
      return
    }
    await reloadStock()
  }

  const handleDeductStock = async (rx) => {
    if (!window.confirm(`Deduct the herbs in ${rx.reference} from your stock? This cannot be undone.`)) return
    setError('')
    const res = await fetch('/api/deduct-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ prescription_id: rx.id })
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || 'Could not deduct stock.')
      return
    }
    if (data.warnings?.length) {
      setError(data.warnings.join(' '))
    }
    await Promise.all([reloadStock(), reloadPrescriptions()])
  }

  const reloadVlog = async () => {
    const res = await fetch('/api/vlog', { headers: { 'x-admin-password': password } })
    if (res.ok) {
      const d = await res.json()
      setVlogPosts(d.posts || [])
    }
  }

  const handleVlogSave = async (post) => {
    setVlogSaving(true)
    setError('')
    const res = await fetch('/api/vlog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(post)
    })
    setVlogSaving(false)
    if (!res.ok) { setError('Could not save the post.'); return }
    await reloadVlog()
  }

  const handleVlogUpdate = async (post) => {
    setVlogSaving(true)
    setError('')
    const res = await fetch('/api/vlog', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(post)
    })
    setVlogSaving(false)
    if (!res.ok) { setError('Could not update the post.'); return }
    await reloadVlog()
  }

  const handleVlogDelete = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    const res = await fetch(`/api/vlog?id=${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password }
    })
    if (!res.ok) { setError('Could not delete the post.'); return }
    await reloadVlog()
  }

  const clientMessages = (email) => messages.filter((m) => m.client_email === email)

  const unreadFrom = (email) =>
    messages.filter((m) => m.client_email === email && m.sender === 'client' && !m.read_by_practitioner).length

  const handleSendMessage = async (client, body) => {
    setMsgSending(true)
    setError('')
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ submission_id: client.id, client_email: client.email, body })
    })
    setMsgSending(false)
    if (!res.ok) {
      setError('Could not send the message.')
      return
    }
    const res2 = await fetch('/api/messages', { headers: { 'x-admin-password': password } })
    if (res2.ok) {
      const d = await res2.json()
      setMessages(d.messages || [])
    }
  }

  const markMessagesRead = async (email) => {
    await fetch('/api/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ client_email: email })
    })
    setMessages((prev) =>
      prev.map((m) =>
        m.client_email === email && m.sender === 'client' ? { ...m, read_by_practitioner: true } : m
      )
    )
  }

  const clientPrescriptions = (submissionId) =>
    prescriptions.filter((rx) => rx.submission_id === submissionId)

  const handleExport = async (kind) => {
    const params = new URLSearchParams()
    if (kind === 'submissions') {
      if (conditionFilter !== 'all') params.set('condition', conditionFilter)
      if (sexFilter !== 'all') params.set('sex', sexFilter)
    }
    const base = kind === 'orders' ? '/api/export-orders' : '/api/export'
    const url = params.toString() ? `${base}?${params}` : base

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
        <a
          href="https://nimh.org.uk/login/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-moss border border-moss/20 rounded px-3 py-1.5 hover:border-ochre hover:text-ochre transition-colors"
        >
          NIMH interaction checker ↗
        </a>
      </div>

      <div className="flex gap-6 border-b border-moss/10 mb-8">
        <button
          onClick={() => setTab('newclient')}
          className={`pb-3 text-sm font-mono ${tab === 'newclient' ? 'text-ochre border-b-2 border-ochre' : 'text-moss/50'}`}
        >
          + New client form
        </button>
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
        <button
          onClick={() => setTab('inventory')}
          className={`pb-3 text-sm font-mono ${tab === 'inventory' ? 'text-ochre border-b-2 border-ochre' : 'text-moss/50'}`}
        >
          Inventory ({stock.length}){stock.some((x) => x.is_low) ? ' ⚠' : ''}
        </button>
        <button
          onClick={() => setTab('vlog')}
          className={`pb-3 text-sm font-mono ${tab === 'vlog' ? 'text-ochre border-b-2 border-ochre' : 'text-moss/50'}`}
        >
          Vlog ({vlogPosts.length})
        </button>
        <button
          onClick={() => setTab('research')}
          className={`pb-3 text-sm font-mono ${tab === 'research' ? 'text-ochre border-b-2 border-ochre' : 'text-moss/50'}`}
        >
          Research
        </button>
      </div>

      {error && <p className="mb-6 text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">{error}</p>}

      {tab === 'submissions' && (
        <div>
          <div className="bg-cream border border-moss/10 rounded-lg p-4 mb-6 space-y-3">
            <div>
              <p className="font-mono text-xs tracking-wide text-moss/60 mb-2">FILTER BY CONDITION</p>
              <div className="flex flex-wrap gap-1.5">
                {CONDITION_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setConditionFilter(f.key)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      conditionFilter === f.key
                        ? 'bg-ochre text-linen'
                        : 'bg-linen border border-moss/20 text-ink/70 hover:border-ochre'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs tracking-wide text-moss/60 mb-2">FILTER BY SEX</p>
              <div className="flex flex-wrap gap-1.5">
                {[{ k: 'all', l: 'All' }, { k: 'F', l: 'Female' }, { k: 'M', l: 'Male' }].map((o) => (
                  <button
                    key={o.k}
                    onClick={() => setSexFilter(o.k)}
                    className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                      sexFilter === o.k
                        ? 'bg-ochre text-linen'
                        : 'bg-linen border border-moss/20 text-ink/70 hover:border-ochre'
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-ink/60">
              Showing {filteredSubmissions.length} of {submissions.length}
              <button
                onClick={() => load(password)}
                disabled={loading}
                className="ml-3 text-xs text-moss hover:text-ochre disabled:opacity-50"
              >
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
            </p>
            <button onClick={() => handleExport('submissions')} className="bg-ochre text-linen px-5 py-2.5 rounded text-sm">
              Export {conditionFilter === 'all' && sexFilter === 'all' ? 'all' : 'filtered'} to CSV
            </button>
          </div>

          <div className="space-y-3">
            {filteredSubmissions.length === 0 && <p className="text-sm text-ink/60">No submissions match these filters.</p>}
            {filteredSubmissions.map((s) => (
              <div key={s.id} className="bg-cream border border-moss/10 rounded-lg">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => {
                    const opening = openId !== s.id
                    setOpenId(opening ? s.id : null)
                    if (opening && unreadFrom(s.email) > 0) markMessagesRead(s.email)
                  }}
                >
                  <div>
                    <p className="text-sm text-ink">{s.first_name} {s.surname}</p>
                    <p className="font-mono text-xs text-ink/50">{new Date(s.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {unreadFrom(s.email) > 0 && (
                      <span className="font-mono text-xs text-linen bg-ochre px-2 py-1 rounded">
                        {unreadFrom(s.email)} new
                      </span>
                    )}
                    {s.status === 'flagged' && (
                      <span className="font-mono text-xs text-ochre bg-ochre/10 px-2 py-1 rounded">flagged</span>
                    )}
                  </div>
                </button>

                {openId === s.id && (
                  <div className="px-5 pb-5 space-y-1 border-t border-moss/10 pt-4">
                    <Section title="CONTACT">
                      <Row label="NAME" value={`${s.first_name || ''} ${s.surname || ''}`.trim()} />
                      <Row label="DOB" value={s.dob} />
                      <Row label="SEX" value={s.sex} />
                      <Row label="ADDRESS" value={s.address} />
                      <Row label="POSTCODE" value={s.postcode} />
                      <Row label="EMAIL" value={s.email} />
                      <Row label="MOBILE" value={s.mobile} />
                      <Row label="LANDLINE" value={s.landline} />
                    </Section>

                    <Section title="GP">
                      <Row label="GP NAME" value={s.gp_name} />
                      <Row label="GP TEL" value={s.gp_tel} />
                      <Row label="GP ADDRESS" value={s.gp_address} />
                      <Row label="PERMISSION TO CONTACT GP" value={s.gp_contact_consent} />
                    </Section>

                    <Section title="PRESENTING COMPLAINT">
                      <Row label="SERVICES INTERESTED" value={s.services_interested} />
                      <Row label="HEALTH STORY" value={s.description_of_ailment} />
                      <Row label="EXISTING OR NEW" value={s.existing_or_new} />
                      <Row label="MEDICATIONS" value={s.medications_selected} />
                      <Row label="OTHER MEDICATIONS" value={s.medications_other} />
                      <Row label="SURGERIES (LAST 3 MONTHS)" value={s.surgeries_last_3_months} />
                    </Section>

                    <Section title="HEALTH HISTORY BY SYSTEM">
                      <Row label="RESPIRATORY" value={s.respiratory_notes} />
                      <Row label="CARDIOVASCULAR" value={s.cardiovascular_notes} />
                      <Row label="CARDIOVASCULAR FLAGS" value={s.cardiovascular_flags} />
                      <Row label="GENITOURINARY" value={s.genitourinary_notes} />
                      <Row label="GENITOURINARY FLAGS" value={s.genitourinary_flags} />
                      <Row label="GASTROINTESTINAL" value={s.gastrointestinal_notes} />
                      <Row label="GASTROINTESTINAL FLAGS" value={s.gastrointestinal_flags} />
                      <Row label="DERMATOLOGICAL" value={s.dermatological_notes} />
                      <Row label="MUSCULOSKELETAL" value={s.musculoskeletal_notes} />
                      <Row label="MUSCULOSKELETAL FLAGS" value={s.musculoskeletal_flags} />
                      <Row label="NERVOUS SYSTEM" value={s.nervous_system_notes} />
                      <Row label="STRESS LEVEL (1–10)" value={s.stress_level} />
                      <Row label="HAPPINESS (1–10)" value={s.happiness_level} />
                      <Row label="PEACEFULNESS (1–10)" value={s.peacefulness_level} />
                    </Section>

                    <Section title="BOWEL">
                      <Row label="DAILY BOWEL MOVEMENTS" value={s.bowel_daily} />
                      <Row label="NUMBER PER DAY" value={s.bowel_number_per_day} />
                      <Row label="DIFFICULTY PASSING" value={s.bowel_difficulty} />
                      <Row label="CONSISTENCY" value={s.bowel_consistency} />
                      <Row label="FLATULENCE / BLOATING" value={s.bowel_flatulence} />
                    </Section>

                    <Section title={s.sex === 'M' ? "MEN'S HEALTH" : "WOMEN'S HEALTH & MENOPAUSE"}>
                      {s.sex === 'M' ? (
                        <>
                          <Row label="PROSTATE PROBLEMS" value={s.men_prostate_problems} />
                          <Row label="TESTICULAR PAIN OR SWELLING" value={s.men_testicular_pain} />
                          <Row label="ERECTILE DIFFICULTIES" value={s.men_erectile_difficulties} />
                          <Row label="LOW LIBIDO" value={s.men_low_libido} />
                          <Row label="FERTILITY CONCERNS" value={s.men_fertility_concerns} />
                        </>
                      ) : (
                        <>
                          <Row label="PAINFUL PERIODS" value={s.women_painful_periods} />
                          <Row label="LAST PERIOD DATE" value={s.women_last_period_date} />
                          <Row label="VAGINAL DISCHARGE" value={s.women_vaginal_discharge} />
                          <Row label="THRUSH" value={s.women_thrush} />
                          <Row label="PREGNANT" value={s.women_pregnant} />
                          <Row label="COMPLICATED PREGNANCY" value={s.women_complicated_pregnancy} />
                          <Row label="MENOPAUSE STATUS" value={s.menopause_status} />
                          <Row label="MENOPAUSE SYMPTOMS" value={s.menopause_symptoms} />
                        </>
                      )}
                    </Section>

                    <Section title="DIET">
                      <Row label="VEGETARIAN / VEGAN" value={s.diet_vegetarian_vegan} />
                      <Row label="FOOD CRAVINGS" value={s.diet_food_cravings} />
                      <Row label="CRAVINGS DETAIL" value={s.diet_food_cravings_detail} />
                      <Row label="DAILY FLUID INTAKE" value={s.diet_daily_fluid_intake} />
                      <Row label="HISTORY OF EATING DISORDER" value={s.diet_eating_disorder} />
                    </Section>

                    <Section title="CONSENT">
                      <Row label="CONSENT GIVEN" value={s.consent_given} />
                      <Row label="COLON HYDROTHERAPY CONSENT" value={s.ch_consent_given} />
                      <Row label="SIGNED BY" value={s.signature} />
                      <Row label="SIGNED DATE" value={s.signed_date} />
                    </Section>

                    {s.signature_image && (
                      <div className="mt-3">
                        <p className="font-mono text-xs text-ochre mb-1">SIGNATURE</p>
                        <img
                          src={s.signature_image}
                          alt={`Signature of ${s.first_name} ${s.surname}`}
                          className="max-w-xs border border-moss/20 rounded-md bg-linen"
                        />
                      </div>
                    )}

                    <div className="mt-6 pt-5 border-t border-moss/10">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-mono text-xs tracking-widest text-moss/60">
                          PRESCRIPTIONS &amp; TREATMENT PLAN
                        </p>
                        <button
                          onClick={() => { setRxClient(s); setRxEditing(null) }}
                          className="text-xs bg-moss text-linen px-3 py-1.5 rounded hover:bg-ink transition-colors"
                        >
                          + New prescription
                        </button>
                      </div>

                      {clientPrescriptions(s.id).length === 0 && (
                        <p className="text-sm text-ink/50 italic">No prescriptions yet.</p>
                      )}

                      <div className="space-y-2 mb-3">
                        {clientPrescriptions(s.id).map((rx) => (
                          <div key={rx.id} className="bg-linen border border-moss/10 rounded-md p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm text-ink">
                                  <span className="font-mono text-xs text-ochre">{rx.reference}</span>
                                  {' — '}{rx.formulation_type}
                                  {rx.total_volume_ml ? `, ${rx.total_volume_ml}ml` : ''}
                                </p>
                                <p className="text-xs text-ink/60">
                                  {rx.dosage} {rx.frequency}
                                  {rx.duration ? ` · ${rx.duration}` : ''}
                                </p>
                                <p className="text-xs text-ink/50 mt-1">
                                  {(rx.prescription_items || []).length} herb(s)
                                  {rx.issued_date ? ` · issued ${rx.issued_date}` : ''}
                                  {rx.review_date ? ` · review ${rx.review_date}` : ''}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                                  rx.status === 'issued'
                                    ? 'bg-sage/20 text-sage'
                                    : rx.status === 'made'
                                      ? 'bg-amber/25 text-bronze'
                                      : rx.status === 'archived'
                                        ? 'bg-moss/10 text-moss/50'
                                        : 'bg-ochre/10 text-ochre'
                                }`}>
                                  {rx.status === 'made' ? 'made up' : rx.status}
                                </span>
                                <div className="flex gap-2">
                                  {!rx.stock_deducted && (rx.prescription_items || []).length > 0 && (
                                    <button
                                      onClick={() => handleDeductStock(rx)}
                                      className="text-xs text-sage hover:text-ochre"
                                    >
                                      Deduct stock
                                    </button>
                                  )}
                                  {rx.stock_deducted && (
                                    <span className="text-xs text-ink/40">stock deducted</span>
                                  )}
                                  <button
                                    onClick={() => { setRxClient(s); setRxEditing(rx) }}
                                    className="text-xs text-moss hover:text-ochre"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeletePrescription(rx.id)}
                                    className="text-xs text-ochre/70 hover:text-ochre"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>

                            {(rx.prescription_items || []).length > 0 && (
                              <ul className="mt-2 pt-2 border-t border-moss/10 space-y-0.5">
                                {(rx.prescription_items || [])
                                  .slice()
                                  .sort((a, b) => a.sort_order - b.sort_order)
                                  .map((item) => (
                                    <li key={item.id} className="text-xs text-ink/70">
                                      <span className="italic">{item.herb_latin}</span>
                                      {item.herb_common ? ` (${item.herb_common})` : ''}
                                      {' — '}{item.format}
                                      {item.quantity_ml ? `, ${item.quantity_ml}ml` : ''}
                                      {item.notes ? ` · ${item.notes}` : ''}
                                    </li>
                                  ))}
                              </ul>
                            )}

                            {rx.instructions && (
                              <p className="text-xs text-ink/70 mt-2 pt-2 border-t border-moss/10">
                                <span className="font-mono text-[10px] text-moss/50">INSTRUCTIONS</span><br />
                                {rx.instructions}
                              </p>
                            )}
                            {rx.practitioner_notes && (
                              <p className="text-xs text-ink/70 mt-2">
                                <span className="font-mono text-[10px] text-moss/50">PRIVATE NOTES</span><br />
                                {rx.practitioner_notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {rxClient?.id === s.id && (
                        <PrescriptionForm
                          key={rxEditing?.id || `new-${rxFormKey}`}
                          client={s}
                          existing={rxEditing}
                          saving={rxSaving}
                          onSave={handleSavePrescription}
                          onCancel={() => { setRxClient(null); setRxEditing(null) }}
                        />
                      )}
                    </div>

                    <div className="mt-6 pt-5 border-t border-moss/10">
                      <p className="font-mono text-xs tracking-widest text-moss/60 mb-3">MESSAGES</p>
                      <MessageThread
                        messages={clientMessages(s.email)}
                        viewerRole="practitioner"
                        sending={msgSending}
                        onSend={(body) => handleSendMessage(s, body)}
                        placeholder={`Message ${s.first_name || 'this client'}…`}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'newclient' && (
        <ClientIntake
          clinicMode
          onSaved={() => load(password)}
          onComplete={() => setTab('submissions')}
        />
      )}

      {tab === 'vlog' && (
        <VlogPanel
          posts={vlogPosts}
          saving={vlogSaving}
          onSave={handleVlogSave}
          onUpdate={handleVlogUpdate}
          onDelete={handleVlogDelete}
        />
      )}

      {tab === 'research' && (
        <ResearchPanel password={password} clients={submissions} />
      )}

      {tab === 'inventory' && (
        <InventoryPanel
          stock={stock}
          saving={stockSaving}
          onSave={handleStockSave}
          onUpdate={handleStockUpdate}
          onDelete={handleStockDelete}
        />
      )}

      {tab === 'orders' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => handleExport('orders')} className="bg-ochre text-linen px-5 py-2.5 rounded text-sm">
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
