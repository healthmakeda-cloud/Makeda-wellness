import ImagePlaceholder from '../components/ImagePlaceholder.jsx'
import { locations } from '../data/locations.js'

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">CONTACT</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-8">Book a session</h1>

      <p className="text-ink/70 mb-10 max-w-xl">
        Brackenbury Health Clinic now takes bookings online directly. For Baldwin's & Co and Cuerpos Beauty,
        [booking details to be confirmed]. New clients should complete the Your health journey form before
        their first session.
      </p>

      <div className="grid sm:grid-cols-2 gap-5">
        {locations.map((loc) => (
          <div key={loc.name} className="bg-cream border border-moss/10 rounded-lg overflow-hidden">
            {loc.image ? (
              <img src={loc.image} alt={loc.name} className="w-full aspect-[16/9] object-cover" />
            ) : (
              <ImagePlaceholder className="aspect-[16/9]" label="" tone="linen" variant={loc.variant} />
            )}
            <div className="p-4">
              <p className="text-sm text-ink/80">{loc.name} — {loc.area}</p>
              {loc.services && <p className="text-xs text-ochre mt-1">{loc.services}</p>}
              {loc.bookingUrl && (
                <a
                  href={loc.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 bg-moss text-linen text-xs px-4 py-2 rounded hover:bg-ink transition-colors"
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
