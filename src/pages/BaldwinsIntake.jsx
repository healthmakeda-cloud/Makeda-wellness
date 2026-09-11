import { useState } from 'react'
import MedicineSelector from '../components/MedicineSelector.jsx'

// The shortened form for Baldwin's & Co, which offers herbal medicine
// only. Lives inside the back office as its own tab — Makéda fills it in
// with the client present, same pattern as the full "+ New client form."
// Submits through the same secure server route (gated by the admin
// password), so it never touches client-side database policies.

const inputClass = 'w-full rounded-md border border-moss/20 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-ochre'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs tracking-wide text-moss/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function RatingScale({ label, lowLabel, highLabel, value, onChange }) {
  return (
    <div>
      <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-9 w-9 rounded-full text-sm font-body transition-colors ${
              value === n ? 'bg-ochre text-linen' : 'bg-cream border border-moss/20 text-ink/70 hover:border-ochre'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-ink/40 font-mono max-w-[420px]">
        <span>1 — {lowLabel}</span>
        <span>10 — {highLabel}</span>
      </div>
    </div>
  )
}

const emptyForm = {
  firstName: '', surname: '', email: '', mobile: '',
  descriptionOfAilment: '',
  medicationsSelected: [], medicationsOther: '', medicationsOtherChecked: false,
  nervousSystemNotes: '',
  stressLevel: 5, happinessLevel: 5, peacefulnessLevel: 5,
  consentGiven: false, signature: '', signedDate: new Date().toISOString().slice(0, 10)
}

export default function BaldwinsIntake({ adminPassword, onSaved, onComplete }) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const toggleMedicine = (item) =>
    setForm((f) => ({
      ...f,
      medicationsSelected: f.medicationsSelected.includes(item)
        ? f.medicationsSelected.filter((m) => m !== item)
        : [...f.medicationsSelected, item]
    }))

  const startFresh = () => {
    setForm(emptyForm)
    setSubmitted(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const payload = {
      first_name: form.firstName,
      surname: form.surname,
      email: form.email,
      mobile: form.mobile,
      description_of_ailment: form.descriptionOfAilment,
      medications_selected: form.medicationsSelected,
      medications_other: form.medicationsOtherChecked ? form.medicationsOther : '',
      nervous_system_notes: form.nervousSystemNotes,
      stress_level: form.stressLevel,
      happiness_level: form.happinessLevel,
      peacefulness_level: form.peacefulnessLevel,
      consent_given: form.consentGiven,
      signature: form.signature,
      signed_date: form.signedDate || null,
      services_interested: ['Herbal Medicine'],
      status: 'new'
    }

    try {
      const res = await fetch('/api/submit-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPassword },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'There was a problem saving this form. Please try again.')
        setSubmitting(false)
        return
      }
    } catch {
      setError('Could not reach the server. Please check your connection and try again.')
      setSubmitting(false)
      return
    }

    setSubmitting(false)
    setSubmitted(true)
    if (onSaved) onSaved()
  }

  if (submitted) {
    return (
      <div className="bg-cream border border-moss/10 rounded-lg p-8 text-center">
        <h2 className="font-display text-2xl text-moss mb-3">
          Saved for {form.firstName} {form.surname}
        </h2>
        <p className="text-ink/70 text-sm mb-6">
          Their record is now in Intake submissions.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={startFresh} className="bg-moss text-linen px-6 py-3 rounded text-sm">
            Start a form for the next client
          </button>
          {onComplete && (
            <button onClick={() => { startFresh(); onComplete() }} className="border border-moss text-moss px-6 py-3 rounded text-sm">
              Done
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl text-moss">Baldwin's & Co — quick health form</h2>
        <p className="text-sm text-ink/60">
          A shorter form for herbal medicine consultations at Baldwin's — complete with the client present.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="FIRST NAME"><input required className={inputClass} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} /></Field>
          <Field label="SURNAME"><input required className={inputClass} value={form.surname} onChange={(e) => update('surname', e.target.value)} /></Field>
          <Field label="EMAIL"><input required type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
          <Field label="MOBILE"><input className={inputClass} value={form.mobile} onChange={(e) => update('mobile', e.target.value)} /></Field>
        </div>

        <Field label="YOUR HEALTH STORY">
          <textarea
            required
            rows={4}
            placeholder="Tell me the story behind your symptoms and how they affect your life."
            className={inputClass}
            value={form.descriptionOfAilment}
            onChange={(e) => update('descriptionOfAilment', e.target.value)}
          />
        </Field>

        <div>
          <span className="font-mono text-xs tracking-wide text-moss/70 block mb-1">LIST OF MEDICINES YOU ARE CURRENTLY TAKING</span>
          <MedicineSelector
            selected={form.medicationsSelected}
            onToggle={toggleMedicine}
            otherText={form.medicationsOther}
            onOtherChange={(v) => update('medicationsOther', v)}
            otherChecked={form.medicationsOtherChecked}
            onOtherCheckedChange={(v) => update('medicationsOtherChecked', v)}
          />
        </div>

        <div className="space-y-4">
          <p className="font-mono text-xs tracking-widest text-moss/70">NERVOUS SYSTEM</p>
          <Field label="ANYTHING TO NOTE — E.G. STRESS, ANXIETY, HEADACHES, SLEEP, MEMORY">
            <textarea rows={3} className={inputClass} value={form.nervousSystemNotes} onChange={(e) => update('nervousSystemNotes', e.target.value)} />
          </Field>
          <RatingScale label="RATE YOUR STRESS LEVELS" lowLabel="Low" highLabel="High" value={form.stressLevel} onChange={(v) => update('stressLevel', v)} />
          <RatingScale label="HOW HAPPY ARE YOU?" lowLabel="Not at all" highLabel="Very happy" value={form.happinessLevel} onChange={(v) => update('happinessLevel', v)} />
          <RatingScale label="HOW PEACEFUL ARE YOU?" lowLabel="Not at all" highLabel="Very peaceful" value={form.peacefulnessLevel} onChange={(v) => update('peacefulnessLevel', v)} />
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-ink/80">
            <input required type="checkbox" className="mt-1" checked={form.consentGiven} onChange={(e) => update('consentGiven', e.target.checked)} />
            I confirm this information is accurate to the best of my knowledge, and I consent to Makéda Health holding it in line with the Privacy Policy.
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="FULL NAME (AS SIGNATURE)"><input required className={inputClass} value={form.signature} onChange={(e) => update('signature', e.target.value)} /></Field>
            <Field label="DATE"><input required type="date" className={inputClass} value={form.signedDate} onChange={(e) => update('signedDate', e.target.value)} /></Field>
          </div>
        </div>

        {error && <p className="text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">{error}</p>}

        <button type="submit" disabled={submitting} className="bg-moss text-linen px-8 py-3 rounded text-sm disabled:opacity-50">
          {submitting ? 'Saving…' : 'Save form'}
        </button>
      </form>
    </div>
  )
}
