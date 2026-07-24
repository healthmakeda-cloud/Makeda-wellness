import ImagePlaceholder from '../components/ImagePlaceholder.jsx'
import { locations } from '../data/locations.js'

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">CONTACT</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-8">Book a session</h1>

      <p className="text-ink/70 mb-10 max-w-xl">
        [Replace with the real booking flow — a phone number, email, or embedded booking widget from
        makedah.com. New clients should complete the Your health journey form before their first session.]
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
