import { Link } from 'react-router-dom'
import RootDivider from '../components/RootDivider.jsx'

const features = [
  { title: 'Gentle & effective', copy: 'A gentle method of cleansing and detoxification to support gut health and vitality.' },
  { title: 'ARCH-registered', copy: 'Single-use, disposable equipment, carried out to full professional standard.' },
  { title: 'Rooted in wisdom', copy: 'Combining traditional knowledge with evidence-informed natural healthcare.' },
  { title: 'Whole-person care', copy: 'Often the starting point for a wider treatment plan, not a standalone fix.' }
]

export default function ColonHydrotherapyPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-widest text-ochre mb-4">COLON HYDROTHERAPY</p>
          <h1 className="font-display text-4xl md:text-5xl text-moss leading-tight">
            The gut is the root.
            <br />Everything else grows from it.
          </h1>
          <p className="mt-6 text-ink/80 max-w-md">
            A gentle, ARCH-registered approach to clearing and resetting the gut — often the starting
            point for a wider health picture, working in harmony with herbal medicine to restore balance.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact" className="bg-moss text-linen px-6 py-3 rounded font-body text-sm hover:bg-ink transition-colors">
              Book a session
            </Link>
            <Link to="/herbal-dispensary" className="border border-moss text-moss px-6 py-3 rounded font-body text-sm hover:bg-moss/5 transition-colors">
              Herbal dispensary
            </Link>
          </div>
        </div>
        <img
          src="/images/colon-hydrotherapy.jpg"
          alt="Colon hydrotherapy treatment"
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
          Colon hydrotherapy uses the gentle introduction of filtered water to soften and clear the colon,
          often used to relieve bloating and sluggish digestion, and frequently the starting point for a
          wider cleanse or treatment plan.
        </p>
        <p>
          Every session is ARCH-registered practice, using single-use, disposable equipment throughout.
          Before your first session, a short health history helps rule out anything that would make
          treatment unsuitable — you'll complete this as part of your health journey form.
        </p>
        <div className="pt-4 flex flex-wrap gap-4">
          <Link to="/contact" className="bg-ochre text-cream px-6 py-3 rounded font-body text-sm inline-block">
            Book a session
          </Link>
          <Link to="/client-intake" className="border border-moss text-moss px-6 py-3 rounded font-body text-sm inline-block">
            Start your health journey
          </Link>
        </div>
      </section>
    </div>
  )
}
