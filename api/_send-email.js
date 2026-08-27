// Shared email sending helper, used by the intake confirmation and the
// message notification. Uses Resend.
//
// Deliberately fail-soft: if email sending fails, the calling code should
// still succeed. A client's intake form saving matters far more than the
// confirmation email arriving.

const FROM = process.env.EMAIL_FROM || 'Makéda Health <info@makedah.com>'
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'info@makedah.com'
const SITE_URL = process.env.SITE_URL || 'https://makeda-app.vercel.app'

// Brand colours, inlined because email clients strip stylesheets
const GREEN = '#4F754C'
const BROWN = '#3E2B1E'
const ORANGE = '#CC5500'
const LINEN = '#F7F4EE'

function wrap(innerHtml) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:${LINEN};font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LINEN};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:${GREEN};padding:24px 32px;text-align:center;">
              <p style="margin:0;color:${LINEN};font-size:22px;letter-spacing:1px;">MAKÉDA HEALTH</p>
              <p style="margin:4px 0 0;color:${LINEN};opacity:0.8;font-size:12px;font-family:Arial,sans-serif;letter-spacing:2px;">ROOTED HEALING · RESTORED BALANCE</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:${BROWN};font-size:16px;line-height:1.6;">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td style="background:${LINEN};padding:20px 32px;text-align:center;color:${BROWN};font-size:12px;font-family:Arial,sans-serif;">
              <p style="margin:0;opacity:0.7;">Makéda Health · Herbal Medicine &amp; Colon Hydrotherapy</p>
              <p style="margin:6px 0 0;opacity:0.6;">This email is confidential and intended for the named recipient.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function button(label, url) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr><td style="background:${ORANGE};border-radius:6px;">
      <a href="${url}" style="display:inline-block;padding:12px 28px;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;">${label}</a>
    </td></tr>
  </table>`
}

export async function sendEmail({ to, subject, html, text }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email not sent')
    return { ok: false, reason: 'not_configured' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: REPLY_TO,
        subject,
        html,
        text
      })
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('Resend error:', detail)
      return { ok: false, reason: 'send_failed' }
    }
    return { ok: true }
  } catch (err) {
    console.error('Email send threw:', err)
    return { ok: false, reason: 'exception' }
  }
}

export function intakeConfirmationEmail({ firstName, hasFlags }) {
  const name = firstName || 'there'
  const flagNote = hasFlags
    ? `<p style="color:${ORANGE};">Because of one or two things you mentioned, I'll be in touch directly before your appointment to talk them through — nothing to worry about, it's simply how I make sure any treatment is right for you.</p>`
    : ''

  const html = wrap(`
    <p>Dear ${name},</p>
    <p>Thank you for sharing your health story with me. I've received it safely, and I'll read through it properly before we meet.</p>
    ${flagNote}
    <p>Everything you've told me is held in strict confidence and is only ever seen by me and authorised clinic staff.</p>
    <p>You can sign in at any time to see your record, view any prescriptions I prepare for you, and message me directly.</p>
    ${button('Sign in to your account', `${SITE_URL}/members`)}
    <p>If anything changes before we meet, or you remember something you'd like to add, do let me know.</p>
    <p style="margin-top:28px;">Warm wishes,<br><strong>Makéda</strong></p>
  `)

  const text = `Dear ${name},

Thank you for sharing your health story with me. I've received it safely, and I'll read through it properly before we meet.
${hasFlags ? "\nBecause of one or two things you mentioned, I'll be in touch directly before your appointment to talk them through — nothing to worry about, it's simply how I make sure any treatment is right for you.\n" : ''}
Everything you've told me is held in strict confidence and is only ever seen by me and authorised clinic staff.

You can sign in at any time to see your record, view any prescriptions I prepare for you, and message me directly:
${SITE_URL}/members

If anything changes before we meet, or you remember something you'd like to add, do let me know.

Warm wishes,
Makéda`

  return { subject: 'Thank you — your health story has been received', html, text }
}

export function messageNotificationEmail({ firstName }) {
  const name = firstName || 'there'

  const html = wrap(`
    <p>Dear ${name},</p>
    <p>You have a new message from Makéda Health.</p>
    <p>For your privacy, messages are kept inside your secure account rather than sent by email.</p>
    ${button('Read your message', `${SITE_URL}/members`)}
    <p style="margin-top:28px;">Warm wishes,<br><strong>Makéda</strong></p>
  `)

  const text = `Dear ${name},

You have a new message from Makéda Health.

For your privacy, messages are kept inside your secure account rather than sent by email. You can read it here:
${SITE_URL}/members

Warm wishes,
Makéda`

  return { subject: 'You have a new message from Makéda Health', html, text }
}
