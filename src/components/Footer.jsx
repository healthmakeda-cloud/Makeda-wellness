import { locations } from '../data/locations.js'
import { socialLinks } from '../data/socialLinks.js'
import SocialIcon from './SocialIcon.jsx'

export default function Footer() {
  return (
    <footer className="bg-sage text-linen mt-32">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="flex flex-col gap-3">
          <img src="/images/logo-circle.png" alt="Makéda's Health" className="h-16 w-16 rounded-full" />
          <p className="text-sm text-linen/80 max-w-xs">
            Herbal medicine and colon hydrotherapy for the gut, considered as the root of wellbeing.
          </p>
          <div className="flex gap-2 mt-1">
            {socialLinks.map((s) => (
              <SocialIcon key={s.label} label={s.label} href={s.href} path={s.path} />
            ))}
          </div>
        </div>

        <div>
          <a href="/contact" className="font-mono text-xs tracking-widest text-amber mb-3 block hover:text-linen transition-colors">
            CLINIC LOCATIONS
          </a>
          <ul className="space-y-1 text-sm text-linen/80">
            {locations.map((loc) => (
              <li key={loc.name}>
                <a href="/contact" className="hover:text-amber transition-colors">
                  {loc.name} — {loc.area}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <a href="/contact" className="font-mono text-xs tracking-widest text-amber mb-3 block hover:text-linen transition-colors">
            GET IN TOUCH
          </a>
          <ul className="space-y-1 text-sm text-linen/80">
            <li><a href="/contact" className="hover:text-amber transition-colors">Contact &amp; booking</a></li>
            <li><a href="/client-intake" className="hover:text-amber transition-colors">Your health journey</a></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest text-amber mb-3">MORE</p>
          <ul className="space-y-1 text-sm text-linen/80">
            <li><a href="/services" className="hover:text-amber transition-colors">All services</a></li>
            <li><a href="/members" className="hover:text-amber transition-colors">Members</a></li>
            <li><a href="/vlog" className="hover:text-amber transition-colors">Vlog</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-linen/20 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-linen/70 font-mono">
        <span>© {new Date().getFullYear()} Makeda Hemans. All rights reserved.</span>
        <a href="/privacy" className="hover:text-amber underline underline-offset-2 transition-colors">Privacy &amp; GDPR</a>
        <a href="#" className="hover:text-amber underline underline-offset-2 transition-colors">Insurance</a>
      </div>
    </footer>
  )
}
