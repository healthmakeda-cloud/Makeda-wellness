import RootMark from './RootMark.jsx'

export default function Footer() {
  return (
    <footer className="bg-moss text-linen mt-32">
      <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <RootMark className="h-10 w-10" variant="dark" />
          <p className="font-display text-lg">Makéda Health</p>
          <p className="text-sm text-linen/70 max-w-xs">
            Herbal medicine and colon hydrotherapy for the gut, considered as the root of wellbeing.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs tracking-widest text-ochre mb-3">CLINIC LOCATIONS</p>
          <ul className="space-y-1 text-sm text-linen/80">
            <li>Baldwin's & Co — Camberwell</li>
            <li>The Light Centre — Clapham</li>
            <li>Brackenbury Health Clinic — Hammersmith</li>
            <li>Wholistic Wellness Clinic</li>
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
      <div className="border-t border-linen/10 py-5 text-center text-xs text-linen/50 font-mono">
        © {new Date().getFullYear()} Makeda Hemans. All rights reserved.
      </div>
    </footer>
  )
}
