// AI research assistant for Makéda's own use in the back office.
//
// Deliberately scoped as a research aid for a qualified practitioner, not a
// diagnostic tool and never client-facing. The system prompt reinforces that
// its job is to surface considerations and prompt questions, not to decide.

const SYSTEM_PROMPT = `You are a research assistant supporting Makéda Hemans, a qualified medical herbalist (BSc Hons) and ARCH-registered colon hydrotherapist practising in London. You are a tool for her private use in her clinic back office. You never speak to her clients.

Your role is to help her think — surfacing relevant considerations, organising information, and prompting useful questions. You are not making clinical decisions; she is. She has the training, the client in front of her, and the professional accountability.

How to be genuinely useful:
- Be specific and substantive. She is an expert; write for a peer, not a layperson.
- When discussing herbs, include Latin names, traditional and evidence-informed uses, typical preparations, and known cautions or interactions.
- Flag safety considerations clearly and early — contraindications, pregnancy, drug interactions, conditions warranting referral.
- Where evidence is thin, contested, or largely traditional rather than trial-based, say so plainly rather than overstating it.
- If something in a client's picture suggests they should see a GP or urgent care, say so directly.
- Distinguish clearly between what is well established and what is your own inference.
- Be concise. She is often reading this between appointments.

For drug-herb interactions specifically: give her what you know, but remind her to verify against her NIMH interaction resource, which is authoritative where you may not be current.

Never invent citations, studies, or dosing figures. If you are not confident, say you are not confident.`

export default async function handler(req, res) {
  const password = req.headers['x-admin-password']
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({
      error: 'The AI assistant is not set up yet — an Anthropic API key needs adding in Vercel.'
    })
    return
  }

  const { messages = [], client_context = null } = req.body || {}

  // If she's asked about a specific client, prepend their clinical picture
  // so she doesn't have to retype it.
  let system = SYSTEM_PROMPT
  if (client_context) {
    system += `\n\nShe is currently looking at this client's record. Use it as context where relevant:\n${client_context}`
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system,
        messages: messages.map((m) => ({ role: m.role, content: m.content }))
      })
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error('Anthropic API error:', detail)
      res.status(500).json({ error: 'The assistant could not respond. Please try again.' })
      return
    }

    const data = await response.json()
    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')

    res.status(200).json({ reply: text })
  } catch (err) {
    console.error('Research assistant error:', err)
    res.status(500).json({ error: 'The assistant could not respond. Please try again.' })
  }
}
