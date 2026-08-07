import Stripe from 'stripe'
import { products } from '../src/data/products.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { productId } = req.body
  const product = products.find((p) => p.id === productId)
  if (!product) {
    res.status(400).json({ error: 'Unknown product' })
    return
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const origin = `https://${req.headers.host}`

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { name: product.name, description: product.description },
          unit_amount: product.priceGBP
        },
        quantity: 1
      }],
      metadata: { product_id: product.id, product_name: product.name },
      success_url: `${origin}/shop/success`,
      cancel_url: `${origin}/shop`
    })
    res.status(200).json({ url: session.url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
