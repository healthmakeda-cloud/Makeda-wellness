// Single source of truth for what's for sale. Prices are in pence (GBP)
// since that's what Stripe expects. Used by both the Shop page (display)
// and api/create-checkout-session.js (server-side price lookup — never
// trust a price sent from the browser).

export const products = [
  {
    id: 'candida-test',
    name: 'Candida Test',
    category: 'Lab Testing',
    description: 'Lab testing for candida overgrowth, informing your herbal and dietary plan.',
    priceGBP: 20000
  },
  {
    id: 'food-sensitivity-test',
    name: 'Food Sensitivity Test',
    category: 'Lab Testing',
    description: 'Identifies foods that may be contributing to your symptoms.',
    priceGBP: 30000
  },
  {
    id: 'dna-diet-lifestyle-map',
    name: 'DNA Diet & Lifestyle Map',
    category: 'Lab Testing',
    description: 'Genetic insight into how your body responds to diet and lifestyle factors.',
    priceGBP: 30000
  },
  {
    id: 'parasitology-test',
    name: 'Parasitology Test',
    category: 'Lab Testing',
    description: 'Screening for parasites that can underlie chronic digestive complaints.',
    priceGBP: 27000
  },
  {
    id: 'microbiome-test',
    name: 'Microbiome Test',
    category: 'Lab Testing',
    description: "A snapshot of your gut's bacterial balance.",
    priceGBP: 30000
  },
  {
    id: 'microbiome-plus-test',
    name: 'Microbiome Plus Test',
    category: 'Lab Testing',
    description: 'An expanded microbiome panel with additional markers.',
    priceGBP: 30000
  },
  {
    id: 'impilo-colon-health-support',
    name: 'IMPILO Colon Health Support',
    category: 'Supplements',
    description: 'A practitioner formula supporting healthy bowel and liver function, with artichoke, cayenne and ginger. Take one capsule three times a day after food.',
    image: '/images/impilo-colon-health-support.jpg',
    // ⚠️ PLACEHOLDER PRICE — replace with the real price before this goes live.
    priceGBP: 2500,
    priceIsPlaceholder: true
  },
  {
    id: 'perimenopause-restore-complex',
    name: 'Perimenopause Restore Complex',
    category: 'Supplements',
    description: 'Hormonal support for balance, vitality and wellbeing — a signature botanical blend of black cohosh, wild yam, ashwagandha, bacopa, dandelion root and schisandra. 60 vegan capsules.',
    image: '/images/perimenopause-restore-complex.jpg',
    // ⚠️ PLACEHOLDER PRICE — replace with the real price before this goes live.
    priceGBP: 2500,
    priceIsPlaceholder: true
  }
]
