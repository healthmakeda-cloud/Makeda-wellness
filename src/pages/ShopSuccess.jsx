import { Link } from 'react-router-dom'

export default function ShopSuccess() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-moss mb-4">Thank you for your order</h1>
      <p className="text-ink/70 mb-8">
        Your payment was successful. A confirmation has been sent to Stripe's receipt email, and Makéda's
        clinic will be in touch with next steps for your test kit.
      </p>
      <Link to="/" className="bg-moss text-linen px-6 py-3 rounded text-sm">Back to home</Link>
    </div>
  )
}
