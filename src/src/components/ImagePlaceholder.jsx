import BotanicalArt from './BotanicalArt.jsx'

export default function ImagePlaceholder({ label = 'Photography coming soon', className = 'aspect-[4/5]', tone = 'cream', variant = 'herb' }) {
  const bg = tone === 'linen' ? 'bg-linen' : 'bg-cream'
  return (
    <div className={`relative overflow-hidden rounded-xl ${bg} border border-moss/10 flex items-center justify-center ${className}`}>
      <div className="w-2/3 h-2/3 opacity-80">
        <BotanicalArt variant={variant} />
      </div>
      {label && (
        <span className="absolute bottom-3 right-4 font-mono text-[9px] tracking-widest text-moss/40">
          {label}
        </span>
      )}
    </div>
  )
}
