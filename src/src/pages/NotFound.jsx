import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-moss mb-4">Page not found</h1>
      <p className="text-ink/70 mb-8">That page doesn't exist. Let's get you back on track.</p>
      <Link to="/" className="bg-moss text-linen px-6 py-3 rounded text-sm">Back to home</Link>
    </div>
  )
}
