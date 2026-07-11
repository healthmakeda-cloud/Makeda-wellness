import RootDivider from '../components/RootDivider.jsx'
import ImagePlaceholder from '../components/ImagePlaceholder.jsx'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">ABOUT</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-8">Makéda</h1>

      <div className="grid md:grid-cols-[1fr_260px] gap-10">
        <div className="space-y-5 text-ink/80 leading-relaxed">
          <p>
            Makeda is a BSc (Hons) medical herbalist and ARCH-registered colon hydrotherapist based in South
            London. Her practice sits at the meeting point of traditional herbal medicine and modern gut-health
            testing — treating the two as one conversation rather than separate disciplines.
          </p>
          <p>
            [Replace this paragraph with Makeda's own story — training background, what led her to this work,
            and the philosophy behind treating the gut as the root of wider health. Pull this directly from her
            existing About page copy on makedah.com.]
          </p>
          <p>
            She currently sees clients across four South London clinics, offering one-to-one consultations,
            hydrotherapy sessions, herbal prescriptions and guided cleanse programmes.
          </p>
        </div>
        <ImagePlaceholder className="aspect-[3/4]" label="Portrait coming soon" variant="root" />
      </div>

      <RootDivider />

      <h2 className="font-display text-2xl text-moss mb-6">Where to find her</h2>
      <ul className="grid sm:grid-cols-2 gap-4 text-sm text-ink/80">
        <li className="bg-cream border border-moss/10 rounded-lg p-4">Baldwin's & Co — Camberwell</li>
        <li className="bg-cream border border-moss/10 rounded-lg p-4">The Light Centre — Clapham</li>
        <li className="bg-cream border border-moss/10 rounded-lg p-4">Brackenbury Health Clinic — Hammersmith</li>
        <li className="bg-cream border border-moss/10 rounded-lg p-4">Wholistic Wellness Clinic</li>
      </ul>
    </div>
  )
}
