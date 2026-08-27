// Sends the acknowledgement email after a client submits their health story.
//
// Called from the browser right after a successful save. Deliberately does
// not require the admin password, because clients submit this themselves —
// but it only ever sends to the address given, and contains no clinical
// detail, so there's nothing sensitive to leak.

import { sendEmail, intakeConfirmationEmail } from './_send-email.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { email, firstName, hasFlags } = req.body || {}

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(400).json({ error: 'Valid email required' })
    return
  }

  const { subject, html, text } = intakeConfirmationEmail({
    firstName,
    hasFlags: Boolean(hasFlags)
  })

  const result = await sendEmail({ to: email, subject, html, text })

  // Always return 200 — a failed confirmation email must never make the
  // client think their form didn't save.
  res.status(200).json({ sent: result.ok })
}
