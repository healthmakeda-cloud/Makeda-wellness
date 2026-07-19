import ImagePlaceholder from '../components/ImagePlaceholder.jsx'

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
        {[
          "Baldwin's & Co — Camberwell",
          'The Light Centre — Clapham',
          'Brackenbury Health Clinic — Hammersmith',
          'Wholistic Wellness Clinic'
        ].map((loc, i) => (
          <div key={loc} className="bg-cream border border-moss/10 rounded-lg overflow-hidden">
            <ImagePlaceholder className="aspect-[16/9]" label="" tone="linen" variant={['berry', 'water', 'herb', 'root'][i % 4]} />
            <div className="p-4 text-sm text-ink/80">{loc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
