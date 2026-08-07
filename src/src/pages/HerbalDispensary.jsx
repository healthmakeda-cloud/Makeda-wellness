import { Link } from 'react-router-dom'
import RootDivider from '../components/RootDivider.jsx'

const features = [
  { title: 'Herbal medicine', copy: 'Practitioner-formulated remedies tailored to your unique constitution and health goals.' },
  { title: 'Colon hydrotherapy', copy: 'A gentle, effective method of cleansing and detoxification to support gut health and vitality.' },
  { title: 'Rooted in wisdom', copy: 'Combining traditional knowledge with evidence-informed natural healthcare.' },
  { title: 'Whole-person care', copy: 'Addressing the root causes, not just the symptoms.' }
]

export default function HerbalDispensary() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-widest text-ochre mb-4">HERBAL DISPENSARY</p>
          <h1 className="font-display text-4xl md:text-5xl text-moss leading-tight">
            Every healing journey
            <br />begins with a story.
          </h1>
          <p className="mt-4 text-ink/80 italic">
            Every personalised medicine begins with understanding it.
          </p>
          <p className="mt-6 text-ink/80 max-w-md">
            Our herbal dispensary and colon hydrotherapy services work in harmony to restore balance,
            support natural detoxification, and promote lasting wellbeing.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact" className="bg-moss text-linen px-6 py-3 rounded font-body text-sm hover:bg-ink transition-colors">
              Herbal medicine
            </Link>
            <Link to="/colon-hydrotherapy" className="border border-moss text-moss px-6 py-3 rounded font-body text-sm hover:bg-moss/5 transition-colors">
              Colon hydrotherapy
            </Link>
          </div>
        </div>
        <img
          src="/images/herbal-medicine.jpeg"
          alt="Herbal dispensary bottles and dried herbs"
          className="w-full aspect-square object-cover rounded-xl"
        />
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <RootDivider />
      </div>

      <section className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f) => (
          <div key={f.title} className="text-center">
            <p className="font-display text-moss mb-2">{f.title}</p>
            <p className="text-sm text-ink/70">{f.copy}</p>
          </div>
        ))}
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <RootDivider />
      </div>

      <section className="max-w-2xl mx-auto px-6 py-16 space-y-5 text-ink/80 leading-relaxed">
        <p>
          Every health story is unique, and your herbal prescription should be too. Once your practitioner
          has carefully explored your health story and developed your personalised treatment plan, the next
          step is the Herbal Dispensary — where your bespoke natural medicine is expertly prepared.
        </p>
        <p>
          Most herbal medicines are given as a liquid tincture, taken in 5ml or 7.5ml doses two or three
          times daily. You may also be prescribed a herbal tea, tablets, ointment, cream or lotion.
        </p>
        <p>
          Our Herbal Dispensary is where your health story becomes a bespoke botanical prescription —
          crafted with care, precision and purpose to support your body's natural capacity to restore
          balance and thrive.
        </p>
        <p>
          As your health improves and your needs change, your herbal formula can be refined and adjusted,
          ensuring your treatment evolves alongside your healing journey.
        </p>
        <div className="pt-4">
          <Link to="/contact" className="bg-ochre text-cream px-6 py-3 rounded font-body text-sm inline-block">
            Book a consultation
          </Link>
        </div>
      </section>
    </div>
  )
}
