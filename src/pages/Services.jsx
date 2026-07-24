import { Link } from 'react-router-dom'
import RootDivider from '../components/RootDivider.jsx'
import { services } from '../data/services.js'

export default function Services() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">SERVICES</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-4">Treatments & programmes</h1>
      <p className="text-ink/70 max-w-xl mb-12">
        Every plan starts with a consultation. Book at any of the clinic locations, or start with the
        Your health journey form so your first session begins with full context.
      </p>

      <div className="space-y-10">
        {services.map((s, i) => (
          <div key={s.slug}>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-ochre">{String(i + 1).padStart(2, '0')}</span>
              <Link to={`/services/${s.slug}`} className="font-display text-xl text-moss hover:text-ochre transition-colors">
                {s.title}
              </Link>
            </div>
            <p className="mt-2 ml-9 text-sm text-ink/70 max-w-2xl">{s.shortCopy}</p>
            <Link to={`/services/${s.slug}`} className="ml-9 inline-block mt-2 text-xs font-mono text-ochre">
              Learn more →
            </Link>
            {i < services.length - 1 && <div className="ml-9 mt-6"><RootDivider /></div>}
          </div>
        ))}
      </div>
    </div>
  )
}
