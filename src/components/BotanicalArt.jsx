const INDIGO = '#2A1E42'
const TERRACOTTA = '#C16B3F'

function HerbSprig() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <path d="M150,250 C148,190 146,130 150,60" fill="none" stroke={INDIGO} strokeWidth="3" strokeLinecap="round" />
      {[70, 105, 140, 175, 210].map((y, i) => (
        <g key={y}>
          <path
            d={`M150,${y} C${i % 2 === 0 ? '115,' + (y - 8) : '185,' + (y - 8)} ${i % 2 === 0 ? '95,' + (y - 22) : '205,' + (y - 22)} ${i % 2 === 0 ? '108,' + (y - 34) : '192,' + (y - 34)}`}
            fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round"
          />
        </g>
      ))}
      <ellipse cx="150" cy="58" rx="6" ry="9" fill={TERRACOTTA} />
    </svg>
  )
}

function RootStudy() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <path d="M150,130 C130,135 118,150 116,172 C114,196 128,214 150,220 C172,214 186,196 184,172 C182,150 170,135 150,130 Z" fill="none" stroke={INDIGO} strokeWidth="3" />
      <path d="M150,220 C146,235 142,248 130,262" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150,220 C150,236 150,250 150,266" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150,220 C154,235 158,248 170,262" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150,130 C150,110 150,95 150,80" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="150" cy="76" rx="7" ry="11" fill={TERRACOTTA} />
    </svg>
  )
}

function WaterLines() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <path d="M60,120 C110,105 140,135 190,120 C215,113 230,118 240,122" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50,155 C100,140 135,168 200,152 C225,146 235,150 250,155" fill="none" stroke={TERRACOTTA} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M65,190 C115,177 145,202 205,188 C222,184 232,187 245,190" fill="none" stroke={INDIGO} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="150" cy="152" r="4" fill={TERRACOTTA} />
    </svg>
  )
}

function BerryBranch() {
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      <path d="M90,230 C120,210 150,190 170,160 C190,130 200,105 205,75" fill="none" stroke={INDIGO} strokeWidth="3" strokeLinecap="round" />
      <circle cx="205" cy="75" r="8" fill={TERRACOTTA} />
      <circle cx="182" cy="102" r="7" fill={TERRACOTTA} />
      <circle cx="160" cy="132" r="6.5" fill={TERRACOTTA} />
      <path d="M170,160 C155,155 140,158 128,170" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="122" cy="176" rx="11" ry="7" fill={INDIGO} transform="rotate(20 122 176)" />
      <path d="M140,200 C128,197 116,200 106,210" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="100" cy="215" rx="10" ry="6.5" fill={INDIGO} transform="rotate(20 100 215)" />
    </svg>
  )
}

const variants = { herb: HerbSprig, root: RootStudy, water: WaterLines, berry: BerryBranch }

export default function BotanicalArt({ variant = 'herb' }) {
  const Component = variants[variant] || HerbSprig
  return <Component />
}
