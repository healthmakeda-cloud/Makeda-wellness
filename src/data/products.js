// Single source of truth for what's for sale. Prices are in pence (GBP)
// since that's what Stripe expects. Used by both the Shop page (display)
// and api/create-checkout-session.js (server-side price lookup — never
// trust a price sent from the browser).

export const products = [
  {
    id: 'candida-test',
    name: 'Candida Test',
    description: 'Lab testing for candida overgrowth, informing your herbal and dietary plan.',
    priceGBP: 20000
  },
  {
    id: 'food-sensitivity-test',
    name: 'Food Sensitivity Test',
    description: 'Identifies foods that may be contributing to your symptoms.',
    priceGBP: 30000
  },
  {
    id: 'dna-diet-lifestyle-map',
    name: 'DNA Diet & Lifestyle Map',
    description: 'Genetic insight into how your body responds to diet and lifestyle factors.',
    priceGBP: 30000
  },
  {
    id: 'parasitology-test',
    name: 'Parasitology Test',
    description: 'Screening for parasites that can underlie chronic digestive complaints.',
    priceGBP: 27000
  },
  {
    id: 'microbiome-test',
    name: 'Microbiome Test',
    description: "A snapshot of your gut's bacterial balance.",
    priceGBP: 30000
  },
  {
    id: 'microbiome-plus-test',
    name: 'Microbiome Plus Test',
    description: 'An expanded microbiome panel with additional markers.',
    priceGBP: 30000
  }
]
