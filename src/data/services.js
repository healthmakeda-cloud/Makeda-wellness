// Single source of truth for services — used by Home, Services, the
// service detail pages, and the Client Intake "which service(s)" checklist.
// Keep the `title` values here in sync with the checklist in ClientIntake.jsx.

export const services = [
  {
    slug: 'colon-hydrotherapy',
    title: 'Colon Hydrotherapy',
    shortCopy: 'A gentle, ARCH-registered approach to clearing and resetting the gut, often the starting point for a wider health picture.',
    image: '/images/colon-hydrotherapy.jpg',
    fullDescription: [
      'Colon hydrotherapy uses the gentle introduction of filtered water to soften and clear the colon, often used to relieve bloating and sluggish digestion, and frequently the starting point for a wider cleanse or treatment plan.',
      'Every session is ARCH-registered practice, using single-use, disposable equipment throughout. Before your first session, a short health history helps rule out anything that would make treatment unsuitable.'
    ],
    cta: { label: 'Book a session', to: '/contact' }
  },
  {
    slug: 'herbal-medicine',
    title: 'Herbal Medicine',
    shortCopy: 'Plant-based remedies tailored to your history and constitution, not a one-size prescription.',
    image: '/images/herbal-medicine.jpeg',
    fullDescription: [
      'A full case history is taken before any remedy is prescribed — your current health, past history, lifestyle, and what brought you in. From there, a formula is built specifically for you, not pulled from a generic template.',
      'Follow-up consultations track how your formula is working and adjust it as things change.'
    ],
    cta: { label: 'Book a consultation', to: '/contact' }
  },
  {
    slug: 'mind-reset',
    title: 'Mind Reset System',
    shortCopy: 'A 90-day mind–gut reset programme, delivered in partnership with Tony Dada.',
    image: null,
    fullDescription: [
      "The Mind Reset System is a 90-day programme exploring the connection between nervous system stress and gut health — the same link that sits behind so much of Makéda's own approach to digestion and wellbeing.",
      "Makéda works alongside this programme as an affiliate practitioner. [Full programme structure and what's included to be confirmed — please provide the official programme details so this page accurately reflects it.]"
    ],
    cta: { label: 'Enquire about Mind Reset', to: '/contact' }
  },
  {
    slug: 'cleanse-programmes',
    title: 'Cleanse Programme',
    shortCopy: '7, 15 and 30-day guided programmes combining diet, herbs and hydrotherapy sessions.',
    image: '/images/cleanse-programmes.jpg',
    fullDescription: [
      'A structured programme combining dietary guidance, herbal support and a course of colon hydrotherapy sessions, run over 7, 15 or 30 days depending on your goals.',
      'Each programme is built around your starting point — nothing generic, and always with support throughout rather than a plan handed over and left to you alone.'
    ],
    cta: { label: 'Book a consultation', to: '/contact' }
  },
  {
    slug: 'gut-lab-testing',
    title: 'Gut & Lab Testing',
    shortCopy: 'Candida, food sensitivity, DNA diet & lifestyle mapping, parasitology, and microbiome testing.',
    image: null,
    fullDescription: [
      'Lab testing used to guide your herbal and dietary plan with real data rather than guesswork — candida, food sensitivity, DNA diet & lifestyle mapping, parasitology, and microbiome panels are all available.',
      'Test kits can be ordered directly through the shop, with results discussed at your consultation.'
    ],
    cta: { label: 'View test kits', to: '/shop' }
  }
]

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug)
}
