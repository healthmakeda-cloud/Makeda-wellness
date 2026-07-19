import RootDivider from '../components/RootDivider.jsx'

const services = [
  {
    title: 'Colon hydrotherapy',
    copy: 'A gentle, water-based treatment that cleanses the colon, often used to relieve bloating, sluggish digestion and to support a wider detox or cleanse programme. ARCH-registered practice, single-use equipment.'
  },
  {
    title: 'Herbal medicine consultations',
    copy: 'A full case history is taken before any prescription is made. Remedies are tailored to your constitution and current health picture, not prescribed generically.'
  },
  {
    title: 'Aromatherapy massage',
    copy: 'Therapeutic massage using essential oil blends chosen to support your treatment goals — relaxation, circulation, or recovery.'
  },
  {
    title: 'Cleanse programmes',
    copy: 'Structured 7, 15 or 30-day programmes combining diet guidance, herbal support and a course of hydrotherapy sessions.'
  },
  {
    title: 'Gut & lab testing',
    copy: 'Candida, food sensitivity, DNA diet & lifestyle mapping, parasitology, and microbiome testing — used to guide the herbal and dietary plan. Full pricing and online ordering are coming to the shop area shortly.'
  }
]

export default function Services() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">SERVICES</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-4">Treatments & programmes</h1>
      <p className="text-ink/70 max-w-xl mb-12">
        Every plan starts with a consultation. Book at any of the four clinic locations, or start with the
        Your health journey form so your first session begins with full context.
      </p>

      <div className="space-y-10">
        {services.map((s, i) => (
          <div key={s.title}>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-ochre">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="font-display text-xl text-moss">{s.title}</h2>
            </div>
            <p className="mt-2 ml-9 text-sm text-ink/70 max-w-2xl">{s.copy}</p>
            {i < services.length - 1 && <div className="ml-9 mt-6"><RootDivider /></div>}
          </div>
        ))}
      </div>
    </div>
  )
}
