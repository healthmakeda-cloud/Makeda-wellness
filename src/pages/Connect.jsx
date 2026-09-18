import { Link } from 'react-router-dom'
import { socialLinks } from '../data/socialLinks.js'
import SocialIcon from '../components/SocialIcon.jsx'
import MakedaMethodModule from '../components/MakedaMethodModule.jsx'
import RootDivider from '../components/RootDivider.jsx'

// A standalone "link in bio" style landing page for social media traffic —
// a short version of the Home page's opening, plus the Method module,
// followed by the quick action buttons and social links.
export default function Connect() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="/images/logo-circle.png"
            alt="Makéda's Health"
            className="h-16 w-16 rounded-full mb-6"
          />
          <p className="font-mono text-xs tracking-widest text-ochre mb-4">MEDICAL HERBALIST · COLON HYDROTHERAPIST</p>
          <h1 className="font-display text-3xl md:text-4xl text-moss leading-tight">
            The gut is the root.
            <br />Everything else grows from it.
          </h1>
          <p className="mt-6 text-ink/80 max-w-md italic">
            The Makéda Method™ helps people tell their health story — personalised,
            evidence-informed, whole-person care.
          </p>
        </div>
        <img
          src="/images/connect-hero.jpg"
          alt="Makéda Hemans with a client during a herbal medicine consultation"
          className="w-full aspect-[4/3] object-cover object-top rounded-xl"
        />
      </section>

      <div className="max-w-2xl mx-auto px-6 pb-10">
        <MakedaMethodModule />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <RootDivider />
      </div>

      <section className="max-w-sm mx-auto px-6 py-10 text-center">
        <Link
          to="/client-intake"
          className="block bg-moss text-linen px-6 py-4 rounded-xl font-body text-sm mb-3 hover:bg-ink transition-colors"
        >
          Start Your Health Journey →
        </Link>
        <Link
          to="/contact"
          className="block border border-moss text-moss px-6 py-4 rounded-xl font-body text-sm mb-3 hover:bg-moss/5 transition-colors"
        >
          Book a Consultation
        </Link>
        <Link
          to="/shop"
          className="block border border-moss text-moss px-6 py-4 rounded-xl font-body text-sm mb-8 hover:bg-moss/5 transition-colors"
        >
          Shop
        </Link>

        <div className="flex justify-center gap-4 text-moss">
          {socialLinks.map((s) => (
            <SocialIcon key={s.label} label={s.label} href={s.href} path={s.path} size="lg" />
          ))}
        </div>
      </section>
    </div>
  )
}
