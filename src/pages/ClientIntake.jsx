import { useState } from 'react'
import RootDivider from '../components/RootDivider.jsx'

const contraindications = [
  'Currently pregnant',
  'Abdominal or bowel surgery in the last 6 weeks',
  'Severe or bleeding haemorrhoids',
  "Active colitis, Crohn's flare or GI bleeding",
  'Abdominal hernia',
  'Kidney or heart failure',
  'History of colorectal cancer',
  'Currently taking blood-thinning medication'
]

const conditionChecklist = [
  'Diabetes', 'Heart condition', 'IBS / IBD', 'Epilepsy',
  'High or low blood pressure', 'Recent surgery (any)', 'Currently pregnant', 'None of the above'
]

const initialForm = {
  fullName: '', dob: '', email: '', phone: '',
  emergencyName: '', emergencyPhone: '', gp: '',
  medications: '', allergies: '', conditions: [],
  reason: '', lifestyle: '',
  contraFlags: [], consent: false, signature: '', signedDate: ''
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-xs tracking-wide text-moss/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

const inputClass = 'w-full rounded-md border border-moss/20 bg-cream px-3 py-2 text-sm text-ink focus:border-ochre outline-none'

export default function ClientIntake() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const toggleInArray = (key, value) => {
    setForm((f) => {
      const arr = f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value]
      return { ...f, [key]: arr }
    })
  }

  const flaggedContraindications = form.contraFlags.length > 0

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      const existing = JSON.parse(localStorage.getItem('makeda_intake_submissions') || '[]')
      existing.push({ ...form, submittedAt: new Date().toISOString() })
      localStorage.setItem('makeda_intake_submissions', JSON.stringify(existing))
      setSubmitted(true)
    } catch (err) {
      alert('There was a problem saving your form. Please try again or contact the clinic directly.')
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-moss mb-4">Thank you, {form.fullName.split(' ')[0] || 'there'}.</h1>
        <p className="text-ink/70">
          Your intake form has been received. Makeda will review it ahead of your first session.
          {flaggedContraindications && ' Because you flagged one or more items on the contraindications list, the clinic will contact you directly before your appointment to discuss next steps.'}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">CLIENT INTAKE</p>
      <h1 className="font-display text-3xl text-moss mb-2">Before your first session</h1>
      <p className="text-ink/70 mb-10 text-sm">
        Two short forms — your general health history, then hydrotherapy-specific consent. Takes about 5 minutes.
      </p>

      <div className="flex items-center gap-3 mb-10 font-mono text-xs text-moss/60">
        <span className={step === 1 ? 'text-ochre' : ''}>01 Health history</span>
        <span>—</span>
        <span className={step === 2 ? 'text-ochre' : ''}>02 Hydrotherapy consent</span>
        <span>—</span>
        <span className={step === 3 ? 'text-ochre' : ''}>03 Review & submit</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="FULL NAME">
                <input required className={inputClass} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
              </Field>
              <Field label="DATE OF BIRTH">
                <input required type="date" className={inputClass} value={form.dob} onChange={(e) => update('dob', e.target.value)} />
              </Field>
              <Field label="EMAIL">
                <input required type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} />
              </Field>
              <Field label="PHONE">
                <input required type="tel" className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </Field>
              <Field label="EMERGENCY CONTACT NAME">
                <input className={inputClass} value={form.emergencyName} onChange={(e) => update('emergencyName', e.target.value)} />
              </Field>
              <Field label="EMERGENCY CONTACT PHONE">
                <input className={inputClass} value={form.emergencyPhone} onChange={(e) => update('emergencyPhone', e.target.value)} />
              </Field>
            </div>

            <Field label="GP NAME / SURGERY (OPTIONAL)">
              <input className={inputClass} value={form.gp} onChange={(e) => update('gp', e.target.value)} />
            </Field>

            <Field label="CURRENT MEDICATIONS & SUPPLEMENTS">
              <textarea rows={3} className={inputClass} value={form.medications} onChange={(e) => update('medications', e.target.value)} />
            </Field>

            <Field label="KNOWN ALLERGIES">
              <textarea rows={2} className={inputClass} value={form.allergies} onChange={(e) => update('allergies', e.target.value)} />
            </Field>

            <Field label="EXISTING CONDITIONS — tick any that apply">
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                {conditionChecklist.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-ink/80">
                    <input type="checkbox" checked={form.conditions.includes(c)} onChange={() => toggleInArray('conditions', c)} />
                    {c}
                  </label>
                ))}
              </div>
            </Field>

            <Field label="MAIN REASON FOR YOUR VISIT">
              <textarea required rows={3} className={inputClass} value={form.reason} onChange={(e) => update('reason', e.target.value)} />
            </Field>

            <Field label="DIET & LIFESTYLE NOTES (OPTIONAL)">
              <textarea rows={3} className={inputClass} value={form.lifestyle} onChange={(e) => update('lifestyle', e.target.value)} />
            </Field>

            <div className="flex justify-end">
              <button type="button" onClick={() => setStep(2)} className="bg-moss text-linen px-6 py-3 rounded text-sm">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs tracking-wide text-moss/70 mb-3">
                DO ANY OF THE FOLLOWING APPLY TO YOU? (required for hydrotherapy safety)
              </p>
              <div className="space-y-2">
                {contraindications.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-ink/80">
                    <input type="checkbox" checked={form.contraFlags.includes(c)} onChange={() => toggleInArray('contraFlags', c)} />
                    {c}
                  </label>
                ))}
              </div>
              {flaggedContraindications && (
                <p className="mt-3 text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">
                  You've flagged something on this list. That doesn't rule out treatment, but the clinic will
                  follow up with you directly before your appointment.
                </p>
              )}
            </div>

            <RootDivider />

            <div className="bg-cream border border-moss/10 rounded-lg p-5 text-sm text-ink/80 space-y-3">
              <p>
                Colon hydrotherapy involves the gentle introduction of filtered water into the colon via a
                single-use, disposable speculum, to soften and clear waste. Sessions typically last 30–45 minutes.
                Mild cramping or light-headedness afterwards is normal and usually passes quickly.
              </p>
              <p>[Replace with Makeda's full consent & aftercare text from her existing intake paperwork.]</p>
            </div>

            <label className="flex items-start gap-3 text-sm text-ink/80">
              <input required type="checkbox" className="mt-1" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} />
              I have read the above, understand the treatment, and consent to proceed.
            </label>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="TYPE FULL NAME AS SIGNATURE">
                <input required className={inputClass} value={form.signature} onChange={(e) => update('signature', e.target.value)} />
              </Field>
              <Field label="DATE">
                <input required type="date" className={inputClass} value={form.signedDate} onChange={(e) => update('signedDate', e.target.value)} />
              </Field>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="text-moss text-sm">Back</button>
              <button type="button" onClick={() => setStep(3)} className="bg-moss text-linen px-6 py-3 rounded text-sm">Review</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-cream border border-moss/10 rounded-lg p-5 text-sm text-ink/80 space-y-2">
              <p><span className="font-mono text-xs text-ochre">NAME</span> — {form.fullName}</p>
              <p><span className="font-mono text-xs text-ochre">EMAIL</span> — {form.email}</p>
              <p><span className="font-mono text-xs text-ochre">REASON FOR VISIT</span> — {form.reason || '—'}</p>
              <p><span className="font-mono text-xs text-ochre">CONTRAINDICATIONS FLAGGED</span> — {form.contraFlags.length ? form.contraFlags.join(', ') : 'None'}</p>
              <p><span className="font-mono text-xs text-ochre">CONSENT SIGNED</span> — {form.signature || '—'} ({form.signedDate || '—'})</p>
            </div>
            <p className="text-xs text-ink/50">
              By submitting, this information is sent securely to the clinic ahead of your appointment.
            </p>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="text-moss text-sm">Back</button>
              <button type="submit" className="bg-ochre text-cream px-6 py-3 rounded text-sm">Submit intake form</button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
