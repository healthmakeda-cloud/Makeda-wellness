import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Plain Vercel serverless function (not Next.js) — the Next.js "bodyParser:
// false" config trick doesn't apply here, so we read the raw request stream
// directly. This must stay untouched/unparsed for Stripe's signature check.
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed')
    return
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const rawBody = await readRawBody(req)
  const signature = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    res.status(400).send(`Webhook signature verification failed: ${err.message}`)
    return
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    const { error } = await supabase.from('orders').insert({
      stripe_session_id: session.id,
      product_id: session.metadata?.product_id,
      product_name: session.metadata?.product_name,
      amount_gbp: (session.amount_total || 0) / 100,
      customer_email: session.customer_details?.email,
      status: 'paid'
    })
    if (error) {
      // Log but still return 200 — Stripe will retry on non-2xx, and this
      // is a bookkeeping failure, not a payment failure.
      console.error('Failed to record order:', error.message)
    }
  }

  res.status(200).json({ received: true })
}
