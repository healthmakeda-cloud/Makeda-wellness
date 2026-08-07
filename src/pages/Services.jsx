import { Link } from 'react-router-dom'
import ImagePlaceholder from '../components/ImagePlaceholder.jsx'
import { services } from '../data/services.js'

export default function Services() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">SERVICES</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-4">Treatments &amp; programmes</h1>
      <p className="text-ink/70 max-w-xl mb-12">
        Every plan starts with a consultation. Book at any of the clinic locations, or start with the
        Your health journey form so your first session begins with full context.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <Link
            key={s.slug}
            to={s.page || `/services/${s.slug}`}
            className="bg-cream border border-moss/10 rounded-xl overflow-hidden block hover:border-ochre/40 transition-colors flex flex-col"
          >
            {s.image ? (
              <img src={s.image} alt={s.title} className="w-full aspect-[4/3] object-cover" />
            ) : (
              <ImagePlaceholder className="aspect-[4/3]" label="" tone="linen" variant={s.artVariant || 'herb'} />
            )}
            <div className="p-5 flex flex-col flex-1">
              <h2 className="font-display text-lg text-moss mb-2">{s.title}</h2>
              <p className="text-sm text-ink/70 flex-1">{s.shortCopy}</p>
              <span className="inline-block mt-4 text-xs font-mono text-ochre">Learn more →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
