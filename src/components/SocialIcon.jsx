// Shared across the Footer and the social landing page, so both stay
// in sync automatically when a real profile link is added.
export default function SocialIcon({ label, href, path, size = 'sm' }) {
  const dims = size === 'lg' ? 'h-14 w-14' : 'h-8 w-8'
  const iconSize = size === 'lg' ? 24 : 15

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`${dims} rounded-full border border-current flex items-center justify-center hover:opacity-70 transition-opacity`}
    >
      <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="currentColor"><path d={path} /></svg>
    </a>
  )
}
