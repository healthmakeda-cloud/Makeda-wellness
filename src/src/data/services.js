// Single source of truth for services — used by Home, Services, the
// service detail pages, and the Client Intake "which service(s)" checklist.
// Keep the `title` values here in sync with the checklist in ClientIntake.jsx.

export const services = [
  {
    slug: 'colon-hydrotherapy',
    title: 'Colon Hydrotherapy',
    page: '/colon-hydrotherapy',
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
    page: '/herbal-dispensary',
    shortCopy: 'Most clinics begin with symptoms. The Makéda Method™ begins with your story.',
    image: '/images/herbal-medicine.jpeg',
    fullDescription: [
      'Every healing journey begins with a story. Every personalised medicine begins with understanding it. Every health story is unique, and your herbal prescription should be too.',
      'Once your practitioner has carefully explored your health story and developed your personalised treatment plan, the next step is the Herbal Dispensary — where your bespoke natural medicine is expertly prepared.',
      'Most herbal medicines are given as a liquid tincture, taken in 5ml or 7.5ml doses two or three times daily. You may also be prescribed a herbal tea, tablets, ointment, cream or lotion.',
      "Our Herbal Dispensary is where your health story becomes a bespoke botanical prescription — crafted with care, precision and purpose to support your body's natural capacity to restore balance and thrive.",
      'As your health improves and your needs change, your herbal formula can be refined and adjusted, ensuring your treatment evolves alongside your healing journey.'
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
    // ⚠️ Once Makéda sends the real affiliate link, replace the line above with:
    // cta: { label: 'Join the Mind Reset programme', to: 'https://the-real-affiliate-url' }
    // ServiceDetail.jsx already detects a full URL automatically and opens it
    // in a new tab instead of routing internally — no other changes needed.
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
