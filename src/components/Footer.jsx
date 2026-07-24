import { locations } from '../data/locations.js'

export default function Footer() {
  return (
    <footer className="bg-moss text-linen mt-32">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <div className="bg-linen rounded-lg p-2 inline-block w-fit">
            <img src="/images/logo-full.jpg" alt="Makéda's Health" className="h-16 w-auto rounded" />
          </div>
          <p className="text-sm text-linen/70 max-w-xs">
            Herbal medicine and colon hydrotherapy for the gut, considered as the root of wellbeing.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest text-ochre mb-3">CLINIC LOCATIONS</p>
          <ul className="space-y-1 text-sm text-linen/80">
            {locations.map((loc) => (
              <li key={loc.name}>{loc.name} — {loc.area}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest text-ochre mb-3">GET IN TOUCH</p>
          <ul className="space-y-1 text-sm text-linen/80">
            <li><a href="/contact" className="hover:text-linen">Contact & booking</a></li>
            <li><a href="/client-intake" className="hover:text-linen">Your health journey</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-linen/10 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-linen/50 font-mono">
        <span>© {new Date().getFullYear()} Makeda Hemans. All rights reserved.</span>
        <a href="/privacy" className="hover:text-linen underline underline-offset-2">Privacy & GDPR</a>
      </div>
    </footer>
  )
}
