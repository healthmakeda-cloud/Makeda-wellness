import ImagePlaceholder from '../components/ImagePlaceholder.jsx'
import { locations, generalAvailabilityNote } from '../data/locations.js'

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">CONTACT</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-4">Book a session</h1>

      <p className="text-ink/70 mb-3 max-w-xl">
        Makéda practises across three South London clinics, each with its own availability and booking
        process. New clients should complete the Your health journey form before their first session.
      </p>
      <p className="font-mono text-xs tracking-wide text-ochre mb-10">{generalAvailabilityNote}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.name} className="bg-cream border border-moss/10 rounded-xl overflow-hidden flex flex-col">
            {loc.image ? (
              <img src={loc.image} alt={loc.name} className="w-full aspect-[4/3] object-cover" />
            ) : (
              <ImagePlaceholder className="aspect-[4/3]" label="Photo coming soon" tone="linen" variant={loc.variant} />
            )}
            <div className="p-5 flex flex-col flex-1">
              <h2 className="font-display text-lg text-moss">{loc.name}</h2>
              <p className="text-xs font-mono text-ochre mb-3">{loc.area.toUpperCase()}</p>

              {loc.services && <p className="text-sm text-ink/80 mb-3">{loc.services}</p>}

              <div className="text-sm text-ink/70 space-y-1 flex-1">
                <p><span className="font-mono text-xs text-moss/60">HOURS</span><br />{loc.hours}</p>
                <p className="pt-2"><span className="font-mono text-xs text-moss/60">BOOKING</span><br />{loc.booking}</p>
                {loc.onlineNote && <p className="pt-1 text-ochre">{loc.onlineNote}</p>}
              </div>

              {loc.bookingUrl && (
                <a
                  href={loc.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-moss text-linen text-xs px-4 py-2.5 rounded text-center hover:bg-ink transition-colors"
                >
                  Book online ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
