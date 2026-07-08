import RootMark from './RootMark.jsx'

export default function ImagePlaceholder({ label = 'Photography coming soon', className = 'aspect-[4/5]', tone = 'cream' }) {
  const bg = tone === 'linen' ? 'bg-linen' : 'bg-cream'
  return (
    <div className={`relative overflow-hidden rounded-xl ${bg} border border-moss/10 flex items-center justify-center ${className}`}>
      <RootMark className="h-16 w-16 opacity-25" variant="light" />
      {label && (
        <span className="absolute bottom-3 right-4 font-mono text-[10px] tracking-widest text-moss/50">
          {label}
        </span>
      )}
    </div>
  )
}
