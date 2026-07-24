import { useState, useEffect } from 'react'
import RootDivider from '../components/RootDivider.jsx'
import MedicineSelector from '../components/MedicineSelector.jsx'
import { supabase } from '../lib/supabaseClient.js'

const cardiovascularFlags = ['Severe cardiac disease', 'High blood pressure', 'Severe anaemia']
const genitourinaryFlags = ['Renal insufficiency / dialysis']
const gastrointestinalFlags = ['Severe haemorrhoids', 'Colon or rectum cancer', 'Severe liver disease', 'Fistulas or fissures']
const musculoskeletalFlags = ['Abdominal or inguinal hernia']
const menopauseSymptomsList = [
  'Hot flushes', 'Night sweats', 'Dizziness', 'Brain fog', 'Weight gain',
  'Hair loss', 'Mood changes', 'Sleep disturbance', 'Joint pain', 'Low libido'
]

const DRAFT_KEY = 'makeda_intake_draft'

const initialForm = {
  firstName: '', surname: '', dob: '', sex: '', address: '', postcode: '',
  email: '', mobile: '', landline: '',
  gpName: '', gpTel: '', gpAddress: '', gpPostcode: '', gpContactConsent: false,
  descriptionOfAilment: '', existingOrNew: '',
  medicationsSelected: [], medicationsOther: '', medicationsOtherChecked: false,
  hadRecentSurgery: '', surgeriesLast3Months: '',
  respiratoryGate: '', respiratoryNotes: '',
  cardiovascularGate: '', cardiovascularNotes: '', cardiovascularFlags: [],
  genitourinaryGate: '', genitourinaryNotes: '', genitourinaryFlags: [],
  gastrointestinalGate: '', gastrointestinalNotes: '', gastrointestinalFlags: [],
  dermatologicalGate: '', dermatologicalNotes: '',
  musculoskeletalGate: '', musculoskeletalNotes: '', musculoskeletalFlags: [],
  womenPainfulPeriods: false, womenLastPeriodDate: '', womenVaginalDischarge: false,
  womenThrush: false, womenPregnant: false, womenComplicatedPregnancy: false,
  menopauseStatus: '', menopauseSymptoms: [],
  menProstateProblems: false, menTesticularPain: false, menErectileDifficulties: false,
  menLowLibido: false, menFertilityConcerns: false,
  bowelDaily: false, bowelNumberPerDay: '', bowelDifficulty: false, bowelConsistency: '', bowelFlatulence: false,
  dietVegetarianVegan: false, dietFoodCravings: false, dietFoodCravingsDetail: '',
  dietDailyFluidIntake: '', dietEatingDisorder: false,
  consentGiven: false, chConsentGiven: false, signature: '', signedDate: '',
  servicesInterested: []
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="font-mono text-xs tracking-wide text-moss/70">{label}</span>
      {hint && <span className="block text-xs text-ink/50 italic mt-0.5 font-body tracking-normal">{hint}</span>}
      <div className="mt-1">{children}</div>
    </label>
  )
}

const inputClass = 'w-full rounded-md border border-moss/20 bg-cream px-3 py-2 text-sm text-ink focus:border-ochre outline-none'

