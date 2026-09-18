import { Link } from 'react-router-dom'
import { socialLinks } from '../data/socialLinks.js'
import SocialIcon from '../components/SocialIcon.jsx'

// A standalone "link in bio" style landing page — the destination for
// Makéda's social media profile links. Deliberately short and mobile-first,
// since that's how almost everyone will arrive here.
export default function Connect() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-linen">
      <div className="max-w-sm w-full text-center">
        <img
          src="/images/logo-circle.png"
          alt="Makéda's Health"
          className="h-24 w-24 rounded-full mx-auto mb-5"
        />
        <h1 className="font-display text-2xl text-moss mb-1">Makéda Health</h1>
        <p className="text-ochre italic text-sm mb-8">Rooted in nature. Restoring balance.</p>

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
      </div>
    </div>
  )
}
