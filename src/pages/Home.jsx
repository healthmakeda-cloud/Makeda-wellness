import { Link } from 'react-router-dom'
import RootDivider from '../components/RootDivider.jsx'
import ImagePlaceholder from '../components/ImagePlaceholder.jsx'
import { services } from '../data/services.js'

const testimonials = [
  { quote: 'Add a real client testimonial here from makedah.com.', name: 'Client, Camberwell' },
  { quote: 'Add a second testimonial here — keep it short.', name: 'Client, Clapham' }
]

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-widest text-ochre mb-4">MEDICAL HERBALIST · COLON HYDROTHERAPIST</p>
          <h1 className="font-display text-4xl md:text-5xl text-moss leading-tight">
            The gut is the root.
            <br />Everything else grows from it.
          </h1>
          <p className="mt-6 text-ink/80 max-w-md italic">
            The Makéda Method™ helps people tell their health story — enabling personalised,
            evidence-informed, whole-person care that honours each individual's cultural
            heritage and lived experience. <Link to="/about" className="text-ochre not-italic">See the method →</Link>
          </p>
          <p className="mt-4 text-ink/80 max-w-md">
            Makéda Hemans combines herbal medicine and colon hydrotherapy across three London clinics,
            working from the gut outward to support lasting change.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/client-intake" className="bg-moss text-linen px-6 py-3 rounded font-body text-sm hover:bg-ink transition-colors">
              Start your health journey
            </Link>
            <Link to="/services" className="border border-moss text-moss px-6 py-3 rounded font-body text-sm hover:bg-moss/5 transition-colors">
              View services
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <img src="/icons/icon-512.png" alt="Makéda's Health mark" className="h-64 w-64" />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <img
          src="/images/home-banner.jpg"
          alt="Hands gathering fresh herbs into a bowl, morning light"
          className="w-full aspect-[21/9] object-cover rounded-xl"
        />
      </div>

      <RootDivider />

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-moss mb-10">Ways to work together</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {services.slice(0, 4).map((s) => (
            <Link
              key={s.slug}
              to={`/services/${s.slug}`}
              className="bg-cream border border-moss/10 rounded-xl p-6 block hover:border-ochre/40 transition-colors"
            >
              {s.image ? (
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full aspect-[16/9] object-cover rounded-lg mb-4"
                />
              ) : (
                <ImagePlaceholder className="aspect-[16/9] mb-4" label="" tone="linen" variant="herb" />
              )}
              <h3 className="font-display text-lg text-moss mb-2">{s.title}</h3>
              <p className="text-sm text-ink/70">{s.shortCopy}</p>
              <span className="inline-block mt-3 text-xs font-mono text-ochre">Learn more →</span>
            </Link>
          ))}
        </div>
        <Link to="/services" className="inline-block mt-8 text-sm font-mono tracking-wide text-ochre hover:text-moss">
          See full service details →
        </Link>
      </section>

      <RootDivider />

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display text-2xl text-moss mb-10">What clients say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <blockquote key={t.name} className="border-l-2 border-sage pl-6">
              <p className="font-display text-lg text-ink italic">"{t.quote}"</p>
              <cite className="block mt-3 font-mono text-xs text-ochre not-italic">{t.name}</cite>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  )
}
