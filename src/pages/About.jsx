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

      <h2 className="font-display text-2xl text-moss mb-3">The Makéda Method™</h2>
      <p className="text-ink/70 mb-8 max-w-xl">
        A framework for hearing the full story behind your symptoms — not just treating what's
        in front of us, but understanding the person it belongs to.
      </p>

      <div className="space-y-5 mb-12">
        {[
          { letter: 'M', word: 'Medical history', copy: 'Your full clinical picture — conditions, medications and treatment history.' },
          { letter: 'A', word: 'Anthropological context', copy: 'The cultural and lived context that shapes how you experience health.' },
          { letter: 'K', word: 'Key lifestyle influences', copy: 'Diet, sleep, stress and daily rhythms that support or strain your system.' },
          { letter: 'É', word: 'Emotional wellbeing', copy: "The emotional and mental layer that's inseparable from physical symptoms." },
          { letter: 'D', word: 'Digestive function', copy: "The gut as the root — what's happening beneath the surface." },
          { letter: 'A', word: 'Action plan', copy: 'A personalised, evidence-informed plan built from everything above.' }
        ].map((step) => (
          <div key={step.word} className="flex items-start gap-4">
            <span className="flex-shrink-0 h-9 w-9 rounded-full bg-moss text-linen font-display flex items-center justify-center text-sm">
              {step.letter}
            </span>
            <div>
              <p className="font-display text-moss">{step.word}</p>
              <p className="text-sm text-ink/70">{step.copy}</p>
            </div>
          </div>
        ))}
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
