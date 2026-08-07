import { useState } from 'react'
import { products } from '../data/products.js'
import RootDivider from '../components/RootDivider.jsx'
import ImagePlaceholder from '../components/ImagePlaceholder.jsx'

const categories = ['Lab Testing', 'Supplements']

export default function Shop() {
  const [loadingId, setLoadingId] = useState(null)
  const [error, setError] = useState('')

  const handleBuy = async (productId) => {
    setError('')
    setLoadingId(productId)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Something went wrong')
      }
      window.location.href = data.url
    } catch (err) {
      setError('Could not start checkout. Please try again or contact the clinic.')
      setLoadingId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs tracking-widest text-ochre mb-4">SHOP</p>
      <h1 className="font-display text-3xl md:text-4xl text-moss mb-4">Shop</h1>
      <p className="text-ink/70 max-w-xl mb-12">
        Order online — results and next steps will be discussed at your consultation.
        Payment is handled securely by Stripe — Makéda Health never sees or stores your card details.
      </p>

      {error && <p className="mb-6 text-sm text-ochre bg-ochre/10 rounded-md px-3 py-2">{error}</p>}

      {categories.map((cat) => {
        const items = products.filter((p) => p.category === cat)
        if (items.length === 0) return null
        return (
          <div key={cat} className="mb-14">
            <h2 className="font-display text-xl text-moss mb-6">{cat}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {items.map((p) => (
                <div key={p.id} className="bg-cream border border-moss/10 rounded-xl p-6 flex flex-col">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full aspect-[4/3] object-cover rounded-lg mb-4" />
                  ) : (
                    <ImagePlaceholder className="aspect-[4/3] mb-4" label="Photo coming soon" tone="linen" variant="root" />
                  )}
                  <h3 className="font-display text-lg text-moss mb-2">{p.name}</h3>
                  <p className="text-sm text-ink/70 flex-1">{p.description}</p>
                  <div className="flex items-center justify-between mt-5">
                    <span className="font-mono text-sm text-ochre">
                      £{(p.priceGBP / 100).toFixed(0)}
                      {p.priceIsPlaceholder && <span className="text-[10px] text-ink/40 ml-1">(price TBC)</span>}
                    </span>
                    <button
                      onClick={() => handleBuy(p.id)}
                      disabled={loadingId === p.id}
                      className="bg-moss text-linen px-4 py-2 rounded text-sm disabled:opacity-50"
                    >
                      {loadingId === p.id ? 'Redirecting…' : 'Buy now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <RootDivider />

      <p className="text-xs text-ink/50 text-center">
        Questions about what's right for you? <a href="/contact" className="text-ochre">Get in touch</a> before ordering.
      </p>
    </div>
  )
}