function YesNo({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink/80">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

function FlagGroup({ title, gateKey, notesKey, flagsKey, flags, form, update, toggleFlag, hint }) {
  const setGate = (value) => {
    update(gateKey, value)
    if (value === 'no') {
      update(notesKey, '')
      update(flagsKey, [])
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-moss/70">{title}</p>
          {hint && <p className="text-xs text-ink/40 italic mt-0.5">{hint}</p>}
        </div>
        <select
          className="rounded-md border border-moss/20 bg-cream px-2 py-1.5 text-sm text-ink"
          value={form[gateKey]}
          onChange={(e) => setGate(e.target.value)}
        >
          <option value="">Select</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      {form[gateKey] === 'yes' && (
        <div className="mt-3">
          <textarea
            rows={2}
            placeholder="Please give details"
            className={inputClass}
            value={form[notesKey]}
            onChange={(e) => update(notesKey, e.target.value)}
          />
          {flags.length > 0 && (
            <div className="mt-2 space-y-1">
              {flags.map((f) => (
                <label key={f} className="flex items-center gap-2 text-sm text-ochre">
                  <input type="checkbox" checked={form[flagsKey].includes(f)} onChange={() => toggleFlag(flagsKey, f)} />
                  {f}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ClientIntake() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Restore an in-progress draft (covers accidental refresh / navigating away),
  // and set up a baseline history entry so the back button can step backward
  // through the form instead of leaving the page and losing everything.
  useEffect(() => {
    let restoredStep = 1
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.form) setForm(parsed.form)
        if (parsed.step) {
          restoredStep = parsed.step
          setStep(parsed.step)
        }
      }
    } catch (err) {
      // ignore a corrupt draft
    }
    window.history.replaceState({ step: restoredStep }, '', window.location.pathname)

    const handlePopState = (e) => {
      if (e.state && e.state.step) setStep(e.state.step)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Keep the draft saved as they go, and scroll to the top on every step change
  // (mobile browsers otherwise leave you scrolled halfway down the previous step).
  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form, step }))
  }, [form])

  const goToStep = (n) => {
    window.history.pushState({ step: n }, '', window.location.pathname)
    setStep(n)
  }

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const toggleFlag = (key, value) => {
    setForm((f) => {
      const arr = f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value]
      return { ...f, [key]: arr }
    })
  }

  const anyFlags = [
    ...form.cardiovascularFlags, ...form.genitourinaryFlags,
    ...form.gastrointestinalFlags, ...form.musculoskeletalFlags,
    ...(form.womenComplicatedPregnancy ? ['Complicated pregnancy'] : [])
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!supabase) {
      setError('The form cannot be submitted yet — the site is not connected to a database. Please contact the clinic directly.')
      return
    }

    setSubmitting(true)
    const { error: insertError } = await supabase.from('intake_submissions').insert({
      first_name: form.firstName, surname: form.surname, dob: form.dob || null, sex: form.sex,
      address: form.address, postcode: form.postcode, email: form.email, mobile: form.mobile, landline: form.landline,
      gp_name: form.gpName, gp_tel: form.gpTel, gp_address: form.gpAddress, gp_postcode: form.gpPostcode,
      gp_contact_consent: form.gpContactConsent,
      description_of_ailment: form.descriptionOfAilment, existing_or_new: form.existingOrNew,
      medications_selected: form.medicationsSelected,
      medications_other: form.medicationsOtherChecked ? form.medicationsOther : '',
      surgeries_last_3_months: form.hadRecentSurgery === 'yes' ? form.surgeriesLast3Months : '',
      respiratory_notes: form.respiratoryNotes,
      cardiovascular_notes: form.cardiovascularNotes, cardiovascular_flags: form.cardiovascularFlags,
      genitourinary_notes: form.genitourinaryNotes, genitourinary_flags: form.genitourinaryFlags,
      gastrointestinal_notes: form.gastrointestinalNotes, gastrointestinal_flags: form.gastrointestinalFlags,
      dermatological_notes: form.dermatologicalNotes,
      musculoskeletal_notes: form.musculoskeletalNotes, musculoskeletal_flags: form.musculoskeletalFlags,
      women_painful_periods: form.womenPainfulPeriods, women_last_period_date: form.womenLastPeriodDate || null,
      women_vaginal_discharge: form.womenVaginalDischarge, women_thrush: form.womenThrush,
      women_pregnant: form.womenPregnant, women_complicated_pregnancy: form.womenComplicatedPregnancy,
      menopause_status: form.menopauseStatus, menopause_symptoms: form.menopauseSymptoms,
      men_prostate_problems: form.menProstateProblems, men_testicular_pain: form.menTesticularPain,
      men_erectile_difficulties: form.menErectileDifficulties, men_low_libido: form.menLowLibido,
      men_fertility_concerns: form.menFertilityConcerns,
      bowel_daily: form.bowelDaily, bowel_number_per_day: form.bowelNumberPerDay,
      bowel_difficulty: form.bowelDifficulty, bowel_consistency: form.bowelConsistency,
      bowel_flatulence: form.bowelFlatulence,
      diet_vegetarian_vegan: form.dietVegetarianVegan, diet_food_cravings: form.dietFoodCravings,
      diet_food_cravings_detail: form.dietFoodCravingsDetail, diet_daily_fluid_intake: form.dietDailyFluidIntake,
      diet_eating_disorder: form.dietEatingDisorder,
      consent_given: form.consentGiven, ch_consent_given: form.chConsentGiven,
      signature: form.signature, signed_date: form.signedDate || null,
      services_interested: form.servicesInterested,
      status: anyFlags.length > 0 ? 'flagged' : 'new'
    })
    setSubmitting(false)

    if (insertError) {
      // Logged for debugging — the message shown to the client stays generic
      // and reassuring, but this tells us exactly what went wrong.
      console.error('Intake submission failed:', insertError)
      setError('There was a problem saving your form. Please try again or contact the clinic directly.')
      return
    }
    sessionStorage.removeItem(DRAFT_KEY)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-moss mb-4">Thank you, {form.firstName || 'there'}.</h1>
        <p className="text-ink/70">
          Your health journey form has been received. Makéda will review it ahead of your first session.
          {anyFlags.length > 0 && ' Because you flagged one or more items on the contraindications list, the clinic will contact you directly before your appointment to discuss next steps.'}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">YOUR HEALTH JOURNEY</p>
      <h1 className="font-display text-3xl text-moss mb-2">Before your first session</h1>
      <p className="text-ink/70 mb-10 text-sm">
        This mirrors the paper form used in clinic — contact and GP details, health history by system, then consent.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-10 font-mono text-xs text-moss/60">
        <span className={step === 1 ? 'text-ochre' : ''}>01 Contact & GP</span>
        <span>—</span>
        <span className={step === 2 ? 'text-ochre' : ''}>02 Health history</span>
        <span>—</span>
        <span className={step === 3 ? 'text-ochre' : ''}>03 Consent & submit</span>
      </div>

      {error && <p className="mb-6 text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-8">
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="FIRST NAME"><input required className={inputClass} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} /></Field>
              <Field label="SURNAME"><input required className={inputClass} value={form.surname} onChange={(e) => update('surname', e.target.value)} /></Field>
              <Field label="DATE OF BIRTH"><input required type="date" className={inputClass} value={form.dob} onChange={(e) => update('dob', e.target.value)} /></Field>
              <Field label="SEX">
                <select required className={inputClass} value={form.sex} onChange={(e) => update('sex', e.target.value)}>
                  <option value="">Select</option>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                </select>
              </Field>
              <Field label="EMAIL"><input required type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} /></Field>
              <Field label="MOBILE"><input required type="tel" className={inputClass} value={form.mobile} onChange={(e) => update('mobile', e.target.value)} /></Field>
              <Field label="LANDLINE (OPTIONAL)"><input className={inputClass} value={form.landline} onChange={(e) => update('landline', e.target.value)} /></Field>
            </div>

            <Field label="ADDRESS"><textarea rows={2} className={inputClass} value={form.address} onChange={(e) => update('address', e.target.value)} /></Field>
            <Field label="POSTCODE"><input className={inputClass} value={form.postcode} onChange={(e) => update('postcode', e.target.value)} /></Field>

            <RootDivider />

            <p className="font-mono text-xs tracking-wide text-moss/50 -mb-2">GP DETAILS (OPTIONAL)</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="GP'S NAME"><input className={inputClass} value={form.gpName} onChange={(e) => update('gpName', e.target.value)} /></Field>
              <Field label="GP'S TELEPHONE"><input className={inputClass} value={form.gpTel} onChange={(e) => update('gpTel', e.target.value)} /></Field>
            </div>
            <Field label="GP'S SURGERY ADDRESS & POSTCODE"><textarea rows={2} className={inputClass} value={form.gpAddress} onChange={(e) => update('gpAddress', e.target.value)} /></Field>
            <label className="flex items-start gap-3 text-sm text-ink/80">
              <input type="checkbox" className="mt-1" checked={form.gpContactConsent} onChange={(e) => update('gpContactConsent', e.target.checked)} />
              I give permission for the clinic to contact my GP if needed. Your GP will not be contacted without this permission.
            </label>

            <div>
              <span className="font-mono text-xs tracking-wide text-moss/70 block mb-1">LIST OF MEDICINES YOU ARE CURRENTLY TAKING</span>
              <MedicineSelector
                selected={form.medicationsSelected}
                onToggle={(item) => toggleFlag('medicationsSelected', item)}
                otherText={form.medicationsOther}
                onOtherChange={(v) => update('medicationsOther', v)}
                otherChecked={form.medicationsOtherChecked}
                onOtherCheckedChange={(v) => update('medicationsOtherChecked', v)}
              />
            </div>

            <div>
              <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">WHICH SERVICE(S) ARE YOU HERE FOR?</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {['Colon Hydrotherapy', 'Herbal Medicine', 'Cleanse Programme', 'Gut & Lab Testing'].map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm text-ink/80">
                    <input type="checkbox" checked={form.servicesInterested.includes(s)} onChange={() => toggleFlag('servicesInterested', s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="YOUR HEALTH STORY" hint="Tell me the story behind your symptoms and how they affect your life.">
                <textarea rows={4} className={inputClass} value={form.descriptionOfAilment} onChange={(e) => update('descriptionOfAilment', e.target.value)} />
              </Field>
              <Field label="EXISTING OR NEW CONDITION">
                <select className={inputClass} value={form.existingOrNew} onChange={(e) => update('existingOrNew', e.target.value)}>
                  <option value="">Select</option>
                  <option value="existing">Existing</option>
                  <option value="new">New</option>
                </select>
              </Field>
            </div>

            <Field label="ANY SURGERIES IN THE LAST 3 MONTHS?">
              <select className={inputClass} value={form.hadRecentSurgery} onChange={(e) => update('hadRecentSurgery', e.target.value)}>
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </Field>
            {form.hadRecentSurgery === 'yes' && (
              <Field label="PLEASE GIVE DETAILS">
                <textarea rows={2} className={inputClass} value={form.surgeriesLast3Months} onChange={(e) => update('surgeriesLast3Months', e.target.value)} />
              </Field>
            )}

            <div className="flex justify-end">
              <button type="button" onClick={() => goToStep(2)} className="bg-moss text-linen px-6 py-3 rounded text-sm">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-xs text-ink/50 italic">
              Items shown in orange are specific conditions the clinic needs to know about before hydrotherapy treatment.
            </p>

            <FlagGroup title="RESPIRATORY — e.g. asthma, shortness of breath" gateKey="respiratoryGate" notesKey="respiratoryNotes" flagsKey="respiratoryFlags" flags={[]} form={form} update={update} toggleFlag={toggleFlag} />
            <FlagGroup title="CARDIOVASCULAR — e.g. high blood pressure, poor circulation, angina" gateKey="cardiovascularGate" notesKey="cardiovascularNotes" flagsKey="cardiovascularFlags" flags={cardiovascularFlags} form={form} update={update} toggleFlag={toggleFlag} />
            <FlagGroup title="GENITOURINARY — e.g. kidney infection, kidney stones" gateKey="genitourinaryGate" notesKey="genitourinaryNotes" flagsKey="genitourinaryFlags" flags={genitourinaryFlags} form={form} update={update} toggleFlag={toggleFlag} />
            <FlagGroup title="GASTROINTESTINAL — e.g. colitis, constipation, liver problems, rectal bleeding" gateKey="gastrointestinalGate" notesKey="gastrointestinalNotes" flagsKey="gastrointestinalFlags" flags={gastrointestinalFlags} form={form} update={update} toggleFlag={toggleFlag} />
            <FlagGroup title="DERMATOLOGICAL — e.g. dry skin, eczema, psoriasis, itching" gateKey="dermatologicalGate" notesKey="dermatologicalNotes" flagsKey="dermatologicalFlags" flags={[]} form={form} update={update} toggleFlag={toggleFlag} />
            <FlagGroup title="MUSCULOSKELETAL — e.g. arthritis, rheumatism, low back pain, swollen joints" gateKey="musculoskeletalGate" notesKey="musculoskeletalNotes" flagsKey="musculoskeletalFlags" flags={musculoskeletalFlags} form={form} update={update} toggleFlag={toggleFlag} />

            <RootDivider />

            {form.sex === 'F' && (
              <>
                <div>
                  <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">WOMEN'S HEALTH</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <YesNo checked={form.womenPainfulPeriods} onChange={(v) => update('womenPainfulPeriods', v)} label="Painful periods" />
                    <YesNo checked={form.womenVaginalDischarge} onChange={(v) => update('womenVaginalDischarge', v)} label="Vaginal discharge" />
                    <YesNo checked={form.womenThrush} onChange={(v) => update('womenThrush', v)} label="Bouts of thrush" />
                    <YesNo checked={form.womenPregnant} onChange={(v) => update('womenPregnant', v)} label="Currently pregnant" />
                  </div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-4">
                    <Field label="LAST PERIOD DATE"><input type="date" className={inputClass} value={form.womenLastPeriodDate} onChange={(e) => update('womenLastPeriodDate', e.target.value)} /></Field>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-ochre mt-2">
                    <input type="checkbox" checked={form.womenComplicatedPregnancy} onChange={(e) => update('womenComplicatedPregnancy', e.target.checked)} />
                    Complicated pregnancy
                  </label>
                </div>

                <RootDivider />

                <div>
                  <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">MENOPAUSE</p>
                  <Field label="STATUS">
                    <select className={inputClass} value={form.menopauseStatus} onChange={(e) => update('menopauseStatus', e.target.value)}>
                      <option value="">Select</option>
                      <option value="pre">Pre-menopausal</option>
                      <option value="peri">Peri-menopausal</option>
                      <option value="post">Post-menopausal</option>
                      <option value="not-applicable">Not applicable</option>
                    </select>
                  </Field>
                  <p className="font-mono text-xs tracking-wide text-moss/70 mt-4 mb-2">SYMPTOMS — tick any that apply</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {menopauseSymptomsList.map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm text-ink/80">
                        <input type="checkbox" checked={form.menopauseSymptoms.includes(s)} onChange={() => toggleFlag('menopauseSymptoms', s)} />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {form.sex === 'M' && (
              <div>
                <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">MEN'S HEALTH</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <YesNo checked={form.menProstateProblems} onChange={(v) => update('menProstateProblems', v)} label="Prostate problems" />
                  <YesNo checked={form.menTesticularPain} onChange={(v) => update('menTesticularPain', v)} label="Testicular pain or swelling" />
                  <YesNo checked={form.menErectileDifficulties} onChange={(v) => update('menErectileDifficulties', v)} label="Erectile difficulties" />
                  <YesNo checked={form.menLowLibido} onChange={(v) => update('menLowLibido', v)} label="Low libido" />
                  <YesNo checked={form.menFertilityConcerns} onChange={(v) => update('menFertilityConcerns', v)} label="Fertility concerns" />
                </div>
              </div>
            )}

            {!form.sex && (
              <p className="text-sm text-ink/50 italic">
                Go back to step 1 and select your sex to see the relevant health questions here.
              </p>
            )}
            <RootDivider />

            <div>
              <p className="font-mono text-xs tracking-wide text-moss/70 mb-2">BOWEL MOVEMENTS & DIET</p>
              <div className="grid sm:grid-cols-2 gap-2">
                <YesNo checked={form.bowelDaily} onChange={(v) => update('bowelDaily', v)} label="Daily bowel movements" />
                <YesNo checked={form.bowelDifficulty} onChange={(v) => update('bowelDifficulty', v)} label="Any difficulty passing" />
                <YesNo checked={form.bowelFlatulence} onChange={(v) => update('bowelFlatulence', v)} label="Flatulence / bloating" />
                <YesNo checked={form.dietVegetarianVegan} onChange={(v) => update('dietVegetarianVegan', v)} label="Vegetarian / vegan" />
                <YesNo checked={form.dietFoodCravings} onChange={(v) => update('dietFoodCravings', v)} label="Food cravings" />
                <YesNo checked={form.dietEatingDisorder} onChange={(v) => update('dietEatingDisorder', v)} label="History of an eating disorder" />
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-4">
                <Field label="NUMBER OF BOWEL MOVEMENTS PER DAY"><input className={inputClass} value={form.bowelNumberPerDay} onChange={(e) => update('bowelNumberPerDay', e.target.value)} /></Field>
                <Field label="AVERAGE CONSISTENCY"><input className={inputClass} value={form.bowelConsistency} onChange={(e) => update('bowelConsistency', e.target.value)} /></Field>
                <Field label="IF FOOD CRAVINGS, WHAT FOR"><input className={inputClass} value={form.dietFoodCravingsDetail} onChange={(e) => update('dietFoodCravingsDetail', e.target.value)} /></Field>
                <Field label="ESTIMATED DAILY FLUID INTAKE"><input className={inputClass} value={form.dietDailyFluidIntake} onChange={(e) => update('dietDailyFluidIntake', e.target.value)} /></Field>
              </div>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => goToStep(1)} className="text-moss text-sm">Back</button>
              <button type="button" onClick={() => goToStep(3)} className="bg-moss text-linen px-6 py-3 rounded text-sm">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            {anyFlags.length > 0 && (
              <p className="text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">
                You've flagged: {anyFlags.join(', ')}. That doesn't automatically rule out treatment, but the clinic
                will follow up with you directly before your appointment.
              </p>
            )}

            <div className="bg-cream border border-moss/10 rounded-lg p-5 text-sm text-ink/80 space-y-3">
              <p>
                My signature below confirms that the information given above is, to the best of my knowledge, true
                and accurate and I have not withheld any information.
              </p>
            </div>

            <label className="flex items-start gap-3 text-sm text-ink/80">
              <input required type="checkbox" className="mt-1" checked={form.consentGiven} onChange={(e) => update('consentGiven', e.target.checked)} />
              I have read and agree to the statement above.
            </label>

            {form.servicesInterested.includes('Colon Hydrotherapy') && (
              <>
                <div className="bg-cream border border-moss/10 rounded-lg p-5 text-sm text-ink/80 space-y-3">
                  <p>
                    Colon hydrotherapy involves the gentle introduction of filtered water into the colon via a
                    single-use, disposable speculum, to soften and clear waste. This may involve a digital
                    examination before treatment. Sessions typically last 30–45 minutes. Mild cramping or
                    light-headedness afterwards is normal and usually passes quickly.
                  </p>
                </div>
                <label className="flex items-start gap-3 text-sm text-ink/80">
                  <input
                    required
                    type="checkbox"
                    className="mt-1"
                    checked={form.chConsentGiven}
                    onChange={(e) => update('chConsentGiven', e.target.checked)}
                  />
                  I understand the colon hydrotherapy procedure described above, including the digital
                  examination, and I consent to it being carried out.
                </label>
              </>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="TYPE FULL NAME AS SIGNATURE"><input required className={inputClass} value={form.signature} onChange={(e) => update('signature', e.target.value)} /></Field>
              <Field label="DATE"><input required type="date" className={inputClass} value={form.signedDate} onChange={(e) => update('signedDate', e.target.value)} /></Field>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => goToStep(2)} className="text-moss text-sm">Back</button>
              <button type="submit" disabled={submitting} className="bg-ochre text-cream px-6 py-3 rounded text-sm disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit health journey form'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
