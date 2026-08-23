// AI research assistant for Makéda's own use in the back office.
//
// Two-stage: first searches Europe PMC (a free, public biomedical literature
// database covering PubMed and more) for real, current papers, then hands
// those to the model as grounding. This means answers can cite genuine
// literature with real dates rather than relying on the model's recollection.
//
// Europe PMC is public and needs no API key. If a licensed source (NIMH,
// Natural Medicines) is added later, it slots in alongside searchLiterature
// below without changing anything else.

const SYSTEM_PROMPT = `You are a research assistant supporting Makéda Hemans, a qualified medical herbalist (BSc Hons) and ARCH-registered colon hydrotherapist practising in London. You are a tool for her private use in her clinic back office. You never speak to her clients.

Your role is to help her think — surfacing relevant considerations, organising information, and prompting useful questions. You are not making clinical decisions; she is. She has the training, the client in front of her, and the professional accountability.

How to be genuinely useful:
- Be specific and substantive. She is an expert; write for a peer, not a layperson.
- When discussing herbs, include Latin names, traditional and evidence-informed uses, typical preparations, and known cautions or interactions.
- Flag safety considerations clearly and early — contraindications, pregnancy, drug interactions, conditions warranting referral.
- Where evidence is thin, contested, or largely traditional rather than trial-based, say so plainly rather than overstating it.
- If something in a client's picture suggests they should see a GP or urgent care, say so directly.
- Be concise. She is often reading this between appointments.

CRITICAL — how to handle sources:
- You will sometimes be given real search results from Europe PMC. Only cite papers that appear in those results, using the title, journal and year given.
- NEVER invent a citation, study, author or journal. If you have no supporting paper, say so: "I don't have a specific paper for this — this is general background."
- Clearly separate three things: (1) what the supplied literature actually says, (2) established background knowledge, (3) your own inference.
- Your general knowledge has a training cutoff and may be out of date. Recent safety alerts, withdrawals or guideline changes may have passed you by. Say so when it matters.
- For drug-herb interactions: give her your thinking, but always tell her to verify against her NIMH resource, which is maintained and authoritative where you may not be current.
- For UK regulatory or safety matters, point her to the MHRA (including Drug Safety Update) and NICE, which are public and current.

Never invent dosing figures. If you are not confident, say you are not confident.`

// Pulls the herb/drug terms worth searching for out of her question.
async function extractSearchTerms(question, apiKey) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 150,
        system: `Extract the key searchable terms from a herbal medicine question — herb names (prefer Latin binomials), drug names, and conditions. Reply with ONLY a search query of 2-6 words suitable for a biomedical literature database. No explanation, no quotes. If the question isn't about a specific herb, drug or condition, reply with exactly: NONE`,
        messages: [{ role: 'user', content: question }]
      })
    })
    if (!res.ok) return null
    const data = await res.json()
    const terms = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim()
    return !terms || terms === 'NONE' ? null : terms
  } catch {
    return null
  }
}

// Europe PMC — free, public, no key required. Covers PubMed plus more.
async function searchLiterature(query) {
  try {
    const url = new URL('https://www.ebi.ac.uk/europepmc/webservices/rest/search')
    url.searchParams.set('query', query)
    url.searchParams.set('format', 'json')
    url.searchParams.set('pageSize', '6')
    url.searchParams.set('sort', 'P_PDATE_D desc')   // most recent first

    const res = await fetch(url.toString())
    if (!res.ok) return []
    const data = await res.json()

    return (data.resultList?.result || []).map((p) => ({
      title: p.title,
      journal: p.journalTitle || p.bookOrReportDetails?.publisher || 'Unknown source',
      year: p.pubYear,
      authors: p.authorString,
      doi: p.doi,
      pmid: p.pmid,
      isOpenAccess: p.isOpenAccess === 'Y',
      url: p.doi ? `https://doi.org/${p.doi}` : p.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/` : null
    }))
  } catch {
    return []
  }
}

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

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({
      error: 'The AI assistant is not set up yet — an Anthropic API key needs adding in Vercel.'
    })
    return
  }

  const { messages = [], client_context = null, search_literature = true } = req.body || {}
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || ''

  let papers = []
  let searchQuery = null

  if (search_literature && lastUserMessage) {
    searchQuery = await extractSearchTerms(lastUserMessage, apiKey)
    if (searchQuery) papers = await searchLiterature(searchQuery)
  }

  let system = SYSTEM_PROMPT

  if (client_context) {
    system += `\n\nShe is currently looking at this client's record. Use it as context where relevant:\n${client_context}`
  }

  if (papers.length > 0) {
    const today = new Date().toISOString().slice(0, 10)
    system += `\n\nLITERATURE SEARCH RESULTS (Europe PMC, searched ${today} for "${searchQuery}"):\n\n`
    system += papers
      .map((p, i) => `[${i + 1}] ${p.title}\n    ${p.journal}, ${p.year}${p.isOpenAccess ? ' (open access)' : ''}`)
      .join('\n\n')
    system += `\n\nThese are real, current papers. Reference them by number where relevant. Titles and abstracts only — you have not read the full text, so don't claim detailed findings you cannot see. If none are relevant to her question, say so and answer from general knowledge, making that clear.`
  } else if (search_literature && searchQuery) {
    system += `\n\nA literature search for "${searchQuery}" returned nothing useful. Answer from general knowledge and say plainly that you have no specific papers to point to.`
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
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
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n')

    res.status(200).json({
      reply: text,
      papers,
      searchQuery,
      searchedAt: papers.length ? new Date().toISOString() : null
    })
  } catch (err) {
    console.error('Research assistant error:', err)
    res.status(500).json({ error: 'The assistant could not respond. Please try again.' })
  }
}
