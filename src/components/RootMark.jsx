export default function RootMark({ className = 'h-10 w-10', variant = 'light' }) {
  const line = variant === 'light' ? '#2A1E42' : '#EDE4CF'
  const accent = '#C16B3F'

  return (
    <svg viewBox="0 0 380 380" className={className} role="img" aria-label="Makéda Health">
      <path
        d="M110,245 C100,190 100,130 110,110 C130,140 165,165 190,190 C215,165 250,140 270,110 C280,130 280,190 270,245"
        fill="none" stroke={line} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M190,192 C205,200 175,215 190,225 C205,235 177,244 188,251"
        fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round"
      />
      <path d="M110,244 C101,253 92,257 79,267" fill="none" stroke={line} strokeWidth="6" strokeLinecap="round" />
      <path d="M270,244 C279,253 288,257 301,267" fill="none" stroke={line} strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="110" cy="104" rx="16" ry="23" fill={accent} transform="rotate(-18 110 104)" />
      <ellipse cx="270" cy="104" rx="16" ry="23" fill={accent} transform="rotate(18 270 104)" />
    </svg>
  )
}
