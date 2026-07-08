import RootMark from '../components/RootMark.jsx'

export default function Members() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <RootMark className="h-16 w-16 mx-auto mb-6 opacity-60" />
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">MEMBERS</p>
      <h1 className="font-display text-3xl text-moss mb-4">Opening soon</h1>
      <p className="text-ink/70 max-w-md mx-auto">
        A members area for ongoing clients — session notes, follow-up plans and exclusive content — is on
        the way as part of the next build phase.
      </p>
    </div>
  )
}
