import { locations } from '../data/locations.js'

// Simple inline icons so no extra icon library is needed. Links are
// placeholders ("#") until Makéda has real profile URLs to add.
function SocialIcon({ label, href, path }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="h-8 w-8 rounded-full border border-linen/30 flex items-center justify-center hover:border-amber hover:text-amber transition-colors"
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d={path} /></svg>
    </a>
  )
}

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
            <SocialIcon
              label="LinkedIn"
              href="#"
              path="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.48 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zm7 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.8c0-1.62-.03-3.7-2.26-3.7-2.27 0-2.62 1.77-2.62 3.6V23h-4V8z"
            />
            <SocialIcon
              label="Instagram"
              href="#"
              path="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.76 4.9 4.9 0 01-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.76-1.15 4.9 4.9 0 01-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76a4.9 4.9 0 011.76-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 1.8c-2.67 0-2.99.01-4.04.06-.97.04-1.5.2-1.85.34-.46.18-.79.4-1.14.75-.35.35-.57.68-.75 1.14-.14.35-.3.88-.34 1.85C3.83 9 3.82 9.33 3.82 12s.01 3 .06 4.05c.04.97.2 1.5.34 1.85.18.46.4.79.75 1.14.35.35.68.57 1.14.75.35.14.88.3 1.85.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.97-.04 1.5-.2 1.85-.34.46-.18.79-.4 1.14-.75.35-.35.57-.68.75-1.14.14-.35.3-.88.34-1.85.05-1.05.06-1.37.06-4.05s-.01-3-.06-4.05c-.04-.97-.2-1.5-.34-1.85a3.1 3.1 0 00-.75-1.14 3.1 3.1 0 00-1.14-.75c-.35-.14-.88-.3-1.85-.34C14.99 3.81 14.67 3.8 12 3.8zm0 3.05a5.15 5.15 0 110 10.3 5.15 5.15 0 010-10.3zm0 1.8a3.35 3.35 0 100 6.7 3.35 3.35 0 000-6.7zm5.35-1.99a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"
            />
            <SocialIcon
              label="YouTube"
              href="#"
              path="M23.5 6.5s-.23-1.64-.94-2.36c-.9-.94-1.9-.95-2.36-1C17 3 12 3 12 3h-.01s-5 0-8.19.14c-.46.05-1.46.06-2.36 1C.74 4.86.5 6.5.5 6.5S.26 8.42.26 10.35v1.8c0 1.93.24 3.85.24 3.85s.24 1.64.94 2.36c.9.94 2.09.9 2.62 1.01C6 19.6 12 19.65 12 19.65s5.01-.01 8.2-.15c.46-.05 1.46-.06 2.36-1 .71-.72.94-2.36.94-2.36s.24-1.92.24-3.85v-1.8c0-1.93-.24-3.85-.24-3.85zM9.75 14.5v-6l6 3.01-6 2.99z"
            />
          </div>
        </div>

        <div>
          <a href="/contact" className="font-mono text-xs tracking-widest text-amber mb-3 block hover:text-linen transition-colors">
            CLINIC LOCATIONS
          </a>
          <ul className="space-y-1 text-sm text-linen/80">
            {locations.map((loc) => (
              <li key={loc.name}>
                <a
                  href={loc.bookingUrl || '/contact'}
                  target={loc.bookingUrl ? '_blank' : undefined}
                  rel={loc.bookingUrl ? 'noopener noreferrer' : undefined}
                  className="hover:text-amber transition-colors"
                >
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
